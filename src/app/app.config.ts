import { ApplicationConfig, DEFAULT_CURRENCY_CODE, InjectionToken, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { loadingIndicatorInterceptor } from './core/interceptors/loading-indicator-interceptor';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig } from '@angular/material/snack-bar';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';

registerLocaleData(localePtBr, 'pt-BR');

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

const matSnabarConfig : MatSnackBarConfig = {
  duration: 1000,
  verticalPosition: 'bottom',
  horizontalPosition: 'right'
};

export const appConfig: ApplicationConfig = {
  providers: [
    //Angular config
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor, loadingIndicatorInterceptor])),
    provideRouter(routes),
    {provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    {provide: LOCALE_ID, useValue: 'pt-BR'},

    //Angular Material config
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: matSnabarConfig},
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},

    //App config
    {provide: BASE_URL, useValue: 'https://fakestoreapi.com'},
    {provide: AUTH_BASE_URL, useValue: 'https://fakestoreapi.com'},
    // Credenciais de admin (para testes):
    // username: kevinryan
    // password: kev02937@
    {provide: ADMIN_USERNAME, useValue: 'kevinryan'}
  ]
};
