import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceDetailsNewComponent } from './place-details-new.component';

describe('PlaceDetailsNewComponent', () => {
  let component: PlaceDetailsNewComponent;
  let fixture: ComponentFixture<PlaceDetailsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceDetailsNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaceDetailsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
