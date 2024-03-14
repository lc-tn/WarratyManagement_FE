import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { LoginComponentComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { WarrantyComponent } from './warranty/warranty.component';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RoleComponent } from './role/role.component';
import { PermissionComponent } from './permission/permission.component';
import { AuthGuardService } from './Service/auth-guard.service';
import { DeviceComponent } from './device/device.component';
import { CreateWarrantyComponent } from './create-warranty/create-warranty.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponentComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  {path: 'user', component: UserComponent, canActivate: [AuthGuardService]},
  {path: 'warranty', component: WarrantyComponent, canActivate: [AuthGuardService]},
  {path: 'warranty/create', component: CreateWarrantyComponent},
  {path: 'signUp', component: SignUpComponent},
  {path: 'role', component: RoleComponent, canActivate: [AuthGuardService]},
  {path: 'permission', component: PermissionComponent, canActivate: [AuthGuardService]},
  {path: 'device', component: DeviceComponent, canActivate: [AuthGuardService]},
  {path: 'report', component: ReportComponent, canActivate: [AuthGuardService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
