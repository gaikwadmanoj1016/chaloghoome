import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCropperModalComponent } from './custom-cropper-modal.component';

describe('CustomCropperModalComponent', () => {
  let component: CustomCropperModalComponent;
  let fixture: ComponentFixture<CustomCropperModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomCropperModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomCropperModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
