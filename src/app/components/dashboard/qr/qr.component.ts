import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platos } from '../../../models/dashboard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

  descargarComprobante() {
  const elemento = document.querySelector('.factura-container') as HTMLElement;
  if (!elemento) {
    alert('No se encontró el comprobante para descargar.');
    return;
  }

  html2canvas(elemento).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('comprobante.pdf');
  }).catch(error => {
    console.error('Error generando PDF:', error);
    alert('Error al generar el comprobante.');
  });
}



}
