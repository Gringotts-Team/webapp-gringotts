import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { USEREMPTY, User } from '../../core/models/user';
import { environment } from 'src/environments/environment';

/**
 * Component representing the header of the application.
 * Manages user information and logout functionality.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit{

  /**
   * Represents the currently logged-in user.
   * @type {User}
   */
  user: User = USEREMPTY;
  
  /** Environment Variables */
  projectName = environment.projectName;
  environmentName = environment.environmentName;
  version = environment.version;

  /** Flag to show/hide component based on user authentication status. */
  show: boolean = false;

  /**
   * Constructor for HeaderComponent.
   * @param {Router} router - Instance of Angular's Router service.
   * @param {AuthService} authService - Instance of the authentication service.
   */
  constructor(private router : Router, private authService : AuthService){}

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    /** 
     * Subscribes to authentication status changes to manage visibility
     * and charge or clear the logged user
     */
    this.authService.isAuthenticated$().subscribe(
      (isAuthenticated) => {
        this.show = isAuthenticated;
        this.user = this.authService.userLogged;
      });
  }



  /**
   * Logs out the user by removing the user token and navigating to the login page.
   */
  logoutUser():void{
    localStorage.removeItem("userToken");
    this.authService.isAuthenticated$();
    this.router.navigate([`/login`]);

  }
}
