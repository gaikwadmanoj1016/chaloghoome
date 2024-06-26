import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuddiesComponent } from './buddies.component';

describe('BuddiesComponent', () => {
  let component: BuddiesComponent;
  let fixture: ComponentFixture<BuddiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuddiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuddiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
