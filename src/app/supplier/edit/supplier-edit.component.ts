import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../supplier.service';
import { Supplier } from '../supplier.model';

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
})
export class SupplierEditComponent implements OnInit {
  supplier: Supplier = {
    id: '',
    name: '',
    phoneNumber: '',
    email: '',
    address: ''
  };

  constructor(
    private supplierService: SupplierService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.getSupplier(id);
    }
  }

  // Fetch supplier details for editing
  getSupplier(id: string): void {
    this.supplierService.getSupplierById(id).subscribe(
      (supplier) => {
        this.supplier = supplier;
      },
      (error) => {
        console.error('Error fetching supplier details:', error);
      }
    );
  }

  // Update supplier details
  updateSupplier(): void {
    this.supplierService.updateSupplier(this.supplier.id, this.supplier).subscribe(
      () => {
        console.log('Supplier updated');
        this.router.navigate(['/suppliers']);
      },
      (error) => {
        console.error('Error updating supplier:', error);
      }
    );
  }
}
