import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpServerService } from '../Service/http-server.service';
import { TransferServiceService } from '../Service/transfer-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent {

  public role!: Role;
  public roleList: Role[] = [];
  
  constructor(private formBuilder: FormBuilder, 
              private httpService: HttpServerService,
              private transferService:TransferServiceService,
              private router: Router) {
    this.roleForm = this.formBuilder.group({
      roles: this.formBuilder.array([])
    });
  }

  public roleForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    creating: new FormControl('')
  });

  public createRoleForm: FormGroup = new FormGroup({
    creating: new FormControl('')
  });

  public ngOnInit() {
    this.httpService.getRole().subscribe((roles) => {
      roles.forEach(role => {
        const roleGroup = this.formBuilder.group({
          id: [role.id],
          name: [role.name],
          // permission: [role.permission]
        });
        this.roles.push(roleGroup);
      });
    });
  }

  public create(){
    this.role = {
      id: 0,
      name: this.createRoleForm.get('creating')?.value
    }

    console.log(this.role);

    this.httpService.createRole(this.role).subscribe((response) => {
      console.log('Warranty created successfully', response);
    }, error => {
      console.error('Error creating warranty', error);
    });
  }

  get roles(): FormArray {
    return this.roleForm.get('roles') as FormArray;
  }

  onSubmit(i: number) {
    const roleGroup = this.roles.at(i) as FormGroup;
    this.role = roleGroup.value;

    this.transferService.setData(this.role);
    this.router.navigateByUrl('/permission');
  }

}

export interface Role{
  id: number,
  name: string
}
