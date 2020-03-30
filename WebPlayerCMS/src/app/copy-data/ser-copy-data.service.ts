import { Injectable } from '@angular/core';
import {ConfigAPI} from '../class/ConfigAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SerCopyDataService {
 
  constructor(private http:HttpClient,private cApi:ConfigAPI) { }
  SaveCopySchedule(json:JSON){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = json
    return this.http.post(this.cApi.SaveCopySchedule,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
}
