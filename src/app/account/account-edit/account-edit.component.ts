import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../account.model';
import { AccountService } from '../account.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
})
export class AccountEditComponent implements OnInit {
  account: Account | undefined;
  errorMessage: string | null = null; // Declare errorMessage

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.accountService.getAccountById(id).subscribe(
        (account) => {
          this.account = account; // Set the account if found
        },
        (error) => {
          this.errorMessage = 'Failed to load account: ' + error; // Set error message
        }
      );
    }
  }

  save(): void {
    if (this.account) {
      this.accountService.updateAccount(this.account).subscribe(
        () => {
          this.router.navigate(['/accounts']); // Navigate back to the account list
        },
        (error) => {
          this.errorMessage = 'Failed to save account: ' + error; // Handle save error
        }
      );
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file: File = target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.account) {
          this.account.image = e.target.result; // Store base64 image string
        }
      };
      reader.readAsDataURL(file); // Convert image file to base64 string
    }
  }
}
