import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invoice-delivery',
  templateUrl: './invoice-delivery.component.html',

})
export class InvoiceDeliveryComponent implements OnInit {
  items: any[] = [];
  pageCount: number = 1;
  currentPage: number = 1;
  begin: number = 0;
  prop: string = 'id';
  invoice: any;
  userInfo: any;
  host: string = environment.host;  // Sử dụng giá trị host từ environment

  constructor(private http: HttpClient, private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    const url = `${this.host}/invoices/delivery`;
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

  sortBy(property: string): void {
    this.prop = property;
    this.items.sort((a, b) => {
      if (a[property] < b[property]) return -1;
      if (a[property] > b[property]) return 1;
      return 0;
    });
  }

  edit(id: string): void {
    window.location.href = `/pcgearhub/admin/table-invoice-detailed/${id}`;
  }

  update(id: string, event: Event): void {
    event.preventDefault();  // Ngừng điều hướng trang khi click vào thẻ <a>
    
    const urlID = `${this.host}/invoice/${id}`;
    this.http.get(urlID).subscribe(
      (resp: any) => {
        this.invoice = resp;
        this.invoice.status = 'complete';
  
        this.http.put(`${this.host}/invoice/${id}`, this.invoice).subscribe(
          updateResp => {
            const index = this.items.findIndex(item => item.id === this.invoice.id);
            if (index !== -1) {
              this.items.splice(index, 1); // Remove the item
            }
            console.log('Success', updateResp);
            this.history(`Đã chuyển trạng thái của đơn hàng ${id} sang đã giao hàng`);
            this.showSuccessMessage('Chuyển trạng thái sang đã hoàn thành đơn hàng thành công');
          },
          error => {
            this.showErrorMessage('Lỗi khi cập nhật trạng thái đơn hàng');
            console.error('Error updating invoice', error);
          }
        );
      },
      error => {
        this.showErrorMessage('Lỗi khi tải thông tin đơn hàng');
        console.error('Error loading invoice', error);
      }
    );
  }
  

  // Method to show success toast message
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

  history(title: string): void {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const timeString = currentDate.toTimeString().split(' ')[0];

    const urlUser = `${this.host}/api/user`;
    this.http.get(urlUser).subscribe(
      userResp => {
        this.userInfo = userResp;
        const urlHistory = `${this.host}/rest/UserHistory`;
        const history = {
          note: `${this.userInfo.name} ${title}`,
          historyDate: formattedDate,
          historyTime: timeString,
          user: this.userInfo
        };

        this.http.post(urlHistory, history).subscribe(
          historyResp => {
            console.log('History saved', historyResp);
          },
          error => {
            console.error('Error saving history', error);
          }
        );
      },
      error => {
        console.error('Error loading user info', error);
      }
    );
  }
}
