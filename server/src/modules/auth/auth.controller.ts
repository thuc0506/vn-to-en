import { Body, Post, Controller, UsePipes, Get, Req, Res, UseGuards, HttpException, HttpStatus, Put, Param, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserDTO } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { LoginUserDTO } from './dto/login-user.dto';
import { GoogleUserDTO } from './dto/google-user.dto';


import { Request, Response } from 'express';
//Xác định controller cho các yêu cầu đến route /auth.
@Controller('auth')
export class AuthController {
    //Điều này cho phép bạn gọi các phương thức của AuthService từ AuthController
    constructor(private authService: AuthService) { }
    
    //Đánh dấu phương thức register để xử lý các yêu cầu POST đến route /auth/register.
    @Post('register')
    //Sử dụng ValidationPipe để tự động kiểm tra và xác thực dữ liệu đầu vào.
   @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    //Lấy dữ liệu từ yêu cầu HTTP và ánh xạ nó vào đối tượng RegisterUserDTO.
    register(@Body() registerUserDTO: RegisterUserDTO): Promise<User> {
        console.log('register api')
        console.log(registerUserDTO)
        //Gọi phương thức register của AuthService để thực hiện logic đăng ký và trả về đối tượng User.
        return this.authService.register(registerUserDTO);
    }

    @Post('login')
    //Đánh dấu phương thức login để xử lý các yêu cầu POST đến route /auth/login.
    //Sử dụng ValidationPipe để tự động kiểm tra và xác thực dữ liệu đầu vào
     @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    login(@Body() loginUserDTO: LoginUserDTO): Promise<any> {
        console.log("login api");
        console.log(loginUserDTO);
        return this.authService.login(loginUserDTO)
    }


    @Post('refresh-token')
    refreshToken(@Body() { refresh_token }): Promise<any> {
        console.log('refresh token api');
        return this.authService.refreshToken(refresh_token)
    }


    // Đường dẫn để bắt đầu quá trình đăng nhập với Google.
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: Request) {
        // Request sẽ được chuyển hướng đến Google để xác thực.
    }

    // Handle Google OAuth callback
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Req() req: any, @Res() res: Response) {
        try {
            // Get user data from the validated Google profile
            const googleUser: GoogleUserDTO = {
                googleId: req.user.googleId,
                email: req.user.email,
                username: req.user.username,
                avatar: req.user.avatar, 
            };

            // Process login with Google user data
            const tokens = await this.authService.googleLogin(googleUser);

            // Thiết lập cookie httpOnly cho bảo mật
            res.cookie('access_token', tokens.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600 * 1000, // Thời gian tồn tại của cookie: 1 giờ
            });

            // Chuyển hướng tới frontend với token trong URL
            res.redirect(`${process.env.FRONTEND_URL}?token=${tokens.access_token}`);
        } catch (error) {
            console.error('Error during Google authentication callback:', error);
            // Chuyển hướng tới trang lỗi đăng nhập nếu có lỗi xảy ra
            res.status(HttpStatus.FOUND).redirect('/login/error');
        }
    }

   
}
