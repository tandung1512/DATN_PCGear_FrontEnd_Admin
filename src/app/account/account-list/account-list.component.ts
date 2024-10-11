import { Component, OnInit } from '@angular/core';
import { Account } from '../account.model';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  errorMessage: string | null = null; // For error handling

  constructor(public accountService: AccountService, public router: Router) {} // Change private to public

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe(
      accounts => this.accounts = accounts,
      error => this.errorMessage = 'Failed to load accounts: ' + error
    );
  }

  editAccount(id: string): void {
    this.router.navigate(['/accounts/edit', id]);
  }

  deleteAccount(id: string): void {
    const confirmDelete = confirm("Are you sure you want to delete this account?");
    if (confirmDelete) {
      this.accountService.deleteAccount(id).subscribe(
        () => this.loadAccounts(), // Reload accounts after deletion
        error => this.errorMessage = 'Failed to delete account: ' + error
      );
    }
  }
}
