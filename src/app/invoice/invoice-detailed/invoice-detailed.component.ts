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
  pageCount: number;
  itemsPerPage: number = 10;
  begin: number = 0;
  host: string = environment.host;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];  // ID được lấy từ route
    console.log('ID của hóa đơn:', id); 
    this.loadInvoiceDetails(id);
  }

  loadInvoiceDetails(id: string): void {
    const url = `http://localhost:8080/api/ordered-list/details/${id}`;
    this.http.get<any>(url).subscribe(
      (data) => {
        console.log('Dữ liệu trả về từ API:', data);
  
        // Kiểm tra xem data và data.detailedInvoices có tồn tại không
        if (data && data.detailedInvoices) {
          this.invoiceID = data.orderId; // Dùng orderId trực tiếp từ data
          this.userName = data.user?.name || 'Không có tên người đặt';  // Nếu không có tên, hiển thị mặc định
          this.orderDate = data.orderDate;
          this.items = data.detailedInvoices || [];  // Lấy chi tiết hóa đơn từ detailedInvoices
          this.pageCount = Math.ceil(this.items.length / this.itemsPerPage);
        } else {
          console.error('Không tìm thấy chi tiết hóa đơn trong dữ liệu trả về!');
        }
      },
      (error) => {
        console.error('Lỗi khi lấy chi tiết hóa đơn:', error);
      }
    );
  }
  
  
  getProductPrice(item: any): string {
    return item.product?.price ? item.product.price : 'Không có giá';
  }

  getProductName(item: any): string {
    return item.product?.name ? item.product.name : 'Không có tên sản phẩm';
  }

  getProductImage(item: any): string {
    return item.product?.image1 ? item.product.image1 : 'Không có hình ảnh';
  }

  getTotalPrice(item: any): string {
    return (item.product?.price * item.quantity) ? (item.product.price * item.quantity).toFixed(2) : 'Không có tổng tiền';
  }
  sortBy(prop: string) {
    this.prop = prop;
  }

  first(): void {
    this.paginate(1);
  }

  prev(): void {
    if (this.currentPage > 1) {
      this.paginate(this.currentPage - 1);
    }
  }

  next(): void {
    if (this.currentPage < this.pageCount) {
      this.paginate(this.currentPage + 1);
    }
  }

  last(): void {
    this.paginate(this.pageCount);
  }
  paginate(page: number): void {
    this.currentPage = page;
    this.begin = (page - 1) * this.itemsPerPage;
  }
}
