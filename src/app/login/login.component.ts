import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private acct: AccountService) { 
    this.loginStatusGet = this.acct.loginStatus;
  } 

  ngOnInit() {
  }

}
