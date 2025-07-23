import { Component } from '@angular/core';
import { Lugares } from '../../../models/dashboard';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LugaresService } from '../../../services/lugares.service';
import { FormularioService } from '../../../services/formulario.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-lugar',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,RouterLink],
  templateUrl: './crear-lugar.component.html',
  styleUrl: './crear-lugar.component.css'
})
export class CrearLugarComponent {

  isFormSubmitted: boolean = false;
  FormSubmitted: boolean = false;
  formulario: FormGroup;
  lugar: Lugares = new Lugares();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private lugarService: LugaresService,
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
  descripcion: ['', [Validators.required]],
  precio: [
    '',
    [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^\d+(\.\d{1,2})?$/), // Números positivos, decimales válidos
    ],
  ],
  capacidad: [
    '',
    [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^[0-9]+$/), // Solo números enteros positivos
    ],
  ],
  imagen: [
    '',
    [
      Validators.required,
      Validators.pattern(/^(http|https):\/\/[^\s]+$/), // URL básica
    ],
  ],
});

  }

  agregarLugar() {
    this.isFormSubmitted = true;
    this.FormSubmitted = true;

    if (this.formulario.invalid) {
      return;
    }

    this.lugar.nombre = this.formulario.value.nombre;
    this.lugar.descripcion = this.formulario.value.descripcion;
    this.lugar.capacidad = this.formulario.value.capacidad;
    this.lugar.imagen = this.formulario.value.imagen;
    this.lugar.precio = parseFloat(this.formulario.value.precio);

    this.lugarService.agregarLugares(this.lugar).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Lugar creado correctamente',
        });
        this.router.navigate(['/admin/lugares']);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al crear el lugar',
        });
        console.error('Error al agregar lugar', error);
      }
    );
  }

}
