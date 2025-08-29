import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushNotificationSetupComponent } from './push-notification-setup.component';

describe('PushNotificationSetupComponent', () => {
  let component: PushNotificationSetupComponent;
  let fixture: ComponentFixture<PushNotificationSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PushNotificationSetupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PushNotificationSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
