import { Injectable } from '@angular/core';
import {ConfigAPI} from '../class/ConfigAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(private http:HttpClient,private cApi:ConfigAPI, public auth:AuthService) { }
  FillCombo(query:string){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ Query: query });
    return this.http.post(this.cApi.FillQueryCombo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillTokenInfo(cid: string) {

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ clientId: cid, UserId: localStorage.getItem('UserId') });
    return this.http.post(this.cApi.FillTokenInfo, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  CommanSearch(type,text,mediaType,IsExplicit,PageNo,ClientId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ searchType: type,searchText:text,mediaType:mediaType, 
      IsRf:localStorage.getItem('IsRf'), ClientId:ClientId,
      IsExplicit:IsExplicit,IsAdmin:false,DBType:localStorage.getItem('DBType'),
      ContentType:localStorage.getItem('ContentType'),PageNo:PageNo });
    return this.http.post(this.cApi.CommanSearch,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DeleteMachineTitle(Tokenid,Titleid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ Tokenid: Tokenid,titleid:Titleid});
    return this.http.post(this.cApi.DeleteMachineTitle,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  GetMachineAnnouncement(Tokenid: string) {

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ Tokenid: Tokenid });
    return this.http.post(this.cApi.GetMachineAnnouncement, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  SaveMachineAnnouncement(TokenId,titleid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ TokenId: TokenId,titleid:titleid});
    
    return this.http.post(this.cApi.SaveMachineAnnouncement,params,{headers:headers})
     .pipe((data=>{return data;}))
  } 
  UpdateMachineAnnouncementSRNo(tokenId, json){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ tokenId: tokenId,lstTitleSR:json});
    console.log(params);
    return this.http.post(this.cApi.UpdateMachineAnnouncementSRNo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  SaveKeyboardAnnouncement(TokenId,splPlaylistId){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ TokenId: TokenId,splPlaylistId:splPlaylistId});
    
    return this.http.post(this.cApi.SaveKeyboardAnnouncement,params,{headers:headers})
     .pipe((data=>{return data;}))
  } 
  GetKeyboardAnnouncement(Tokenid: string) {

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var params = JSON.stringify({ Tokenid: Tokenid });
    return this.http.post(this.cApi.GetKeyboardAnnouncement, params, { headers: headers })
      .pipe((data => { return data; }))
  }
  DeleteKeyboardAnnouncement(id){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ id: id});
    return this.http.post(this.cApi.DeleteKeyboardAnnouncement,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
}