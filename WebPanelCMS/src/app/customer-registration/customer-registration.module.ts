import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerRegistrationComponent } from './customer-registration.component';
import { CustomerRegistrationRoutes } from './customer-registration.routes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule  } from 'ngx-loading';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';

import { 
  OwlDateTimeModule, 
  OwlNativeDateTimeModule ,OWL_DATE_TIME_FORMATS,OWL_DATE_TIME_LOCALE ,DateTimeAdapter
} from 'ng-pick-datetime';
import {  MomentDateTimeAdapter } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';
import { DataTablesModule } from 'angular-datatables';
export const MY_CUSTOM_FORMATS = {
  parseInput: 'LL LT',
  fullPickerInput: 'LL LT',
  datePickerInput: 'DD-MMM-YYYY',
  timePickerInput: 'HH:mm',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMM YYYY',
};

@NgModule({
  declarations: [CustomerRegistrationComponent],
  exports:[CustomerRegistrationComponent],
  imports: [
    RouterModule.forChild(CustomerRegistrationRoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    Ng2SearchPipeModule,
    //MenuListModule, 
    //TokenInfoModule
    //PlayerLogModule
     
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DataTablesModule
  ],
  providers:[{provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
  {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS}]
})
export class CustomerRegistrationModule { }
