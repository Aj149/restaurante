import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Platos } from '../../../models/dashboard';
import { HttpClient } from '@angular/common/http';
import { PlatosService } from '../../../services/platos.service';
import { FormularioService } from '../../../services/formulario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-plato',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './crear-plato.component.html',
  styleUrl: './crear-plato.component.css'
})
export class CrearPlatoComponent {

  isFormSubmitted: boolean = false;
  formSurbmitted: boolean = false;
  plato: Platos = new Platos();
  formulario: FormGroup;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private platoService: PlatosService,
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
      descripcion: ['', [Validators.required, Validators.maxLength(300)]],
      precio: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/), // Números con hasta dos decimales
        ],
      ],
      imagen: ['', [Validators.required]],
    });
     this.formulario.get('imagen')?.valueChanges.subscribe(value => {
    this.plato.imagen = value;
  });
  }



  agregarPlato() {
    this.isFormSubmitted = true;
    if (this.formulario.valid) {
      const formValues = this.formulario.value;
      const nuevoPlato: Platos = {
        nombre: formValues.nombre,
        descripcion: formValues.descripcion,
        precio: parseFloat(formValues.precio),
        imagen: formValues.imagen,
      };
      this.platoService.agregarPlatos(nuevoPlato).subscribe(
      (response) => {
        Swal.fire({
          title: 'Éxito',
          text: 'Plato creado exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          this.router.navigate(['/admin/lista-de-platos']);
        });
      },
        (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo crear el plato. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
      );    
    }
  }

  volver() {
    this.router.navigate(['/admin/lista-de-platos']);
  }
}