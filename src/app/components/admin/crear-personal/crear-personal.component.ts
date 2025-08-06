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

  if (this.formulario.invalid) {
    // Marcar todos los controles como tocados para que el UI muestre errores si usas *ngIf con touched/invalid
    this.formulario.markAllAsTouched();
    // Mostrar SweetAlert con el primer error específico
    this.mostrarErroresValidacion();
    return;
  }

  // Si es válido, continuamos con el envío
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




private mostrarErroresValidacion(): void {
  // Recorremos los controles en orden (puedes cambiar el orden si prefieres)
  const controlesOrden = [
    'nombre', 'email', 'telefono', 'direccion', 'cedula',
    'nacionalidad', 'imagen', 'puesto', 'fecha_contratacion',
    'fecha_nacimiento', 'salario', 'genero', 'jornadaLaboral', 'descripcion'
  ];

  for (const key of controlesOrden) {
    const control = this.formulario.get(key);
    if (control && control.invalid) {
      const errors = control.errors || {};
      let mensaje = 'El campo tiene un valor incorrecto';

      switch (key) {
        case 'nombre':
          if (errors['required']) mensaje = 'El campo nombre está vacío.';
          else if (errors['pattern']) mensaje = 'El campo nombre solo acepta letras y espacios.';
          break;

        case 'email':
          if (errors['required']) mensaje = 'El campo email está vacío.';
          else if (errors['email']) mensaje = 'Introduce un email válido (ej: usuario@dominio.com).';
          break;

        case 'telefono':
          if (errors['required']) mensaje = 'El campo teléfono está vacío.';
          else if (errors['pattern']) mensaje = 'El teléfono debe contener solo números.';
          else if (errors['minlength']) mensaje = `El teléfono debe tener al menos ${errors['minlength'].requiredLength} dígitos.`;
          else if (errors['maxlength']) mensaje = `El teléfono debe tener como máximo ${errors['maxlength'].requiredLength} dígitos.`;
          break;

        case 'direccion':
          if (errors['required']) mensaje = 'El campo dirección está vacío.';
          break;

        case 'cedula':
          if (errors['required']) mensaje = 'El campo cédula está vacío.';
          else if (errors['pattern']) {
            // Distinguimos si contiene letras o tiene longitud incorrecta
            const val = control.value || '';
            if (/[^0-9]/.test(val)) mensaje = 'La cédula debe contener solo números.';
            else if (val.length !== 10) mensaje = 'La cédula debe tener exactamente 10 dígitos.';
            else mensaje = 'Cédula inválida.';
          } else if (errors['minlength'] || errors['maxlength']) {
            mensaje = 'La cédula debe tener exactamente 10 dígitos.';
          }
          break;

        case 'nacionalidad':
          if (errors['required']) mensaje = 'El campo nacionalidad está vacío.';
          break;

        case 'imagen':
          if (errors['required']) mensaje = 'Debes seleccionar una imagen.';
          break;

        case 'puesto':
          if (errors['required']) mensaje = 'El campo puesto está vacío.';
          break;

        case 'fecha_contratacion':
          if (errors['required']) mensaje = 'Debes seleccionar la fecha de contratación.';
          break;

        case 'fecha_nacimiento':
          if (errors['required']) mensaje = 'Debes seleccionar la fecha de nacimiento.';
          break;

        case 'salario':
          if (errors['required']) mensaje = 'El campo salario está vacío.';
          else if (errors['pattern']) mensaje = 'El salario debe ser un número válido (opcionalmente con hasta 2 decimales).';
          break;

        case 'genero':
          if (errors['required']) mensaje = 'El campo género está vacío.';
          break;

        case 'jornadaLaboral':
          if (errors['required']) mensaje = 'El campo jornada laboral está vacío.';
          break;

        case 'descripcion':
          if (errors['required']) mensaje = 'El campo descripción está vacío.';
          break;

        default:
          mensaje = 'Hay campos que no cumplen los requisitos.';
      }

      // Mostramos el primer error encontrado y salimos
      Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: mensaje,
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  }
}


}
