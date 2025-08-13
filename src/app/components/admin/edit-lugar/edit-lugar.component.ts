import { Component } from '@angular/core';
import { Horario, Lugares } from '../../../models/dashboard';
import { ActivatedRoute, Router } from '@angular/router';
import { LugaresService } from '../../../services/lugares.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormGroup, FormsModule } from '@angular/forms';
import { EditHorariosComponent } from "../edit-horarios/edit-horarios.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-lugar',
  standalone: true,
  imports: [FormsModule, EditHorariosComponent, CommonModule],
  templateUrl: './edit-lugar.component.html',
  styleUrl: './edit-lugar.component.css'
})
export class EditLugarComponent {

  lugar: Lugares = {
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



  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private lugaresService: LugaresService,
  ) {}

   horarioParaEditar: Horario | null = null;

  abrirEdicion(horario: Horario) {
  console.log('Horario para editar:', horario);
  this.horarioParaEditar = { ...horario };
}

  // 1guarda el horario editado

 onHorarioGuardado(horarioActualizado: Horario) {
  console.log('ID del horario:', horarioActualizado.id);  

  this.lugaresService.updateHorario(horarioActualizado.id, horarioActualizado)
    .subscribe(() => {
      this.horarioParaEditar = null;
      this.cargarHorarios();
      this.toastr.success('Horario actualizado correctamente', 'Éxito');
    }, error => {
      this.toastr.error('Error al actualizar horario', 'Error');
      console.error(error);
    });
}


// 1 carga todos los horarios de un lugar sin filtro de día.

  cargarHorarios() {
  if (!this.lugar?.id_lugar) {
    this.horariosDelDia = [];
    return;
  }
  this.lugaresService.getHorariosPorLugar(this.lugar.id_lugar).subscribe({
    next: (horarios) => this.horariosDelDia = horarios,
    error: () => this.horariosDelDia = []
  });
}


// 1 carga horarios filtrados por lugar y día seleccionado.
  onDiaChange() {
  if (this.diaSeleccionado && this.lugar?.id_lugar) {
    this.lugaresService.getHorariosPorLugarYDia(this.lugar.id_lugar, this.diaSeleccionado)
      .subscribe({
        next: horarios => {
          console.log('Horarios filtrados por lugar y día:', horarios);
          this.horariosDelDia = horarios;
        },
        error: err => {
          console.error(err);
          this.horariosDelDia = [];
        }
      });
    this.horarioParaEditar = null;
  }
}


 ngOnInit(): void {
  // Obtiene el parámetro 'id_lugar' de la URL actual
  const id_lugar = this.activatedRoute.snapshot.params['id_lugar'];

  // Llama al servicio 'lugaresService' para obtener los datos del lugar con ese id
  this.lugaresService.id_lugar(id_lugar).subscribe(
    data => {
      // 3. Si la respuesta es exitosa, asigna los datos recibidos a la variable 'lugar'
      this.lugar = data;

      //  Luego, llama al método cargarHorarios() para cargar los horarios relacionados con ese lugar
      this.cargarHorarios();
    },
    err => {
      // 5. Si ocurre un error, muestra un mensaje de error con toastr
      this.toastr.error(err.error.message, 'Fail', {
        timeOut: 3000,
        positionClass: 'toast-top-center',
      });

      // Redirige al usuario a la página principal
      this.router.navigate(['/']);
    }
  );
}


eliminarHorario(horario: any) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: `Se eliminará el horario de ${horario.dia}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.lugaresService.eliminarHorario(horario.id).subscribe(() => {
        Swal.fire(
          'Eliminado',
          'El horario ha sido eliminado correctamente.',
          'success'
        );
        this.cargarHorarios();
      });
    }
  });
}





  guardarCambios(): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas editar este lugar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const id_lugar = this.activatedRoute.snapshot.params['id_lugar'];

        if (this.lugar.precio) {
          this.lugar.precio = Number(this.lugar.precio);
        }

        this.lugaresService.update(id_lugar, this.lugar).subscribe(
          data => {
            this.toastr.success('Lugar editado correctamente', 'Éxito', {
              timeOut: 3000,
              positionClass: 'toast-top-center',
            });
            this.router.navigate(['/admin/lugares']);
          },
          err => {
            this.toastr.error(err.error.message, 'Fail', {
              timeOut: 3000,
              positionClass: 'toast-top-center',
            });
          }
        );
      }
    });
  }
  volver(): void {
    this.router.navigate(['/admin/lugares']);
  }

}
