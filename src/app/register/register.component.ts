import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm=this.fb.group({
    pname:['',[Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    email:['',[Validators.required, Validators.pattern('[a-z0-9@_.]*')]],
    phone:['',[Validators.required, Validators.pattern('[0-9]*')]],
    dob:['',[Validators.required, Validators.pattern('[0-9_-]*')]],
    uname:['',[Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
    pwrd:['',[Validators.required, Validators.pattern('[a-zA-Z0-9@]*')]]
  })

  dLogin:Date = new Date()

  constructor(private route:Router, private ds:DataService, private fb:FormBuilder) { }

  ngOnInit(): void {
  }

  toggleTheme() {
    var element = document.body;
    element.classList.toggle("light-mode");
 }

  register(){
    var pname=this.registerForm.value.pname
    var email=this.registerForm.value.email
    var phone=this.registerForm.value.phone
    var dob=this.registerForm.value.dob
    var uname=this.registerForm.value.uname
    var pwrd=this.registerForm.value.pwrd
    if(this.registerForm.valid){
      this.ds.register(pname, email, phone, dob, uname, pwrd)
      .subscribe((result:any)=>{
        if (result){
          alert(result.message)
          this.route.navigateByUrl("")
        }
      }, (result:any)=>{
        alert(result.error.message)
      })
    }
    else{
      alert("Invalid Form Details")
    }
  }

}
