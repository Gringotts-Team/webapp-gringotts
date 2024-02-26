import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplashPageComponent } from './splash-page/splash-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';


/**
 * NgModule that contains shared components used across the application.
 * This module exports components such as navigation bar, header and footer.
 */
@NgModule({
  declarations: [
    SplashPageComponent,
    NavbarComponent,
    HeaderComponent,
    FooterComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule

  ],
  exports: [
    SplashPageComponent,
    NavbarComponent,
    HeaderComponent,
    FooterComponent
  ],
})
export class SharedModule { }
