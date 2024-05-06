import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightHandSidebarComponent } from './right-hand-sidebar.component';

describe('RightHandSidebarComponent', () => {
  let component: RightHandSidebarComponent;
  let fixture: ComponentFixture<RightHandSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightHandSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RightHandSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
