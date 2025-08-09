import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platos } from '../models/dashboard';
import { Factura, Pedido } from '../models/pedidos';



@Injectable({
  providedIn: 'root'
})
export class PlatosService {

  platosUrl = environment.platosURL
  facturaUrl = environment.facturaUrl
    
    constructor(private httpClient: HttpClient) { }
  
    public obtenerPlatos(): Observable<Platos[]> {
      return this.httpClient.get<Platos[]>(this.platosUrl);
    }
  
    public id_Plato(id_plato: number): Observable<Platos> {
      return this.httpClient.get<Platos>(`${this.platosUrl}/${id_plato}`);
    }
  
    public agregarPlatos(nuevaPlatos: Platos): Observable<any> {
      return this.httpClient.post<any>(`${this.platosUrl}`, nuevaPlatos);
    }

    public eliminarPlato(id_plato: number): Observable<any> {
  return this.httpClient.delete<any>(`${this.platosUrl}/${id_plato}`);
}

  
    public update(id_platos: number, platos: Platos): Observable<any> {
      return this.httpClient.patch<any>(`${this.platosUrl}/${id_platos}`, platos);
    }


    // 4codigo para los platos  que van al carrito
    
    private articulosCarrito = new BehaviorSubject<Pedido[]>(this.loadCart());
    private pedidoTemporal = new BehaviorSubject<Pedido | null>(null);
    articulos = this.articulosCarrito.asObservable();
    
    private obtenerAlmacenCarrito(): Pedido[] {
      try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
      } catch (error) {
        console.error('Error al leer el carrito desde localStorage:', error);
        return [];
      }
    }
    
    agregar(item: Pedido) {
      const currentItems = this.articulosCarrito.value;
      const existingItemIndex = currentItems.findIndex(i => i.id_pedido === item.id_pedido);
            
      if (existingItemIndex >= 0) {
        const newItems = [...currentItems];
        newItems[existingItemIndex].cantidad += item.cantidad;
        newItems[existingItemIndex].total = newItems[existingItemIndex].precio * newItems[existingItemIndex].cantidad;
        this.storeCart(newItems);
      } else {
        const newItem = { ...item, total: item.precio * item.cantidad };
        const newItems = [...currentItems, newItem];
        this.storeCart(newItems);
      }
    }
    
    private storeCart(items: Pedido[]) {
      this.articulosCarrito.next(items);
      localStorage.setItem('carrito', JSON.stringify(items));
    }
    
    // codigo que hace que me salga este error: ERROR ReferenceError: localStorage is not defined
    private loadCart(): Pedido[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('carrito');
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Error al parsear el carrito:', e);
        localStorage.removeItem('carrito'); // opcional: limpiar dato corrupto
      }
    }
  }
  return [];
}

      
      

    
      removeFromCart(index: number) {
        const currentItems = this.articulosCarrito.value;
        const newItems = currentItems.filter((_, i) => i !== index);
        this.storeCart(newItems);
      }

     

setPedidoTemporal(pedido: Pedido) {
  this.pedidoTemporal.next(pedido);
  localStorage.setItem('pedidoTemporal', JSON.stringify(pedido));
}

getPedidoTemporal(): Observable<Pedido | null> {
  return this.pedidoTemporal.asObservable();
}
    
      updateQuantity(index: number, change: number) {
        const currentItems = this.articulosCarrito.value;
        const newItems = [...currentItems];
        
        newItems[index].cantidad += change;
        
        // Si la cantidad es menor a 1, eliminar el item
        if (newItems[index].cantidad < 1) {
          newItems.splice(index, 1);
        }
        
        this.storeCart(newItems);
      }
    
      clearCart() {
        this.storeCart([]);
      }
    
      public total(): number {
        return this.articulosCarrito.value.reduce(
          (sum, item) => sum + (item.precio * item.cantidad), 
          0
        );
      }

    
      // 2codigo para las facturas

        crearFactura(factura: Factura) {
    return this.httpClient.post(this.facturaUrl, factura);
  }
      
     
  }

