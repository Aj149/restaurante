import { Component } from '@angular/core';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { filter } from 'rxjs/operators';







@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  nombreUsuario: string = 'adrian';
  clave: string = 'asdf';
  hide = true;
  
  

  constructor(private router: Router, private authService: AuthService) {
   
  }

  
  login(){
    this.router.navigate(['/admin']);
  }

 
  }
  
  



