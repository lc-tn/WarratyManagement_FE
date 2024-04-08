import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpServerService } from '../Service/http-server.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss'
})
export class DeviceComponent {

  deviceList!: Device[]; 
  availableDeviceQuantities: number[] = [];
  soldDeviceQuantity: number[] = [];
  categories!: Category[]; 

  devicePopup: Device[] = [];

  visible: boolean = false;

  constructor(private formBuilder: FormBuilder, private httpService: HttpServerService){}

  public deviceForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl('')
  });

  public onSubmit(){
    // this.device = {
    //   id: 0,
    //   name: this.deviceForm.get('name')?.value,
    //   description: this.deviceForm.get('description')?.value,
    //   status: 'On process',
    //   result: '',
    //   userId: '',
    //   userName: '',
    //   categoryId: 0,
    //   replacementDevice: 0
    // };

    // this.httpService.createDevice(this.device).subscribe(response => {
    //   alert("Successfully creating");
    // }, error => {
    //   alert("Somthing went wrong!");
    //   console.error('Error creating warranty', error);
    // });
  }

  public ngOnInit(){
    this.httpService.getAllCategory().subscribe(data => {
      this.categories = data;  
      this.httpService.getAllDevice().subscribe(data => {
        this.deviceList = data;
        this.categories.forEach(category => {
          var availableQuantity = 0;
          var soldQuantity = 0;
          this.deviceList.forEach(device => {
            if(device.categoryId == category.id){
              if(device.userName != null)
                soldQuantity += 1;
              else
                availableQuantity += 1;
            }
          })
          this.availableDeviceQuantities.push(availableQuantity);
          this.soldDeviceQuantity.push(soldQuantity);
        })
      })
    }) 
  }

  showDialog(categoryId: number, status: string){
    this.devicePopup = [];
    this.visible = true;
    if (status == 'Available'){
      this.deviceList.forEach(device => {
        if(device.categoryId == categoryId && device.userName == null){
          this.devicePopup.push(device);
        }
      })
    }
    else{
      this.deviceList.forEach(device => {
        if(device.categoryId == categoryId && device.userName != null){
          this.devicePopup.push(device);
        }
      })
    }
  }
}

export interface Device{
  id: number,
  name: string,
  description: string,
  status: string,
  result: string,
  userId: string,
  userName: string,
  categoryId: number,
  replacementDevice: number,
  reason: string,
  activationDate: Date,
  warrantyPeriod: Date
}

export interface DeviceStatus{
  name: string
}

export interface DeviceWarranty{
  id: number,
  description: string
}

export interface ReplacementDevice{
  id: number,
  replacementDevice: number,
  userId: string,
  modifier: string | undefined
}

export interface Category{
  id: number,
  name: string
}