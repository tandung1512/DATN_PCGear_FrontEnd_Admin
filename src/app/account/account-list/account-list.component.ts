import { Component, OnInit, ViewChild } from '@angular/core';
import { Account } from '../account.model';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  displayedAccounts: Account[] = [];
  errorMessage: string | null = null;

  totalAccounts: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  pageSizeOptions: number[] = [5, 10, 20];
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
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalAccounts);
    this.displayedAccounts = this.accounts.slice(startIndex, endIndex);

    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
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

  addNewAccount(): void {
    this.router.navigate(['/accounts/create']);
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Accounts');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      // { header: 'Address', key: 'address', width: 30 },
    ];

    this.accounts.forEach((account) => {
      worksheet.addRow({
        id: account.id,
        name: account.name,
        email: account.email,
        phone: account.phone,
        // address: account.address,
      });
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, 'Accounts.xlsx');
    });
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    const tableData = this.accounts.map((account) => [
      account.id,
      account.name,
      account.email,
      account.phone,
      // account.address,
    ]);

    const headers = [['ID', 'Name', 'Email', 'Phone', 
      // 'Address'
    ]];

    doc.text('Account List', 10, 10);
    (doc as any).autoTable({
      head: headers,
      body: tableData,
      startY: 20,
    });

    doc.save('Accounts.pdf');
  }
}
