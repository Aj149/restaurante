import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Personal3Component } from './personal3.component';

describe('Personal3Component', () => {
  let component: Personal3Component;
  let fixture: ComponentFixture<Personal3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Personal3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Personal3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
