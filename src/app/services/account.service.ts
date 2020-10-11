import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }
  
  //Url to access our Web API
  private baseUrlLogin: string ="http://localhost:56713/api/account/login";
  //User related properties
  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private UserName = new BehaviorSubject<string>(localStorage.getItem('username'));
  private UserRole = new BehaviorSubject<string>(localStorage.getItem('userRole'));
    
  //Login Method
  login(username: string, password: string)
  {
    return this.http.post<any>(this.baseUrlLogin, {username, password}).pipe();
  }

  checkLoginStatus() : boolean
  {
    return false;
  }
}
