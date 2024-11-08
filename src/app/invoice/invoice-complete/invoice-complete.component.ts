import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-invoice-complete',
  templateUrl: './invoice-complete.component.html',

})
export class InvoiceCompleteComponent implements OnInit {
  items: any[] = [];
  currentPage: number = 1;
  pageCount: number = 1;
  prop: string = 'orderDate'; // Thuộc tính mặc định để sắp xếp
  begin: number = 0;
  host: string = environment.host;

  constructor( private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  
  loadAll(): void {
    const url = `${this.host}/invoices/complete`;
    this.http.get<any[]>(url).subscribe(
      resp => {
        this.items = resp;
        this.pageCount = Math.ceil(this.items.length / 5);
        console.log(this.pageCount);
      },
      error => {
        this.showErrorMessage('Lỗi khi tải dữ liệu');
        console.error('Error loading data', error);
      }
    );
  }

  sortBy(property: string) {
    this.prop = property; // Cập nhật thuộc tính sắp xếp
  }

  edit(id: string) {
    // Chuyển hướng tới trang chi tiết hóa đơn
    // Có thể sử dụng Router
  }

  first() {
    this.begin = 0;
    this.currentPage = 1;
  }

  prev() {
    if (this.begin > 0) {
      this.begin -= 5;
      this.currentPage--;
    }
  }

  next() {
    if (this.begin < (this.pageCount - 1) * 5) {
      this.begin += 5;
      this.currentPage++;
    }
  }

  last() {
    this.begin = (this.pageCount - 1) * 5;
    this.currentPage = this.pageCount;
  }
  showSuccessMessage(message: string): void {
    this.toastr.success(message, 'Thông báo', {
      timeOut: 3000,  // Thời gian hiện thông báo (3 giây)
      positionClass: 'toast-top-right'  // Vị trí thông báo
    });
  }

  // Method to show error toast message
  showErrorMessage(message: string): void {
    this.toastr.error(message, 'Lỗi', {
      timeOut: 3000,
      positionClass: 'toast-top-right'
    });
  }

  // Method to show info toast message
  showInfoMessage(message: string): void {
    this.toastr.info(message, 'Thông tin', {
      timeOut: 3000,
      positionClass: 'toast-top-right'
    });
  }

  // Method to show warning toast message
  showWarningMessage(message: string): void {
    this.toastr.warning(message, 'Cảnh báo', {
      timeOut: 3000,
      positionClass: 'toast-top-right'
    });
  }
}
