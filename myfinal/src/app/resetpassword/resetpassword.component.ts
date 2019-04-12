import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../Shared/auth.service';
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  setPassword:resetPassword = {
    password:undefined,
    confirmPassword:undefined,
    token:undefined
  }

  getValidation:any = []


  token: any

  constructor(private route: ActivatedRoute, private _auth:AuthService,private _router: Router) { }


  ngOnInit() {
    this.token = this.route.snapshot.params.id;
    this.setPassword.token = this.token
    console.log(this.token)
  }

  resetPassword(): void{
    this._auth.ConfirmReset(this.setPassword).subscribe(
      res =>{
        if(res.token !== undefined && res.token !== null){
          localStorage.setItem('token', res.token)
          localStorage.setItem('email', res.userData.email)
          localStorage.setItem('username', res.userData.username)
          this._auth.sendReload(res.userData.username)
          this._router.navigate(['/deals'])
          }else{
            this.getValidation = res
          alert(this.getValidation.message)
          }
        },
      err => {
        console.log(err)
      }
    )
  }


}

export class resetPassword{
  password:String;
  confirmPassword:String;
  token:String;
}


