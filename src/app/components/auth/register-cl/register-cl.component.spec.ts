import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterClComponent } from './register-cl.component';

describe('RegisterClComponent', () => {
  let component: RegisterClComponent;
  let fixture: ComponentFixture<RegisterClComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterClComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterClComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
