import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from '../supplier.service';
import { Supplier } from '../supplier.model';

@Component({
  selector: 'app-supplier-add',
  templateUrl: './supplier-add.component.html',
})
export class SupplierAddComponent {
  supplier: Supplier = {
    id: '',
    name: '',
    phoneNumber: '',
    email: '',
    address: ''
  };

  constructor(private supplierService: SupplierService, private router: Router) {}

  ngOnInit(): void {}
  // Create a new supplier
  createSupplier(): void {
    this.supplierService.createSupplier(this.supplier).subscribe(
      () => {
        console.log('Supplier created');
        this.router.navigate(['/suppliers']);  // Navigate to the list of suppliers
      },
      (error) => {
        console.error('Error creating supplier:', error);
      }
    );
  }
}
