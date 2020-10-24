import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { Key } from 'protractor';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  constructor(
        private fb: FormBuilder,
        private acct: AccountService,
        private router: Router
  ) { }
  
  //Properties
  insertForm: FormGroup;
  username: FormControl;
  password: FormControl;
  cpassword: FormControl;
  email: FormControl;

  //Custom Validator
  MustWatch(passwordControl: AbstractControl): ValidatorFn
  {
      return (cpasswordControl: AbstractControl) : {[Key: string] : boolean} | null  =>
      {
        // return null if controls havent initialised yet
        if(!passwordControl && !cpasswordControl)
        {
          return null;
        }
        // return null if another validator has already found an error on the matchingControl
        if(cpasswordControl.hasError && !passwordControl.hasError)
        {
          return null;
        }
        //set error on matchingControl if validation false
        if(passwordControl.value !== cpasswordControl.value)
        {
           return {'mustMatch': true}
        }
        else {
          return null;
        }
      }
  }

  ngOnInit() {
    this.username = new FormControl('', [Validators.required, Validators.maxLength[10], Validators.minLength[5]]);
    this.password = new FormControl('', [Validators.required, Validators.maxLength[10], Validators.minLength[5]]);
    this.cpassword = new FormControl('', [Validators.required, this.MustWatch(this.password)]);
    this.email = new FormControl('', [Validators.required]);
  }
  

}
