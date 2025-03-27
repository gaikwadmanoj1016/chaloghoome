import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidImageComponent } from './liquid-image.component';

describe('LiquidImageComponent', () => {
  let component: LiquidImageComponent;
  let fixture: ComponentFixture<LiquidImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiquidImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiquidImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
