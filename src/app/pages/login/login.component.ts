import { Component } from '@angular/core';
import { USEREMPTY, User } from '../../core/models/user';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

/**
 * Component representing the login page of the application.
 * Manages user login functionality.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  /**
   * Represents the user attempting to log in.
   * @type {User}
   */
  user: User = USEREMPTY;
  /**
 * Represents the error msg.
 * @type {string}
 */
  errorMsg: string = "";

  /**
   * Constructor for LoginComponent.
   * @param {AuthService} authService - Instance of the authentication service.
   * @param {Router} router - Instance of Angular's Router service.
   */
  constructor(private authService: AuthService, private router: Router) { }

  /**
   * Submits the login form data for user authentication.
   * @param {NgForm} loginForm - The login form containing user credentials.
   */
  async submitLogin(loginForm: NgForm) {
    this.user = loginForm.value;
    this.user.token = "";

    try
    {
      const postLogin = await this.authService.postLogin(this.user);

      if (postLogin.ok) {
        let token = postLogin.data.token;
        this.authService.setUserInLocalStorage(token);
        this.authService.isAuthenticated$();
        this.router.navigate([`/home`]);
      }
      else
      {
        const errorMessage = postLogin.data .error;
        this.errorMsg = errorMessage;
      }
    }
    catch (error)
    {
      console.error("Error:", error);
    }
  }
}

