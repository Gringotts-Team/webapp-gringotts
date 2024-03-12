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


  async getMageById(idMage: number): Promise<Result<any>> {
    try {
      let newHeaders = ({
        'accept': 'text/plain',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userToken')),
        'Content-type': 'application/json',
      });
      const requestOptions = { headers: new HttpHeaders(newHeaders) };
      let url = `${this.apiURL}/mages/${idMage}`;
      let response = this.http.get(url, requestOptions);
      return { data: response, ok: true, errors: [] };
    } catch (error) {
      if (error.status === 401 && error.error) {
        return { data: { error: error.error }, ok: false, errors: [error] };
      }
      return { data: { error: "An error has occurred" }, ok: false, errors: [error] };
    }
  }

  async putMage(mageToUpdate: Mage, idMage: number): Promise<Result<any>> {
    try {
      let newHeaders = ({
        'accept': 'text/plain',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userToken')),
        'Content-type': 'application/json',
      });
      const requestOptions = { headers: new HttpHeaders(newHeaders) };
      let url = `${this.apiURL}/mages/${idMage}`;
      let response = await this.http.put(url, mageToUpdate, requestOptions);
      return { data: response, ok: true, errors: [] };
    } catch (error) {
      if (error.status === 401 && error.error) {
        return { data: { error: error.error }, ok: false, errors: [error] };
      }
      return { data: { error: "An error has occurred" }, ok: false, errors: [error] };
    }
  }



  /**
   * Submits a new mage for registration to the API.
   * @param {Mage} newMage - The mage data to be registered.
   * @returns {Promise<Result<any>>} - A promise that resolves to a Result object indicating the success or failure of the registration.
   */
  async postNewMage(newMage: Mage): Promise<Result<any>> {
    try {
    let newHeaders = ({
      'accept': 'text/plain',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userToken')),
      'Content-type': 'application/json',
    });
    const requestOptions = { headers: new HttpHeaders(newHeaders) };
    let url = `${this.apiURL}/mages`;
      let response = this.http.post(url, newMage, requestOptions);
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
  async getMagesList(params: mageListRequest): Promise<Result<any>> {
    try {
    let newHeaders = ({
      'accept': 'text/plain',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userToken')),
      'Content-type': 'application/json',
    });
    const requestOptions = { headers: new HttpHeaders(newHeaders) };
    let url = `${this.apiURL}/mages?`;
    if (params.mageName) url += `mageName=${params.mageName}&`;
    if (params.AALN) url += `AALN=${params.AALN}&`;
    if (params.minAge) url += `minAge=${params.minAge}&`;
    if (params.maxAge) url += `maxAge=${params.maxAge}&`;
    if (params.houseId) url += `houseId=${params.houseId}&`;
    if (params.minRegDate) url += `minRegDate=${params.minRegDate.toString()}&`;
    if (params.maxRegDate) url += `maxRegDate=${params.maxRegDate.toString()}&`;

    url = url.slice(0, -1);

      let response = this.http.get(url, requestOptions);
      return { data: response, ok: true, errors: [] };
    } catch (error) {
      if (error.status === 401 && error.error) {
        return { data: { error: error.error }, ok: false, errors: [error] };
      }
      return { data: { error: "An error has occurred" }, ok: false, errors: [error] };
    }
  }
}
