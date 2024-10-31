import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/service/auth.service';
import { LoginResponse } from './loginResponse.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export default class AuthSigninComponent implements OnInit { 
  errorMessage;
  public form: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService,
    private cookieService: CookieService) {}

  ngOnInit() {
    this.form = this.fb.group ( {
      uname: [null , Validators.compose ( [ Validators.required ] )] ,
      password: [null , Validators.compose ( [ Validators.required ] )]
    } );
  }
  
  onSubmit() {
    this.authService.login(this.form.controls['uname'].value, this.form.controls['password'].value).subscribe(data => {
        this.errorMessage = '';
        this.authService.setLoggedIn(true);
        // set cookie
        // this.cookieService.set( 'token', data.headers.get('Authorization') );
        const loginResult = data.body as LoginResponse;
        console.log(loginResult.token);
        this.cookieService.set( 'token', loginResult.token,2,'/' );
        this.cookieService.set( 'userName', this.form.controls['uname'].value,2,'/' );
        this.router.navigate ( [ '/dashboard' ] );
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 || error.status === 403) {
          // this.errorMessage = this.translate.instant('login.wrongUsernamePassword');
          this.errorMessage = "Wrong ID or Password!"
        }
      }
    });
  }


}
