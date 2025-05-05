import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from "../../dashboard/footer/footer.component";
import { NavbarComponent } from "../../dashboard/navbar/navbar.component";
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [ReactiveFormsModule, FooterComponent, NavbarComponent, NgClass],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css'
})
export class RecuperarContrasenaComponent {

  forgotForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;
  
    const email = this.forgotForm.value.email;
  
    this.authService.sendRecoveryEmail(email).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Revisa tu bandeja de entrada para restablecer tu contraseña.'
        });
        this.forgotForm.reset();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al enviar el correo. Intenta nuevamente.'
        });
        console.error(err);
      }
    });
  }
  
  
  
  
}
