import { Component, Input } from '@angular/core';
import { TransferServiceService } from '../Service/transfer-service.service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpServerService } from '../Service/http-server.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.scss'
})
export class PermissionComponent {

  public role!: Role;
  private permissionListByRole!: Permission[];
  private permissionList!: Permission[];
  private rolePermission!: RolePermission;
  
  constructor(
    private transferService:TransferServiceService,
    private router:Router,
    private formBuilder: FormBuilder, 
    private httpService: HttpServerService) { 
      this.permissionForm = this.formBuilder.group({
        permissions: this.formBuilder.array([])
      });
     }

     public permissionForm: FormGroup = new FormGroup({
      roleId: new FormControl(''),
      permissionId: new FormControl(''),
      name: new FormControl(''),
      choice: new FormControl('')
    });

  public ngOnInit(): void {
    this.role = this.transferService.getData();

    this.httpService.getPermission(this.role.id).subscribe(response => {
      this.permissionListByRole = response;
      console.log(this.permissionListByRole);
      
      this.httpService.getAllPermission().subscribe((permissions) => {
        this.permissionList = permissions;

        this.permissionList.forEach(permission => {
          const existsInRole = this.permissionListByRole.some(permissionByRole => permissionByRole.id === permission.id);

          const permissionGroup = this.formBuilder.group({
            permissionId: [permission.id],
            name: [permission.name],
            choice: [existsInRole]
          });
          this.permissions.push(permissionGroup);
        });
      });
    }, error => {
      console.error(error);
    });
  }

  get permissions(): FormArray {
    return this.permissionForm.get('permissions') as FormArray;
  }

  public onSubmit(permissionList : FormArray): void {
    const checkedPermissions = permissionList.controls
  .filter(control => control.value.choice)
  .map(control => control.value.permissionId);
    
    this.rolePermission = {
      roleId: this.role.id,
      permissionId: checkedPermissions
    }

    console.log(this.rolePermission);

    this.httpService.editRolePermission(this.rolePermission).subscribe(response => {
      console.log('Edit user successfully', response);
    }, error => {
      console.error('Error editing user', error);
    });
  }  
}

export interface Role{
  id: number,
  name: string
}

export interface Permission{
  id: number,
  name: string
}

export interface RolePermission{
  roleId: number,
  permissionId: number[]
}