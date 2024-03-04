import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { HttpServerService } from '../Service/http-server.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  public user!: User;
  public userList!: User[];

  constructor(private formBuilder: FormBuilder, private httpService: HttpServerService) {
    this.userForm = this.formBuilder.group({
      users: this.formBuilder.array([])
    });
  }

  public userForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    password: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
    role: new FormControl('')
  });

  public ngOnInit() {
    this.httpService.getUser().subscribe((users) => {
      this.userList = users;
      users.forEach(user => {
        const userGroup = this.formBuilder.group({
          id: [user.id],
          name: [user.name],
          username: [user.username],
          password: [user.password],
          email: [user.email],
          phone: [user.phone],
          address: [user.address],
          role: [user.role]
        });
        this.users.push(userGroup);
      });
    });
  }

  get users(): FormArray {
    return this.userForm.get('users') as FormArray;
  }

  public get usersArray(): any[] {
    return this.users.controls.map(control => control.value);
  }
  

  onSubmit(i: number) {
    const userGroup = this.users.at(i) as FormGroup;
    this.user = userGroup.value;
    this.httpService.editUser(this.user).subscribe(response => {
    }, error => {
    });
  }
}

export interface User {
  id: string | null,
  password: string | null,
  name: string | null,
  username: string | null,
  email: string | null,
  phone: string | null,
  address: string | null,
  role: string
}