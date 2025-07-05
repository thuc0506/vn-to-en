import { DataSourceOptions, DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres', // Thay 'mysql' thành 'postgres'
    host: process.env.DATABASE_HOST, // Nếu chạy Docker, lấy từ env, nếu không thì dùng localhost
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: 'vn_to_en', // Tên database của bạn
    entities: ['dist/**/*.entity{.ts,.js}'], // Không cần thay đổi
    migrations: ['dist/db/migrations/*.js'], // Không cần thay đổi
    synchronize: false, // Giữ nguyên để tránh mất dữ liệu khi deploy
};

const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize()
    .then(() => {
        console.log("✅ Kết nối database thành công!");
    })
    .catch((error) => {
        console.error("❌ Lỗi kết nối database:", error);
    });
export default dataSource;





  // host: 'localhost', // Địa chỉ host (hoặc thay bằng service name nếu dùng Docker)
    // port: 5432, // Cổng mặc định của PostgreSQL
    // username: 'postgres', // PostgreSQL user mặc định là 'postgres'
    // password: '12345', // Thay bằng mật khẩu của bạn
    // database: 'tttn1', // Thay bằng tên database PostgreSQL
    //host: process.env.DATABASE_HOST, // Nếu chạy Docker, lấy từ env, nếu không thì dùng localhost
