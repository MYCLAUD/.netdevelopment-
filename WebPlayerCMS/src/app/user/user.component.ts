import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastsManager } from 'ng6-toastr';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPlayService } from '../instant-play/i-play.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  uid;
  public loading = false;
  TokenList = [];
  UserList = [];
  Userform: FormGroup;
  submitted = false;
  TokenSelected = [];
  currentJustify = 'justified';
  searchText;
  IsAdminLogin: boolean = false;
  CustomerList = [];
  did;
  constructor(private formBuilder: FormBuilder, public toastr: ToastsManager, vcr: ViewContainerRef,
    config: NgbModalConfig, private modalService: NgbModal, private ipService: IPlayService) {
    this.toastr.setRootViewContainerRef(vcr);
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    if (localStorage.getItem('dfClientId') == "6") {
      this.did=localStorage.getItem('dfClientId');
      this.IsAdminLogin = true;
      this.FillClientList();
    }
    else{
      this.did=localStorage.getItem('dfClientId');
    this.FillPlayer(this.did);
    }
    this.Userform = this.formBuilder.group({
      UserName1: ["", Validators.required],
      Password1: ["", Validators.required],
      chkDashboard: [true],
      chkPlayerDetail: [false],
      chkPlaylistLibrary: [false],
      chkScheduling: [false],
      chkAdvertisement: [false],
      chkInstantPlay: [false],
      chkDeleteSong: [false],
      lstToken: [this.TokenSelected],
      id: ["0"],
      dfClientid: [this.did],
      Responce: ["0"]
    });
    
  }
  FillClientList() {
    this.loading = true;
    var str = "";
    str = "select DFClientID as id,  ClientName as displayname from DFClients where CountryCode is not null and DFClients.IsDealer=1 order by RIGHT(ClientName, LEN(ClientName) - 3)";
    this.ipService.FillCombo(str).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
       // this.FillPlayer(localStorage.getItem('dfClientId'));
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded ,support team will get back to you soon.", '');
          this.loading = false;
        })
  }
  get f() { return this.Userform.controls; }
  onSubmitUser() {
    this.submitted = true;
    if (this.Userform.invalid) {
      return;
    }
    if ((this.f.chkDashboard.value == false) && (this.f.chkPlayerDetail.value == false) && (this.f.chkPlaylistLibrary.value == false) &&
      (this.f.chkScheduling.value == false) && (this.f.chkAdvertisement.value == false) && (this.f.chkInstantPlay.value == false)&& (this.f.chkDeleteSong.value == false)) {
      this.toastr.error("Please select a user rights");
      return;
    }
    if (this.TokenSelected.length == 0) {
      this.toastr.error("Please select a player");
      return;
    }

    this.Userform.get('dfClientid').setValue(this.did);
this.loading = true;

this.ipService.SaveUpdateUser(this.Userform.value).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
          this.Refresh();
          this.FillUserList(this.did);
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded ,support team will get back to you soon.", '');
          this.loading = false;
        }
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded ,support team will get back to you soon.", '');
          this.loading = false;
        })
  }
  Refresh() {
    this.TokenList = [];
    this.TokenSelected = [];
    this.f.UserName1.setValue("");
    this.f.Password1.setValue("");
    this.f.chkDashboard.setValue(true);
    this.f.chkPlayerDetail.setValue(false);
    this.f.chkPlaylistLibrary.setValue(false);
    this.f.chkScheduling.setValue(false);
    this.f.chkAdvertisement.setValue(false);
    this.f.chkInstantPlay.setValue(false);
    this.f.chkDeleteSong.setValue(false);
    this.f.lstToken.setValue(this.TokenSelected);
    this.f.id.setValue("0");
    this.f.dfClientid.setValue(this.did);
 
    this.FillPlayer(this.did);
  }
  SelectToken(fileid, event) {
    if (event.target.checked) {
      this.TokenSelected.push(fileid);
    }
    else {
      const index: number = this.TokenSelected.indexOf(fileid);
      if (index !== -1) {
        this.TokenSelected.splice(index, 1);
      }
    }

  }
  FillPlayer(id) {
    this.loading = true;
    this.ipService.FillPlayerUsers(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        
        this.TokenList = JSON.parse(returnData);
        this.loading = false;
        this.FillUserList(id);
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded ,support team will get back to you soon.", '');
          this.loading = false;
        })
  }
  FillUserList(id) {
    this.loading = true;
    this.ipService.FillUserList(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.UserList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded ,support team will get back to you soon.", '');
          this.loading = false;
        })
  }
  onClickEditUser(id) {
    this.loading = true;
    this.ipService.EditUser(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);

        var obj = JSON.parse(returnData);
        this.TokenList = obj.lstTokenInfo;
        this.TokenSelected = obj.lstToken;
        this.f.UserName1.setValue(obj.UserName1);
        this.f.Password1.setValue(obj.Password1);
        this.f.chkDashboard.setValue(true);
        this.f.chkPlayerDetail.setValue(obj.chkPlayerDetail);
        this.f.chkPlaylistLibrary.setValue(obj.chkPlaylistLibrary);
        this.f.chkScheduling.setValue(obj.chkScheduling);
        this.f.chkAdvertisement.setValue(obj.chkAdvertisement);
        this.f.chkInstantPlay.setValue(obj.chkInstantPlay);
        this.f.chkDeleteSong.setValue(obj.chkDeleteSong);
        this.f.lstToken.setValue(this.TokenSelected);
        this.f.id.setValue(obj.id);
        this.f.dfClientid.setValue(this.did);

        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded ,support team will get back to you soon.", '');
          this.loading = false;
        })
  }
  openDeleteDeleteModal(mContent, id) {
    this.uid = id;
    this.modalService.open(mContent, { centered: true });
  }
  DeleteUser() {
    this.loading = true;
    this.ipService.DeleteUser(this.uid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.loading = false;
          this.toastr.info("User Deleted", '');
          this.FillUserList(this.did);
        }
        else {
          this.loading = false;
          this.toastr.error("Apologies for the inconvenience.The error is recorded ,support team will get back to you soon.", '');
        }

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded ,support team will get back to you soon.", '');
          this.loading = false;
        })
  }

  onChangeCustomer(deviceValue) {
    this.did= deviceValue;
    this.FillPlayer(deviceValue);
  }

}
