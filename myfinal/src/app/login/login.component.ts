import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Shared/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUserData = {}

  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  loginUser(): void{
    this._auth.loginUser(this.loginUserData).subscribe(
      res => {
        console.log(res)
        localStorage.setItem('token', res.token)
        localStorage.setItem('email', res.userData.email)
        localStorage.setItem('username', res.userData.username)
        this._router.navigate(['/best-deals'])
      },
      err => console.log(err)
    )
      
  }



}
