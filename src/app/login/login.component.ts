import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Service/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponentComponent {
  [x: string]: any;

  public login!: Login;
  private token!: string;
  validateControl: any;
  hasError: any;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  showError!: boolean;
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  public loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  public onSubmit() {
    this.login = ({
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value
    });
    console.log(this.login);

    this.authService.login(this.login).subscribe((res:any) => {
      if(res){
        // console.log(res.token);
          alert('Login successfully');
          localStorage.setItem('loginToken', res);
          this.router.navigateByUrl('/home');
        }
        else{
          alert("Login unsuccessfully");
        }
      })
  }

  public ngOnInit(): void {
  }
}

export interface Login {
  username: string,
  password: string
}

export interface AuthResponse{
  isAuthenticated: boolean,
  errorMessage: string,
  token: string
}