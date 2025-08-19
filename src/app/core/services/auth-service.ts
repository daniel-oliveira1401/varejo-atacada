import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, signal, WritableSignal } from '@angular/core';
import { LoginRequest } from '../../shared/models/api/login-request';
import { LoginResponse } from '../../shared/models/api/login-response';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user';
import { ADMIN_USERNAME, AUTH_BASE_URL } from '../../app.config';

type TokenPayload = {
  sub: number,
  user : string,
  iat: number
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private isLoggedIn : WritableSignal<boolean> = signal(false);

  constructor(
    private readonly httpClient : HttpClient,
    private readonly router : Router,
    @Inject(AUTH_BASE_URL) private readonly baseUrl : string,
    @Inject(ADMIN_USERNAME) private readonly adminUsername : string
  ){}

  isAdmin(){
    const user = this.getLoggedInUser();
    if(!user) return false;

    return user.username == this.adminUsername;
  }

  getLoggedInUser() : User | undefined {

    const tokenPayload = this.readTokenPayload();
    
    if(!tokenPayload) return undefined;
    
    return new User(tokenPayload.sub, tokenPayload.user);

  }

  userIsLoggedIn(){
    let token = this.getTokenString();
    
    if(token)
      this.isLoggedIn.set(true);
    else
      this.isLoggedIn.set(false);

    return this.isLoggedIn.asReadonly();
  }

  login(username : string, password : string){

    this.httpClient.post<LoginResponse>(this.baseUrl + "/auth/login", new LoginRequest(username, password)).subscribe({
      next: (res)=>{
        
        this.setToken(res.token);

        this.isLoggedIn.set(true);

        this.router.navigate(["/home"]);

      },
      error: (error)=>{
        console.error('Não foi possível fazer login');
      }
    })
    
  }

  logout(){

    this.discardToken();

    this.isLoggedIn.set(false);

    this.router.navigate(["/home"]);
  }

  getTokenString() : string {

    let token = localStorage.getItem(this.TOKEN_KEY);

    token ??= '';

    return token;
  }

  private discardToken(){
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private setToken(token : string) : void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private readTokenPayload() : TokenPayload | undefined{
    const tokenString = this.getTokenString();
    
    if(!tokenString) return undefined;

    const [header, payload, signature] = tokenString.split(".");

    try{

      return JSON.parse(atob(payload));

    }catch(error){
      
      return undefined;

    }
    
  }

}
