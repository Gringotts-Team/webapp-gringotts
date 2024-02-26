import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Result } from '../models/result';

/**
 * Service for handling house-related operations.
 */
@Injectable({
  providedIn: 'root'
})
export class HouseService {

  /**
   * The base API URL for house-related endpoints.
   * @type {string}
   */
  private apiURL: string = environment.apiUrl;

  /**
   * Constructor for HouseService.
   * @param {HttpClient} http - Instance of Angular's HttpClient service.
   */
  constructor(private http: HttpClient) { }

  /**
   * Retrieves the list of houses from the API.
   * @returns {Promise<Result<any>>} - A promise that resolves to a Result object containing the list of houses.
   */
  async getHouseList(): Promise<Result<any>> {
    let newHeaders =({
      'accept': 'text/plain',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userToken')),
      'Content-type': 'application/json',
    });
    const requestOptions = { headers: new HttpHeaders(newHeaders) };
    const url = `${this.apiURL}/houses`;
    try {
      const response = await this.http.get(url, requestOptions).toPromise();
      return { data: response, ok: true, errors: [] };
    } catch (error) {
      if (error.status === 401 && error.error) {
        return { data: { error: error.error }, ok: false, errors: [error] };
      }
      return { data: { error: "An error has occurred" }, ok: false, errors: [error] };
    }
  }
}
