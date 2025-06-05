import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoExpandingTextareaComponent } from './auto-expanding-textarea.component';

describe('AutoExpandingTextareaComponent', () => {
  let component: AutoExpandingTextareaComponent;
  let fixture: ComponentFixture<AutoExpandingTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoExpandingTextareaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutoExpandingTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
