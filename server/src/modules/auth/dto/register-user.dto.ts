// DTO cho việc đăng ký người dùng mới
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterUserDTO {
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString()
  password: string;

  @IsOptional()
  roleId?: number;

  @IsOptional()
  @IsString()
  avatar?: string;
}


// Chức năng: Định nghĩa cấu trúc dữ liệu mà controller sẽ nhận khi thực hiện yêu cầu đăng ký người dùng.
// Chi tiết: RegisterUserDTO chứa các thuộc tính username, email, và password, mà người dùng cần cung cấp khi đăng ký. 
// DTO giúp kiểm tra dữ liệu đầu vào và đảm bảo dữ liệu hợp lệ trước khi gửi đến service.