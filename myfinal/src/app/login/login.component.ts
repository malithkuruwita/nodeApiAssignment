import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  someCondition:Boolean = false
  condition:Boolean = false
  emailCondition = true
  returnUrl:any
  
  ResetUserData = {}
  errorData = []
  resetData:any = []

  constructor(private _auth: AuthService, private _router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.resetForm()
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  resetForm(form? : NgForm) {
    if(form !=null)
    form.reset();
    this._auth.selectedUser = {
      method: 'local',
      local:{
        username: '',
        email: '',
        password: ''
      }

    }
  }


  //call show notification model
  getClass(){
    return this.someCondition ? 'displayclass' : 'hideclass';
  }
  //hide notofication model
  hideClass(){
    this.someCondition = false
    this.getClass()
  }


  //call forgot model
  getForClass(){
    return this.condition ? 'displayForgotPasswordModel' : 'hideForgotPasswordModel';
  }
  //call hide forgot model
  hideForClass(){
    this.resetData = undefined
    this.condition = false
    this.getForClass()
  }
  //call show forgot model
  showForClass(){
    this.emailCondition = true
    this.condition = true
    this.hideemailsec()
    this.getForClass()
  }

  
  //hide email section
  hideemailsec(){
    return this.emailCondition ? 'showEmailSec' : 'hideEmailSec';
  }

  loginUser(form: NgForm): void{
    let user = {
      method: form.value.method,
      local: {
        email: form.value.email,
        password: form.value.password
      }
    }
    this._auth.loginUser(user).subscribe(
      res => {
        this.resetForm(form)
        console.log(res)
        if(res.token !== undefined && res.token !== null){
        localStorage.setItem('token', res.token)
        localStorage.setItem('email', res.userData.email)
        localStorage.setItem('username', res.userData.username)
        this._auth.sendReload(res.userData.username)
        this._router.navigateByUrl(this.returnUrl)
        }
      },
      err => {
          this.errorData = err
          this.someCondition = true
          this.getClass() 
      }
    ) 
  }


  ResetUser(){
    this._auth.ResetUser(this.ResetUserData).subscribe(
      res =>{
          this.resetData = res
          if(this.resetData.status == true){
            this.emailCondition = false
            this.hideemailsec()
            console.log('inside')
          }
          console.log(this.resetData)
      },
      err => {
          this.resetData = err
          console.log(this.resetData)
      }
    )
  }



}
