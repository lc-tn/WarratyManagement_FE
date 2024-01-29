import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpRequest, provideHttpClient, withFetch } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { WarrantyComponent } from './warranty/warranty.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { Interceptor } from './Service/interceptor.service';
import { RoleComponent } from './role/role.component';
import { PermissionComponent } from './permission/permission.component';
import { JwtModule } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    HomeComponent,
    UserComponent,
    WarrantyComponent,
    SignUpComponent,
    RoleComponent,
    PermissionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:7140'],
        disallowedRoutes: []
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi:true
    },
    provideClientHydration(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function tokenGetter() {
  return localStorage.getItem('loginToken');
}
