import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpServerService } from '../Service/http-server.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss'
})
export class DeviceComponent {

  private device!: Device;
  public deviceList!: Device[]; 

  constructor(private formBuilder: FormBuilder, private httpService: HttpServerService){}

  public deviceForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl('')
  });

  public onSubmit(){
    this.device = {
      id: 0,
      name: this.deviceForm.get('name')?.value,
      description: this.deviceForm.get('description')?.value,
      status: 'On process'
    };

    this.httpService.createDevice(this.device).subscribe(response => {
      alert("Successfully creating");
    }, error => {
      alert("Somthing went wrong!");
      console.error('Error creating warranty', error);
    });
  }

  public ngOnInit(){
    this.httpService.getAllDevice().subscribe(data => {
      this.deviceList = data;
    })
  }
}

export interface Device{
  id: number,
  name: string,
  description: string,
  status: string
}
