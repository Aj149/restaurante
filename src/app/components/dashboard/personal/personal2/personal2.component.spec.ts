import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Personal2Component } from './personal2.component';

describe('Personal2Component', () => {
  let component: Personal2Component;
  let fixture: ComponentFixture<Personal2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Personal2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Personal2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
