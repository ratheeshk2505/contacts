// import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user:any
  msg:any
  dLogin:Date = new Date()
  tempcontacts:any
  contacts:any
  uId = localStorage.getItem("uId")
  allcount:any
  favcount:any
  eId:any

  fname:any
  lname:any
  email:any
  phone:any
  dob:any
  label=false

  // updateVariables = [fname, hname, ]
  

  saveForm=this.fb.group({
    fname:['',[Validators.required, Validators.pattern('[a-zA-Z. ]*')]],
    lname:['',[Validators.pattern('[a-zA-Z. ]*')]],
    email:['',[Validators.required, Validators.pattern('[a-z0-9@_.]*')]],
    phone:['',[Validators.required, Validators.pattern('[0-9]*')]],
    dob:['',[Validators.pattern('[0-9_-]*')]],
    // imgPath:['',[Validators.required, Validators.pattern('[a-zA-Z0-9@]*')]],
    label:[false]
  })

  constructor(private route:Router, private ds:DataService, private fb:FormBuilder) {
    this.user = localStorage.getItem('currUser')
    this.favCount()
    this.populate()
    
   }

  ngOnInit(): void {
    if(!localStorage.getItem("token")){
      alert("Access Denied. Please Login")
      this.route.navigateByUrl("")
    }
  }

  logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("currUser")
    localStorage.removeItem("currUname")
    localStorage.removeItem("uId")
    this.route.navigateByUrl("")
  }

  myFunction() {
    var element = document.body;
    element.classList.toggle("light-mode");
 }

  updateCall(event:any){
    this.eId = event.target.parentElement.id    
    this.ds.updateCall(this.uId,this.eId)
        .subscribe((result:any)=>{
          if(result){
            this.fname = result.contacts.fname
            this.lname = result.contacts.lname
            this.email = result.contacts.email
            this.phone = result.contacts.phone
            this.dob = result.contacts.dob
            this.label = result.contacts.label
          }
        }, (result:any)=>{
            alert(result.error.message)
          }
        )
  }

  deleteContact(){
    alert("Are You Sure Want To Delete?")
    this.ds.deleteContact(this.uId, this.eId)
    .subscribe((result:any)=>{
      if(result){
        alert(result.message)
        this.populate()
        this.favCount()
      }
      
    }, (result:any)=>{
      alert(result.error.message)
    })
  }

  updateContact(){
    var eId = this.eId
    var uId = localStorage.getItem("uId")
    var fname=this.fname
    var lname=this.lname
    var email=this.email
    var phone=this.phone
    var dob=this.dob
    var label=this.label
        
       // uname, uId, fname, lname, email, phone, dob, imgPath, label
      this.ds.updateContact(uId, eId, fname, lname, email, phone, dob, label)
      .subscribe((result:any)=>{
        if (result){
          alert(result.message)
          this.populate()
          this.favCount()
        }
      }, (result:any)=>{
        alert(result.error.message)
      }) 
  }
  

  populate(){
    this.ds.showContacts(this.uId)
    .subscribe((result:any)=>{
      this.contacts = result.contacts
      this.allcount = result.contacts.length
      if(result.contacts.length==0){
        this.msg=result.messageNo
        this.contacts=""
      }
      else{
        this.msg=result.messageYes
      }      
    },((result:any)=>{
      this.msg=result.error.message
    }))
  }

  favContacts(){
    this.ds.favContacts(this.uId)
    .subscribe((result:any)=>{
      this.contacts = result.contacts 
      this.favcount = result.contacts.length    
      if(result.contacts.length==0){
        this.msg=result.messageNo
      }
      else{
        this.msg=result.messageYes
      }      
    },((result:any)=>{
      this.msg=result.error.message
    }))

  }

  favCount(){
    this.ds.favContacts(this.uId)
    .subscribe((result:any)=>{
      this.favcount = result.contacts.length    
    },((result:any)=>{
      this.msg=result.error.message
    }))

  }

  saveContact(){
    var uname = localStorage.getItem("currUname")
    var uId = localStorage.getItem("uId")
    var fname=this.saveForm.value.fname
    var lname=this.saveForm.value.lname
    var email=this.saveForm.value.email
    var phone=this.saveForm.value.phone
    var dob=this.saveForm.value.dob
    var label=this.saveForm.value.label 
    
    if(this.saveForm.valid){
       // uname, uId, fname, lname, email, phone, dob, imgPath, label
      this.ds.saveContact(uname, uId, fname, lname, email, phone, dob, label)
      .subscribe((result:any)=>{
        if (result){
          alert(result.message)
          this.saveForm.reset()
          this.populate()
          this.favCount()
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
