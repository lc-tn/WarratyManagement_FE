import { Component, OnInit } from '@angular/core';
import { HttpServerService } from '../Service/http-server.service';
import { MessageService } from 'primeng/api';
import { Warranty } from '../warranty/warranty.component';
import * as XLSX from 'xlsx';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
  pieData: any;
  pieOptions: any;
  stackedData: any;
  stackedOptions: any;

  fromDate!: Date;
  toDate!: Date;
  time: string[] = [];

  total: number = 0;

  fileName = 'Warranty.xlsx';

  filterWarranties: Warranty[] = [];
  statusWarranties: Warranty[] = [];
  warranties: Warranty[] = [];
  waiting: Warranty[] = [];
  processing: Warranty[] = [];
  complete: Warranty[] = [];

  waitingCount: number[] = [];
  processingCount: number[] = [];
  completeCount: number[] = [];

  statuses: string[] = ['Tất cả', 'Chờ xác nhận', 'Đang xử lý', 'Hoàn thành'];
  selectedStatus!: string;

  role: any = localStorage.getItem('role');
  userId: any = localStorage.getItem('userId');

  constructor(private httpService: HttpServerService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig) {
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    if (this.role == 'Admin') {
      this.httpService.getWarranties().subscribe(data => {
        this.warranties = data;
        this.filterWarranties = data;
        this.statusWarranties = data;
        this.changeFilterDate();
      });
    }
    if (this.role == 'Customer'){
      this.httpService.getWarrantyByUser(this.userId).subscribe(data => {
        this.warranties = data;
        this.filterWarranties = data;
        this.statusWarranties = data;
        this.changeFilterDate();
      });
    }
  }

  changeStatus(status: any) {
    this.statusWarranties = this.filterWarranties;
    if (status.value !== null && status.value != 'Tất cả') {
      this.statusWarranties.forEach(warranty => {
        // if (warranty.createDate <= this.toDate && warranty.createDate >= this.fromDate)
        if (warranty.status != status.value) {
          this.statusWarranties = this.statusWarranties.filter(warranty => warranty.status == status.value);
        }
      })
    }
  }

  changeFilterDate() {
    if (this.fromDate == undefined) {
      this.fromDate = new Date();
      this.warranties.forEach(warranty => {
        if (new Date(this.fromDate) >= new Date(warranty.createDate)) {
          this.fromDate = warranty.createDate
        }
      })
    }

    if (this.toDate == undefined) {
      this.toDate = new Date();
    }
    if (this.fromDate != undefined || this.toDate != undefined) {
      this.filterWarranties = [];
      this.warranties.forEach(warranty => {
        if (this.fromDate == undefined && this.toDate != undefined) {
          if (new Date(warranty.createDate) <= new Date(this.toDate)) {
            this.filterWarranties.push(warranty)
          }
        }
        else if (this.toDate == undefined && this.fromDate != undefined) {
          if (new Date(warranty.createDate) >= new Date(this.fromDate)) {
            this.filterWarranties.push(warranty)
          }
        }
        else {
          if (new Date(warranty.createDate) >= new Date(this.fromDate) &&
            new Date(warranty.createDate) <= new Date(this.toDate)) {
            this.filterWarranties.push(warranty)
          }
        }
      })
    }
    else {
      this.filterWarranties = this.warranties;
    }

    this.statusWarranties = this.filterWarranties;
    this.selectedStatus = 'Tất cả'

    this.waiting = [];
    this.processing = [];
    this.complete = [];
    this.waitingCount = [];
    this.processingCount = [];
    this.completeCount = []
    this.filterWarranties.forEach(warranty => {
      if (warranty.status === 'Chờ xác nhận') {
        this.waiting.push(warranty);
      }
      else if (warranty.status === 'Đang xử lý') {
        this.processing.push(warranty);
      }
      else {
        this.complete.push(warranty);
      }
    })
    this.pieChart();

    this.time = []
    var currentDate = new Date(this.fromDate);
    currentDate.setDate(1);
    while (currentDate <= this.toDate) {
      var waiting = 0;
      var processing = 0;
      var complete = 0;
      this.filterWarranties.forEach(warranty => {
        if (new Date(warranty.createDate).getMonth() + 1 == currentDate.getMonth() + 1 &&
          new Date(warranty.createDate).getFullYear() == currentDate.getFullYear()) {
          if (warranty.status === 'Chờ xác nhận') {
            waiting += 1;
          }
          else if (warranty.status === 'Đang xử lý') {
            processing += 1;
          }
          else {
            complete += 1;
          }
        }
      })
      this.waitingCount.push(waiting);
      this.processingCount.push(processing);
      this.completeCount.push(complete);
      this.time.push(`T${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    this.stackedChart();
  }

  stackedChartYear() {
    this.waitingCount = [];
    this.processingCount = [];
    this.completeCount = []
    if (this.fromDate == undefined) {
      this.fromDate = new Date();
      this.warranties.forEach(warranty => {
        if (new Date(this.fromDate) >= new Date(warranty.createDate)) {
          this.fromDate = warranty.createDate
        }
      })
    }

    if (this.toDate == undefined) {
      this.toDate = new Date();
    }
    this.time = []
    var currentDate = new Date(this.fromDate);
    currentDate.setDate(1);
    while (currentDate.getFullYear() <= this.toDate.getFullYear()) {
      var waiting = 0;
      var processing = 0;
      var complete = 0;
      this.filterWarranties.forEach(warranty => {
        if (new Date(warranty.createDate).getFullYear() == currentDate.getFullYear()) {
          if (warranty.status === 'Chờ xác nhận') {
            waiting += 1;
          }
          else if (warranty.status === 'Đang xử lý') {
            processing += 1;
          }
          else {
            complete += 1;
          }
        }
      })
      this.waitingCount.push(waiting);
      this.processingCount.push(processing);
      this.completeCount.push(complete);
      this.time.push(`${currentDate.getFullYear()}`);
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }
    this.stackedChart();
  }

  stackedChartQuarter() {
    this.waitingCount = [];
    this.processingCount = [];
    this.completeCount = []
    if (this.fromDate == undefined) {
      this.fromDate = new Date();
      this.warranties.forEach(warranty => {
        if (new Date(this.fromDate) >= new Date(warranty.createDate)) {
          this.fromDate = warranty.createDate
        }
      })
    }

    if (this.toDate == undefined) {
      this.toDate = new Date();
    }
    this.time = []
    var quarter = 0;
    var currentDate = new Date(this.fromDate);
    var tempDate = new Date(this.toDate);
    if (currentDate.getMonth() < 4) {
      currentDate.setMonth(2);
      quarter = 1;
    }
    else if (currentDate.getMonth() < 7) {
      currentDate.setMonth(5);
      quarter = 2;
    }
    else if (currentDate.getMonth() < 10) {
      currentDate.setMonth(8);
      quarter = 3;
    }
    else {
      currentDate.setMonth(11);
      quarter = 4;
    }
    currentDate.setDate(1);

    if (tempDate.getMonth() < 4) {
      tempDate.setMonth(3);
    }
    else if (tempDate.getMonth() < 7) {
      tempDate.setMonth(6);
    }
    else if (tempDate.getMonth() < 10) {
      tempDate.setMonth(9);
    }
    else {
      tempDate.setMonth(12);
    }
    while (currentDate <= tempDate) {
      var waiting = 0;
      var processing = 0;
      var complete = 0;
      this.filterWarranties.forEach(warranty => {
        if ((currentDate.getMonth() + 1) - new Date(warranty.createDate).getMonth() <= 3 &&
          new Date(warranty.createDate).getFullYear() == currentDate.getFullYear()) {
          if (warranty.status === 'Chờ xác nhận') {
            waiting += 1;
          }
          else if (warranty.status === 'Đang xử lý') {
            processing += 1;
          }
          else {
            complete += 1;
          }
        }
      })
      this.waitingCount.push(waiting);
      this.processingCount.push(processing);
      this.completeCount.push(complete);

      this.time.push(`Q${quarter}/${currentDate.getFullYear()}`);
      quarter += 1;
      if (quarter > 4) {
        quarter = 1;
      }
      currentDate.setMonth(currentDate.getMonth() + 3);
    }
    this.stackedChart();
  }

  first: number = 0;

  rows: number = 10;

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  exportExcel() {
    let element = document.getElementById('warranty-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }

  pieChart() {
    this.total = this.waiting.length + this.processing.length + this.complete.length;
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    if (this.waiting && this.processing && this.complete) {
      this.pieData = {
        labels: [`Chờ xác nhận: ${this.waiting.length} (${(this.waiting.length / this.total) * 100}%)`,
        `Đang xử lý: ${this.processing.length} (${(this.processing.length / this.total) * 100}%)`,
        `Hoàn thành: ${this.complete.length} (${(this.complete.length / this.total) * 100}%)`],
        datasets: [
          {
            data: [this.waiting.length, this.processing.length, this.complete.length],
            backgroundColor: [
              documentStyle.getPropertyValue('--yellow-500'),
              documentStyle.getPropertyValue('--blue-500'),
              documentStyle.getPropertyValue('--green-500')
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--yellow-400'),
              documentStyle.getPropertyValue('--blue-400'),
              documentStyle.getPropertyValue('--green-400')
            ]
          }
        ]
      };
    }
    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }

  stackedChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.stackedData = {
      labels: this.time,
      datasets: [
        {
          type: 'bar',
          label: 'Chờ xác nhận',
          backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
          data: this.waitingCount
        },
        {
          type: 'bar',
          label: 'Đang xử lý',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          data: this.processingCount
        },
        {
          type: 'bar',
          label: 'Hoàn thành',
          backgroundColor: documentStyle.getPropertyValue('--green-500'),
          data: this.completeCount
        }
      ]
    };

    this.stackedOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false
        },
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
}