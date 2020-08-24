import { Component, OnInit } from '@angular/core';
import { ConfigAPI } from '../class/ConfigAPI';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { MachineService } from '../machine-announcement/machine.service';
import { PlaylistLibService } from '../playlist-library/playlist-lib.service';
@Component({
  selector: 'app-keyboardannouncement',
  templateUrl: './keyboardannouncement.component.html',
  styleUrls: ['./keyboardannouncement.component.css']
})
 

export class KeyboardannouncementComponent implements OnInit {
  public loading = false;
  cmbSearchCustomer: number;
  cmbSearchToken; 
  SearchTokenList;
  TokenList=[];
  CustomerList: any[];
  SavedList;
  cmbFormat;
  cmbPlaylist;
  FormatList:any[];
  PlaylistList:any[];
  SongsList;
  tid;
   
  plArray = [];
  selectedRow;
  dropdownSettings = {};
  cmbToken;
  cmbCustomer;
  chkAll:boolean=false;
  constructor(public toastr: ToastrService,  private cf: ConfigAPI,
     config: NgbModalConfig, private modalService: NgbModal, public auth:AuthService, 
     private mService:MachineService, private pService: PlaylistLibService) {
      config.backdrop = 'static';
    config.keyboard = false;
     }

  ngOnInit(): void {
    $("#dis").attr('unselectable', 'on');
    $("#dis").css('user-select', 'none');
    $("#dis").on('selectstart', false);

    this.FillClient();
  }
  FillClient() {
    var q = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    q = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');

    this.loading = true;
    this.mService.FillCombo(q).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
         
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeSearchCustomer(id) {
    this.cmbSearchToken=[];
    this.SearchTokenList=[];
    this.loading = true;
    this.mService.FillTokenInfo(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.SearchTokenList = JSON.parse(returnData);
        this.loading = false;
        this.dropdownSettings = {
          singleSelection: false,
          text: "",
          idField: 'tokenid',
          textField: 'tokenCode',
          selectAllText: 'All',
          unSelectAllText: 'All',
          itemsShowLimit: 2
        };
        this.FillFormat();
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillFormat() {
    this.loading = true;
    var qry = "";
    qry = "select max(sf.Formatid) as id , sf.formatname as displayname from tbSpecialFormat sf left join tbSpecialPlaylistSchedule_Token st on st.formatid= sf.formatid";
    qry = qry + " left join tbSpecialPlaylistSchedule sp on sp.pschid= st.pschid  where ";
    qry = qry + " (dbtype='"+ localStorage.getItem('DBType') +"' or dbtype='Both') and  (st.dfclientid=" + this.cmbSearchCustomer + " OR sf.dfclientid=" + this.cmbSearchCustomer + ") group by  sf.formatname";

    this.mService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.FormatList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeToken(id){
    this.loading = true;
    this.mService.GetKeyboardAnnouncement(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.SavedList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeFormat(id){
    this.chkAll=false;
    this.PlaylistList = [];
    this.loading = true;
    this.pService.Playlist(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.PlaylistList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
   


  selectWithShift(rowIndex) {
    var lastSelectedRowIndexInSelectedRowsList = this.selectedRowsIndexes.length - 1;
    var lastSelectedRowIndex = this.selectedRowsIndexes[lastSelectedRowIndexInSelectedRowsList];
    var selectFromIndex = Math.min(rowIndex, lastSelectedRowIndex);
    var selectToIndex = Math.max(rowIndex, lastSelectedRowIndex);
    this.selectRows(selectFromIndex, selectToIndex);
  }
  selectRows(selectFromIndex, selectToIndex) {
    for (var rowToSelect = selectFromIndex; rowToSelect <= selectToIndex; rowToSelect++) {
      this.select(rowToSelect);
    }
  }
  setMultipleClickedRow = function (event, index, songLst, lock) {
    if (event.ctrlKey) {
      // this.selectedRowsIndexes=[];
      this.changeSelectionStatus(index);
    }
    else if (event.shiftKey) {
      this.selectWithShift(index);
    } else {
      this.selectedRowsIndexes = [index];
    }
    return;

  }
  changeSelectionStatus(rowIndex) {
    if (this.isRowSelected(rowIndex)) {
      this.unselect(rowIndex);
    } else {
      this.select(rowIndex);
    }
  }

  isRowSelected(rowIndex) {
    return this.selectedRowsIndexes.indexOf(rowIndex) > -1;
  };
  selectedRowsIndexes = [];

  unselect(rowIndex) {
    var rowIndexInSelectedRowsList = this.selectedRowsIndexes.indexOf(rowIndex);
    var unselectOnlyOneRow = 1;
    this.selectedRowsIndexes.splice(rowIndexInSelectedRowsList, unselectOnlyOneRow);
  }
  select(rowIndex) {
    if (!this.isRowSelected(rowIndex)) {
      this.selectedRowsIndexes.push(rowIndex)
    }
  }


  openTitleDeleteModal(mContent, id) {

    this.tid= id;
    this.modalService.open(mContent);
  }

  DeleteKeyboardAnnouncement() {
    this.loading = true;
    this.mService.DeleteKeyboardAnnouncement(this.tid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Deleted", 'Success!');
          this.loading = false;
          this.onChangeToken(this.cmbToken);
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
 
Clear(){
  this.cmbSearchToken=[];
  this.cmbFormat="0";
  this.cmbPlaylist="0";
  this.SongsList=[];
  this.chkAll=false;
}
SaveAnnouncement(){
    

    //this.getSelectedRows();
 
    if (this.cmbSearchCustomer == 0) {
      this.toastr.error("Please select a customer", '');
      return;
    }

    if (this.cmbSearchToken.length == '0') {
      this.toastr.error("Please select a player", '');
      return;
    }
    if (this.cmbFormat == 0) {
      this.toastr.error("Please select a format", '');
      return;
    }
    if (this.cmbPlaylist == 0) {
      this.toastr.error("Please select a playlist", '');
      return;
    }
     
    this.loading = true;
    this.mService.SaveKeyboardAnnouncement(this.cmbSearchToken,this.cmbPlaylist).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.loading = false;

        if (obj.Responce == "1") {
          this.toastr.info("Saved", '');
          this.Clear();
          this.selectedRowsIndexes = [];
          
          //this.onChangeToken(this.cmbSearchToken);
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        }
       
       
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }  
  onChangeCustomer(id) {
    this.TokenList=[];
    this.SavedList=[];
    this.loading = true;
    this.mService.FillTokenInfo(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.TokenList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  
}