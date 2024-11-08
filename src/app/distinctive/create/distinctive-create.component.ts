import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DistinctiveService } from '../distinctive.service';
import { Distinctive } from '../distinctive.model';

@Component({
  selector: 'app-distinctive-create',
  templateUrl: './distinctive-create.component.html',
})
export class DistinctiveCreateComponent implements OnInit {
  distinctive: Distinctive = { id: '', name: '' };  // Initialize a new distinctive object

  constructor(
    private distinctiveService: DistinctiveService,  // Inject the service to handle API calls
    private router: Router  // Inject the router for navigation
  ) {}

  ngOnInit(): void {}

  // Create a new distinctive
  createDistinctive(): void {
    if (this.distinctive.id && this.distinctive.name) {
      this.distinctiveService.createDistinctive(this.distinctive).subscribe(
        () => {
          console.log('Distinctive created successfully');
          this.router.navigate(['/distinctives']);  // Navigate to the list page after creation
        },
        (error) => {
          console.error('Error creating distinctive:', error);  // Handle errors
        }
      );
    } else {
      alert('Please provide both ID and Name for the distinctive.');
    }
  }
}
