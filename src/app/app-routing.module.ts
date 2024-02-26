import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { loginGuard, permissionsGuard, overseerGuard } from './core/authorize/auth.guard';
import { NewMageComponent } from './pages/new-mage/new-mage.component';
import { MagesListComponent } from './pages/mages-list/mages-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate:[loginGuard] },
  { path: 'home', component: HomeComponent, canActivate:[permissionsGuard] },
  { 
    path: 'mages', 
    canActivate:[permissionsGuard],
    children: [
      { path: 'new-mage', component: NewMageComponent, canActivate:[overseerGuard] },
      { path: 'mages-list', component: MagesListComponent, canActivate:[permissionsGuard] },
      { path: '', redirectTo: 'mages-list', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];


/**
 * NgModule that defines the application's routes and their associated components.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
