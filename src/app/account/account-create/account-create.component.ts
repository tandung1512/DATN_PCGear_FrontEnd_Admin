import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from '../account.model';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
})
export class AccountCreateComponent implements OnInit {
  accountForm: FormGroup; // Declare FormGroup for the form
  selectedImage: File | null = null; // Store the selected image
  errorMessage: string | null = null; // For displaying error messages

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    // Initialize the form with FormBuilder
    this.accountForm = this.fb.group({
      id: ['', Validators.required], // ID field
      name: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      admin: [false],
      status: [false],
      confirm: [false],
      otp: [null], // Added for the OTP field
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.accountForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    // Create newAccount object from the form values
    const newAccount: Account = {
      ...this.accountForm.value,
      image: this.selectedImage ? this.convertImageToBase64(this.selectedImage) : '', // Convert image to base64 string
    };

    // Call the service to create the account
    this.accountService.createAccount(newAccount).subscribe(
      () => this.router.navigate(['/accounts']), // Navigate back to the account list
      error => this.errorMessage = 'Failed to create account: ' + error
    );
  }

  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedImage = target.files[0]; // Store the selected image file
    }
  }

  get imagePreviewUrl(): string {
    return this.selectedImage ? URL.createObjectURL(this.selectedImage) : '';
  }

  private convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // Convert image file to base64 string
    });
  }
}
