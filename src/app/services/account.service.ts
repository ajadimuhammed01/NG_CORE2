import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, BehaviorSubject, from} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private router: Router) { }
  
  //Url to access our Web API
  private baseUrlLogin: string ="http://localhost:62900/api/account/login";

  private baseUrlRegister: string ="http://localhost:62900/api/account/register";
  //User related properties
  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private UserName = new BehaviorSubject<string>(localStorage.getItem('username'));
  private UserRole = new BehaviorSubject<string>(localStorage.getItem('userRole'));
    
  //Login Method
  login(username: string, password: string)
  {
    return this.http.post<any>(this.baseUrlLogin, {username, password}).pipe(
      map(result =>{
        if(result && result.token){
          
          this.loginStatus.next(true);
          localStorage.setItem('password', result.password)
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

  //Register Method
  register(username: string, password: string, email: string)
  {
    return this.http.post<any>(this.baseUrlRegister, {username, password, email}).pipe(map(result => {
      //registration was successful
      return result;
    }, error =>
    {
      return error;
    }
    ));
  }

  logout()
  {
    this.loginStatus.next(false);
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('expiration');
    localStorage.setItem('loginStatus', '0');
    this.router.navigate(['/Login']);
    console.log("Logged Out Successfully");
  }

  checkLoginStatus() : boolean
  {

    const token = localStorage.getItem('jwt');
   
    const decoded = jwt_decode(token);

    
    var loginCookie = localStorage.getItem("loginStatus");

     if(loginCookie == "1")
    {
       if((<any>decoded).exp === undefined)
      {
          return false;
      }

      const date = new Date(0);

      let tokenExpDate = date.setUTCDate((<any>decoded).exp);
      
      
      if(tokenExpDate.valueOf() > new Date().valueOf())
      {
        return true;
      }

    
      console.log("NEW DATE" + new Date().valueOf());
      console.log("Token Date" + tokenExpDate.valueOf());

      return false; 
    }  

    return false;
  }

  get isLoggedIn()
  {
    return this.loginStatus.asObservable();
  }
  get currentUserName()
  {
    return this.UserName.asObservable();
  }
  get currentUserRole()
  {
    return this.UserRole.asObservable();
  }
}
