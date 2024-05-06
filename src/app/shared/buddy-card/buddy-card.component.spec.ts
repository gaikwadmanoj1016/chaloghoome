import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuddyCardComponent } from './buddy-card.component';

describe('BuddyCardComponent', () => {
  let component: BuddyCardComponent;
  let fixture: ComponentFixture<BuddyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuddyCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuddyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
