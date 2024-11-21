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
  displayedSuppliers: Supplier[] = [];
  errorMessage: string | null = null;

  totalSuppliers: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];

  startDisplay: number = 0;
  endDisplay: number = 0;

  constructor(private supplierService: SupplierService, private router: Router) {}

  ngOnInit(): void {
    this.getSuppliers();
  }

  // Get all suppliers
  getSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe(
      (suppliers) => {
        this.suppliers = suppliers;
        this.totalSuppliers = this.suppliers.length;
        this.totalPages = Math.ceil(this.totalSuppliers / this.pageSize);
        this.updateDisplayedSuppliers();
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error fetching suppliers:', error);
        this.errorMessage = 'Lỗi khi load nhà cung cấp: ' + error.message;
      }
    );
  }

   // Update the suppliers to display based on the current page
   updateDisplayedSuppliers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalSuppliers);
    this.displayedSuppliers = this.suppliers.slice(startIndex, endIndex);

    // Create pagination pages
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    // Update start and end display values
    this.startDisplay = startIndex + 1;
    this.endDisplay = endIndex;
  }

  // Change page and update displayed suppliers
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedSuppliers();
  }

  // Delete supplier
  deleteSupplier(id: string): void {
    if (confirm('Bạn có muốn xoá nhà cung cấp?')) {
      this.supplierService.deleteSupplier(id).subscribe(
        () => {
          console.log('Xoá thành công nhà cung cấp');
          this.getSuppliers();
           // Refresh list after deletion
           this.router.navigate(['/suppliers']).then(() => {
            // Tải lại trang sau khi điều hướng (reload)
            window.location.reload();
        });
        },
        (error) => {
          console.error('Lỗi khi xoá nhà cung cấp:', error);
        }
      );
    }
  }

  // Navigate to the edit page
  editSupplier(id: string): void {
    this.router.navigate([`/suppliers/edit/${id}`]);
  }
}
