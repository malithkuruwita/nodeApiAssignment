import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Shared/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _authService: AuthService) { }

  
  userData:any = {
    username: String
  }
  
  usernameCheck: String

  subscription: Subscription

  ngOnInit() {

    this.getUsername()

    this.subscription = this._authService.getReload().subscribe(data => {
      this.usernameCheck = data.username
      if(this.usernameCheck == null){
        this.userData.username = "My Account"
      }else{
        this.userData.username = this.usernameCheck
      }
    })

  }

  
  getUsername(){
    this.userData.username = this._authService.getUsername()
    if(this.userData.username === null){
      this.userData.username = 'My Account'
    }
  }

}
