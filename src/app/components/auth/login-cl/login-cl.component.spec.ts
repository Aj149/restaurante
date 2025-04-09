import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginClComponent } from './login-cl.component';

describe('LoginClComponent', () => {
  let component: LoginClComponent;
  let fixture: ComponentFixture<LoginClComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginClComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginClComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
