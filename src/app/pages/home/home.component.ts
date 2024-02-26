import { Component, OnInit } from '@angular/core';

/**
 * Component representing the home page of the application.
 * This component serves as the main landing page after user login.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  ngOnInit(): void {
  }

  /**
   * Constructor to initialize the HomeComponent.
   */
  constructor(){

  }
  
}
