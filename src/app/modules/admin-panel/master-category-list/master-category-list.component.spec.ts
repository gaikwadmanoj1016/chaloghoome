import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterCategoryListComponent } from './master-category-list.component';

describe('MasterCategoryListComponent', () => {
  let component: MasterCategoryListComponent;
  let fixture: ComponentFixture<MasterCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterCategoryListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasterCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
