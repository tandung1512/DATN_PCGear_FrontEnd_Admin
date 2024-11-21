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
  currentCancelId: number | null = null;
 
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
  }

  first(): void {
    this.begin = 0;
    this.currentPage = 1;
  }

  prev(): void {
    if (this.begin > 0) {
      this.begin -= 5;
      this.currentPage--;
    }
  }

  next(): void {
    if (this.begin < (this.pageCount - 1) * 5) {
      this.begin += 5;
      this.currentPage++;
    }
  }

  last(): void {
    this.begin = (this.pageCount - 1) * 5;
    this.currentPage = this.pageCount;
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
  openCancelModal(id: number): void {
    this.currentCancelId = id;
    this.showCancelModal = true;
  }
  closeCancelModal(): void {
    this.showCancelModal = false;
    this.cancellationReason = '';
    this.currentCancelId = null;
  }
 
  

  cancelledOrder(id: number): void {
    if (this.currentCancelId !== null && this.cancellationReason.trim()) {
      const url = `http://localhost:8080/invoice/${this.currentCancelId}`;
      
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
  updateQuantityProduct(invoiceID: string): void {
    const detailedInvoicesUrl = `${this.host}/detailedInvoices`;
    this.http.get(detailedInvoicesUrl).subscribe(resp => {
      const detailedInvoices = resp as any[];
      const detailedInvoiceByInvoice = detailedInvoices.filter(d => d.invoice.id === invoiceID);
      for (const detailedInvoice of detailedInvoiceByInvoice) {
        const urlProduct = `${this.host}/product/${detailedInvoice.product.id}`;
        let updatedProduct = { ...detailedInvoice.product, quantity: detailedInvoice.product.quantity + detailedInvoice.quantity };
        this.http.put(urlProduct, updatedProduct).subscribe(() => {
          console.log("Quantity updated successfully");
        }, error => {
          console.error("Error updating quantity", error);
        });
      }
    }, error => {
      console.error("Error loading detailed invoices", error);
    });
  }

  
}
