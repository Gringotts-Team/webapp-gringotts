import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { HelperService } from './helper.service';

/**
 * Service for handling form validation operations.
 */
@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  /**
   * Regular expression pattern for AALN validation.
   */
  public aalnPatternValidation: string = "^[A-Z]{2}-[A-Z]{2}-\\d{6}$";

  constructor(private helperService : HelperService){   
  }
  /**
   * Checks if a form field is valid and touched.
   * @param {FormGroup} form - The form to validate.
   * @param {string} field - The field to validate.
   * @returns {boolean} - True if the field is invalid and touched, otherwise false.
   */
  public isValidField(form: FormGroup, field: string): boolean {
    const control = form.controls[field];

    return control && control.errors && control.touched;
  }

  /**
   * Validates equality between house and AALN in the form.
   * @param {string} house - The house field in the form.
   * @param {string} aaln - The AALN field in the form.
   * @returns {(formGroup: AbstractControl) => ValidationErrors | null} - Validation function for the form group.
   */
  aalnAndHousePatterValidation(house: string, aaln: string): any {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      let houseSelected = formGroup.get(house).value;
      let aalnWrited = formGroup.get(aaln).value;

      if (houseSelected != null && aalnWrited != null) {
        let houseSubString = houseSelected.substring(0, 2).toUpperCase();
        let schoolAALN = aalnWrited.substring(0, 2);
        let houseAALN = aalnWrited.substring(3, 5);

        if (houseSubString != houseAALN) {
          formGroup.get(aaln)?.setErrors({ houseAndAALNNotEqual: true });
          return { houseAndAALNNotEqual: true };
        }

        if (houseSubString == "OT" && schoolAALN != "OT") {
          formGroup.get(aaln)?.setErrors({ invalidAALN: true });
          return { invalidAALN: true };
        }

        if (houseSubString != "OT" && schoolAALN != "HG") {
          formGroup.get(aaln)?.setErrors({ aalnSchoolError: true });
          return { aalnSchoolError: true };
        }
      }
      return null;
    };
  }

  /**
   * Validates if the birth date makes the person at least 16 years old.
   * @param {FormControl} birthDateValue - The birth date form control.
   * @returns {ValidationErrors | null} - Validation result.
   */
  public birthDateValidate(birthDateValue: FormControl): ValidationErrors | null {
    let birthDate = new Date(birthDateValue.value);
    
    if(this.helperService.IsYounger(birthDate)){
      return { minor: true };
    }
    return null;
  }

  /**
   * Gets the error message for a specific form field.
   * @param {FormGroup} form - The form to check for errors.
   * @param {string} field - The field to get the error message for.
   * @returns {string | null} - The error message, or null if no error.
   */
  getFieldError(form: FormGroup, field: string): string | null {

    if (!form.controls[field]) return null;
    const errors = form.controls[field].errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'pattern':
          return 'The code format is incorrect';
        case 'minor':
          return 'The age cannot be less than 16 years old.';
        case 'houseAndAALNNotEqual':
          return 'The house in the AALN and the selected must be equal';
        case 'aalnSchoolError':
          return 'The selected house must belong to the School in the AALN';
        case 'invalidAALN':
          return 'For the OT house, the school initials should be OT';
      }
    }
    return null;
  }

}
