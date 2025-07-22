import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Personal } from '../../../../models/dashboard';
import { PersonalService } from '../../../../services/personal.service';

@Component({
  selector: 'app-personal1',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './personal1.component.html',
  styleUrl: './personal1.component.css'
})
export class Personal1Component {

  personal : Personal[] = [];
  personalEspecial: Personal[] = [];

  constructor(
    private personalService: PersonalService
  ) { }

  ngOnInit():void {
    if (this.personal) {
      this.traerPersonal(); 
       }
  }
  traerPersonal(): void {
    this. personalService.obtenerPersonal().subscribe(
      (data) => {
        this.personal = data;
        this.personalEspecial = this.personal.slice(0, 3);
      },
      (Error)
    )
  }
}
