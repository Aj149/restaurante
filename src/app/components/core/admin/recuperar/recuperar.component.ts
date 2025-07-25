import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import Swal from 'sweetalert2';
import { NavbarComponent } from "../../../dashboard/navbar/navbar.component";
import { FooterComponent } from "../../../dashboard/footer/footer.component";
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './recuperar.component.html',
  styleUrl: './recuperar.component.css'
})
export class RecuperarComponent {

  forgotForm: FormGroup;

  constructor (
    private fb: FormBuilder,
    private adminService: AdminService,
  ) {
    this.forgotForm = this.fb.group({
      
      correo: ['', Validators.required]
    });
  }
  
  onSubmit() {
    if (this.forgotForm.invalid) return;
    const correo = this.forgotForm.value.correo;

    this.adminService.recuperarCorreo(correo).subscribe({
      next:() => {
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Revisa tu bandeja de entrada para restablecer tu contraseña.'
        });
        this.forgotForm.reset();
      },
      error: (err) =>{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al enviar el correo. Intenta nuevamente.'
        });
        console.error(err);
      }
    })
  }
  
}
