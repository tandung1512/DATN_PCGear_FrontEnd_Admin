export interface Product {
    id: string; // ID sản phẩm
    name: string; // Tên sản phẩm
    quantity: number; // Số lượng sản phẩm
    price: number; // Giá sản phẩm
    description: string; // Mô tả sản phẩm
    status: string; // Trạng thái sản phẩm (ví dụ: available, out of stock)
    image1: string; // Hình ảnh 1
    image2: string; // Hình ảnh 2
    category?: string; // ID của danh mục, có thể không có
    productDistinctives?: any[]; // Quan hệ với ProductDistinctive (nếu có)
  }
  