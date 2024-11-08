import { Component } from '@angular/core';
import { CategoryService } from '../category.service';
import { Category } from '../category.model';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  
})
export class AddCategoryComponent {
  newCategory: Category = { id: '', name: '', description: '' };

  constructor(private categoryService: CategoryService) {}

  addCategory(): void {
    if (this.newCategory.id && this.newCategory.name) {
      this.categoryService.createCategory(this.newCategory).subscribe(
        (data) => {
          console.log('Category added successfully:', data);
          this.newCategory = { id: '', name: '', description: '' }; // Reset form
        },
        (error) => console.error('Error adding category:', error)
      );
    } else {
      console.error('Category ID and Name are required.');
    }
  }
}
