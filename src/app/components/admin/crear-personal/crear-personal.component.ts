import { Component } from '@angular/core';
import { Personal } from '../../../models/dashboard';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PersonalService } from '../../../services/personal.service';
import { FormularioService } from '../../../services/formulario.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-personal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './crear-personal.component.html',
  styleUrl: './crear-personal.component.css',
})
export class CrearPersonalComponent {
  isFormSubmitted: boolean = false;
  FormSubmitted: boolean = false;
  formulario: FormGroup;
  personal: Personal = new Personal();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private personalService: PersonalService,
    private formularioService: FormularioService
  ) {
    this.formulario = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/), // Solo letras y espacios
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/), // Solo números
        ],
      ],
      direccion: ['', [Validators.required]],
      cedula: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{10}$/), // Exactamente 10 dígitos
        ],
      ],
      nacionalidad: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
      puesto: ['', [Validators.required]],
      fecha_contratacion: ['', [Validators.required]],
      fecha_nacimiento: ['', [Validators.required]],
      salario: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/), // Números con decimales opcionales
        ],
      ],
      genero: ['', [Validators.required]],
      jornadaLaboral: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    });
  }

  agregarPersonal() {
  this.isFormSubmitted = true;
  if (this.formulario.valid) {
    const formValues = this.formulario.value;
    const nuevaPersona: Personal = {
      nombre: formValues.nombre,
      email: formValues.email,
      telefono: formValues.telefono,
      direccion: formValues.direccion,
      cedula: formValues.cedula,
      nacionalidad: formValues.nacionalidad,
      imagen: formValues.imagen,
      puesto: formValues.puesto,
      fecha_contratacion: formValues.fecha_contratacion,
      fecha_nacimiento: formValues.fecha_nacimiento,
      salario: formValues.salario,
      genero: formValues.genero,
      jornadaLaboral: formValues.jornadaLaboral,
      descripcion: formValues.descripcion,
    };

    this.personalService.agregarPersonal(nuevaPersona).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La persona se creó correctamente',
          confirmButtonText: 'Aceptar',
          timer: 2000,
          timerProgressBar: true,
          willClose: () => {
            // Aquí rediriges, por ejemplo al listado de personal o a la página anterior
            this.router.navigate(['/admin/listaPersonal']);
          }
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al crear la persona',
        });
      }
    );
  }
}

}
