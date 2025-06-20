import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceByCategoryComponent } from './place-by-category.component';

describe('PlaceByCategoryComponent', () => {
  let component: PlaceByCategoryComponent;
  let fixture: ComponentFixture<PlaceByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceByCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaceByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
