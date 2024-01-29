import { Injectable } from '@angular/core';
import { Router } from 'express';

@Injectable({
  providedIn: 'root'
})
export class TransferServiceService {

  constructor(
  ) { }

  private data: any;

  setData(data: any){
    this.data = data;
  }

  getData(){
    let temp = this.data;
    this.clearData();
    return temp;
  }

  clearData(){
    this.data = undefined;
  }
}
