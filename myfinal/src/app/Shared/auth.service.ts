import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _registerUrl = "http://localhost:3000/user/register"
  private _loginUrl = "http://localhost:3000/user/login"

  constructor(private http: HttpClient, private _router: Router) { }

  registerUser(user){
      return this.http.post<any>(this._registerUrl, user)
  }

  loginUser(user){
    return this.http.post<any>(this._loginUrl, user)
  }

  loggedIn(){
    return !!localStorage.getItem('token')
  }

  getToken(){
    return localStorage.getItem('token')
  }

  getUsername(){
    return localStorage.getItem('username')
  }

  logoutUser(){
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('username')
    this._router.navigate(['/deals'])
  }


}
