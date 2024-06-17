import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private token='';

  constructor() { }

  login(nombreUsuario: string, clave: string): string | undefined{
    if (nombreUsuario === 'adrian' && clave === 'holamundo') {
      this.token = 'token_valido';
      return 'success';
    } else if (nombreUsuario !== 'adrian' && clave !== 'holamundo') {
      return 'both';
    } else if (nombreUsuario !== 'adrian') {
      return 'username';
    } else if (clave !== 'holamundo') {
      return 'password';
    }
    return undefined;
  }
  


  isAuth () {
    return this.token.length > 0
  }
}
