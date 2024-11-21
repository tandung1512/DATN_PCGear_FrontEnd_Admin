import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-invoice-detailed',
  templateUrl: './invoice-detailed.component.html',
})
export class InvoiceDetailedComponent implements OnInit {
  invoiceID!: string;  // Để phù hợp với định dạng UUID
  userName!: string;
  orderDate!: string;
  items: any[] = [];
  prop: string = '';
  currentPage: number = 1;
  pageCount: number = 1;
  itemsPerPage: number = 5;
  begin: number = 0;
  host: string = environment.host;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];  // ID được lấy từ route
    this.loadInvoiceDetails(id);
  }

  loadInvoiceDetails(id: string) {
    const url = `${this.host}/ordered-list/details/${id}`;
    this.http.get<any>(url).subscribe(
      (data) => {
        console.log('Dữ liệu trả về từ API:', data);  // In dữ liệu ra console để kiểm tra
        const order = data.order;
  
        // Kiểm tra chi tiết sản phẩm trong hóa đơn
        if (order.detailedInvoices && order.detailedInvoices.length > 0) {
          console.log('Chi tiết sản phẩm:', order.detailedInvoices);
        } else {
          console.log('Không có chi tiết sản phẩm trong hóa đơn.');
        }
  
        // Cập nhật các biến trong component
        this.invoiceID = order.id;
        this.userName = order.user.name;
        this.orderDate = order.orderDate;
  
        this.items = order.detailedInvoices || [];  // Nếu không có chi tiết, gán mảng rỗng
        this.pageCount = Math.ceil(this.items.length / this.itemsPerPage);
      },
      (error) => {
        console.error('Lỗi khi lấy chi tiết hóa đơn:', error);
      }
    );
  }
  
  

  sortBy(prop: string) {
    this.prop = prop;
  }

  first() {
    this.begin = 0;
    this.currentPage = 1;
  }

  prev() {
    if (this.begin > 0) {
      this.begin -= this.itemsPerPage;
      this.currentPage--;
    }
  }

  next() {
    if (this.begin < (this.pageCount - 1) * this.itemsPerPage) {
      this.begin += this.itemsPerPage;
      this.currentPage++;
    }
  }

  last() {
    this.begin = (this.pageCount - 1) * this.itemsPerPage;
    this.currentPage = this.pageCount;
  }
}
