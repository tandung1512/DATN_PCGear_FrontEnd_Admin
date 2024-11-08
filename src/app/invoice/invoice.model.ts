// user.model.ts
export interface User {
    id: string;
    name: string;  // Xác định rõ ràng thuộc tính name
    email: string;
    // Thêm các thuộc tính khác nếu cần
  }
  
export interface Account {
    id: string;
    name: string;
    // Các thuộc tính khác của Account nếu có
  }
  
  // Định nghĩa DetailedInvoice (nếu chưa có)
  export interface DetailedInvoice {
    id: string;
    productId: string;
    quantity: number;
    invoice: Invoice;  // Tham chiếu lại đến Invoice
  }
  
  // Định nghĩa Invoice
  export interface Invoice {
    id: string;
    orderDate: Date;  // Hoặc Date nếu bạn muốn sử dụng đối tượng Date
    address: string;
    status: string;
    node?: string; // Optional field nếu có
    user: Account;  // Tham chiếu đến Account
    detailedInvoices: DetailedInvoice[];  // Một danh sách các DetailedInvoice
  }
  
  // Định nghĩa để chuyển status thành statusName
  export function getStatusName(status: string): string {
    switch (status) {
      case 'pending':
        return 'Đang xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'delivery':
        return 'Đang vận chuyển';
      case 'complete':
        return 'Đã giao thành công';
      default:
        return 'Không xác định';
    }
  }
  