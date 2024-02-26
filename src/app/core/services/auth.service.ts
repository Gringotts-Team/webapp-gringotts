import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { USEREMPTY, User } from '../models/user';
import { BehaviorSubject, Observable} from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { Result } from '../models/result';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  userLogged: User = USEREMPTY;

  private apiURL: string = environment.apiUrl

  constructor(private http: HttpClient) { }

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  /**
   * Sets the authentication status.
   * @param {boolean} isAuthenticated - The authentication status to be set.
   */
  setAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  /**
   * Sets user token information in local storage.
   * @param {string} token - The user token to be stored in local storage.
   */
  setUserInLocalStorage(token: string) {
    localStorage.setItem("userToken", JSON.stringify(token));
  }

  /**
   * Checks if the user is authenticated based on token presence in local storage.
   * @returns {Observable<boolean>} Observable indicating if the user is authenticated.
   */
  isAuthenticated$(): Observable<boolean> {
    if (localStorage.getItem("userToken") !== 'undefined' && localStorage.getItem("userToken") !== null)
    {
      const userToken: string = localStorage.getItem("userToken")!;
      const decoded: any = jwtDecode(userToken);
      const { name, role, profile_picture } = decoded;
      this.userLogged = { name: name, role: role, profile_picture: profile_picture, token: userToken };
      this.isAuthenticatedSubject.next(true);
    }
    else
    {
      this.userLogged = USEREMPTY;
      this.isAuthenticatedSubject.next(false);
    }
    return this.isAuthenticatedSubject.asObservable();
  }

  /**
     * Checks if the user token is valid.
     * @param {string} token - The user token to be validated.
     * @returns {Promise<boolean>} Promise indicating if the token is valid.
     */
    async validateToken(token: string): Promise<boolean> {
      const tokenParams = new HttpParams().set('token', token);
    try
    {      
      await this.http.get<boolean>(`${this.apiURL}/tokenValidated`, { params: tokenParams })
    }
    catch (error)
    {
      return false
    };
  }


  /**
   * Logs in the user by making a POST request with user credentials.
   * @param {User} user - The user object containing login credentials.
   * @returns {Promise<Result<any>>} Promise containing the result of the login action.
   */
  async postLogin(user: User): Promise<Result<any>> {
    const url = `${this.apiURL}/login`;
    try
    {
      const response = await this.http.post(url, user).toPromise();
      return { data: response, ok: true, errors: [] };
    }
    catch (error)
    {
      if (error.status === 401 && error.error)
      {
        return { data: { error: error.error }, ok: false, errors: [error] };
      }
      return { data: { error: "An error has occurred" }, ok: false, errors: [error] };
    }
  }



  /**
   * Validates if the user is logged in and the token is valid.
   * @returns {boolean} Validation result indicating if the user is logged in.
   */
  guardValidation(): boolean {
    if (this.userLogged != USEREMPTY && this.validateToken(this.userLogged.token)) {
      return true
    }
    return false
  }

  /**
   * Validates overseer role.
   * @returns {boolean} Validation that indicates whether the user belongs to role Overseer
   */
  overseerValidation(): boolean {
    return this.userLogged.role == 'Overseer' 
  }

}

