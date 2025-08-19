import { ApplicationConfig, InjectionToken, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';

/**
 * Url base para a api que realiza o crud dos produtos e gerenciamento do
 * carrinho de compras
 */
export const BASE_URL = new InjectionToken<string>('base_url');
// geralmente a api de auth é diferente da api que faz o crud, então criei
// 2 tokens de injeção diferentes. Para esta aplicação em específico, 
// não seria necessário.
export const AUTH_BASE_URL = new InjectionToken<string>('auth_base_url');

/**
 * Qual nome de usuário deve ser considerado admin da aplicação. Este nome
 * deve ser um dos nomes disponíveis na lista de usuários da fakestoreapi
 */
export const ADMIN_USERNAME = new InjectionToken<string>('admin_username');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    {provide: BASE_URL, useValue: 'https://fakestoreapi.com'},
    {provide: AUTH_BASE_URL, useValue: 'https://fakestoreapi.com'},
    {provide: ADMIN_USERNAME, useValue: 'kevinryan'}
  ]
};
