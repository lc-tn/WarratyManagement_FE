import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { Router } from 'express';
import { AuthResponse, Login } from '../login/login.component';
import { SignUp } from '../sign-up/sign-up.component';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authChangeSub = new Subject<boolean>()
  public authChanged = this.authChangeSub.asObservable();
  private AUTH_SERVER = 'https://localhost:7140/api';
  constructor(private httpClient: HttpClient, private jwtHelper: JwtHelperService) { 
  }
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  }

  public login(login: Login): Observable<string>{
    const url = `${this.AUTH_SERVER}/User/signin`;
    return this.httpClient.post<string>(url, login, {responseType: 'text' as 'json'});
  }

  public signUp(signUp: SignUp): Observable<SignUp>{
    const url = `${this.AUTH_SERVER}/User/signup`;
    return this.httpClient.post<SignUp>(url, signUp, this.httpOptions);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('loginToken');
    return !this.jwtHelper.isTokenExpired(token);
  }
  
}
