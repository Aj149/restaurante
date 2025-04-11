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
import { Comentarios, Platos, reserva } from '../../models/dashboard';
import { HttpClient } from '@angular/common/http';
import { PopUpPlatosComponent } from './pop-up-platos/pop-up-platos.component';
import { PlatosService } from '../../services/platos.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, CarouselModule, NavbarComponent, FooterComponent, FormsModule, PopUpPlatosComponent],
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

// 4traer platos

  ngOnInit(): void {
    if (this.platos) {
      this.traerPlatos();
    }
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



// 4abre y cierra el popup de los platos especiales
abrirPopup(plato: Platos) {
  this.platoSeleccionado = plato;
  this.isPopupVisible = true;
}

  closePopup() {
    this.isPopupVisible = false;
  }
  
  // 1para los lugares
  lugares: string[] = [];
  capacidades: { [key: string]: number } = {};
  maxPersonas: number = 0;


  constructor(
    // 1para los lugares
    private fb: FormBuilder, private http: HttpClient,
    private likeService: LikesService,
    private formularioService: FormularioService,
    private mensajeService: ComentariosService,
    private platosService: PlatosService,

  ) {
    // 1para los lugares
    this.formulario = this.fb.group({
      lugar: ['', Validators.required],
      numeroPersonas: ['', [Validators.required, Validators.min(1)]],
    });


    this.formularioMensaje = new FormGroup({
      nombre: new FormControl("",[Validators.required, Validators.pattern('^[a-zA-Z\s]*$')]),
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
      hora:new FormControl ('',[Validators.required])
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
      console.log('Validators:', numeroPersonasControl.validator);
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
        hora: formValues.hora
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