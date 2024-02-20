import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Service/auth.service';
import { Router } from '@angular/router';
import { TransferServiceService } from '../Service/transfer-service.service';

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
        this.router.navigateByUrl('/home');
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