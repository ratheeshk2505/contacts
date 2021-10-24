import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment";
import {Observable} from 'rxjs';


const options={
  withCredential:true,
  headers:new HttpHeaders()
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private route:Router, private http:HttpClient) { }

  getOptions(){
    const token = localStorage.getItem("token")
    let headers = new HttpHeaders()
    if (token){
      headers = headers.append("x-token",token)
      options.headers = headers
    }
    return options
  }

  login(uname:any, pwrd:any){
    const data = {
      uname, pwrd
    }
    return this.http.post(environment.apiURL+'/login', data, options)
  }

  register(pname:any, email:any, phone:any, dob:any, uname:any, pwrd:any){
    const data = {
      pname, email, phone, dob, uname, pwrd
    }
    return this.http.post(environment.apiURL+'/register', data)
  }

  defaultContactImage(call:any){
    const data = {call}
    return this.http.post(environment.apiURL+'/contactimg', data, this.getOptions())
  }

  saveContact(uname:any, uId:any, fname:any, lname:any, email:any, phone:any, dob:any, img:any, label:any){
    const data = {
      uname, uId, fname, lname, email, phone, dob, img, label
    }
    return this.http.post(environment.apiURL+'/save', data, this.getOptions())
  }

  showContacts(uId:any){
    const data={
      uId
    }
    return this.http.post(environment.apiURL+'/show', data, this.getOptions())
  }

  favContacts(uId:any){
    const data={
      uId
    }
    return this.http.post(environment.apiURL+'/fav', data, this.getOptions())
  }

  updateCall(uId:any, eId:any){
    const data={
      uId, eId
    }
    return this.http.post(environment.apiURL+'/update', data, this.getOptions())
  }

  updateContact(uId:any, eId:any,fname:any, lname:any, email:any, phone:any, dob:any, img:any, label:any){
    const data={
      uId, eId, fname, lname, email, phone, dob, img, label
    }
    return this.http.post(environment.apiURL+'/updatecontact', data, this.getOptions())
  }

  deleteContact(uId:any, eId:any){
    const data={
      uId, eId
    }
    return this.http.post(environment.apiURL+'/delete', data, this.getOptions())
  }

 

  // end bracket
}
