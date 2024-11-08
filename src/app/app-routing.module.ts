import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';


// Account components

import { AccountListComponent } from './account/account-list/account-list.component';
import { AccountEditComponent } from './account/account-edit/account-edit.component';
import { AccountCreateComponent } from './account/account-create/account-create.component';
import AuthSigninComponent from './demo/pages/authentication/auth-signin/auth-signin.component';
import { AuthGuard } from './auth-guard.guard';

const routes: Routes = [ {path: 'authentication/login', component:AuthSigninComponent},
  {
    path: '',
    component: AdminComponent,canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./demo/dashboard/dashboard.component').then(m => m.default), // Use `m.default` for default export
      },
      { path: 'accounts', component: AccountListComponent },
      { path: 'accounts/edit/:id', component: AccountEditComponent },
      { path: 'accounts/create', component: AccountCreateComponent },
     
      { path: '', redirectTo: '/accounts', pathMatch: 'full' },
      { path: '**', redirectTo: '/accounts' } // Handle 404
    ],

},

  // {
  //   path: '',
  //   component: GuestComponent,
  //   children: [
  //     {
  //       path: 'auth',
  //       loadChildren: () =>
  //         import('./demo/pages/authentication/authentication.module').then(
  //           m => m.AuthenticationModule
  //         ),
  //     },
  //   ],
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
