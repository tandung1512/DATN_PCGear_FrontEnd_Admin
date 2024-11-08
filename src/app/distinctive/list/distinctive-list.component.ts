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
      },
      (error) => {
        console.error('Error fetching distinctives:', error);  // Handle errors
      }
    );
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
