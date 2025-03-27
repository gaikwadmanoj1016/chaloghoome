import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RippleImageComponent } from './ripple-image.component';

describe('RippleImageComponent', () => {
  let component: RippleImageComponent;
  let fixture: ComponentFixture<RippleImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RippleImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RippleImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
