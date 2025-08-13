import { Component } from '@angular/core';
import { Horario, Lugares } from '../../../models/dashboard';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LugaresService } from '../../../services/lugares.service';
import { FormularioService } from '../../../services/formulario.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-lugar',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './crear-lugar.component.html',
  styleUrl: './crear-lugar.component.css'
})
export class CrearLugarComponent {

  isFormSubmitted: boolean = false;
  FormSubmitted: boolean = false;
  formulario: FormGroup;
  lugar: Lugares = new Lugares();
  lugares: Lugares = {
    id_lugar: 0,
    descripcion: '',
    nombre: '',
    imagen: '',
    precio: 0,
    capacidad: 0,
    dia: '',
    hora: '',
    estado: ''
  };

  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
diaSeleccionado: string = '';
horariosDelDia: Horario[] = [];
horarioEditado: Horario | null = null;
modoEdicion: boolean = false;
horarios: Horario[] = [];
   horarioParaEditar: Horario | null = null;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
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

  volver() {
    this.router.navigate(['/admin/lista-de-platos']);
  }


}
