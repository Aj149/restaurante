import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-lugar4',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NavbarComponent, FooterComponent, CarouselModule],
  templateUrl: './lugar4.component.html',
  styleUrl: './lugar4.component.css'
})
export class Lugar4Component {

  customOptions1: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000, // Tiempo total del carrusel
    autoplayHoverPause: true,
    items: 1,
    animateOut: 'fadeOut' // Efecto de desvanecimiento
  };

}
