// angular import
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  constructor(private cookieService: CookieService){}
  logouts() {
    localStorage.clear();
    this.cookieService.deleteAll();
    window.location.reload();
  }
}
