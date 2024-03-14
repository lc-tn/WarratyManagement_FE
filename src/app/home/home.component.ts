import { Component } from '@angular/core';
import { tokenGetter } from '../app.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  public username: string | undefined;
  role: any = localStorage.getItem('role');

  constructor(){}
  ngOnInit(): void {
    this.username = localStorage.getItem('username')?.toString();
  }

  public Logout(){
    localStorage.clear();
  }
}


