import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpLugaresComponent } from './pop-up-lugares.component';

describe('PopUpLugaresComponent', () => {
  let component: PopUpLugaresComponent;
  let fixture: ComponentFixture<PopUpLugaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpLugaresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopUpLugaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
