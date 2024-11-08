import { Component, OnInit } from '@angular/core';
import { BrandService } from '../brand.service';
import { Router } from '@angular/router';
import { Brand } from '../brand.model';

@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
})
export class BrandAddComponent implements OnInit {
  brand: Brand = {
    id: '',
    name: '',
    phoneNumber: '',
    email: '',
    address: ''
  };

  constructor(private brandService: BrandService, private router: Router) {}

  ngOnInit(): void {}

  // Tạo mới thương hiệu
  createBrand(): void {
    this.brandService.createBrand(this.brand).subscribe(
      (newBrand) => {
        console.log('Thương hiệu đã được tạo:', newBrand);
        this.router.navigate(['/brands']);  // Điều hướng về trang danh sách thương hiệu
      },
      (error) => {
        console.error('Lỗi khi tạo thương hiệu:', error);
      }
    );
  }
}
