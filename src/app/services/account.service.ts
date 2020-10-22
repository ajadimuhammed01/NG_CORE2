import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private router: Router) { }
  
  //Url to access our Web API
  private baseUrlLogin: string ="http://localhost:56713/api/account/login";
  //User related properties
  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private UserName = new BehaviorSubject<string>(localStorage.getItem('userName'));
  private UserRole = new BehaviorSubject<string>(localStorage.getItem('userRole'));
    
  //Login Method
  login(username: string, password: string)
  {
    return this.http.post<any>(this.baseUrlLogin, {username, password}).pipe(
      map(result =>{
        if(result && result.token){
          
          this.loginStatus.next(true);
          localStorage.setItem('loginStatus', '1');
          localStorage.setItem('jwt', result.token);
          localStorage.setItem('username', result.username);
          localStorage.setItem('expiration', result.expiration);
          localStorage.setItem('userRole', result.userRole);
          
        }
        return result;
      })
    );
  }

  logout()
  {
    this.loginStatus.next(false);
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('expiration');
    localStorage.setItem('loginStatus', '0');
    this.router.navigate(['/login']);
    console.log("Logged Out Successfully");
  }

  checkLoginStatus() : boolean
  {
    return false;
  }

  getisLoggedIn()
  {
    return this.loginStatus.asObservable();
  }
  getcurrentUserName()
  {
    return this.UserName.asObservable();
  }2222
  getcurrentUserRole()
  {
    return this.UserRole.asObservable();
  }
}
