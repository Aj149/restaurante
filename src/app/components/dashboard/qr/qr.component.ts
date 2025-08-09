import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platos } from '../../../models/dashboard';

@Component({
  selector: 'app-qr',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.css'
})
export class QrComponent {

   datosFactura: any = {};


   plato: Platos[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const datosBase64 = params['d'];
      if (datosBase64) {
        try {
          const json = decodeURIComponent(atob(datosBase64));
          this.datosFactura = JSON.parse(json);
          console.log('Factura decodificada:', this.datosFactura);
        } catch (error) {
          console.error('Error al decodificar datos:', error);
        }
      } else {
        console.warn('No hay datos en query params');
      }
    });
  }



}
