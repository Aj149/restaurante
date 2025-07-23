import { Component } from '@angular/core';
import { Personal } from '../../../models/dashboard';
import { FormsModule } from '@angular/forms';
import { PersonalService } from '../../../services/personal.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ver-personal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ver-personal.component.html',
  styleUrl: './ver-personal.component.css'
})
export class VerPersonalComponent {

  personal: Personal = {
    id_persona: 0,
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    cedula: 0,
    nacionalidad: '',
    imagen: '',
    puesto: '',
    fecha_contratacion: '',
    fecha_nacimiento: '',
    salario: 0,
    genero: '',
    jornadaLaboral: '',
    descripcion: ''
  }

  constructor(
    private personalService: PersonalService,
    private router: ActivatedRoute,
    private route: Router,
  ) {}

  ngOnInit(): void {
  const id_persona = this.router.snapshot.params['id_personal'];
  this.personalService.idPersonal(id_persona).subscribe({
    next: (data: Personal) => {
      this.personal = data; // Aquí sin corchetes
    },
    error: (err: Error) => {
      console.error(err);
    }
  });
}

volver() {
  this.route.navigate(['/admin/listaPersonal']);
}

}
