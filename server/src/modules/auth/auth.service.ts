import { HttpException, HttpStatus, Injectable, Inject, Res } from '@nestjs/common';
import { Response } from 'express';
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


import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'; // Sử dụng cache manager từ NestJS





@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        private jwtService: JwtService,
        private configService: ConfigService,


        @Inject(CACHE_MANAGER) private cacheManager: Cache, // Sử dụng cache manager từ NestJS

    ) {
        console.log(
            'CacheManager Type:',
            (this.cacheManager as any).store?.constructor?.name,
        );
    }

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



    // Phương thức đăng nhập với Redis cache + HttpOnly Cookie
    async login(
        loginUserDTO: LoginUserDTO,
        @Res({ passthrough: true }) res: Response // ✅ Phải thêm @Res
    ): Promise<{ user: User }> {
        const { email, password } = loginUserDTO;

        console.log(`🚀 Attempting login for email: ${email}`);

        const attemptKey = `login_attempts:${email}`;
        const attempts = Number(await this.cacheManager.get(attemptKey)) || 0;
        console.log(`🔑 Current login attempts: ${attempts} (Key: ${attemptKey})`);

        if (attempts >= 5) {
            console.log(`❌ Blocking login for ${email} - too many attempts`);
            throw new HttpException(
                {
                    message: 'Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.',
                    remainingAttempts: 0,
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }


        // Tìm user trong Redis cache
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ['role'],
        });

        if (!user) {
            console.log(`⚠️ User not found in DB for email: ${email}`);
            await this.cacheManager.set(attemptKey, attempts + 1,{ ttl: 900 } as any);
            console.log(`⏫ Increased login attempt (Key: ${attemptKey}) to ${attempts + 1} with TTL 900s`);
            // Ném ngoại lệ nếu không tìm thấy user
            // Thông báo lỗi với số lần thử còn lại
            throw new HttpException(
                {
                    message: 'Email không tồn tại',
                    remainingAttempts: 5 - (attempts + 1),
                },
                HttpStatus.UNAUTHORIZED,
            );
        }


        // Kiểm tra mật khẩu
        const checkPass = bcrypt.compareSync(password, user.password);
        if (!checkPass) {
            console.log(`❌ Wrong password for email: ${email}`);
            await this.cacheManager.set(attemptKey, attempts + 1,  { ttl: 900 } as any);
            console.log(`⏫ Increased login attempt (Key: ${attemptKey}) to ${attempts + 1} with TTL 900s`);
            // Ném ngoại lệ nếu mật khẩu không đúng
            // Thông báo lỗi với số lần thử còn lại
            throw new HttpException(
                {
                    message: 'Mật khẩu không đúng',
                    remainingAttempts: 5 - (attempts + 1),
                },
                HttpStatus.UNAUTHORIZED,
            );
        }

        // Xóa số lần thử sai nếu login thành công
        await this.cacheManager.del(attemptKey);
        console.log(`✅ Login successful for email: ${email}. Deleted login attempts key: ${attemptKey}`);

        // ✅ Sinh token
        const roleIds = user.role ? [user.role.id] : [];
        const { access_token, refresh_token } = await this.generateToken({
            id: user.id,
            email: user.email,
            roleIds,
        });

        // ✅ Set HttpOnly cookies
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 phút
        });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });

        // ✅ Trả về user thôi, KHÔNG trả token
        return { user };
    }


    //Phương thức tạo token
    async generateToken(payload: { id: number; email: string; roleIds: number[] }) {
        // Tạo access token và refresh token từ payload
        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: this.configService.get<string>('EXP_IN_ACCESS_TOKEN'),
        });
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
        });

        // Lưu refresh token vào Redis
        const tokenKey = `refresh_token:${refresh_token}`;
        await this.cacheManager.set(tokenKey, payload, { ttl: 7 * 24 * 60 * 60 } as any);// 7 ngày

        // Cập nhật refresh token trong database
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
    // Phương thức làm mới token
    async refreshToken(
        refresh_token: string,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{ message: string }> {
        try {
            const blacklistKey = `blacklist:${refresh_token}`;
            const isBlacklisted = await this.cacheManager.get(blacklistKey);
            if (isBlacklisted) {
                throw new HttpException('Token đã bị vô hiệu hóa', HttpStatus.UNAUTHORIZED);
            }

            const verifiedPayload = await this.jwtService.verifyAsync(refresh_token, {
                secret: this.configService.get<string>('SECRET'),
            });

            const tokenKey = `refresh_token:${refresh_token}`;
            const cachedPayload = await this.cacheManager.get(tokenKey);

            if (!cachedPayload) {
                // Không có trong Redis => kiểm tra DB
                const user = await this.userRepository.findOne({
                    where: { email: verifiedPayload.email, refresh_token },
                    relations: ['role'],
                });

                if (!user) {
                    throw new HttpException('Refresh token không hợp lệ', HttpStatus.BAD_REQUEST);
                }
            }

            // ✅ Tạo token mới
            const { exp, iat, ...cleanPayload } = verifiedPayload;
            const { access_token, refresh_token: new_refresh_token } = await this.generateToken(cleanPayload);

            // ✅ Set lại HttpOnly Cookie mới
            res.cookie('access_token', access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000, // 15 phút
            });

            res.cookie('refresh_token', new_refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            });

            return { message: 'Token refreshed successfully' };
        } catch (error) {
            throw new HttpException('Refresh token không hợp lệ', HttpStatus.BAD_REQUEST);
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


    // Phương thức logout - KHÔNG xóa cookie trong service
    async logout(refresh_token: string): Promise<void> {
        const blacklistKey = `blacklist:${refresh_token}`;
        await this.cacheManager.set(blacklistKey, true,  { ttl: 24 * 60 * 60 } as any); //24h
        const tokenKey = `refresh_token:${refresh_token}`;
        await this.cacheManager.del(tokenKey);
    }


    // Phương thức lấy thông tin người dùng hiện tại
    async getMe(access_token: string): Promise<User> {
        if (!access_token) {
            throw new HttpException('Chưa đăng nhập', HttpStatus.UNAUTHORIZED);
        }

        try {
            const payload = await this.jwtService.verifyAsync(access_token);
            const user = await this.userRepository.findOne({
                where: { id: payload.id },
                relations: ['role'],
            });

            if (!user) {
                throw new HttpException('Người dùng không tồn tại', HttpStatus.UNAUTHORIZED);
            }

            return user;
        } catch (error) {
            throw new HttpException('Token không hợp lệ', HttpStatus.UNAUTHORIZED);
        }
    }










}
