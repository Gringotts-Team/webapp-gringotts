import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { NewMageComponent } from './new-mage/new-mage.component';
import { MagesListComponent } from './mages-list/mages-list.component'
import { AgGridModule } from 'ag-grid-angular';


/**
 * NgModule that contains components related to pages in the application.
 */
@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent,
    NewMageComponent,
    MagesListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AgGridModule
  ],
  exports: [
    HomeComponent
  ],
})
export class PagesModule { }
