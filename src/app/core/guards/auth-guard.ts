import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

/**
 * Auth guard. A documentação do angular recomenda que caso um usuário não esteja logado,
 * ao invés de navegar manualmente usando o router.navigate(), deve ser retornado um
 * URLTree para que o router gerencie o redirecionamento sem causar consequências 
 * inesperadas.
 */
export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getLoggedInUser();
  
  const logado = user != undefined

  if(logado)
    return true;
  else
    return router.parseUrl('/login');

};
