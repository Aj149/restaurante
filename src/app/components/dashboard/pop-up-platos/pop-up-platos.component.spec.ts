import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpPlatosComponent } from './pop-up-platos.component';

describe('PopUpPlatosComponent', () => {
  let component: PopUpPlatosComponent;
  let fixture: ComponentFixture<PopUpPlatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpPlatosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopUpPlatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
