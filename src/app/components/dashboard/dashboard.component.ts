import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LikesService } from '../../services/likes.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormularioService } from '../../services/formulario.service';
import { CommonModule } from '@angular/common';
import { ComentariosService } from '../../services/comentarios.service';
import Swal from 'sweetalert2';
import { Bebidas, Comentarios, Horario, Lugares, Personal, Platos, reserva } from '../../models/dashboard';
import { HttpClient } from '@angular/common/http';
import { PopUpPlatosComponent } from './pop-up-platos/pop-up-platos.component';
import { PlatosService } from '../../services/platos.service';
import { LugaresService } from '../../services/lugares.service';
import { PopUpLugaresComponent } from "./pop-up-lugares/pop-up-lugares.component";
import { NgxPaginationModule } from 'ngx-pagination';
import { PopUpPersonalComponent } from "./pop-up-personal/pop-up-personal.component";
import { PersonalService } from '../../services/personal.service';
import { AuthService } from '../../services/auth.service';
import { BebidasService } from '../../services/bebidas.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CarouselModule, NavbarComponent, FooterComponent, FormsModule, PopUpPlatosComponent, PopUpLugaresComponent, NgxPaginationModule, PopUpPersonalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})


export class DashboardComponent {

  formularioMensaje: FormGroup
  formulario: FormGroup;
  isFormSubmitted: boolean = false;
  FormSubmitted: boolean = false;

  // 4popup platos especiales

  isPopupVisible = false;
  platos: Platos[] = [];
  platosEspeciales: Platos[] = [];
  platoSeleccionado!: Platos;

  // 4traer platos, lugares, comentarios y personal

  ngOnInit(): void {
    if (this.platos) {
      this.traerPlatos();
    }
    if (this.lugares) {
      this.traerLugares();
    }
    if (this.comentario) {
      this.listarComentarios();
    }
    if (this.personal) {
      this.traerPersonal();
    }
    if (this.bebidas) {
      this.traerBebidas();
    }
  }

  traerPersonal(): void {
    this.PersonalService.obtenerPersonal().subscribe(
      (data) => {
        this.personal = data;
        this.personalEspeciales = this.personal.slice(0, 4);
      },
      (error) => {
        console.error('Error al cargar el personal', error);
      }
    );
  }

  traerPlatos(): void {
    this.platosService.obtenerPlatos().subscribe(
      (data) => {
        this.platos = data;
        this.platosEspeciales = this.platos.slice(0, 4); // primeros 4 platos
      },
      (error) => {
        console.error('Error al cargar los platos', error);
      }
    );
  }

  traerLugares(): void {
    this.lugaresService.obtenerLugares().subscribe(
      (data) => {
        this.lugares = data;
        this.lugaresEspeciales = this.lugares.slice(0, 4);
      },
      (error) => {
        console.error('Error al cargar lugares:', error);
      }
    );
  }

  traerBebidas(): void {
    this.bebidasService.obtenerBebidas().subscribe(
      (data) => {
        this.bebidas = data;
        this.bebidasEspeciales = this.bebidas.slice(0, 6);
      },
      (error) => {
        console.error('Error al cargar bebidas:', error);
      }
    );
  }

  onLugarChange(event: any) {
    const lugarId = +event.target.value;
    const lugarSeleccionado = this.lugares.find(l => l.id_lugar === lugarId);

    if (lugarSeleccionado) {
      this.capacidades = lugarSeleccionado.capacidad;

      const personasCtrl = this.formulario.get('n_personas');
      if (personasCtrl && personasCtrl.value > this.capacidades) {
        personasCtrl.setValue(this.capacidades);
      }

      // 🔹 Cargar todos los horarios de este lugar
      this.lugaresService.getHorariosPorLugar(lugarId).subscribe((data: Horario[]) => {
        this.todosLosHorarios = data; // Guardamos todos
        this.horarios = [];
      });
    } else {
      this.capacidades = 0;
      this.todosLosHorarios = [];
      this.horarios = [];
    }
  }


  onFechaChange(event: any) {
  const fechaSeleccionada = event.target.value; // "YYYY-MM-DD"
  if (!fechaSeleccionada) {
    this.horarios = [];
    this.horariosFiltrados = [];
    return;
  }

  // Evitar problema de timezone: parse manual
  const [anio, mes, dia] = fechaSeleccionada.split('-').map(Number);
  const dateObj = new Date(anio, mes - 1, dia); // mes - 1 porque en JS los meses van de 0 a 11

  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const diaSemana = diasSemana[dateObj.getDay()];

  // Filtrar por día
  this.horarios = this.todosLosHorarios.filter((h: Horario) => h.dia === diaSemana);

  // Filtrar por hora si la fecha es hoy
  this.filtrarHorariosPorFecha(fechaSeleccionada);
}



  // para que el cliente no pueda seleccionar un horario pasado
  filtrarHorariosPorFecha(fechaSeleccionada: string) {
  const ahora = new Date();

  const parts = fechaSeleccionada.split('-');
  const fechaSel = new Date(+parts[0], +parts[1] - 1, +parts[2]);
  fechaSel.setHours(0, 0, 0, 0);

  // Horarios disponibles
  const horariosDisponibles = this.horarios.filter(h => h.estado === 'Disponible');

  // Hora base para ordenar (8am)
  const baseHora = 8 * 60; // 480 minutos

  // Función para convertir hora a minutos cíclicos según baseHora
  const minutosCiclicos = (hora: string) => {
    const [h, m] = hora.split(':').map(Number);
    let total = h * 60 + m - baseHora;
    if (total < 0) total += 1440; // suma un día si es negativo
    return total;
  };

  // Filtrar y ordenar según fecha
  if (fechaSel.toDateString() === ahora.toDateString()) {
    let limite = new Date(ahora.getTime() + 1 * 60 * 60 * 1000);
    const finDia = new Date(fechaSel);
    finDia.setHours(23, 59, 59, 999);
    if (limite > finDia) {
      limite = finDia;
    }

    const filtrados = horariosDisponibles.filter(h => {
      const [horaInicio, minutoInicio] = h.horaInicio.split(':').map(Number);
      const fechaHorario = new Date(fechaSel);
      fechaHorario.setHours(horaInicio, minutoInicio, 0, 0);
      return fechaHorario >= limite;
    });

    this.horariosFiltrados = filtrados.sort((a, b) => minutosCiclicos(a.horaInicio) - minutosCiclicos(b.horaInicio));
  } else {
    this.horariosFiltrados = horariosDisponibles.sort((a, b) => minutosCiclicos(a.horaInicio) - minutosCiclicos(b.horaInicio));
  }
}






  horarioActual(event: any) {
    const fechaSeleccionada = event.target.value;
    this.filtrarHorariosPorFecha(fechaSeleccionada);
  }






  // 4abre y cierra el popup de los platos especiales
  abrirPopup(plato: Platos) {
    this.platoSeleccionado = plato;
    this.isPopupVisible = true;
  }

  closePopup() {
    this.isPopupVisible = false;
  }

  // 5para los lugares del carrusel

  abrirPopupLugar(lugar: Lugares) {
    this.lugarSeleccionado = lugar;
    this.mostrarPopUp = true;
  }


  cerrarPopup() {
    this.mostrarPopUp = false;
  }

  // 2abre y cierra el pop up del personal
  abrirPopupPersonal(personal: Personal) {
    this.personalSelecionado = personal;
    this.mostrarPopUpPersonal = true;
  }

  cerrarPopupPersonal() {
    this.mostrarPopUpPersonal = false;
  }

  // 2pop up personal
  mostrarPopUpPersonal = false;
  personal: Personal[] = [];
  personalEspeciales: Personal[] = [];
  personalSelecionado!: Personal;

  // 1para los lugares
  mostrarPopUp = false;
  lugares: Lugares[] = [];
  lugaresEspeciales: Lugares[] = [];
  lugarSeleccionado!: Lugares;
  capacidades: number = 0;
  maxPersonas: number = 0;
  // 2para los horarios
  todosLosHorarios: Horario[] = [];
  horarios: Horario[] = [];
  horariosFiltrados: any[] = [];

  // 4para las bebidas
  bebidas: Bebidas[] = [];
  bebidasEspeciales: Bebidas[] = [];

  constructor(
    // 1para los lugares
    private fb: FormBuilder,
    private formularioService: FormularioService,
    private mensajeService: ComentariosService,
    private platosService: PlatosService,
    private PersonalService: PersonalService,
    private lugaresService: LugaresService,
    private comentariosService: ComentariosService,
    private router: Router,
    private authService: AuthService,
    private bebidasService: BebidasService

  ) {
    // 1para los lugares
    this.formulario = this.fb.group({
      lugar: ['', Validators.required],
      numeroPersonas: ['', [Validators.required, Validators.min(1)]],
    });


    this.formularioMensaje = new FormGroup({
      nombre: new FormControl("", [Validators.required, Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40), Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
      comentario: new FormControl('', [Validators.required, Validators.maxLength(150)]),

    })
    this.formulario = new FormGroup
      ({

        nombre: new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/), Validators.maxLength(30)]),
        email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40), Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
        telefono: new FormControl("", [Validators.required, Validators.maxLength(11), Validators.pattern(/^[0-9]{1,10}$/)]),
        lugar: new FormControl('', [Validators.required]),
        n_personas: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]),
        fecha: new FormControl('', [Validators.required, this.fechaNoPasadaValidator]),
        hora: new FormControl('', [Validators.required]),
        detalles: new FormControl('', [Validators.maxLength(200)]),
      })
  }

  // para que no puedan poner una fecha anterior a la actual
  hoy: string = new Date().toLocaleDateString('en-CA'); // formato YYYY-MM-DD en local time


  fechaNoPasadaValidator(control: AbstractControl) {
    if (!control.value) return null;

    const fechaSeleccionada = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // quitar hora

    return fechaSeleccionada < hoy ? { fechaPasada: true } : null;
  }

  fechaHoy(event: any) {
    console.log('Fecha seleccionada:', event.target.value);
  }

  // numero maximo de caracteres para los detalles de la reserva
maxCaracteres = 200;
get caracteresRestantes() {
  const valor = this.formulario.get('detalles')?.value || '';
  return this.maxCaracteres - valor.length;
}
onInputDetalles() {
  const control = this.formulario.get('detalles');
  if (control) {
    const valor = control.value;
    if (valor.length > this.maxCaracteres) {
      control.setValue(valor.substring(0, this.maxCaracteres));
    }
  }
}
  



  updateNumeroPersonasValidators() {
    const numeroPersonasControl = this.formulario.get('numeroPersonas');
    if (numeroPersonasControl) {
      numeroPersonasControl.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(this.maxPersonas),
      ]);
      numeroPersonasControl.updateValueAndValidity();
    }
  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.formulario.valid) {
      console.log(this.formulario.value);
      // Aquí puedes manejar el envío de la reserva al backend.
    } else {
      console.log('Formulario Inválido', this.formulario.errors);
    }
  }
  agregarReserva() {
    this.isFormSubmitted = true;
    if (this.formulario.valid) {
      const formValues = this.formulario.value;
      const nuevaReserva: reserva = {
        nombre: formValues.nombre,
        email: formValues.email,
        telefono: formValues.telefono,
        lugar_id: +formValues.lugar,
        n_personas: +formValues.n_personas,
        fecha: formValues.fecha,
        horario_id: +formValues.hora,
        detalles: formValues.detalles,
      };
      console.log(nuevaReserva); // Verifica los datos aquí
      this.formularioService.agregarReserva(nuevaReserva).subscribe(
        response => {
          // Reserva creada con éxito
          Swal.fire({
            icon: 'success',
            title: '¡Reserva creada!',
            text: 'La reserva se ha realizado correctamente.',
            confirmButtonText: 'Aceptar',
            timer: 3000,
            timerProgressBar: true
          });
          this.formulario.reset();
          console.log('Reserva creada con éxito', response);
        },
        error => {
          // Manejo de errores
          console.error('Error al crear la reserva', error);

          if (error.status === 409) {
            // Error de conflicto: horario ya reservado
            Swal.fire({
              icon: 'error',
              title: 'Horario no disponible',
              text: error.error.message || 'El horario ya está reservado para esa fecha.',
              confirmButtonText: 'Aceptar',
            });
          } else {
            // Otros errores
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al crear la reserva. Inténtalo de nuevo.',
              confirmButtonText: 'Aceptar',
            });
          }
        }
      );
    }
  }



  formatearHorario(horaInicio: string, horaFin: string, dia: string): string {
    const formato = (hora: string) => {
      const [h, m] = hora.split(':').map(Number);
      const ampm = h >= 12 ? 'pm' : 'am';
      const hora12 = h % 12 || 12;
      return `${hora12}${ampm}`;
    };

    return `${formato(horaInicio)} a ${formato(horaFin)} (${dia})`;
  }






  // para agregar mensajes
  agregarMensaje(): void {
    this.FormSubmitted = true;
    this.formularioMensaje.markAllAsTouched();

    // 1) Comprobar si está logueado (ajusta según tu proyecto)
    // Opción A: usando un AuthService
    const isLoggedIn = this.authService?.isLoggedIn ? this.authService.isLoggedIn() : null;

    // Opción B (fallback): comprobación directa en localStorage
    const token = localStorage.getItem('token');
    const logged = (isLoggedIn !== null) ? isLoggedIn : !!token;

    if (!logged) {
      // Guardar borrador opcionalmente
      const draft = this.formularioMensaje.value;
      localStorage.setItem('draftComentario', JSON.stringify(draft));

      // Mostrar alerta y ofrecer ir a login
      Swal.fire({
        icon: 'warning',
        title: 'Debes iniciar sesión',
        text: 'Necesitas iniciar sesión para publicar un comentario. ¿Deseas ir a la página de login?',
        showCancelButton: true,
        confirmButtonText: 'Ir a login',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          // Redirigir a login
          this.router.navigate(['/login']);
        }
      });

      return; // detener ejecución: no enviar si no está logueado
    }

    // 2) Si está logueado, validar formulario y enviar
    if (this.formularioMensaje.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos requeridos.'
      });
      return;
    }

    const formValues = this.formularioMensaje.value;
    const nuevoMensaje: Comentarios = {
      nombre: formValues.nombre,
      email: formValues.email,
      comentario: formValues.comentario
    };

    console.log('Enviando comentario:', nuevoMensaje);

    this.mensajeService.agregarMensaje(nuevoMensaje).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Enviado!',
          text: 'El mensaje ha sido enviado correctamente.',
          icon: 'success',
          background: "#27272a",
          color: "#fafafa",
          confirmButtonColor: "rgb(218, 91, 30)"
        });
        this.formularioMensaje.reset();
        this.FormSubmitted = false;
        localStorage.removeItem('draftComentario'); // limpiar borrador
      },
      error: (err) => {
        console.error('Error al enviar mensaje:', err);
        const msg = err?.error?.message || 'Hubo un problema al enviar el mensaje.';
        Swal.fire({
          title: 'Error!',
          text: msg,
          icon: 'error',
          background: "#27272a",
          color: "#fafafa",
          confirmButtonColor: "#d33"
        });
      }
    });
  }

  // 2para ver los mensajes
  comentario: Comentarios[] = [];

  nombre = '';
  public page!: number;

  get comentariosOrdenados() {
    return this.comentario.slice().reverse();
  }



  listarComentarios(): void {
    this.comentariosService.obtenerMensaje().subscribe({
      next: (Comentarios: Comentarios[]) => {
        this.comentario = Comentarios;
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }





  // carrusel de la comida
  customOptions: OwlOptions = {
    loop: true,
    autoWidth: true,
    autoplay: true,
    autoplaySpeed: 800,
    autoplayTimeout: 5000,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
  }
  // carrusel de las instalaciones
  customOptions1: OwlOptions = {
    autoplay: false,
    responsive: {
      0: {
        items: 1,
        loop: true,
        autoplay: true, // Activar autoplay en pantallas pequeñas
        autoplayTimeout: 3000,
      },
      400: {
        items: 2,
        loop: true,
        autoplay: true, // Activar autoplay en pantallas pequeñas
        autoplayTimeout: 3000,
      },
      740: {
        items: 3,
        loop: true,
        autoplay: true, // Activar autoplay en pantallas pequeñas
        autoplayTimeout: 3000,
      },
      940: {
        items: 4
      }
    },
  }
  // carrusel del team
  customOptions3: OwlOptions = {
    autoplay: false,
    responsive: {
      0: {
        items: 1,
        loop: true,
        autoplay: true, // Activar autoplay en pantallas pequeñas
        autoplayTimeout: 3000,
      },
      600: {
        items: 2,
        loop: true,
        autoplay: true, // Activar autoplay en pantallas pequeñas
        autoplayTimeout: 3000,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4
      }
    },
  }

}