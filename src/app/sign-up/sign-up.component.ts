import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  public signUp! : SignUp;

  constructor(private authService: AuthService){}

  public signUpForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
  });
  onSubmit(){
    this.signUp = {
      username: this.signUpForm.get('username')?.value,
      password: this.signUpForm.get('password')?.value,
      name: this.signUpForm.get('name')?.value,
      email: this.signUpForm.get('email')?.value,
      phone: this.signUpForm.get('phone')?.value,
      address: this.signUpForm.get('address')?.value
    }

    this.authService.signUp(this.signUp).subscribe(response => {
      console.log('Create user successfully', response);
    }, error => {
      console.error('Error creating user', error);
    });

  }
}

export interface SignUp{
  username: string,
  password: string,
  name: string,
  email: string,
  phone: string,
  address: string
}
