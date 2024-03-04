import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpRequest, provideHttpClient, withFetch } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { WarrantyComponent } from './warranty/warranty.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { Interceptor } from './Service/interceptor.service';
import { RoleComponent } from './role/role.component';
import { PermissionComponent } from './permission/permission.component';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { DeviceComponent } from './device/device.component';
import { InputTextModule } from 'primeng/inputtext';
import { TabMenuModule } from 'primeng/tabmenu';
import { StepsModule } from 'primeng/steps';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { DataViewModule } from 'primeng/dataview';
import { CreateWarrantyComponent } from './create-warranty/create-warranty.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    HomeComponent,
    UserComponent,
    WarrantyComponent,
    SignUpComponent,
    RoleComponent,
    PermissionComponent,
    DeviceComponent,
    CreateWarrantyComponent,
    // PBadgeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:7140'],
        disallowedRoutes: []
      }
    }),
    MatSlideToggleModule,
    BrowserAnimationsModule,
    ButtonModule,
    StyleClassModule,
    TableModule,
    InputTextModule,
    TabMenuModule,
    PasswordModule,
    StepsModule,
    DynamicDialogModule,
    CalendarModule,
    InputTextModule,
    ToastModule,
    DropdownModule,
    MultiSelectModule,
    DataViewModule,
    ConfirmPopupModule,
    DialogModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi:true,
    },
    provideClientHydration(),
    provideHttpClient(withFetch()),
    DialogService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function tokenGetter() {
  return localStorage.getItem('loginToken');
}
