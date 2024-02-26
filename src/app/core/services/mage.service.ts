import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mage } from '../models/mage';
import { Result } from '../models/result';
import { environment } from 'src/environments/environment';
import { mageListRequest } from '../models/mageListRequest';

/**
 * Service for handling mage-related operations.
 */
@Injectable({
  providedIn: 'root'
})
export class MageService {

  /**
   * The base API URL for mage-related endpoints.
   * @type {string}
   */
  private apiURL: string = environment.apiUrl;

  /**
   * Constructor for MageService.
   * @param {HttpClient} http - Instance of Angular's HttpClient service.
   */
  constructor(private http: HttpClient) { }

  /**
   * Submits a new mage for registration to the API.
   * @param {Mage} newMage - The mage data to be registered.
   * @returns {Promise<Result<any>>} - A promise that resolves to a Result object indicating the success or failure of the registration.
   */
  async postNewMage(newMage: Mage): Promise<Result<any>> {
    let newHeaders =({
      'accept': 'text/plain',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userToken')),
      'Content-type': 'application/json',
    });
    const requestOptions = { headers: new HttpHeaders(newHeaders) };
    const url = `${this.apiURL}/newMage`;
    try {
      const response = await this.http.post(url, newMage, requestOptions).toPromise();
      return { data: response, ok: true, errors: [] };
    } catch (error) {
      if (error.status === 401 && error.error) {
        return { data: { error: error.error }, ok: false, errors: [error] };
      }
      return { data: { error: "An error has occurred" }, ok: false, errors: [error] };
    }
  }

  /**
   * Retrieves a list of mages from the API based on provided parameters.
   * @param {mageListRequest} params - Parameters for filtering the mage list.
   * @returns {Promise<Result<any>>} - A promise that resolves to a Result object containing the mage list data.
   */
  async postMagesList(params: mageListRequest): Promise<Result<any>>{
    let newHeaders =({
      'accept': 'text/plain',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userToken')),
      'Content-type': 'application/json',
    });
    const requestOptions = {headers: new HttpHeaders(newHeaders)};
    const url = `${this.apiURL}/mage/list`;
    try {
      const response = await this.http.post(url, params, requestOptions).toPromise();
      return { data: response, ok: true, errors: [] };
    } catch (error) {
      if (error.status === 401 && error.error) {
        return { data: { error: error.error }, ok: false, errors: [error] };
      }
      return { data: { error: "An error has occurred" }, ok: false, errors: [error] };
    }
  }
}
