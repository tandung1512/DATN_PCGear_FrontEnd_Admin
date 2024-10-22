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
  errorMessage: string | null = null;

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe(
      (accounts) => {
        this.accounts = accounts;
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error loading accounts:', error);
        this.errorMessage = 'Failed to load accounts: ' + error.message;
      }
    );
  }

  editAccount(id: string): void {
    this.router.navigate(['/accounts/edit', id]);
  }

  deleteAccount(id: string): void {
    const confirmDelete = confirm('Are you sure you want to delete this account?');
    if (confirmDelete) {
      this.accountService.deleteAccount(id).subscribe(
        () => {
          this.loadAccounts();
          this.errorMessage = null;
        },
        (error) => {
          console.error('Error deleting account:', error);
          this.errorMessage = 'Failed to delete account: ' + error.message;
        }
      );
    }
  }

  // New method for adding an account
  addNewAccount(): void {
    this.router.navigate(['/accounts/create']); // Navigate to the create account page
  }
}
