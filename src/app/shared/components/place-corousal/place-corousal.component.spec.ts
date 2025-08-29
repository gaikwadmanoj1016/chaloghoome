import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceCorousalComponent } from './place-corousal.component';

describe('PlaceCorousalComponent', () => {
  let component: PlaceCorousalComponent;
  let fixture: ComponentFixture<PlaceCorousalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceCorousalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaceCorousalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
