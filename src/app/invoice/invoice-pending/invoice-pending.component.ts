import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Invoice } from '../invoice.model'; 
import { User } from '../invoice.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-pending',
  templateUrl: './invoice-pending.component.html',
})
export class InvoicePendingComponent implements OnInit {
  pageCount = 1;
  items: any[] = [];
  invoice: Invoice | null = null;
  nodes = '';
  currentPage = 1;
  begin = 0;
  prop: string = ''; 
  cancellationReason = '';
  selectedItemId: string | null = null;
  showCancelModal = false;
  currentCancelId: String | null = null;
  itemsPerPage: number = 5;
 
  host: string = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private toastr: ToastrService,private router: Router) {}

  ngOnInit(): void {
    this.load_all();
  }

  load_all(): void {
    const url = `${this.host}/invoices/pending`;
    console.log('Loading invoices from URL:', url);
  
    this.getInvoices(url).subscribe({
      next: (resp) => {
        if (Array.isArray(resp)) {
          this.items = resp;
          this.nodes = 's';
          this.pageCount = Math.ceil(this.items.length / 5);
          console.log('Total Pages:', this.pageCount);
        } else {
          console.error('Invalid response format');
        }
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
      }
    });
  }
  
  getInvoices(url: string): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(url);
  }

  edit(id: string): void {
    this.router.navigate([`/detail/${id}`]);
  }

  sortBy(prop: string): void {
    this.prop = prop;
    
    // Kiểm tra nếu prop là 'orderDate' thì sắp xếp theo ngày
    if (this.prop === 'orderDate') {
        this.items = this.items.sort((a, b) => {
            const dateA = new Date(a.orderDate);
            const dateB = new Date(b.orderDate);
            return dateA.getTime() - dateB.getTime(); // Sắp xếp theo thứ tự tăng dần
        });
    }

    // Sau khi sắp xếp, quay lại trang đầu
    this.paginate(1); // Quay lại trang đầu tiên sau khi sắp xếp
}


first(): void {
  // Chuyển đến trang đầu tiên (trang 1)
  this.paginate(1);
}

// Phương thức chuyển đến trang trước
prev(): void {
  if (this.currentPage > 1) {
    // Chuyển đến trang trước nếu không phải trang đầu
    this.paginate(this.currentPage - 1);
  }
}

// Phương thức chuyển đến trang tiếp theo
next(): void {
  if (this.currentPage < this.pageCount) {
    // Chuyển đến trang tiếp theo nếu chưa đến trang cuối cùng
    this.paginate(this.currentPage + 1);
  }
}

// Phương thức chuyển đến trang cuối
last(): void {
  // Chuyển đến trang cuối cùng
  this.paginate(this.pageCount);
}

// Phương thức phân trang
paginate(page: number): void {
  if (page < 1 || page > this.pageCount) return; // Kiểm tra để đảm bảo trang hợp lệ

  this.currentPage = page; // Cập nhật trang hiện tại
  this.begin = (page - 1) * this.itemsPerPage; // Tính chỉ mục bắt đầu của trang mới

 
}



  message(animation: boolean, title: string, icon: string): void {
    if (icon === 'success') {
      this.toastr.success(title, '', { timeOut: 3000 });
    } else if (icon === 'error') {
      this.toastr.error(title, '', { timeOut: 3000 });
    } else {
      this.toastr.info(title, '', { timeOut: 3000 });
    }
  }

  update(id: string, event: Event): void {
   
    
    // Lấy thông tin hóa đơn từ server
    this.http.get<Invoice>(`${this.host}/invoice/${id}`).subscribe({
      next: (resp) => {
        this.invoice = resp;

        // Cập nhật trạng thái của hóa đơn
        let updatedInvoice = { ...this.invoice, status: "delivery" };
        this.http.put<Invoice>(`${this.host}/invoice/${id}`, updatedInvoice).subscribe({
          next: () => {
            // Cập nhật mảng items bằng cách xóa hóa đơn đã cập nhật
            const index = this.items.findIndex(item => item.id === updatedInvoice.id);
            if (index !== -1) {
              this.items.splice(index, 1); // Xóa hóa đơn khỏi mảng items
            }

            this.message(true, "Chuyển trạng thái sang giao hàng thành công", "success");
          },
          error: (error) => {
            console.error("Error updating invoice", error);
          }
        });
      },
      error: (error) => {
        console.error("Error fetching invoice", error);
      }
    });
}
  openCancelModal(id: String): void {
    this.currentCancelId = id;
    this.showCancelModal = true;
  }
  closeCancelModal(): void {
    this.showCancelModal = false;
    this.cancellationReason = '';
    this.currentCancelId = null;
  }
 
  

  cancelledOrder(id: String): void {
    const url = `http://localhost:8080/api/invoice/${id}`;
    if (this.currentCancelId !== null && this.cancellationReason.trim()) {
      
      
      // Lấy thông tin hóa đơn hiện tại
      this.http.get<any>(url).subscribe({
        next: (invoice) => {
          // Cập nhật trạng thái và lý do hủy của hóa đơn
          invoice.status = 'cancelled';
          invoice.node = this.cancellationReason;

          // Gửi yêu cầu cập nhật hóa đơn
          this.http.put(url, invoice).subscribe({
            next: () => {
              // Xóa hóa đơn khỏi danh sách hiển thị
              this.items = this.items.filter(item => item.id !== this.currentCancelId);
              console.log(`Đơn hàng ${this.currentCancelId} đã được hủy thành công.`);
              
              // Thông báo thành công và đóng modal
              alert('Hủy đơn thành công');
              this.closeCancelModal();
            },
            error: (error) => {
              console.error('Lỗi khi cập nhật đơn hàng:', error);
              alert('Không thể hủy đơn hàng. Vui lòng thử lại.');
            }
          });
        },
        error: (error) => {
          console.error('Lỗi khi lấy thông tin đơn hàng:', error);
          alert('Không thể tải thông tin đơn hàng.');
        }
      });
    } else {
      alert('Vui lòng nhập lý do hủy đơn.');
    }
  }
 

  
}
