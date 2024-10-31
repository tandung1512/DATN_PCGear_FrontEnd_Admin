import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './service/auth.service';

// import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isLoggedIn) {
      return true;
    } else {
      // check login from server
      // return this.user.isLoggedIn().pipe(map(res => {
      //   if (res.status) {
      //     this.auth.setLoggedIn(true);
      //     return true;
      //   } else {
      //     this.router.navigate(['/login']);
      //     return false;
      //   }
      // }));
      this.router.navigate(['/authentication/login']);
      return false;
    }
  }
}