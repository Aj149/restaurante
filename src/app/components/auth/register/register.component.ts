import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

nombre: string;
apellido: string;
correo: string;
fecha: Date;

constructor(){
  this.nombre = '';
  this.apellido = '';
  this.correo = ''
  this.fecha = new Date();
}

  Acceder(){

  }
}
