import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'login',
        loadComponent: ()=> import('./features/login/login-component/login-component').then((c)=> c.LoginComponent)
    },
    {
        path: 'home',
        loadComponent: ()=> import('./features/home/home-component/home-component').then((c)=> c.HomeComponent)
    },
    {
        path: 'product/:id',
        loadComponent: ()=> import('./features/product/product-detail-component/product-detail-component').then((c)=> c.ProductDetailComponent)
    },
    {
        path: 'cart',
        loadComponent: ()=> import('./features/cart/cart-component/cart-component').then((c)=> c.CartComponent),
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        loadComponent: ()=> import('./features/admin/admin-component/admin-component').then((c)=> c.AdminComponent),
        canActivate: [authGuard, adminGuard]
    },
    {
        path: "**",
        pathMatch: 'full',
        redirectTo: 'home'
    }
];
