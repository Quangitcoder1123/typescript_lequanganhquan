# Hệ thống quản lý thuê phòng trọ

Hệ thống quản lý thuê phòng trọ được xây dựng bằng Next.js và PostgreSQL.

## Tính năng

- Hiển thị danh sách phòng trọ
- Tìm kiếm theo mã phòng, tên người thuê hoặc số điện thoại
- Thêm mới thông tin thuê phòng
- Xóa thông tin thuê phòng (có thể xóa nhiều mục cùng lúc)
- Quản lý hình thức thanh toán (theo tháng, quý, năm)

## Yêu cầu hệ thống

- Node.js 18.x trở lên
- PostgreSQL 12.x trở lên
- npm hoặc yarn

## Cài đặt

1. Clone repository:

```bash
git clone [repository-url]
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo cơ sở dữ liệu PostgreSQL:

```sql
CREATE DATABASE room_rental;
```

4. Chạy file schema.sql để tạo bảng:

```bash
psql -U [username] -d room_rental -f app/db/schema.sql
```

5. Tạo file .env.local và cập nhật thông tin kết nối database:

```env
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quanlyphongtro
```

6. Chạy ứng dụng:

```bash
npm run dev
```

Truy cập ứng dụng tại http://localhost:3000

## Cấu trúc dự án

- `app/components/`: Chứa các component React
- `app/api/`: Chứa các API endpoints
- `app/db/`: Chứa các file liên quan đến database
- `app/lib/`: Chứa các utility functions

## License

MIT
