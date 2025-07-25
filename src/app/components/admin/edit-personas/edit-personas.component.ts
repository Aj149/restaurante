import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { PersonalService } from '../../../services/personal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormsModule } from '@angular/forms';
import { Personal } from '../../../models/dashboard';
import { data } from 'jquery';

@Component({
  selector: 'app-edit-personas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-personas.component.html',
  styleUrl: './edit-personas.component.css'
})
export class EditPersonasComponent {


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
};
  constructor(
    private personalService: PersonalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

ngOnInit() {
  const id_persona = this.activatedRoute.snapshot.params['id_personal'];
  this.personalService.idPersonal(id_persona).subscribe(
    data => {
      this.personal = data;
    },
    err => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.error.message,
        confirmButtonText: 'Aceptar'
      });
      this.router.navigate(['/']);
    }
  );
}

editarPersonal(): void {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Deseas editar esta persona?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, editar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
     const id_persona = this.activatedRoute.snapshot.params['id_personal'];
    // Convertir el salario a número
    if (this.personal.salario) {
      this.personal.salario = Number(this.personal.salario);
    }
    this.personalService.editPersonal(id_persona, this.personal).subscribe(
      (data: any) => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Personal actualizado correctamente',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/admin/listaPersonal']);
        });
      },
      (err: any) => {
        console.error("Error:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error.message,
          confirmButtonText: 'Aceptar'
        });
      }
    );
    }
  }
  );
}

cancelar() {
  this.router.navigate(['/admin/listaPersonal']);
}
}
