// Angular imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; 
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';


// Project imports
import { AppComponent } from './app.component';

// Shared module and components
import { SharedModule } from './theme/shared/shared.module';

// Layout components
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavLogoComponent } from './theme/layout/admin/navigation/nav-logo/nav-logo.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavSearchComponent } from './theme/layout/admin/nav-bar/nav-left/nav-search/nav-search.component';

//invoice
import { InvoicePendingComponent } from './invoice/invoice-pending/invoice-pending.component';
import { InvoiceDeliveryComponent } from './invoice/invoice-delivery/invoice-delivery.component';
import { InvoiceCompleteComponent } from './invoice/invoice-complete/invoice-complete.component';
import { InvoiceCancelledComponent } from './invoice/invoice-canceller/invoice-cancelled.component';
import { InvoiceDetailedComponent } from './invoice/invoice-detailed/invoice-detailed.component';
// Shared directives
import { ToggleFullScreenDirective } from './theme/shared/components/full-screen/toggle-full-screen';

// Account components
import { AccountListComponent } from './account/account-list/account-list.component';
import { AccountEditComponent } from './account/account-edit/account-edit.component';
import { AccountCreateComponent } from './account/account-create/account-create.component';
// Brand components
import { BrandEditComponent} from './brand/brand-edit/brand-edit.component'
import { AuthInterceptor } from './auth.interceptor';
import { BrandListComponent } from './brand/brand-list/brand-list.component';
import { BrandAddComponent } from './brand/brand-create/brand-add.component';

// Navigation item provider
import { NavigationItem } from './theme/layout/admin/navigation/navigation';

// Services
import { AccountService } from './account/account.service';

// Supplier component
import { SupplierListComponent } from './supplier/list/supplier-list.component';
import { SupplierAddComponent } from './supplier/add/supplier-add.component';
import { SupplierEditComponent } from './supplier/edit/supplier-edit.component';
//Distinctive component
import { DistinctiveListComponent } from './distinctive/list/distinctive-list.component';
import { DistinctiveCreateComponent } from './distinctive/create/distinctive-create.component';
import { DistinctiveEditComponent } from './distinctive/edit/distinctive-edit.component';
//Category components
import { AddCategoryComponent } from './category/add/add-category.component';
import { EditCategoryComponent } from './category/edit/edit-category.component';
import { ListCategoryComponent } from './category/list/list-category.component';
// Product components
import { ProductListComponent } from './product/list/product-list.component';
import { ProductAddComponent } from './product/add/product-add.component';
import { ProductEditComponent } from './product/edit/product-edit.component';

// Banner components
import { BannerListComponent } from './banner/list/banner-list.component';
import { BannerCreateComponent } from './banner/create/banner-create.component';
import { BannerEditComponent } from './banner/edit/banner-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    GuestComponent,
    AdminComponent,
    ConfigurationComponent,
    NavBarComponent,
    NavigationComponent,
    NavLeftComponent,
    NavRightComponent,
    NavContentComponent,
    NavLogoComponent,
    NavCollapseComponent,
    NavGroupComponent,
    NavItemComponent,
    NavSearchComponent,
    ToggleFullScreenDirective,
    AccountListComponent,
    AccountEditComponent,
    AccountCreateComponent,
    InvoicePendingComponent,
    InvoiceDeliveryComponent,
    InvoiceCompleteComponent,
    InvoiceCancelledComponent,
    InvoiceDetailedComponent ,
    BrandEditComponent,
    BrandAddComponent,
    BrandListComponent,
    SupplierListComponent,
    SupplierAddComponent,
    SupplierEditComponent,
    DistinctiveListComponent,
    DistinctiveCreateComponent,
    DistinctiveEditComponent,
    ListCategoryComponent,
    EditCategoryComponent,
    AddCategoryComponent,
    ProductEditComponent,
    ProductAddComponent,
    ProductListComponent,
    BannerListComponent,
    BannerCreateComponent,
    BannerEditComponent
  
     ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    SharedModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    
    NavigationItem, AccountService ,DatePipe,{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
      
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
