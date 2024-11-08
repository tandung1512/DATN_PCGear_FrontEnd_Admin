import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../brand.service';
import { Brand } from '../brand.model';

@Component({
  selector: 'app-brand-edit',
  templateUrl: './brand-edit.component.html',
})
export class BrandEditComponent implements OnInit {
  brand: Brand = {
    id: '',
    name: '',
    phoneNumber: '',
    email: '',
    address: ''
  };

  constructor(
    private brandService: BrandService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.brandService.getBrandById(id).subscribe(
      (brand) => {
        this.brand = brand;
      },
      (error) => {
        console.error('Lỗi khi lấy thông tin thương hiệu:', error);
      }
    );
  }

  // Cập nhật thương hiệu
  updateBrand(): void {
    this.brandService.updateBrand(this.brand.id, this.brand).subscribe(
      (updatedBrand) => {
        console.log('Thương hiệu đã được cập nhật:', updatedBrand);
        this.router.navigate(['/brands']);  // Điều hướng về trang danh sách thương hiệu
      },
      (error) => {
        console.error('Lỗi khi cập nhật thương hiệu:', error);
      }
    );
  }
}
