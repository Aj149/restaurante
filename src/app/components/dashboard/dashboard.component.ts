import { Component, Input, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule,OwlOptions } from 'ngx-owl-carousel-o';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LikesService } from '../../services/likes.service';
import {  FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormularioService } from '../../services/formulario.service';
import { CommonModule } from '@angular/common';
import { ComentariosService } from '../../services/comentarios.service';
import Swal from 'sweetalert2';
import { Comentarios, Lugares, Personal, Platos, reserva } from '../../models/dashboard';
import { HttpClient } from '@angular/common/http';
import { PopUpPlatosComponent } from './pop-up-platos/pop-up-platos.component';
import { PlatosService } from '../../services/platos.service';
import { LugaresService } from '../../services/lugares.service';
import { PopUpLugaresComponent } from "./pop-up-lugares/pop-up-lugares.component";
import { NgxPaginationModule } from 'ngx-pagination';
import { PopUpPersonalComponent } from "./pop-up-personal/pop-up-personal.component";
import { PersonalService } from '../../services/personal.service';

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

    onLugarChange(event: any) {
  const lugarId = +event.target.value;
  const lugarSeleccionado = this.lugares.find(l => l.id_lugar === lugarId);

  if (lugarSeleccionado) {
    this.capacidades = lugarSeleccionado.capacidad;

    const personasCtrl = this.formulario.get('n_personas');
    if (personasCtrl && personasCtrl.value > this.capacidades) {
      personasCtrl.setValue(this.capacidades);
    }
  } else {
    this.capacidades = 0;
  }
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


  constructor(
    // 1para los lugares
    private fb: FormBuilder, private http: HttpClient,
    private likeService: LikesService,
    private formularioService: FormularioService,
    private mensajeService: ComentariosService,
    private platosService: PlatosService,
    private PersonalService: PersonalService,
    private lugaresService: LugaresService,
    private comentariosService: ComentariosService

  ) {
    // 1para los lugares
    this.formulario = this.fb.group({
      lugar: ['', Validators.required],
      numeroPersonas: ['', [Validators.required, Validators.min(1)]],
    });


    this.formularioMensaje = new FormGroup({
      nombre: new FormControl("",[Validators.required]),
      email: new FormControl('',[Validators.required,Validators.email] ),
      comentario: new FormControl ("", [Validators.required])

    })
    this.formulario = new FormGroup
    ({
      
      nombre: new FormControl("",[Validators.required, Validators.pattern('^[a-zA-Z\s]*$')]),
      email: new FormControl('',[Validators.required,Validators.email] ),
      telefono: new FormControl("", [Validators.required, Validators.pattern(/^[0-9]{1,10}$/)]),
      lugar: new FormControl('',[Validators.required]),
      n_personas: new FormControl ('',[Validators.required, Validators.pattern('^[0-9]*$')]),
      fecha: new FormControl ('',[Validators.required]),
      hora:new FormControl ('',[Validators.required]),
      detalles: new FormControl ('',[Validators.required])
    })
  }


// 1para los lugares
  // ngOnInit() {
  //   this.http.get<any>('http://localhost:8000/reserva/lugares').subscribe(data => {
  //     console.log('Data:', data);
  //     this.lugares = data.lugares;
  //     this.capacidades = data.capacidades;
  //   });

  //   this.formulario.get('lugar')?.valueChanges.subscribe(selectedLugar => {
  //     this.maxPersonas = this.capacidades[selectedLugar] || 0;
  //     console.log('Max Personas:', this.maxPersonas);
  //     this.updateNumeroPersonasValidators();
  //   });
  // }

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
        telefono: +formValues.telefono,
        lugar: formValues.lugar,
        n_personas: +formValues.n_personas,
        fecha: formValues.fecha,
        hora: formValues.hora,
        detalles: formValues.detalles
      };
      console.log(nuevaReserva); // Verifica los datos aquí
      this.formularioService.agregarReserva(nuevaReserva).subscribe(
        response => {
          console.log('Reserva creada con éxito', response);
        },
        error => {
          console.error('Error al crear la reserva', error);
        }
      );
    }
  }







  // para agregar mensajes
  agregarMensaje(): void {
    this.FormSubmitted = true;
    if (this.formularioMensaje.valid) {
        const formValues = this.formularioMensaje.value;
        const nuevoMensaje: Comentarios = {
            nombre: formValues.nombre,
            email: formValues.email,
            comentario: formValues.comentario
        };
        console.log(nuevoMensaje);
        this.mensajeService.agregarMensaje(nuevoMensaje).subscribe(
            response => {
                Swal.fire({
                    title: 'Enviado!',
                    text: 'El mensaje ha sido enviado correctamente.',
                    icon: 'success',
                    background: "#27272a",
                    color: "#fafafa",
                    confirmButtonColor: "rgb(218, 91, 30)"
                });  
            },
            error => {
                Swal.fire({
                    title: 'Error!',
                    text: 'Hubo un problema al enviar el mensaje.',
                    icon: 'error',
                    background: "#27272a",
                    color: "#fafafa",
                    confirmButtonColor: "#d33"
                });
            }
        );
    }
}

// 2para ver los mensajes
comentario : Comentarios [] =[];
  
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




// servicio para cargar el corazon a otro componente

incrementClickCount() {
  this.likeService.incrementClickCount();
}

// efecto del corazon y del enviar
ngAfterViewInit(): void {
  const enviar = document.querySelectorAll('.enviar');
  enviar.forEach(enviar => {
    enviar.addEventListener('click', () => this.handleClick1(enviar.id));
  });

  const hearts = document.querySelectorAll('.heart');
  hearts.forEach(heart => {
    heart.addEventListener('click', () => this.handleClick(heart.id));
  });
}


handleClick(heartId: string): void {
  const heart = document.getElementById(heartId);
  if (heart) {
    heart.classList.add('clicked');
    setTimeout(() => {
      heart.classList.remove('clicked');
    }, 600);
  }
}

handleClick1(enviarId: string): void {
  const enviar = document.getElementById(enviarId);
  if (enviar) {
    enviar.classList.add('clicked');
    setTimeout(() => {
      enviar.classList.remove('clicked');
    }, 600);
  }
}

}