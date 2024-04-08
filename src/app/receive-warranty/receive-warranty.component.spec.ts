import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveWarrantyComponent } from './receive-warranty.component';

describe('ReceiveWarrantyComponent', () => {
  let component: ReceiveWarrantyComponent;
  let fixture: ComponentFixture<ReceiveWarrantyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceiveWarrantyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReceiveWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
