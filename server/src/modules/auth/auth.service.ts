import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Role } from '../user/entities/role.entity';


import { RegisterUserDTO } from './dto/register-user.dto';
import { GoogleUserDTO } from './dto/google-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';


import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { createCanvas } from 'canvas'; // Thư viện hỗ trợ vẽ ảnh



@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private  userRepository: Repository<User>,
        @InjectRepository(Role) private  roleRepository: Repository<Role>,
        private jwtService: JwtService,
        private configService: ConfigService,

    )
    {}

    async generateAvatarByName(name: string): Promise<string> {
        const canvasSize = 200;
        const canvas = createCanvas(canvasSize, canvasSize);
        const ctx = canvas.getContext('2d');

        // Tạo màu nền
        ctx.fillStyle = '#2c7be5'; // Màu xanh
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // Lấy ký tự đầu của tên
        const initials = name
            .split(' ')
            .map((word) => word[0]?.toUpperCase())
            .slice(0, 2)
            .join('');

        // Vẽ ký tự lên ảnh
        ctx.font = 'bold 80px Arial';
        ctx.fillStyle = '#fff'; // Màu chữ trắng
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, canvasSize / 2, canvasSize / 2);

        // Tạo đường dẫn để lưu avatar
        const avatarPath = path.join('../front-end/public/avatar');
        if (!fs.existsSync(avatarPath)) {
            fs.mkdirSync(avatarPath, { recursive: true });
        }
        const fileName = `${Date.now()}-${name}.jpg`;
        const filePath = path.join(avatarPath, fileName);

        // Lưu ảnh
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filePath, buffer);

        return `/avatars/${fileName}`; // Trả về đường dẫn để lưu vào database
    }

    //Phương thức đăng ký
    async register(registerUserDTO: RegisterUserDTO): Promise<User> {
        // Gọi phương thức hashPassword để mã hóa mật khẩu
        const hashPassword = await this.hashPassword(registerUserDTO.password);
        // Gán roleId mặc định là 2 nếu không được chỉ định
        const roleId = registerUserDTO.roleId || 2;
        // Tạo avatar theo tên
        const avatar = await this.generateAvatarByName(registerUserDTO.username);
        // Lưu thông tin người dùng vào database, bao gồm mật khẩu đã mã hóa và refresh_token
        return await this.userRepository.save({
            ...registerUserDTO,
            username: registerUserDTO.username,// Sao chép tất cả các thuộc tính từ RegisterUserDTO
            refresh_token: "reresasdasd", // Thêm refresh_token (có thể là một giá trị ngẫu nhiên hoặc cố định)
            password: hashPassword, // Thay thế mật khẩu bằng mật khẩu đã mã hóa
            roleId,
            avatar,
        });
    }

    // Phương thức đăng nhập
    async login(loginUserDTO: LoginUserDTO): Promise<User> {
         const user = await this.userRepository.findOne({
            where: { email: loginUserDTO.email }, relations: ['role']
        });
        if (!user) {
            throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
        }
        // So sánh mật khẩu đã mã hóa với mật khẩu người dùng nhập vào
        const checkPass = bcrypt.compareSync(loginUserDTO.password, user.password);
        if (!checkPass) {
            throw new HttpException('Password is not correct', HttpStatus.UNAUTHORIZED);
        }
        // Nếu mật khẩu đúng, trả về thông tin người dùng
        return user;
    }

     //Phương thức tạo token
    private async generateToken(payload: { id: number; email: string; roleIds: number[] }) {
        const access_token = await this.jwtService.signAsync(payload);
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'), // Lấy secret từ file .env
            expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'), // Lấy thời gian hết hạn refresh token từ file .env
        });

        // Cập nhật refresh token cho người dùng
        await this.userRepository.update(
            { email: payload.email },
            { refresh_token: refresh_token },
        );

        return { access_token, refresh_token };
    }

     //Phương thức làm mới token
    //Kiểm tra tính hợp lệ của refresh token và tạo lại access token mới    
    // Nếu refresh token hợp lệ, tạo một access token mới và trả về nó
    // Nếu refresh token không hợp lệ, ném ra một ngoại lệ với thông báo lỗi
    async refreshToken(refresh_token: string): Promise<any> {
        try {
            const verifiedPayload = await this.jwtService.verifyAsync(refresh_token, 
                { secret: this.configService.get<string>('SECRET') });
            const user = await this.userRepository.findOne({
                where: { email: verifiedPayload.email, refresh_token },
                relations: ['role'],
            });

            if (!user) {
                throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST);
            }

            const roleIds = user.role ? [user.role.id] : [];
            return this.generateToken({ id: user.id, email: user.email, roleIds });
        } catch (error) {
            throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST);
        }
    }

    //Phương thức đăng nhập với Google
    // Nhận dữ liệu người dùng từ Google, kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
    // Nếu người dùng chưa tồn tại, tạo mới người dùng với thông tin từ Google và lưu vào cơ sở dữ liệu
    async googleLogin(googleUserData: GoogleUserDTO): Promise<any> {
        try {
            let user = await this.userRepository.findOne({
                where: [
                    { googleId: googleUserData.googleId },
                    { email: googleUserData.email }
                ],
                relations: ['role'],
            });
            if (!user) {
                const avatar = await this.downloadGoogleAvatar(googleUserData.avatar, googleUserData.username);
                user = await this.userRepository.save({
                    username: googleUserData.username,
                    email: googleUserData.email,
                    googleId: googleUserData.googleId,
                    avatar,
                    password: await this.hashPassword(Math.random().toString(36)),
                    refresh_token: "",
                    role: { id: 2 },
                });
            } else if (!user.avatar) {
                const avatar = await this.downloadGoogleAvatar(googleUserData.avatar, googleUserData.username);
                user.avatar = avatar;
                await this.userRepository.save(user);
            }

            const roleIds = user.role ? [user.role.id] : [];
            const payload = { id: user.id, username: user.username, email: user.email, roleIds };
            return this.generateToken(payload);
        } catch (error) {
            throw new Error('Google authentication failed');
        }
    }

    // Phương thức tải ảnh đại diện từ Google và lưu vào thư mục public/avatar
    // Tạo thư mục nếu chưa tồn tại và lưu ảnh vào đó
    async downloadGoogleAvatar(url: string, name: string): Promise<string> {
        const avatarPath = path.join('../front-end/public/avatar');
        if (!fs.existsSync(avatarPath)) {
            fs.mkdirSync(avatarPath, { recursive: true });
        }
        const fileName = `${Date.now()}-${name}.jpg`;
        const filePath = path.join(avatarPath, fileName);

        // Tải ảnh từ URL và lưu vào file
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));

        return fileName;  // Trả về trực tiếp fileName mà không có đường dẫn
    }


    private async hashPassword(password: string): Promise<string> {
        const saltRound = 10; // Định nghĩa số vòng salt cho bcrypt
        const salt = await bcrypt.genSalt(saltRound); // Tạo salt mới với số vòng salt đã định nghĩa
        const hash = await bcrypt.hash(password, salt); // Mã hóa mật khẩu với salt vừa tạo
        return hash; // Trả về mật khẩu đã mã hóa
    }
}
