import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterTagListComponent } from './master-tag-list.component';

describe('MasterTagListComponent', () => {
  let component: MasterTagListComponent;
  let fixture: ComponentFixture<MasterTagListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterTagListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasterTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
