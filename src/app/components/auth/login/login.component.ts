import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  NombreUsuario: string = '';
  clave: string = '';
  hide: boolean = true;

  constructor(private router: Router) {
    this.NombreUsuario = "";
    this.clave = "";
    this.hide = true;
  }




  Acceder(){
this.router.navigate(['/dashboard']);
  }
}

