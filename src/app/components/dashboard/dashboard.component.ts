import { Component, OnInit} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarouselModule,OwlOptions } from 'ngx-owl-carousel-o';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LikesService } from '../../services/likes.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { reserva } from '../../models/reserva';
import { FormularioService } from '../../services/formulario.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Comentarios } from '../../models/comentarios';
import { ComentariosService } from '../../services/comentarios.service';






@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink,CarouselModule,NavbarComponent, FooterComponent,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})


export class DashboardComponent {

  nombre='';
  telefono = 0;
  n_personas = 0;
  hora = 0;
  email = '';
  lugar = '';
  fecha = new Date()


  formularioMensaje: FormGroup
  formulario: FormGroup;
  isFormSubmitted: boolean = false;
  FormSubmitted: boolean = false;



  constructor(
    private likeService: LikesService,
    private formularioService: FormularioService,
    private mensajeService: ComentariosService,

  ) {
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
  agregarMensaje() {
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
          console.log('Mensaje creado con éxito', response);
        },
        error => {
          console.error('Error al enviar el mensaje', error);
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