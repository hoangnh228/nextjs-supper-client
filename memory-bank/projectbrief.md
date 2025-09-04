# Project Brief - Nhà hàng Big Boy

## Tổng quan dự án

Ứng dụng web quản lý nhà hàng "Big Boy" được xây dựng với Next.js, cung cấp giao diện công khai cho khách hàng và hệ thống quản lý nội bộ cho nhân viên nhà hàng.

## Mục tiêu chính

### Frontend khách hàng (Public)

- Hiển thị thông tin nhà hàng với banner và slogan "Vị ngon, trọn khoảnh khắc"
- Showcase đa dạng các món ăn với hình ảnh và giá cả
- Giao diện responsive, hiện đại với dark/light mode

### Hệ thống quản lý (Admin)

- Dashboard tổng quan cho quản lý
- Quản lý đơn hàng (orders)
- Quản lý bàn ăn (tables)
- Quản lý món ăn (dishes)
- Phân tích dữ liệu (analytics)
- Quản lý nhân viên (accounts)
- Cài đặt cá nhân và đổi mật khẩu

## Phạm vi dự án

### Các tính năng hiện tại

1. **Xác thực và ủy quyền**
   - Đăng nhập/đăng xuất
   - Refresh token tự động
   - Middleware bảo vệ các route quản lý

2. **Quản lý nhân viên**
   - Thêm/sửa/xóa nhân viên
   - Phân quyền theo vai trò
   - Cập nhật thông tin cá nhân

3. **Giao diện người dùng**
   - Responsive design
   - Dark/light mode toggle
   - Component system với shadcn/ui

### Roadmap phát triển

- Cải thiện authentication flows
- Nâng cao tính năng quản lý accounts
- Tối ưu hóa xử lý media và hình ảnh

## Yêu cầu kỹ thuật

### Technology Stack

- **Frontend**: Next.js 15.5.2 với App Router
- **UI**: shadcn/ui + Radix UI components
- **Styling**: TailwindCSS v4
- **State Management**: TanStack Query cho data fetching
- **Forms**: React Hook Form + Zod validation
- **Authentication**: JWT với httpOnly cookies

### Architecture Pattern

- Server-first với Next.js App Router
- API routes cho backend logic
- Middleware để bảo vệ routes
- Modular structure với separation of concerns

## Tiêu chí thành công

- Giao diện người dùng mượt mà, responsive
- Hệ thống xác thực an toàn và ổn định
- Khả năng quản lý nhân viên hiệu quả
- Performance tốt với Next.js optimizations
- Code maintainable với TypeScript và proper structure
