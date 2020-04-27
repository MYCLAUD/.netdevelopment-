import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule  } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { CopyDataComponent } from './copy-data.component';
import { CopyDataRoutes } from './copy-data.routes';

@NgModule({
  declarations: [CopyDataComponent],
  exports:[CopyDataComponent],
  imports: [
    RouterModule.forChild(CopyDataRoutes),
    CommonModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    Ng2SearchPipeModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class CopyDataModule { }
