import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config"; // Import ConfigService để lấy cấu hình từ file .env

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService:JwtService, private configService: ConfigService, ) {}

    // Phương thức canActivate sẽ được gọi trước khi xử lý yêu cầu
    // Nó sẽ kiểm tra xem token trong header Authorization có hợp lệ hay không
    // Nếu token hợp lệ, nó sẽ cho phép truy cập vào route
    // Nếu token không hợp lệ hoặc không có, nó sẽ ném ra một ngoại lệ
    // Phương thức này trả về một Promise<boolean> để xác định quyền truy cập
    // Nếu trả về true, yêu cầu sẽ được xử lý tiếp  
    // Nếu trả về false, yêu cầu sẽ bị từ chối
    // Nếu ném ra một ngoại lệ, yêu cầu sẽ bị từ chối và trả về lỗi 401 Unauthorized
    // Phương thức này sẽ được gọi mỗi khi có yêu cầu đến các route được bảo vệ bởi AuthGuard
    // Trong phương thức này, chúng ta sẽ kiểm tra xem token có hợp lệ hay không    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Lấy request từ context
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException(); // Không có token trong header Authorization
        }
        try {

            const payload = await this.jwtService.verifyAsync(token, {secret: this.configService.get<string>('SECRET')});
            request['userData'] = payload; // Lưu payload vào request để sử dụng trong các handler tiếp theo
        }catch{
            throw new UnauthorizedException('Token không hợp lệ'); // Token không hợp lệ
        }
        return true; // Token hợp lệ, cho phép truy cập vào route
    }


    // Kiểm tra xem token có tồn tại trong header Authorization hay không
    // Nếu có, trả về true, ngược lại trả về false
    // Nếu token không hợp lệ, ném ra một ngoại lệ với thông báo lỗi
    private extractTokenFromHeader(request:Request): string | undefined {
       const [type, token] =request.headers.authorization?  request.headers.authorization.split(' '): [];
       return type === 'Bearer' ? token : undefined;
    }
}
