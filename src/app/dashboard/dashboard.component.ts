// import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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

  fname=""
  lname=""
  email:any
  phone:any
  dob:any
  label=false
  file:any
  img:any
  imgPath:any
  url:any
  def_url:any
  

  saveForm=this.fb.group({
    fname:['',[Validators.required, Validators.pattern('[a-zA-Z. ]*')]],
    lname:['',[Validators.pattern('[a-zA-Z. ]*')]],
    email:['',[Validators.required, Validators.pattern('[a-z0-9@_.]*')]],
    phone:['',[Validators.required, Validators.pattern('[0-9]*')]],
    dob:['',[Validators.pattern('[0-9_-]*')]],
    label:[false]
  })
  

  constructor(private route:Router, private ds:DataService, private fb:FormBuilder, private http:HttpClient) {
    this.user = localStorage.getItem('currUser')
    this.favCount()
    this.populate()
    this.defaultContactImage()
    
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

  toggleTheme() {
    var element = document.body;
    element.classList.toggle("light-mode");
 }

  defaultContactImage(){
    let call = true;
    this.ds.defaultContactImage(call)
    .subscribe((result:any)=>{
      this.url = result.imgurl
      this.imgPath = result.imgurl
      this.def_url = result.imgurl
    })
  }

  updateCall(event:any){
    if(this.allcount<=1){
      this.tempcontacts=""
    }
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
            this.url = result.contacts.img
          }
        }, (result:any)=>{
            alert(result.error.message)
          }
        )
  }

  updateContact(){
    var eId = this.eId
    var uId = localStorage.getItem("uId")
    var fname=this.fname.toLowerCase()
    var lname=this.lname.toLowerCase()
    var email=this.email
    var phone=this.phone
    var dob=this.dob
    var label=this.label
    var img=this.url  
    
      
      this.ds.updateContact(uId, eId, fname, lname, email, phone, dob, img, label)
      .subscribe((result:any)=>{
        if (result){
          alert(result.message)
          this.populate()
          this.favCount()
          this.imgPath=this.def_url
          this.url=this.def_url
        }
      }, (result:any)=>{
        alert(result.error.message)
      }) 
  }

  deleteContact(){
    if(confirm("Are You Sure Want To Delete..?")){
      this.contacts=this.tempcontacts
      this.ds.deleteContact(this.uId, this.eId)
      .subscribe((result:any)=>{
        if(result){
          alert(result.message)
          this.populate();
          this.favCount();
        }
      }, (result:any)=>{
        alert(result.error.message)
      })
    }
  }
  

  populate(){
    this.ds.showContacts(this.uId)
    .subscribe((result:any)=>{
      if(result.contacts.length==0){
        this.allcount = result.contacts.length
        this.msg=result.messageNo
        this.contacts=""
      }
      else{
        this.contacts = result.contacts
        this.allcount = result.contacts.length
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

  onChangeImg(event:any){
    if(event.target.files){
      this.file=event.target.files[0]
      var reader = new FileReader()      
      reader.readAsDataURL(event.target.files[0])
      reader.onload=(event:any)=>{
        this.url=event.target.result
      }
    }
    this.uploadImg()
  }
  
  uploadImg(){ 
    const files = this.file
    const formData = new FormData()
    formData.append('img', files, files.name)    
    this.http.post('http://localhost:8080/upload', formData)
      .subscribe((result:any) => {
        this.imgPath = result.imgurl
        // console.log('upload success');
        // console.log(result.imgurl);
        
        
      },
       (result)=>{
        alert(result.error.message)
      });
  }

  saveContact(){
    var uname = localStorage.getItem("currUname")
    var uId = localStorage.getItem("uId")
    var fname=this.saveForm.value.fname.toLowerCase()
    var lname=this.saveForm.value.lname.toLowerCase()
    var email=this.saveForm.value.email
    var phone=this.saveForm.value.phone
    var dob=this.saveForm.value.dob
    var label=this.saveForm.value.label 
    var img=this.imgPath
    console.log(img);
    
    if(this.saveForm.valid){
      this.ds.saveContact(uname, uId, fname, lname, email, phone, dob, img, label)
      .subscribe((result:any)=>{
        if (result){
          alert(result.message)
          this.saveForm.reset()
          this.defaultContactImage()
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
