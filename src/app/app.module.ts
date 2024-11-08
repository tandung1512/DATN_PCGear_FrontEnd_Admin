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

// Navigation item provider
import { NavigationItem } from './theme/layout/admin/navigation/navigation';

// Services
import { AccountService } from './account/account.service';
import { AuthInterceptor } from './auth.interceptor';


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
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
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
