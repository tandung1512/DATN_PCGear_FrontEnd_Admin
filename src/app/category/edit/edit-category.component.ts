import { Component, Input, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { Category } from '../category.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
 
})
export class EditCategoryComponent implements OnInit {
  @Input() categoryId!: string;
  category?: Category;

  constructor(private categoryService: CategoryService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id')!;
    this.loadCategory();
  }

  loadCategory(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe(
      (data) => this.category = data,
      (error) => console.error('Error loading category:', error)
    );
  }

  updateCategory(): void {
    if (this.category) {
      this.categoryService.updateCategory(this.category.id, this.category).subscribe(
        (data) => console.log('Category updated successfully:', data),
        (error) => console.error('Error updating category:', error)
      );
    }
  }
}
