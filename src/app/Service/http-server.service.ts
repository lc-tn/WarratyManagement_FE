import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Warranty } from '../warranty/warranty.component';
import { User } from '../user/user.component';
import { Role } from '../role/role.component';
import { Permission, RolePermission } from '../permission/permission.component';
import { Device } from '../device/device.component';

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

  public getUserByRole(roleId: number): Observable<User[]> {
    const url = `${this.REST_API_SERVER}/User/role/${roleId}`;
    return this.httpClient.get<User[]>(url, this.httpOptions);
  }

  public editUser(user: User): Observable<User> {
    const url = `${this.REST_API_SERVER}/User`;
    return this.httpClient.put<User>(url, user, this.httpOptions);
  }

  public createWarranty(warranty: Warranty): Observable<HttpResponse<string>>{
    const url = `${this.REST_API_SERVER}/Warranty`;
    return this.httpClient.post<HttpResponse<string>>(url, warranty, this.httpOptions);
  }

  public getWarranty(): Observable<Warranty[]> {
    const url = `${this.REST_API_SERVER}/Warranty`;
    return this.httpClient.get<Warranty[]>(url, this.httpOptions);
  }

  public editWarranty(warranty: Warranty): Observable<Warranty> {
    const url = `${this.REST_API_SERVER}/Warranty`;
    return this.httpClient.put<Warranty>(url, warranty, this.httpOptions);
  }

  public getWarrantyById(id: number): Observable<Warranty> {
    const url = `${this.REST_API_SERVER}/Warranty/${id}`;
    return this.httpClient.get<Warranty>(url, this.httpOptions);
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

  public createDevice(device: Device): Observable<Device>{
    const url = `${this.REST_API_SERVER}/Device`;
    return this.httpClient.post<Device>(url, device, this.httpOptions);
  }

  public getAllDevice(): Observable<Device[]> {
    const url = `${this.REST_API_SERVER}/Device`;
    return this.httpClient.get<Device[]>(url, this.httpOptions);
  }

  public getDeviceById(id: any): Observable<Device> {
    const url = `${this.REST_API_SERVER}/Device/${id}`;
    return this.httpClient.get<Device>(url, this.httpOptions);
  }
}
