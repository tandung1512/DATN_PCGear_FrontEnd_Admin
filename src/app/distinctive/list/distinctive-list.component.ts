import { Component, OnInit } from '@angular/core';
import { DistinctiveService } from '../distinctive.service';  // Import the distinctive service
import { Distinctive } from '../distinctive.model';  // Import the distinctive model
import { Router } from '@angular/router';  // Import Router for navigation

@Component({
  selector: 'app-distinctive-list',
  templateUrl: './distinctive-list.component.html',  // Point to the template HTML file
})
export class DistinctiveListComponent implements OnInit {
  distinctives: Distinctive[] = [];  // Store the list of distinctives
  displayedDistinctives: Distinctive[] = [];  // Store the distinctives to display in pagination
  errorMessage: string | null = null;

  totalDistinctives: number = 0;  // Total number of distinctives
  pageSize: number = 10;  // Number of items to show per page
  currentPage: number = 1;  // Current page
  totalPages: number = 1;  // Total number of pages
  pages: number[] = [];  // List of page numbers

  startDisplay: number = 0;  // Starting index of displayed items
  endDisplay: number = 0; 

  constructor(
    private distinctiveService: DistinctiveService,  // Inject the distinctive service
    private router: Router  // Inject the router to navigate between components
  ) {}

  ngOnInit(): void {
    this.getDistinctives();  // Fetch the list of distinctives when the component initializes
  }

  // Get all distinctives from the service
  getDistinctives(): void {
    this.distinctiveService.getAllDistinctives().subscribe(
      (distinctives) => {
        this.distinctives = distinctives;  // Set the distinctives to the list
        this.totalDistinctives = this.distinctives.length;
        this.totalPages = Math.ceil(this.totalDistinctives / this.pageSize);
        this.updateDisplayedDistinctives();
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error fetching distinctives:', error);  // Handle errors
      }
    );
  }
   // Update the list of distinctives to display based on the current page
   updateDisplayedDistinctives(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalDistinctives);
    this.displayedDistinctives = this.distinctives.slice(startIndex, endIndex);

    // Create the pagination pages array
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    // Update the start and end display values
    this.startDisplay = startIndex + 1;
    this.endDisplay = endIndex;
  }

  // Change page and update the list of displayed distinctives
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedDistinctives();
  }
  // Delete a distinctive by its ID
  deleteDistinctive(id: string): void {
    if (confirm('Are you sure you want to delete this distinctive?')) {  // Ask for confirmation before deletion
      this.distinctiveService.deleteDistinctive(id).subscribe(
        () => {
          console.log('Distinctive deleted successfully');
          this.getDistinctives();  // Refresh the list after deletion
        },
        (error) => {
          console.error('Error deleting distinctive:', error);  // Handle errors
        }
      );
    }
  }

  // Navigate to the edit page for a specific distinctive
  editDistinctive(id: string): void {
    this.router.navigate(['/distinctives/edit', id]);  // Navigate to the edit page with the ID as a parameter
  }
}
