import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpServerService } from '../Service/http-server.service';

@Component({
  selector: 'app-warranty',
  templateUrl: './warranty.component.html',
  styleUrl: './warranty.component.scss'
})
export class WarrantyComponent {
  public warranty!: Warranty;
  public warrantyList: Warranty[] = [];

  constructor(private formBuilder: FormBuilder, private httpService: HttpServerService) {
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
    deviceName: new FormControl(''),
    date: new FormControl(''),
    description: new FormControl(''),
  });

  public createWarranty(){
    this.warranty = {
      id: 0,
      description: this.warrantyCreateForm.get('description')?.value,
      createDate: new Date(),
      status: 'On process',
      deviceName: this.warrantyCreateForm.get('deviceName')?.value,
      customerName: 'cus1'
    };

    this.httpService.createWarranty(this.warranty).subscribe(response => {
      console.log('Warranty created successfully', response);
    }, error => {
      console.error('Error creating warranty', error);
    });

    console.log(this.warranty);
  }

  public editWarranty(i: number){
    const warrantyGroup = this.warranties.at(i) as FormGroup;
    this.warranty = warrantyGroup.value;

    this.httpService.editWarranty(this.warranty).subscribe(response => {
      console.log('Edit user successfully', response);
    }, error => {
      console.error('Error editing user', error);
    });
  }

  public ngOnInit(){
    this.httpService.getWarranty().subscribe((data) =>{
      this.warrantyList = data;
      console.log('data', data);
    })

    this.httpService.getWarranty().subscribe((warranties) => {
      warranties.forEach(warranty => {
        const warrantyGroup = this.formBuilder.group({
          id: [warranty.id],
          description: [warranty.description],
          createDate: [warranty.createDate],
          status: [warranty.status],
          deviceName: [warranty.deviceName],
          customerName: [warranty.customerName]
        });
        this.warranties.push(warrantyGroup);
      });
    });
  }
  get warranties(): FormArray {
    return this.warrantyEditForm.get('warranties') as FormArray;
  }
}

export interface Warranty {
  id: number,
  description: string,
  createDate: Date,
  status: string,
  deviceName: string,
  customerName: string
}