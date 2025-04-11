import { Component } from '@angular/core';
import { NavbarComponent } from "../../dashboard/navbar/navbar.component";
import { FooterComponent } from "../../dashboard/footer/footer.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-cl',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './register-cl.component.html',
  styleUrl: './register-cl.component.css'
})
export class RegisterClComponent {

}
