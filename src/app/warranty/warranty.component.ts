import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpServerService } from '../Service/http-server.service';
import { MenuItem, MessageService } from 'primeng/api';
import { User } from '../user/user.component';
import { Device, ReplacementDevice } from '../device/device.component';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-warranty',
  templateUrl: './warranty.component.html',
  styleUrl: './warranty.component.scss'
})
export class WarrantyComponent implements OnInit {

  role: any = localStorage.getItem('role');
  userId: any = localStorage.getItem('userId');

  accept: boolean = false;
  refuse: boolean = false;

  checkBox: boolean[] = [];
  disabled: boolean = false;
  disabledDevice: boolean[] = [];
  check: Boolean = false;
  checkReason: Boolean = false;
  checkReplacement: Boolean = false;
  warrantyIndex = -1;
  stepIndex: number = 0;
  color: any;
  selectedItem: MenuItem | null = null;
  items: MenuItem[] | undefined;
  status: MenuItem[] | undefined;

  warrantyPage: number = 0;
  warrantyHistoryPage: number = 0;
  warrantyDeviceHistoryPage: number = 0;
  totalWarranty!: number;
  totalWarrantyHistory: number = 0;
  totalWarrantyDeviceHistory: number = 0;

  deviceStatusOptions!: string[];
  deviceResultOptions!: string[];
  products: MenuItem[] | any;
  activeItem: MenuItem | undefined;

  editWarranty!: EditWarranty;
  warrantyById!: WarrantyById;
  warrantyStatus: string = '';

  warrantyHistoryList: WarrantyHistory[] = [];
  warrantyHistory!: WarrantyHistory;
  warrantyDeviceHistoryList: WarrantyDeviceHistory[] = [];
  warrantyDeviceHistory!: WarrantyDeviceHistory;
  warrantyDevice!: WarrantyDevice;

  username: string | undefined;

  devices: Device[] = [];
  replacementDevices: Device[] = [];
  replacementDevice!: ReplacementDevice;
  editDevices: Device[] = [];
  editedDevice!: Device;

  categoryId!: number;

  deviceDescription!: string;
  deviceStatus!: string;
  deviceResult!: string;
  reason!: string;

  warrantyDescription!: string;

  sales: User[] = [];
  technicians: User[] = [];
  deviceOptions: Device[] = [];

  appointmentDate!: Date | null;
  deviceId!: number;

  selectedSale!: string | null;
  selectedTechnician!: string | null;
  selectedDevices!: Device[] | null;

  constructor(private formBuilder: FormBuilder, private httpService: HttpServerService,
    private messageService: MessageService, private router: Router,
    private cdr: ChangeDetectorRef, private primengConfig: PrimeNGConfig) {
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

  editWarrantyTicket() {
    if (this.role == 'Technician') {
      this.selectedTechnician = this.userId;
    }
    else if (this.role == 'Receiver') {
      this.selectedSale = this.userId;
    }
    this.editWarranty = {
      id: this.warrantyById.id,
      description: this.warrantyDescription,
      appointmentDate: this.appointmentDate,
      warrantyDate: null,
      status: this.warrantyStatus,
      sale: this.selectedSale,
      technician: this.selectedTechnician,
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
        status = 'Người dùng xác nhận';
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
        status = 'Người dùng xác nhận';
      else
        status = 'Đang xử lý';
    }

    this.editWarranty.status = status;

    this.warrantyById.warrantyDate = new Date(this.warrantyById.warrantyDate);
    if (this.editWarranty.warrantyDate == undefined)
      this.editWarranty.warrantyDate = new Date('1/1/1970');

    if (this.warrantyById.description === this.editWarranty.description &&
      this.warrantyById.sale === this.editWarranty.sale &&
      this.warrantyById.technician === this.editWarranty.technician &&
      this.warrantyById.status === this.editWarranty.status &&
      (this.editWarranty.warrantyDate?.toLocaleDateString() === '1/1/1970' ||
        this.warrantyById.warrantyDate.toISOString() === this.editWarranty.warrantyDate?.toISOString())) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Không có gì thay đổi' });
    }
    else {
      if (this.editWarranty.warrantyDate.toLocaleDateString() == '1/1/1970' || this.editWarranty.warrantyDate == undefined) {
        this.editWarranty.warrantyDate = null;
      }
      this.httpService.editWarranty(this.editWarranty).subscribe(response => {
        this.httpService.addWarrantyHistory(this.editWarranty).subscribe(warrantyHistory => {
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sửa phiếu bảo hành thành công' });
          this.GetInfo(this.editWarranty, this.warrantyIndex);
        }, error => {
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
      modifier: localStorage.getItem("username")?.toString(),
      replacementDevice: null,
      reason: this.reason
    };

    this.devices.forEach((device, index) => {
      if (device.id === this.deviceId) {
        if (device.description === this.warrantyDevice.description &&
          device.status === this.warrantyDevice.status &&
          device.result === this.warrantyDevice.result &&
          this.devices === this.warrantyById.device) {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Không có gì thay đổi' });
        }
        else {
          if ((this.warrantyDevice.status == 'Hoàn thành' || this.warrantyDevice.status == 'Từ chối') &&
            this.warrantyDevice.deviceId == device.id) {
            this.disabledDevice[index] = true;
          }
          // if (this.warrantyDevice.status == 'Hoàn thành' && this.warrantyDevice.deviceId == device.id)
          //   this.warrantyDevice.result = 'Đã ' + this.warrantyDevice.result;

          if (this.warrantyDevice.status == 'Đang xử lý' && this.warrantyDevice.result == 'Sửa chữa') {
            this.httpService.editDeviceStatus("Đang bảo hành", this.warrantyDevice.deviceId).subscribe(response => {

            }, error => { });
          }
          else if ((this.warrantyDevice.status == 'Hoàn thành' || this.warrantyDevice.status == 'Từ chối') &&
            this.warrantyDevice.result == 'Sửa chữa') {
            this.httpService.editDeviceStatus("Đang sử dụng", this.warrantyDevice.deviceId).subscribe(response => {

            }, error => { });
          }

          if (this.warrantyDevice.status == 'Hoàn thành') {
            this.warrantyDevice.reason = null;
          }

          if (this.warrantyDevice.status == 'Từ chối') {
            this.warrantyDevice.result = null;
          }

          if (this.refuse) {
            this.warrantyDevice.status = 'Đang xử lý';
          }

          this.httpService.editWarrantyDevice(this.warrantyDevice).subscribe(response => {
            this.httpService.addWarrantyDeviceHistory(this.warrantyDevice).subscribe(response => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sửa thành công' });
              if (this.warrantyDevice.deviceId == device.id && this.warrantyDevice.status != device.status)
                this.editWarrantyTicket();
              // this.editWarrantyTicket();
              this.editDeviceVisibility = false;
              this.GetInfo(this.warrantyDevice, this.warrantyIndex);
            }, error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Đã có lỗi xảy ra!' });
            })
          }, error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Đã có lỗi xảy ra!' });
          });
        }
      }
    })
  }

  acceptWarranty(status: string) {
    this.editWarranty = {
      id: this.warrantyById.id,
      description: this.warrantyDescription,
      appointmentDate: this.appointmentDate,
      warrantyDate: null,
      status: status,
      sale: this.selectedSale,
      technician: this.selectedTechnician,
      modifier: localStorage.getItem("username")?.toString(),
    };

    this.httpService.editWarranty(this.editWarranty).subscribe(response => {
      this.httpService.addWarrantyHistory(this.editWarranty).subscribe(warrantyHistory => {
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sửa phiếu bảo hành thành công' });
        this.GetInfo(this.editWarranty, this.warrantyIndex);
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
      })
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
    });

    if (status == 'Đang xử lý') {
      this.httpService.getWarrantyById(this.warrantyById.id).subscribe((data) => {
        this.devices = this.warrantyById.device;
        this.devices.forEach(device => {

          this.warrantyDevice = {
            warrantyId: this.warrantyById.id,
            deviceId: device.id,
            description: device.description,
            status: 'Đang xử lý',
            result: null,
            modifier: localStorage.getItem("username")?.toString(),
            replacementDevice: null,
            reason: this.reason
          };

          this.httpService.editWarrantyDevice(this.warrantyDevice).subscribe(response => {
            this.httpService.addWarrantyDeviceHistory(this.warrantyDevice).subscribe(response => {
              this.editDeviceVisibility = false;
              this.GetInfo(this.warrantyDevice, this.warrantyIndex);
            }, error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Đã có lỗi xảy ra!' });
            })
          }, error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Đã có lỗi xảy ra!' });
          });
        })
      })
    }
    if (status == 'Hoàn thành') {
      this.devices.forEach(device => {
        if (device.status == 'Hoàn thành' && device.result == 'Thay thế'){
          this.categoryId = device.categoryId;
          this.deviceId = device.id;
          this.deviceDescription = device.description;
          this.deviceStatus = device.status;
          this.deviceResult = device.result;
          this.reason = device.reason;
          this.AddReplacementDevice();
        }
      })
      // console.log(this.devices)
    }
  }

  selectItem(item: any) {
    this.selectedItem = item;

    this.httpService.getWarrantyHistory(this.warrantyById.id, 0, 5).subscribe(data => {
      this.warrantyHistoryList = data;
    });

    this.httpService.getWarrantyDeviceHistory(this.warrantyById.id, 0, 5).subscribe(data => {
      this.warrantyDeviceHistoryList = data;
    });
  }

  navigate() {
    if (this.role == 'Admin') {
      this.router.navigateByUrl('/warranty/create');
    }
    else {
      this.router.navigateByUrl('/warranty/receive');
    }
  }

  public ngOnInit() {
    this.primengConfig.ripple = true;
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
        label: 'Người dùng xác nhận',
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
    this.warrantyPage = 1;

    this.httpService.getTotalWarrantyByUser(this.userId).subscribe((data) => {
      this.totalWarranty = data;
    })

    this.httpService.getWarrantyPagination(this.userId, 0, 5).subscribe((warranties) => {
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
    // this.httpService.getWarrantyByUser(this.userId, 0, 5).subscribe((warranties) => {
    //   warranties.forEach(warranty => {
    //     const warrantyGroup = this.formBuilder.group({
    //       id: [warranty.id],
    //       createDate: [warranty.createDate],
    //       status: [warranty.status],
    //       customerName: [warranty.customerName]
    //     });
    //     this.warranties.push(warrantyGroup);
    //   });
    // });
    // this.httpService.getUserByRole(9).subscribe((data) => {
    //   this.sales = data;
    // });

    // this.httpService.getUserByRole(8).subscribe((data) => {
    //   this.technicians = data;
    // });
  }
  get warranties(): FormArray {
    return this.warrantyEditForm.get('warranties') as FormArray;
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
      this.appointmentDate = this.warrantyById.appointmentDate;
      this.warrantyDescription = this.warrantyById.description;

      this.selectedSale = this.warrantyById.saleId;
      this.selectedTechnician = this.warrantyById.technicianId;

      this.devices.forEach((device, index) => {
        if ((device.status === 'Hoàn thành' || device.status === 'Từ chối') &&
          (this.warrantyById.status !== 'Chờ xác nhận' && this.warrantyById.status !== 'Đang xử lý') &&
          this.role == 'Technician')
          this.disabledDevice[index] = true;
        else
          this.disabledDevice[index] = false;

        if (this.role == 'Admin') {
          this.disabledDevice[index] = false;
        }

        if (device.reason)
          this.checkReason = true;

        if (device.replacementDevice)
          this.checkReplacement = true;
      })

      if (this.warrantyById.status == 'Hoàn thành' || this.role == 'Customer') {
        this.disabled = true;
        this.disabledDevice = this.disabledDevice.map(() => true);
      }

      this.stepIndex = this.warrantyById.status === 'Chờ xác nhận' ? 0 :
        this.warrantyById.status === 'Đang xử lý' ? 1 :
          this.warrantyById.status === 'Người dùng xác nhận' ? 2 : 3

      if (this.warrantyById.appointmentDate?.toLocaleString() !== '0001-01-01T00:00:00' &&
        this.warrantyById.appointmentDate !== null) {
        this.appointmentDate = new Date(this.warrantyById?.appointmentDate || Date.now());
      }
      else {
        this.appointmentDate = null;
      }
    })

    // this.httpService.getU

    this.httpService.getWarrantyHistory(warranty.id, 0, 5).subscribe(data => {
      this.warrantyHistoryList = data;
    });

    this.httpService.getWarrantyDeviceHistory(warranty.id, 0, 5).subscribe(data => {
      this.warrantyDeviceHistoryList = data;
    });

    this.httpService.getTotalWarrantyHistory(warranty.id).subscribe((data) => {
      this.totalWarrantyHistory = data;
    })

    this.httpService.getTotalWarrantyDeviceHistory(warranty.id).subscribe((data) => {
      this.totalWarrantyDeviceHistory = data;
    })
  }

  onActiveIndexChange(event: number) {
    this.stepIndex = event;
  }

  setAppoinmentDate(date: any) {
    if (date != undefined)
      this.appointmentDate = date;
    else
      this.appointmentDate = null;
  }

  editDeviceVisibility: boolean = false;
  editDeviceDialog(d: Device, i: number) {
    this.editDevices = [];
    this.editDeviceVisibility = true;
    this.editDevices[0] = this.devices[i];
    this.deviceId = d.id;
    this.deviceDescription = d.description;
    this.deviceStatus = d.status;
    this.deviceResult = d.result;

    this.httpService.getReplacementDevices(d.categoryId).subscribe(data => {
      this.replacementDevices = data;
    })
  }

  replaceDeviceVisibility: boolean = false;

  WarrantyPageChange(pageNumber: any) {
    this.warranties.clear();
    this.httpService.getWarrantyPagination(this.userId, pageNumber.page, pageNumber.rows).subscribe((warranties) => {
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

  WarrantyHistoryPageChange(pageNumber: any) {
    this.httpService.getWarrantyHistory(this.warrantyById.id, pageNumber.page, pageNumber.rows).subscribe(data => {
      this.warrantyHistoryList = data;
    });
  }

  WarrantyDeviceHistoryPageChange(pageNumber: any) {
    this.httpService.getWarrantyDeviceHistory(this.warrantyById.id, pageNumber.page, pageNumber.rows).subscribe(data => {
      this.warrantyDeviceHistoryList = data;
    });
  }

  AddReplacementDevice() {
    this.httpService.getReplacementDevices(this.categoryId).subscribe(data => {
      this.replacementDevices = data;
    })
    if (this.replacementDevices.length > 0) {
      
      this.replacementDevice =
      {
        id: this.deviceId,
        replacementDevice: this.replacementDevices[0].id,
        userId: this.warrantyById.customerId,
        modifier: localStorage.getItem("username")?.toString()
      };

      this.warrantyDevice = {
        warrantyId: this.warrantyById.id,
        deviceId: this.deviceId,
        description: this.deviceDescription,
        status: this.deviceStatus,
        result: this.deviceResult,
        modifier: localStorage.getItem("username")?.toString(),
        replacementDevice: this.replacementDevices[0].id,
        reason: this.reason
      };

      this.httpService.addReplacementDevice(this.replacementDevice).subscribe(data => {
        this.httpService.addWarrantyReplacementDevice(this.replacementDevice,
          this.warrantyById.id, this.deviceId).subscribe(response => {
            this.httpService.addWarrantyDeviceHistory(this.warrantyDevice).subscribe(response => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Thay thế thiết bị thành công!' });
              this.editDeviceVisibility = false;
              this.GetInfo(this.warrantyDevice, this.warrantyIndex);
            }, error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
            })
          }, error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
          })
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Đã có lỗi xảy ra!' });
      })
    }
    else {
      this.messageService.add({ severity: 'info', summary: 'Infor', detail: 'Không còn hàng để thay thế!' });
    }
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
  customerName: string
}

export interface EditWarranty {
  id: number,
  description: string,
  appointmentDate: Date | null,
  warrantyDate: Date | null,
  status: string,
  sale: string | null,
  technician: string | null,
  modifier: string | undefined,
}

export interface WarrantyById {
  id: number,
  description: string,
  createDate: Date,
  creator: string,
  appointmentDate: Date,
  warrantyDate: Date,
  status: string,
  sale: string | null,
  technician: string | null,
  saleId: string | null,
  technicianId: string | null,
  modifier: string | undefined,
  device: Device[],
  customerName: string,
  customerId: string
}

export interface WarrantyHistory {
  warrantyId: number,
  description: string,
  appointmentDate: Date | null,
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
  result: string | null,
  modifier: string | undefined,
  description: string,
  replacementDevice: number | null,
  reason: string | null
}

export interface WarrantyDeviceHistory {
  warrantyId: number,
  deviceId: number,
  description: string,
  status: string,
  result: string,
  modifier: string | undefined,
  modifyDate: Date,
  replacementDevcie: number,
  replacementDeviceName: string
}