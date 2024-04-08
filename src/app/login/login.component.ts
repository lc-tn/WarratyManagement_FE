import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Service/auth.service';
import { Router } from '@angular/router';
import { TransferServiceService } from '../Service/transfer-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponentComponent {
  [x: string]: any;

  public login!: Login;
  value!: string;
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
    private router: Router,
    private transferService:TransferServiceService
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

    this.authService.login(this.login).subscribe((res: any) => {
      if (res) {
        localStorage.setItem('loginToken', res);
        localStorage.setItem('username', this.login.username);
        const helper = new JwtHelperService();
        const decoded= helper.decodeToken(res);
        localStorage.setItem('role', decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
        localStorage.setItem('userId', decoded.UserId);
        this.router.navigateByUrl('/warranty');
      }
      else {
        alert("Login unsuccessfully");
      }
    })
  }
  public ngOnInit(): void {
    const token = localStorage.getItem('loginToken');
    if (token){
      this.router.navigateByUrl('/home');
    }
  }
}

export interface Login {
  username: string,
  password: string
}

export interface AuthResponse {
  isAuthenticated: boolean,
  errorMessage: string,
  token: string
}