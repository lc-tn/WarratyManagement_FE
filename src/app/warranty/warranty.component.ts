import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpServerService } from '../Service/http-server.service';
import { MenuItem, MessageService } from 'primeng/api';
import { User } from '../user/user.component';
import { Device, DeviceStatus } from '../device/device.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warranty',
  templateUrl: './warranty.component.html',
  styleUrl: './warranty.component.scss'
})
export class WarrantyComponent {

  check: Boolean = false;
  selectedIndex = -1;
  activeIndex: number = 0;
  color: any;
  selectedItem: MenuItem | null = null;
  items: MenuItem[] | undefined;
  status: MenuItem[] | undefined;

  deviceStatusOptions!: string[];
  deviceResultOptions!: string[];
  products: MenuItem[] | any;
  activeItem: MenuItem | undefined;

  editWarranty!: EditWarranty;
  warrantyById!: WarrantyById;
  warrantyList: Warranty[] = [];
  warrantyStatus: string = '';

  warrantyHistoryList: WarrantyHistory[] = [];
  warrantyHistory!: WarrantyHistory;
  warrantyDeviceHistoryList: WarrantyDeviceHistory[] = [];
  warrantyDeviceHistory!: WarrantyDeviceHistory;
  warrantyDevice!: WarrantyDevice;

  username: string | undefined;

  devices: Device[] = [];
  editDevices: Device[] = [];
  editedDevice!: Device;

  deviceDescription!: string;
  deviceStatus!: string;
  deviceResult!: string;

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

  selectedSale!: User | null;
  selectedTechnician!: User | null;
  selectedDevices!: Device[] | null;

  constructor(private formBuilder: FormBuilder, private httpService: HttpServerService,
    private messageService: MessageService, private router: Router,) {
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

  public editWarrantyTicket() {
    this.editWarranty = {
      id: this.warrantyById.id,
      description: this.warrantyDescription,
      appointmentDate: this.warrantyById.appointmentDate,
      warrantyDate: this.warrantyDate !== null ? this.warrantyDate.toJSON() : '',
      status: this.warrantyStatus,
      sale: this.selectedSale !== null ? this.selectedSale?.name?.toString() : '',
      technician: this.selectedTechnician !== null ? this.selectedTechnician?.name?.toString() : '',
      modifier: localStorage.getItem("username")?.toString(),
    };

    this.check = true;
    var status = '';
    this.devices.forEach(device => {
      if (device.id === this.deviceId) {
        device.status = this.deviceStatus;
        device.result = this.deviceResult;
      }
      if ((device.status === 'Hoàn thành' && device.result !== ' ') || device.status === 'Từ chối') {
        status = 'Hoàn thành';
      }
      else {
        this.check = false;
      }

      if (device.status === 'Chờ xác nhận') {
        status = 'Chờ xác nhận';
      }
    });
    if (status !== 'Chờ xác nhận') {
      if (this.check == true)
        status = 'Hoàn thành';
      else
        status = 'Đang xử lý';
    }

    this.editWarranty.status = status;

    this.warrantyById.warrantyDate = new Date(this.warrantyById.warrantyDate);

    if (this.warrantyById.description === this.editWarranty.description &&
      this.warrantyById.sale === this.editWarranty.sale &&
      this.warrantyById.technician === this.editWarranty.technician &&
      this.warrantyById.status === this.editWarranty.status &&
      ((this.warrantyDate === null && this.editWarranty.warrantyDate === '') ||
        (this.editWarranty.warrantyDate == this.warrantyById.warrantyDate?.toISOString()))) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Không có gì thay đổi' });
    }
    else {
      this.httpService.editWarranty(this.editWarranty).subscribe(response => {
        this.httpService.addWarrantyHistory(this.editWarranty).subscribe(warrantyHistory => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sửa thành công' });
        }, error =>{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
        })       
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
      });
    }
  }

  editWarrantyDevice() {
    this.warrantyDevice = {
      warrantyId: this.warrantyById.id,
      deviceId: this.deviceId,
      description: this.deviceDescription,
      status: this.deviceStatus,
      result: this.deviceResult,
      modifier: localStorage.getItem("username")?.toString()
    };

    this.devices.forEach(device => {
      if (device.id === this.deviceId) {
        if (device.description === this.warrantyDevice.description &&
          device.status === this.warrantyDevice.status &&
          device.result === this.warrantyDevice.result &&
          this.devices === this.warrantyById.device) {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Không có gì thay đổi' });
        }
        else {
          this.httpService.editWarrantyDevice(this.warrantyDevice).subscribe(response => {
            this.httpService.addWarrantyDeviceHistory(this.warrantyDevice).subscribe(response => {
              this.editWarrantyTicket();
            }, error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
            })
          }, error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
          });
        }
      }
    })
  }

  selectItem(item: any) {
    this.selectedItem = item;
  }

  navigate() {
    this.router.navigateByUrl('/warranty/create');
  }

  public ngOnInit() {
    this.username = localStorage.getItem('username')?.toString();
    this.items = [
      { label: 'Chi tiết phiếu bảo hành', icon: 'pi pi-fw pi-info-circle' },
      { label: 'Lịch sử phiếu bảo hành', icon: 'pi pi-fw pi-history' },
      { label: 'Lịch sử thiết bị', icon: 'pi pi-fw pi-mobile' },
      // { label: 'Tạo phiếu bảo hành', icon: 'pi pi-fw pi-pencil' }
      // { label: 'Settings', icon: 'pi pi-fw pi-cog' }
    ];

    this.activeItem = this.items[0];
    this.selectedItem = this.activeItem;

    this.status = [
      {
        label: 'Chờ xác nhận',
      },
      {
        label: 'Đang xử lý',
      },
      {
        label: 'Hoàn thành',
      }
    ];

    this.deviceStatusOptions = [
      'Chờ xác nhận',
      'Đang xử lý',
      'Hoàn thành',
      'Từ chối'
    ];

    this.deviceResultOptions = [
      'Sửa chữa',
      'Thay thế'
    ];

    this.products = [];

    this.httpService.getWarranty().subscribe((data) => {
      this.warrantyList = data;
    })

    this.httpService.getWarranty().subscribe((warranties) => {
      warranties.forEach(warranty => {
        const warrantyGroup = this.formBuilder.group({
          id: [warranty.id],
          description: [warranty.description],
          createDate: [warranty.createDate],
          sale: [warranty.sale],
          technician: [warranty.technician],
          status: [warranty.status],
          deviceId: [warranty.deviceId],
          customerName: [warranty.customerName]
        });
        this.warranties.push(warrantyGroup);
      });
    });

    this.httpService.getUserByRole(9).subscribe((data) => {
      this.sales = data;
    });

    this.httpService.getUserByRole(8).subscribe((data) => {
      this.technicians = data;
    });
  }
  get warranties(): FormArray {
    return this.warrantyEditForm.get('warranties') as FormArray;
  }

  GetInfo(w: any, i: number) {
    this.selectedIndex = i;
    var check = false;

    this.httpService.getWarrantyById(w.value.id).subscribe((data) => {
      this.warrantyById = data;
      this.devices = this.warrantyById.device;
      this.warrantyDate = this.warrantyById.warrantyDate;
      this.warrantyDescription = this.warrantyById.description;

      this.technicians.forEach(technician => {
        if (this.warrantyById.technician === technician.name) {
          this.selectedTechnician = technician;
          check = true;
        }
        if (!check) {
          this.selectedTechnician = null;
        }
      });

      this.sales.forEach(sale => {
        if (this.warrantyById.sale === sale.name) {
          this.selectedSale = sale;
          check = true;
        }
        if (!check) {
          this.selectedSale = null;
        }
      });

      this.activeIndex = this.warrantyById.status === 'Chờ xác nhận' ? 0 :
        this.warrantyById.status === 'Đang xử lý' ? 1 : 2

      if (this.warrantyById.warrantyDate?.toLocaleString() !== '0001-01-01T00:00:00' && 
          this.warrantyById.warrantyDate !== null) {
        this.warrantyDate = new Date(this.warrantyById?.warrantyDate || Date.now());
      }
      else {
        this.warrantyDate = null;
      }
    })

    this.httpService.getWarrantyHistory(w.value.id).subscribe(data => {
      this.warrantyHistoryList = data;
    })

    this.httpService.getWarrantyDeviceHistory(w.value.id).subscribe(data => {
      this.warrantyDeviceHistoryList = data;
    })
  }

  GetDeviceByUser(customer: User) {
    this.deviceOptions = [];
    this.selectedDevices = [];
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

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  setWarrantyDate(date: any) {
    if (date != undefined)
    this.warrantyDate = date;
  else
  this.warrantyDate = null;
  }

  updateDevice(status: string, result: string, deviceId: number, i: number) {
    // this.devices.forEach(device => {
    //   if (device.id === deviceId){
    //     device.status = status;
    //     device.result = result;
    //   }
    // })
  }

  visible: boolean = false;
  showDialog(d: Device, i: number) {
    this.editDevices = [];
    this.visible = true;
    this.editDevices[0] = this.devices[i];
    this.deviceId = d.id;
    this.deviceDescription = d.description;
    this.deviceStatus = d.status;
    this.deviceResult = d.result;
  }
}

export interface Warranty {
  id: number,
  description: string,
  createDate: Date,
  appointmentDate: Date,
  warrantyDate: Date | null,
  status: string,
  sale: string | undefined,
  technician: string | undefined,
  modifier: string | undefined,
  deviceId: number,
  customerName: string
}

export interface EditWarranty {
  id: number,
  description: string,
  appointmentDate: Date,
  warrantyDate: string | null,
  status: string,
  sale: string | undefined,
  technician: string | undefined,
  modifier: string | undefined
}

export interface WarrantyById {
  id: number,
  description: string,
  createDate: Date,
  creator: string,
  appointmentDate: Date,
  warrantyDate: Date, 
  status: string,
  sale: string | undefined,
  technician: string | undefined,
  modifier: string | undefined,
  device: Device[],
  customerName: string
}
export interface WarrantyHistory {
  warrantyId: number,
  description: string,
  warrantyDate: Date | null,
  status: string,
  sale: string | undefined,
  technician: string | undefined,
  modifier: string | undefined,
  modifyDate: Date,
}

export interface WarrantyDevice {
  warrantyId: number,
  deviceId: number,
  status: string,
  result: string,
  modifier: string | undefined,
  description: string
}

export interface WarrantyDeviceHistory {
  warrantyId: number,
  deviceId: number,
  description: string,
  status: string,
  result: string,
  modifier: string | undefined,
  modifyDate: Date,
}