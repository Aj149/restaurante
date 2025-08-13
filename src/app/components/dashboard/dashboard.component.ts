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
// Declaración de formularios reactivos para manejar datos en la UI
formularioMensaje: FormGroup;
formulario: FormGroup;
isFormSubmitted: boolean = false; // Controla si el formulario fue enviado
FormSubmitted: boolean = false;   // Otro flag para estado de envío (podría unificarse)

// Variables para controlar el popup de platos especiales
isPopupVisible = false;           // Controla si el popup está visible o no
platos: Platos[] = [];            // Lista general de platos
platosEspeciales: Platos[] = [];  // Lista filtrada de platos especiales
platoSeleccionado!: Platos;       // Plato seleccionado para mostrar detalles en popup

// Método que se ejecuta al inicializar el componente Angular
ngOnInit(): void {
  // Se verifican las variables (posiblemente propiedades que indican si hay datos) y si existen,
  // se llaman a funciones para cargar los datos necesarios desde servicios
  if (this.platos) {
    this.traerPlatos();       // Carga los platos desde el backend o servicio
  }
  if (this.lugares) {
    this.traerLugares();      // Carga los lugares
  }
  if (this.comentario) {
    this.listarComentarios(); // Carga comentarios
  }
  if (this.personal) {
    this.traerPersonal();     // Carga el personal
  }
  if (this.bebidas) {
    this.traerBebidas();      // Carga las bebidas
  }
}

// Función para traer datos del personal desde el servicio
traerPersonal(): void {
  this.PersonalService.obtenerPersonal().subscribe(
    (data) => {
      // Cuando se recibe la respuesta, se asigna a la variable local 'personal'
      this.personal = data;

      // Además, se crea una lista 'personalEspeciales' con los primeros 4 elementos,
      // probablemente para destacar o mostrar en otra sección
      this.personalEspeciales = this.personal.slice(0, 4);
    },
    (error) => {
      // En caso de error al obtener datos, se muestra en consola para depuración
      console.error('Error al cargar el personal', error);
    }
  );
}


  // Función para obtener la lista completa de platos desde el servicio
traerPlatos(): void {
  this.platosService.obtenerPlatos().subscribe(
    (data) => {
      // Al recibir los datos, se asignan a la variable 'platos'
      this.platos = data;

      // Se seleccionan los primeros 4 platos para destacarlos como 'especiales'
      this.platosEspeciales = this.platos.slice(0, 4);
    },
    (error) => {
      // Si ocurre un error, se muestra en la consola para depurar
      console.error('Error al cargar los platos', error);
    }
  );
}

// Función para obtener la lista completa de lugares desde el servicio
traerLugares(): void {
  this.lugaresService.obtenerLugares().subscribe(
    (data) => {
      // Se asignan los datos recibidos a 'lugares'
      this.lugares = data;

      // Se filtran los primeros 4 lugares para destacarlos como especiales
      this.lugaresEspeciales = this.lugares.slice(0, 4);
    },
    (error) => {
      // Muestra en consola si hay algún error al cargar los lugares
      console.error('Error al cargar lugares:', error);
    }
  );
}

// Función para obtener la lista completa de bebidas desde el servicio
traerBebidas(): void {
  this.bebidasService.obtenerBebidas().subscribe(
    (data) => {
      // Se asignan las bebidas recibidas a la variable local
      this.bebidas = data;

      // Se seleccionan los primeros 6 para mostrarlos como bebidas especiales
      this.bebidasEspeciales = this.bebidas.slice(0, 6);
    },
    (error) => {
      // Loguea cualquier error que ocurra al obtener las bebidas
      console.error('Error al cargar bebidas:', error);
    }
  );
}

  // Se ejecuta cuando cambia la selección de lugar en el formulario
onLugarChange(event: any) {
  // Obtener el id del lugar seleccionado y convertirlo a número
  const lugarId = +event.target.value;

  // Buscar el lugar completo en la lista de lugares usando el id
  const lugarSeleccionado = this.lugares.find(l => l.id_lugar === lugarId);

  if (lugarSeleccionado) {
    // Si existe el lugar, asignar su capacidad a la variable local
    this.capacidades = lugarSeleccionado.capacidad;

    // Obtener el control del formulario que contiene el número de personas
    const personasCtrl = this.formulario.get('n_personas');

    // Si el número ingresado es mayor a la capacidad, ajustar al máximo permitido
    if (personasCtrl && personasCtrl.value > this.capacidades) {
      personasCtrl.setValue(this.capacidades);
    }

    // 🔹 Obtener todos los horarios disponibles para el lugar seleccionado
    this.lugaresService.getHorariosPorLugar(lugarId).subscribe((data: Horario[]) => {
      // Guardar todos los horarios en una variable para uso posterior
      this.todosLosHorarios = data;

      // Inicializar el arreglo de horarios filtrados vacío porque aún no se ha filtrado por fecha
      this.horarios = [];
    });
  } else {
    // Si no hay lugar seleccionado o no existe, reiniciar variables relacionadas
    this.capacidades = 0;
    this.todosLosHorarios = [];
    this.horarios = [];
  }
}

// Se ejecuta cuando cambia la fecha seleccionada en el formulario
onFechaChange(event: any) {
  // Obtener la fecha seleccionada en formato "YYYY-MM-DD"
  const fechaSeleccionada = event.target.value;

  // Si no hay fecha, limpiar listas de horarios y salir
  if (!fechaSeleccionada) {
    this.horarios = [];
    this.horariosFiltrados = [];
    return;
  }

  // Para evitar problemas con la zona horaria, desglosar la fecha manualmente
  const [anio, mes, dia] = fechaSeleccionada.split('-').map(Number);

  // Crear un objeto Date con año, mes (menos 1 porque JS cuenta meses desde 0) y día
  const dateObj = new Date(anio, mes - 1, dia);

  // Lista de días de la semana en español, índice 0 es domingo
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  // Obtener el nombre del día de la semana para la fecha seleccionada
  const diaSemana = diasSemana[dateObj.getDay()];

  // Filtrar los horarios del lugar para que solo queden los que coinciden con ese día
  this.horarios = this.todosLosHorarios.filter((h: Horario) => h.dia === diaSemana);

  // Aplicar filtrado adicional por hora si la fecha es hoy (función propia)
  this.filtrarHorariosPorFecha(fechaSeleccionada);
}



  /**
 * Filtra los horarios para que el cliente no pueda seleccionar horarios pasados en la fecha seleccionada.
 * Además, ordena los horarios disponibles de forma cíclica desde una hora base (8 AM).
 * 
 * @param fechaSeleccionada - Fecha en formato "YYYY-MM-DD"
 */
filtrarHorariosPorFecha(fechaSeleccionada: string) {
  const ahora = new Date(); // Fecha y hora actual

  // Crear objeto Date para la fecha seleccionada con horas en 00:00:00.000
  const parts = fechaSeleccionada.split('-');
  const fechaSel = new Date(+parts[0], +parts[1] - 1, +parts[2]);
  fechaSel.setHours(0, 0, 0, 0);

  // Filtrar solo los horarios cuyo estado sea 'Disponible'
  const horariosDisponibles = this.horarios.filter(h => h.estado === 'Disponible');

  // Definir hora base para ordenar horarios (8:00 AM convertido a minutos)
  const baseHora = 8 * 60; // 480 minutos

  /**
   * Convierte una hora en formato "HH:mm" a minutos cíclicos,
   * partiendo desde la baseHora para ordenar horarios después de esa hora primero.
   * Ejemplo: 7:00 AM sería negativo, se ajusta sumando 1440 minutos (un día).
   * 
   * @param hora - string en formato "HH:mm"
   * @returns minutos cíclicos para ordenar
   */
  const minutosCiclicos = (hora: string) => {
    const [h, m] = hora.split(':').map(Number);
    let total = h * 60 + m - baseHora;
    if (total < 0) total += 1440; // Ajustar para horas antes de la base
    return total;
  };

  // Si la fecha seleccionada es el día actual
  if (fechaSel.toDateString() === ahora.toDateString()) {
    // Definir límite como la hora actual + 1 hora para evitar reservar en horarios ya muy próximos o pasados
    let limite = new Date(ahora.getTime() + 1 * 60 * 60 * 1000);

    // Obtener el fin del día para la fecha seleccionada
    const finDia = new Date(fechaSel);
    finDia.setHours(23, 59, 59, 999);

    // Ajustar límite para que no pase del fin del día
    if (limite > finDia) {
      limite = finDia;
    }

    // Filtrar horarios disponibles que sean posteriores o iguales al límite calculado
    const filtrados = horariosDisponibles.filter(h => {
      // Convertir hora de inicio del horario a un objeto Date en la fecha seleccionada
      const [horaInicio, minutoInicio] = h.horaInicio.split(':').map(Number);
      const fechaHorario = new Date(fechaSel);
      fechaHorario.setHours(horaInicio, minutoInicio, 0, 0);
      // Retornar solo los horarios que estén después del límite (hora actual + 1h)
      return fechaHorario >= limite;
    });

    // Asignar a horariosFiltrados ordenados usando la función minutosCiclicos
    this.horariosFiltrados = filtrados.sort((a, b) => minutosCiclicos(a.horaInicio) - minutosCiclicos(b.horaInicio));
  } else {
    // Si la fecha no es hoy, mostrar todos los horarios disponibles ordenados
    this.horariosFiltrados = horariosDisponibles.sort((a, b) => minutosCiclicos(a.horaInicio) - minutosCiclicos(b.horaInicio));
  }
}

/**
 * Método que se ejecuta al cambiar la fecha en el input,
 * llama a la función que filtra los horarios según la fecha.
 */
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



  /**
 * Convierte una hora de formato 24h a formato 12h y arma un texto con el rango horario y el día.
 */
formatearHorario(horaInicio: string, horaFin: string, dia: string): string {
  
  // Función interna para dar formato a una hora (ej. "14:30" → "2pm")
  const formato = (hora: string) => {
    // Divide la hora en horas y minutos, y convierte a número
    const [h, m] = hora.split(':').map(Number);

    // Determina si es AM o PM
    const ampm = h >= 12 ? 'pm' : 'am';

    // Convierte la hora de 24h a 12h (usando 12 en lugar de 0)
    const hora12 = h % 12 || 12;

    // Retorna la hora formateada con AM o PM (sin minutos en este caso)
    return `${hora12}${ampm}`;
  };

  // Devuelve el rango horario y el día (ej. "2pm a 4pm (Lunes)")
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