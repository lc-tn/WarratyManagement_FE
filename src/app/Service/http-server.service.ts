import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { WarrantyById, Warranty, WarrantyHistory, EditWarranty, WarrantyDeviceHistory, WarrantyDevice } from '../warranty/warranty.component';
import { User } from '../user/user.component';
import { Role } from '../role/role.component';
import { Permission, RolePermission } from '../permission/permission.component';
import { Device } from '../device/device.component';
import { CreateWarranty } from '../create-warranty/create-warranty.component';

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

  public createWarranty(warranty: CreateWarranty): Observable<CreateWarranty>{
    const url = `${this.REST_API_SERVER}/Warranty`;
    return this.httpClient.post<CreateWarranty>(url, warranty, this.httpOptions);
  }

  public getWarranty(): Observable<Warranty[]> {
    const url = `${this.REST_API_SERVER}/Warranty`;
    return this.httpClient.get<Warranty[]>(url, this.httpOptions);
  }

  public editWarranty(editWarranty: EditWarranty): Observable<EditWarranty> {
    const url = `${this.REST_API_SERVER}/Warranty`;
    return this.httpClient.put<EditWarranty>(url, editWarranty, this.httpOptions);
  }

  public getWarrantyById(id: number): Observable<WarrantyById> {
    const url = `${this.REST_API_SERVER}/Warranty/${id}`;
    return this.httpClient.get<WarrantyById>(url, this.httpOptions);
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

  public getDeviceByUser(userId: any): Observable<Device[]> {
    const url = `${this.REST_API_SERVER}/Device/device/${userId}`;
    return this.httpClient.get<Device[]>(url, this.httpOptions);
  }

  public getWarrantyHistory(warrantyId: number): Observable<WarrantyHistory[]> {
    const url = `${this.REST_API_SERVER}/WarrantyHistory/${warrantyId}`;
    return this.httpClient.get<WarrantyHistory[]>(url, this.httpOptions);
  }

  public addWarrantyHistory(warrantyHistory: EditWarranty): Observable<EditWarranty>{
    const url = `${this.REST_API_SERVER}/WarrantyHistory`;
    return this.httpClient.post<EditWarranty>(url, warrantyHistory, this.httpOptions);
  }

  public getWarrantyDeviceHistory(warrantyId: number): Observable<WarrantyDeviceHistory[]> {
    const url = `${this.REST_API_SERVER}/WarrantyDeviceHistory/${warrantyId}`;
    return this.httpClient.get<WarrantyDeviceHistory[]>(url, this.httpOptions);
  }

  public editWarrantyDevice(warrantyDevice: WarrantyDevice): Observable<WarrantyDevice>{
    const url = `${this.REST_API_SERVER}/WarrantyDevice`;
    return this.httpClient.put<WarrantyDevice>(url, warrantyDevice, this.httpOptions);
  }

  public addWarrantyDeviceHistory(warrantyDeviceHistory: WarrantyDevice): Observable<WarrantyDevice>{
    const url = `${this.REST_API_SERVER}/WarrantyDeviceHistory`;
    return this.httpClient.post<WarrantyDevice>(url, warrantyDeviceHistory, this.httpOptions);
  }

  public addWarrantyDevice(warrantyDevice: WarrantyDevice): Observable<WarrantyDevice>{
    const url = `${this.REST_API_SERVER}/WarrantyDevice`;
    return this.httpClient.post<WarrantyDevice>(url, warrantyDevice, this.httpOptions);
  }
}
