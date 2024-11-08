// Angular imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; 

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
    AddCategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    
    ReactiveFormsModule,
    SharedModule,
    BrowserAnimationsModule,
    
    HttpClientModule,
  ],
  providers: [
    NavigationItem, AccountService ,{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
