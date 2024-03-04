import { Component } from '@angular/core';
import { User } from '../user/user.component';
import { Device, DeviceWarranty } from '../device/device.component';
import { HttpServerService } from '../Service/http-server.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { EditWarranty } from '../warranty/warranty.component';

@Component({
  selector: 'app-create-warranty',
  templateUrl: './create-warranty.component.html',
  styleUrl: './create-warranty.component.scss'
})
export class CreateWarrantyComponent {

  customers: User[] = [];
  selectedCustomer!: User;

  deviceOptions: Device[] = [];
  selectedDevices!: DeviceWarranty[];
  deviceWarranties: DeviceWarranty[] = [];
  deviceDescription!: string;
  createAppointmentDate!: Date;
  createDescription!: string;

  createWarranty!: CreateWarranty;
  editWarranty!: EditWarranty;
  
  constructor(private httpService: HttpServerService,
    private messageService: MessageService, private router: Router,) {
  }

  public ngOnInit() {
    this.httpService.getUserByRole(1).subscribe((data) => {
      this.customers = data;
    });
  }

  GetDeviceByUser(customer: User) {
    this.deviceOptions = [];
    this.selectedDevices = [];
    console.log(this.selectedDevices)
    this.httpService.getDeviceByUser(customer.id).subscribe((data) => {
      if (data.at(0)) {
        this.deviceOptions = data;
      }
      else {
        this.deviceOptions = [];
        this.selectedDevices = [];
      }
    });
  }

  public async createWarrantyTicket() {
    this.deviceWarranties = [];
    this.selectedDevices?.forEach(device => {
      this.deviceWarranties.push(device);
    });
    this.createWarranty = {
      id: 0,
      description: this.createDescription === undefined ? '' : this.createDescription,
      appointmentDate: this.createAppointmentDate,
      creator: localStorage.getItem("username")?.toString(),
      device: this.deviceWarranties,
      customerId: this.selectedCustomer?.id
    };

    console.log(this.createWarranty)

    this.httpService.createWarranty(this.createWarranty).subscribe(response => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Create successfully!' });
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
    });
  }

  updateDevice(description: string, i: number){
    this.selectedDevices[i].description = description;
  }

  back(){
    this.router.navigateByUrl('/warranty');
  }
}

export interface CreateWarranty {
  id: number,
  description: string,
  device: DeviceWarranty[],
  customerId: string | null,
  creator: string | undefined,
  appointmentDate: Date
}
