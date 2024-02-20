import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpServerService } from '../Service/http-server.service';
import { MenuItem, MessageService } from 'primeng/api';
import { User } from '../user/user.component';
import { Device } from '../device/device.component';

@Component({
  selector: 'app-warranty',
  templateUrl: './warranty.component.html',
  styleUrl: './warranty.component.scss'
})
export class WarrantyComponent {

  selectedIndex = -1;
  color: any;
  public selectedItem: MenuItem | null = null;
  items: MenuItem[] | undefined;
  status: MenuItem[] | undefined;
  products: MenuItem[] | any;
  activeItem: MenuItem | undefined;
  public warranty!: Warranty;
  public warrantyList: Warranty[] = [];
  public username: string | undefined;
  date: Date = new Date();
  apointment: Date | undefined;
  device: Device[] = [];
  return: string | undefined;
  sales: User[] = [];
  technicians: User[] = [];
  selectedUser!: User;
  selectedTechnician!: User;

  constructor(private formBuilder: FormBuilder, private httpService: HttpServerService,
    private messageService: MessageService) {
    this.warrantyEditForm = this.formBuilder.group({
      warranties: this.formBuilder.array([])
    });
  }

  public warrantyEditForm: FormGroup = new FormGroup({
    deviceName: new FormControl(''),
    date: new FormControl(''),
    description: new FormControl(''),
  });

  public warrantyCreateForm: FormGroup = new FormGroup({
    // deviceName: new FormControl(''),
    date: new FormControl(''),
    description: new FormControl(''),
    appointmentDate: new FormControl(''),
    customerName: new FormControl('', Validators.required),
    deviceId: new FormControl('')
  });

  public createWarranty() {
    this.warranty = {
      id: 0,
      description: this.warrantyCreateForm.get('description')?.value,
      createDate: new Date(),
      appointmentDate: this.warrantyCreateForm.get('appointmentDate')?.value,
      status: 'Chờ xác nhận',
      deviceId: this.warrantyCreateForm.get('deviceId')?.value,
      customerName: this.warrantyCreateForm.get('customerName')?.value
    };

    this.httpService.createWarranty(this.warranty).subscribe(response => {
      console.log(response);
      this.return = response.body?.toString();
      // if(response.ok){
      this.messageService.add({ severity: 'success', summary: 'Success', detail: response.body?.toString() });
      // }
    }, error => {
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: response.body?.toString() });
    });
    console.log()
  }

  public editWarranty(i: number) {
    const warrantyGroup = this.warranties.at(i) as FormGroup;
    this.warranty = warrantyGroup.value;

    this.httpService.editWarranty(this.warranty).subscribe(response => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Create successfully' });
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
    });
  }

  selectItem(item: any) {
    this.selectedItem = item;
  }

  public ngOnInit() {
    this.username = localStorage.getItem('username')?.toString();
    this.items = [
      { label: 'Chi tiết phiếu bảo hành', icon: 'pi pi-fw pi-info-circle' },
      { label: 'Tạo phiếu bảo hành', icon: 'pi pi-fw pi-pencil' }
      // { label: 'Documentation', icon: 'pi pi-fw pi-file' },
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
        label: 'Tạm ngưng',
      },
      {
        label: 'Hoàn tất',
      }
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
          status: [warranty.status],
          deviceId: [warranty.deviceId],
          customerName: [warranty.customerName]
        });
        this.warranties.push(warrantyGroup);
      });
    });

    this.warrantyCreateForm?.get('deviceId')?.valueChanges.subscribe(deviceId => {
      this.GetDevice(deviceId);
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

    this.httpService.getWarrantyById(w.value.id).subscribe((data) => {
      this.warranty = data;
    })

    this.httpService.getDeviceById(w.value.deviceId).subscribe((data) => {
      this.device = [data];
    })
  }

  GetDevice(id: any) {
    if (id) {
      this.httpService.getDeviceById(id).subscribe((data) => {
        this.device = [data];
      })
    }
  }
}

export interface Warranty {
  id: number,
  description: string,
  createDate: Date,
  appointmentDate: Date,
  status: string,
  deviceId: string,
  customerName: string
}