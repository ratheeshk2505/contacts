import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm=this.fb.group({
    uname:['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
    pwrd:['', [Validators.required, Validators.pattern('[a-zA-Z0-9@]*')]]
  })

  dLogin:Date = new Date()

  constructor(private route:Router, private ds:DataService, private fb:FormBuilder) { }

  ngOnInit(): void {
  }

  myFunction() {
    var element = document.body;
    element.classList.toggle("light-mode");
 }

  login(){
    var uname=this.loginForm.value.uname
    var pwrd=this.loginForm.value.pwrd
      if(this.loginForm.valid){          
        this.ds.login(uname,pwrd)
        .subscribe((result:any)=>{
          if(result){
            localStorage.setItem("token",result.token)
            localStorage.setItem("currUser",result.currUser)
            localStorage.setItem("currUname",result.currUserName)
            localStorage.setItem("uId",result.userId)
            alert(result.message)
            this.route.navigateByUrl("dashboard")
          }
        }, (result:any)=>{
            alert(result.error.message)
          }
        )
      }
      else{
        alert("Invalid Form Details")
      }
  }

}
