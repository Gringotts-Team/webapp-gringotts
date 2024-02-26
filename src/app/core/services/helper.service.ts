import { Injectable } from '@angular/core';

/**
 * Service providing helper methods for various operations.
 */
@Injectable({
  providedIn: 'root'
})
export class HelperService {

  /**
   * Checks if the provided birthdate corresponds to a person younger than 16 years old.
   * @param {Date} birthDate - The birthdate to compare.
   * @returns {boolean} - True if the person is younger than 16, false otherwise.
   */
  public IsYounger(birthDate: Date): boolean {
    let today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    let result: boolean;

    if (today.getMonth() < birthDate.getMonth() || 
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 16) {
      return result = true;
    }

    return result = false;
  }
}
