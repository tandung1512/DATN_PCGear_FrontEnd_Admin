import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';

// Account components
import { AccountListComponent } from './account/account-list/account-list.component';
import { AccountEditComponent } from './account/account-edit/account-edit.component';
import { AccountCreateComponent } from './account/account-create/account-create.component';

import { AuthGuard } from './auth-guard.guard';

// Invoice components
import { InvoicePendingComponent } from './invoice/invoice-pending/invoice-pending.component';
import { InvoiceDeliveryComponent } from './invoice/invoice-delivery/invoice-delivery.component';
import { InvoiceCompleteComponent } from './invoice/invoice-complete/invoice-complete.component';
import { InvoiceCancelledComponent } from './invoice/invoice-canceller/invoice-cancelled.component';
import { InvoiceDetailedComponent } from './invoice/invoice-detailed/invoice-detailed.component';

// Brand components
import { BrandEditComponent } from './brand/brand-edit/brand-edit.component';
import { BrandListComponent } from './brand/brand-list/brand-list.component';
import { BrandAddComponent } from './brand/brand-create/brand-add.component';

// Supplier components
import { SupplierListComponent } from './supplier/list/supplier-list.component';
import { SupplierAddComponent } from './supplier/add/supplier-add.component';
import { SupplierEditComponent } from './supplier/edit/supplier-edit.component';

// Distinctive components
import { DistinctiveListComponent } from './distinctive/list/distinctive-list.component';
import { DistinctiveCreateComponent } from './distinctive/create/distinctive-create.component';
import { DistinctiveEditComponent } from './distinctive/edit/distinctive-edit.component';

// Category components
import { AddCategoryComponent } from './category/add/add-category.component';
import { EditCategoryComponent } from './category/edit/edit-category.component';
import { ListCategoryComponent } from './category/list/list-category.component';
// Product components
import { ProductListComponent } from './product/list/product-list.component';
import { ProductAddComponent } from './product/add/product-add.component';
import { ProductEditComponent } from './product/edit/product-edit.component';
import AuthSigninComponent from './demo/pages/authentication/auth-signin/auth-signin.component';



const routes: Routes = [
  { path: 'authentication/login', component: AuthSigninComponent },

  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],  // Đảm bảo AuthGuard bảo vệ tất cả các tuyến đường con
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./demo/dashboard/dashboard.component').then(m => m.default),
      },
      // Account routes
      { path: 'accounts', component: AccountListComponent },
      { path: 'accounts/edit/:id', component: AccountEditComponent },
      { path: 'accounts/create', component: AccountCreateComponent },

      // Invoice routes
      { path: 'invoice-pending', component: InvoicePendingComponent },
      { path: 'invoice-delivery', component: InvoiceDeliveryComponent },
      { path: 'invoice-complete', component: InvoiceCompleteComponent },
      { path: 'invoice-cancelled', component: InvoiceCancelledComponent },
      { path: 'invoice-detailed', component: InvoiceDetailedComponent },

      // Brand routes
      { path: 'brands', component: BrandListComponent },
      { path: 'brands/create', component: BrandAddComponent },
      { path: 'brands/edit/:id', component: BrandEditComponent },

      // Supplier routes
      { path: 'suppliers', component: SupplierListComponent },
      { path: 'suppliers/create', component: SupplierAddComponent },
      { path: 'suppliers/edit/:id', component: SupplierEditComponent },

      // Distinctive routes
      { path: 'distinctives', component: DistinctiveListComponent },
      { path: 'distinctives/create', component: DistinctiveCreateComponent },
      { path: 'distinctives/edit/:id', component: DistinctiveEditComponent },

      // Category routes
      { path: 'categories', component: ListCategoryComponent },
      { path: 'categories/create', component: AddCategoryComponent },
      { path: 'categories/edit/:id', component: EditCategoryComponent },

      // Product routes
      { path: 'products', component: ProductListComponent },
      { path: 'products/create', component: ProductAddComponent },
      { path: 'products/edit/:id', component: ProductEditComponent },

      // Default redirect (sửa lại vì bạn đã có redirectTo ở đầu route)
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },

  // Wildcard route to redirect to login if the user navigates to an invalid path
  { path: '**', redirectTo: '/authentication/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
