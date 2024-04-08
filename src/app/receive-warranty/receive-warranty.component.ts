import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpServerService } from '../Service/http-server.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { EditWarranty, WarrantyById, WarrantyDevice, WarrantyDeviceHistory, WarrantyHistory } from '../warranty/warranty.component';
import { Device, ReplacementDevice } from '../device/device.component';
import { User } from '../user/user.component';

@Component({
  selector: 'app-receive-warranty',
  templateUrl: './receive-warranty.component.html',
  styleUrl: './receive-warranty.component.scss'
})
export class ReceiveWarrantyComponent implements OnInit {

  role: any = localStorage.getItem('role');
  userId: any = localStorage.getItem('userId');

  // checkBox: boolean[] = [];
  disabled: boolean = false;
  disabledDevice: boolean[] = [];
  // check: Boolean = false;
  checkReason: Boolean = false;
  checkReplacement: Boolean = false;
  warrantyIndex = -1;
  stepIndex: number = 0;

  totalWarranty!: number;
  // color: any;
  // selectedItem: MenuItem | null = null;
  // items: MenuItem[] | undefined;
  // status: MenuItem[] | undefined;

  // warrantyPage: number = 0;
  // warrantyHistoryPage: number = 0;
  // warrantyDeviceHistoryPage: number = 0;
  // totalWarranty!: number;
  // totalWarrantyHistory: number = 0;
  // totalWarrantyDeviceHistory: number = 0;

  // deviceStatusOptions!: string[];
  // deviceResultOptions!: string[];
  // products: MenuItem[] | any;
  // activeItem: MenuItem | undefined;

  editWarranty!: EditWarranty;
  warrantyById!: WarrantyById;
  // warrantyStatus: string = '';

  // warrantyHistoryList: WarrantyHistory[] = [];
  // warrantyHistory!: WarrantyHistory;
  // warrantyDeviceHistoryList: WarrantyDeviceHistory[] = [];
  // warrantyDeviceHistory!: WarrantyDeviceHistory;
  // warrantyDevice!: WarrantyDevice;

  // username: string | undefined;

  devices: Device[] = [];
  // replacementDevices: Device[] = [];
  // replacementDevice!: ReplacementDevice;
  // editDevices: Device[] = [];
  // editedDevice!: Device;

  // deviceDescription!: string;
  // deviceStatus!: string;
  // deviceResult!: string;
  // reason!: string;

  warrantyDescription!: string;

  sales: User[] = [];
  technicians: User[] = [];
  deviceOptions: Device[] = [];

  warrantyId!: number;
  description!: string;
  customerName!: string;
  createDate!: Date;
  appointment!: Date;
  warrantyDate!: Date | null;
  deviceId!: number;

  selectedSale!: string | null;
  selectedTechnician!: string | null;
  selectedDevices!: Device[] | null;

  constructor(private formBuilder: FormBuilder, private httpService: HttpServerService,
    private messageService: MessageService, private router: Router) {
    this.warrantyEditForm = this.formBuilder.group({
      warranties: this.formBuilder.array([])
    });
  }

  public warrantyEditForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    deviceId: new FormControl(''),
    createDate: new FormControl(''),
    appoimentDate: new FormControl(''),
    warrantyDate: new FormControl(''),
    sale: new FormControl(''),
    technician: new FormControl(''),
    customerName: new FormControl(''),
    description: new FormControl(''),
    implementer: new FormControl(''),
    status: new FormControl('')
  });

  public ngOnInit() {
    this.httpService.getNewWarranty(this.userId, 0, 5).subscribe((warranties) => {
      warranties.forEach(warranty => {
        const warrantyGroup = this.formBuilder.group({
          id: [warranty.id],
          createDate: [warranty.createDate],
          status: [warranty.status],
          customerName: [warranty.customerName]
        });
        this.warranties.push(warrantyGroup);
      });
    });

    this.httpService.getTotalNewWarranty(this.userId).subscribe((data) => {
      this.totalWarranty = data;
    })
  }
  get warranties(): FormArray {
    return this.warrantyEditForm.get('warranties') as FormArray;
  }

  WarrantyPageChange(pageNumber: any) {
    this.warranties.clear();
    this.httpService.getNewWarranty(this.userId, pageNumber.page, pageNumber.rows).subscribe((warranties) => {
      warranties.forEach(warranty => {
        const warrantyGroup = this.formBuilder.group({
          id: [warranty.id],
          description: [warranty.description],
          createDate: [warranty.createDate],
          status: [warranty.status],
          customerName: [warranty.customerName]
        });
        this.warranties.push(warrantyGroup); 
      });
    });
  }

  GetInfo(w: any, i: number) {
    this.warrantyIndex = i;
    this.disabled = false;
    this.checkReason = false;
    this.checkReplacement = false;
    this.disabledDevice = [];
    var check = false;

    var warranty;
    if (w.value != undefined)
      warranty = w.value
    else
      warranty = this.warrantyById;

    this.httpService.getWarrantyById(warranty.id).subscribe((data) => {
      this.warrantyById = data;
      this.devices = this.warrantyById.device;
      this.warrantyDate = this.warrantyById.warrantyDate;
      this.warrantyDescription = this.warrantyById.description;

      this.selectedSale = this.warrantyById.saleId;
      this.selectedTechnician = this.warrantyById.technicianId;

      this.devices.forEach((device, index) => {
        if (device.status == 'Hoàn thành' || device.status == 'Từ chối')
          this.disabledDevice[index] = true;
        else
          this.disabledDevice[index] = false;

        if (device.reason)
          this.checkReason = true;

        if (device.replacementDevice)
          this.checkReplacement = true;
      })
    })
  }

  editWarrantyTicket() {
    if (this.role == 'Technician') {
      this.selectedTechnician = this.userId;
    }
    else {
      this.selectedSale = this.userId;
    }

    this.editWarranty = {
      id: this.warrantyById.id,
      description: this.warrantyDescription,
      appointmentDate: this.warrantyById.appointmentDate,
      warrantyDate: null,
      status: 'Chờ xác nhận',
      sale: this.selectedSale,
      technician: this.selectedTechnician,
      modifier: localStorage.getItem("username")?.toString(),
    };

    // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tiếp nhận phiếu bảo hành thành công' });

    this.httpService.editWarranty(this.editWarranty).subscribe(response => {
      this.httpService.addWarrantyHistory(this.editWarranty).subscribe(warrantyHistory => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tiếp nhận phiếu bảo hành thành công' });
        this.router.navigateByUrl("/warranty");
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Đã có lỗi xảy ra' });
      })
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Đã có lỗi xảy ra!' });
    });
  }

  back(){
    this.router.navigateByUrl('/warranty');
  }
}
