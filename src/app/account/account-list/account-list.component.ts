import { Component, OnInit, ViewChild } from '@angular/core';
import { Account } from '../account.model';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  displayedAccounts: Account[] = []; // Danh sách tài khoản hiển thị trên trang hiện tại
  errorMessage: string | null = null;

  totalAccounts: number = 0; // Tổng số tài khoản
  pageSize: number = 10; // Số tài khoản hiển thị mỗi trang
  currentPage: number = 0; // Trang hiện tại (bắt đầu từ 0)
  pageSizeOptions: number[] = [5, 10, 20]; // Các tuỳ chọn kích thước trang
  totalPages: number = 1;
  pages: number[] = [];
  startDisplay: number = 0;
  endDisplay: number = 0;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe(
      (accounts) => {
        this.accounts = accounts;
        this.totalAccounts = accounts.length;
        this.totalPages = Math.ceil(this.totalAccounts / this.pageSize);
        this.updateDisplayedAccounts();
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error loading accounts:', error);
        this.errorMessage = 'Lỗi khi tải tài khoản: ' + error.message;
      }
    );
  }
  updateDisplayedAccounts(): void {
    const startIndex = (this.currentPage ) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalAccounts);
    this.displayedAccounts = this.accounts.slice(startIndex, endIndex);

    // Cập nhật lại số trang
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    // Cập nhật start và end để hiển thị đúng số lượng
    this.startDisplay = startIndex + 1;
    this.endDisplay = endIndex;
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedAccounts();
  }

  editAccount(id: string): void {
    this.router.navigate(['/accounts/edit', id]);
  }

  deleteAccount(id: string): void {
    const confirmDelete = confirm('Bạn muốn xoá tài khoản này?');
    if (confirmDelete) {
      this.accountService.deleteAccount(id).subscribe(
        () => {
          this.loadAccounts();
          this.errorMessage = null;
        },
        (error) => {
          console.error('Error deleting account:', error);
          this.errorMessage = 'Lỗi khi xoá tài khoản: ' + error.message;
        }
      );
    }
  }

  // New method for adding an account
  addNewAccount(): void {
    this.router.navigate(['/accounts/create']); // Navigate to the create account page
  }
}
