import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

/**
 * Component representing the navigation bar of the application.
 * This component contains the navigation links and menu options.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  /** Stores current Route */
  currentRoute: string = '';

  /** Flag to show/hide component based on user authentication status */
  show: boolean = false;

  /** Flag to show/hide component based on user role */
  isOverseer: boolean = false;

  /**
   * Constructor to initialize the NavbarComponent.
   * @param authService - The authentication service.
   * @param router - The router service.
   */
  constructor(private authService : AuthService, private router: Router){

    this.isOverseer = this.authService.overseerValidation();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.router.url;
      }
    });
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$().subscribe(
      (isAuthenticated) => {
        this.isOverseer = this.authService.overseerValidation()
      });    

    /** 
     * Subscribes to authentication status changes to manage visibility
     */
    this.authService.isAuthenticated$().subscribe(
      (isAuthenticated) => {
        this.show = isAuthenticated;
      });
  }  
}
