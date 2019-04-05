import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Shared/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _authService: AuthService) { }

  
  userName:String

  ngOnInit() {
    this.getUsername()
  }

  getUsername(){
    this.userName = this._authService.getUsername()
    if(this.userName === null){
      this.userName = 'My Account'
    }
    console.log(this.userName)
  }

}
