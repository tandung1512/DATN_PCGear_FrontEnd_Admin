import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../supplier.service';
import { Supplier } from '../supplier.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
})
export class SupplierListComponent implements OnInit {
  suppliers: Supplier[] = [];

  constructor(private supplierService: SupplierService, private router: Router) {}

  ngOnInit(): void {
    this.getSuppliers();
  }

  // Get all suppliers
  getSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe(
      (suppliers) => {
        this.suppliers = suppliers;
      },
      (error) => {
        console.error('Error fetching suppliers:', error);
      }
    );
  }

  // Delete supplier
  deleteSupplier(id: string): void {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.deleteSupplier(id).subscribe(
        () => {
          console.log('Supplier deleted');
          this.getSuppliers(); // Refresh list after deletion
        },
        (error) => {
          console.error('Error deleting supplier:', error);
        }
      );
    }
  }

  // Navigate to the edit page
  editSupplier(id: string): void {
    this.router.navigate([`/suppliers/edit/${id}`]);
  }
}
