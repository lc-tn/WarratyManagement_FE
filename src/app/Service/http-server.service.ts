import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Warranty } from '../warranty/warranty.component';
import { User } from '../user/user.component';
import { Role } from '../role/role.component';
import { Permission, RolePermission } from '../permission/permission.component';

@Injectable({
  providedIn: 'root'
})

export class HttpServerService {
  private REST_API_SERVER = 'https://localhost:7140/api';
  private httpOptions = {
    headers: new HttpHeaders({
      // 'Access-Control-Allow-Origin': '*',
      'Content-type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }
  public getUser(): Observable<User[]> {
    const url = `${this.REST_API_SERVER}/User`;
    return this.httpClient.get<User[]>(url, this.httpOptions);
  }

  public editUser(user: User): Observable<User> {
    const url = `${this.REST_API_SERVER}/User`;
    return this.httpClient.put<User>(url, user, this.httpOptions);
  }

  public createWarranty(warranty: Warranty): Observable<Warranty>{
    const url = `${this.REST_API_SERVER}/Warranty`;
    return this.httpClient.post<Warranty>(url, warranty, this.httpOptions);
  }

  public getWarranty(): Observable<Warranty[]> {
    const url = `${this.REST_API_SERVER}/Warranty`;
    return this.httpClient.get<Warranty[]>(url, this.httpOptions);
  }

  public editWarranty(warranty: Warranty): Observable<Warranty> {
    const url = `${this.REST_API_SERVER}/Warranty`;
    return this.httpClient.put<Warranty>(url, warranty, this.httpOptions);
  }

  public getRole(): Observable<Role[]> {
    const url = `${this.REST_API_SERVER}/Role`;
    return this.httpClient.get<Role[]>(url, this.httpOptions);
  }

  public createRole(role: Role): Observable<Role>{
    const url = `${this.REST_API_SERVER}/Role`;
    return this.httpClient.post<Role>(url, role, this.httpOptions);
  }

  public getPermission(id: number): Observable<Permission[]> {
    const url = `${this.REST_API_SERVER}/Permission/${id}`;
    return this.httpClient.get<Permission[]>(url, this.httpOptions);
  }

  public getAllPermission(): Observable<Permission[]> {
    const url = `${this.REST_API_SERVER}/Permission`;
    return this.httpClient.get<Permission[]>(url, this.httpOptions);
  }

  public editRolePermission(rolePermission: RolePermission): Observable<Role>{
    const url = `${this.REST_API_SERVER}/RolePermission`;
    return this.httpClient.post<Role>(url, rolePermission, this.httpOptions);
  }
}
