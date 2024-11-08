import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DistinctiveService } from '../distinctive.service';
import { Distinctive } from '../distinctive.model';

@Component({
  selector: 'app-distinctive-edit',
  templateUrl: './distinctive-edit.component.html',
})
export class DistinctiveEditComponent implements OnInit {
  distinctive: Distinctive = { id: '', name: '' };  // Initialize an empty distinctive object

  constructor(
    private distinctiveService: DistinctiveService,  // Inject the service to handle API calls
    private router: Router,  // Inject the router for navigation
    private route: ActivatedRoute  // Inject ActivatedRoute to access the route parameters (ID)
  ) {}

  ngOnInit(): void {
    // Get the ID of the distinctive to be edited from the route
    const id = this.route.snapshot.paramMap.get('id')!;
    this.getDistinctive(id);
  }

  // Fetch the distinctive by ID
  getDistinctive(id: string): void {
    this.distinctiveService.getDistinctiveById(id).subscribe(
      (distinctive) => {
        this.distinctive = distinctive;  // Set the distinctive object
      },
      (error) => {
        console.error('Error fetching distinctive:', error);  // Handle errors
      }
    );
  }

  // Update the distinctive
  updateDistinctive(): void {
    if (this.distinctive.id && this.distinctive.name) {
      this.distinctiveService.updateDistinctive(this.distinctive.id, this.distinctive).subscribe(
        () => {
          console.log('Distinctive updated successfully');
          this.router.navigate(['/distinctives']);  // Navigate back to the list page after update
        },
        (error) => {
          console.error('Error updating distinctive:', error);  // Handle errors
        }
      );
    } else {
      alert('Please provide both ID and Name for the distinctive.');
    }
  }
}
