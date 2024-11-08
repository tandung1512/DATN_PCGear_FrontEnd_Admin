import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';


interface Invoice {
  id: string;
  orderDate: string;
  status: string;
  user: { id: string; name: string };
}

interface User {
  id: string;
  name: string;
}

interface History {
  note: string;
  historyDate: string;
  historyTime: string;
  user: User;
}

@Component({
  selector: 'app-invoice-delivery',
  templateUrl: './invoice-delivery.component.html',
})
export class InvoiceDeliveryComponent implements OnInit {
  items: Invoice[] = [];
  filteredItems: Invoice[] = [];
  invoice: Invoice | null = null;
  pageCount = 1;
  currentPage = 1;
  pageSize = 5;
  begin = 0;
  prop = '';
  host = 'http://localhost:8080/api';
  userInfo: User | null = null;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadUserInfo();
  }
  getFormattedDate(orderDate: string): string {
    const date = new Date(orderDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Thêm 1 vì tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  

  loadAll(): void {
    const url = `${this.host}/invoices/delivery`;
    this.http.get<Invoice[]>(url).subscribe({
      next: (resp) => {
        this.items = resp;
        this.filteredItems = [...this.items];
        this.pageCount = Math.ceil(this.items.length / this.pageSize);
        console.log('Loaded invoices:', this.items);
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.toastr.error('Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.');
      },
    });
  }

  edit(id: string): void {
    this.router.navigate([`/pcgearhub/admin/table-invoice-detailed/${id}`]);
  }

  sortBy(prop: string): void {
    this.prop = prop;
    this.filteredItems.sort((a: any, b: any) => {
      const valA = a[prop];
      const valB = b[prop];
      if (valA < valB) return -1;
      if (valA > valB) return 1;
      return 0;
    });
  }

  update(id: string): void {
    const urlID = `${this.host}/invoice/${id}`;
    this.http.get<Invoice>(urlID).subscribe({
      next: (resp) => {
        this.invoice = resp;
        if (this.invoice) {
          this.invoice.status = 'complete';
          this.http.put(`${this.host}/invoice/${id}`, this.invoice).subscribe({
            next: () => {
              this.items = this.items.filter((item) => item.id !== id);
              this.filteredItems = [...this.items];
              this.pageCount = Math.ceil(this.filteredItems.length / this.pageSize);
              this.logHistory(`Đã chuyển trạng thái của đơn hàng ${id} sang đã giao hàng`);
              this.toastr.success('Chuyển trạng thái đơn hàng thành công', 'Thành công');
            },
            error: (error) => console.error('Error updating invoice:', error),
          });
        }
      },
      error: (error) => console.error('Error fetching invoice:', error),
    });
  }

  loadUserInfo(): void {
    const urlUser = `http://localhost:8088/pcgearhub/api/user`;
    this.http.get<User>(urlUser).subscribe({
      next: (resp) => {
        this.userInfo = resp;
        console.log('User Info:', this.userInfo);
      },
      error: (error) => console.error('Error fetching user info:', error),
    });
  }

  logHistory(title: string): void {
    const formattedDate = new Date().toISOString().split('T')[0];
    const timeString = new Date().toTimeString().split(' ')[0];

    if (this.userInfo) {
      const history: History = {
        note: `${this.userInfo.name} ${title}`,
        historyDate: formattedDate,
        historyTime: timeString,
        user: this.userInfo,
      };
      const urlHistory = `http://localhost:8088/pcgearhub/rest/UserHistory`;
      this.http.post(urlHistory, history).subscribe({
        next: (resp) => console.log('History logged:', resp),
        error: (error) => console.error('Error logging history:', error),
      });
    }
  }

  // Pagination Methods
  first(): void {
    this.begin = 0;
    this.currentPage = 1;
  }

  prev(): void {
    if (this.begin > 0) {
      this.begin -= this.pageSize;
      this.currentPage--;
    }
  }

  next(): void {
    if (this.begin < (this.pageCount - 1) * this.pageSize) {
      this.begin += this.pageSize;
      this.currentPage++;
    }
  }

  last(): void {
    this.begin = (this.pageCount - 1) * this.pageSize;
    this.currentPage = this.pageCount;
  }
}
