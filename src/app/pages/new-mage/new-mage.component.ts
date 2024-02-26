import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { House } from 'src/app/core/models/house';
import { MAGEEMPTY, Mage } from 'src/app/core/models/mage';
import { HouseService } from 'src/app/core/services/house.service';
import { MageService } from 'src/app/core/services/mage.service';
import { ValidatorService } from 'src/app/core/services/validator.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

/**
 * Component representing the form for creating a new mage.
 * Manages the form submission and validation.
 */
@Component({
  selector: 'app-new-mage',
  templateUrl: './new-mage.component.html',
  styleUrls: ['./new-mage.component.css']
})
export class NewMageComponent implements OnInit {

  /**
   * Represents the new mage being created.
   * @type {Mage}
   */
  newMage: Mage = MAGEEMPTY;

  /**
   * Represents the list of houses available.
   * @type {House[]}
   */
  houseList: House[];

  /**
   * Represents the error message.
   * @type {string}
   */
  errorMsg: string = null;

  /**
   * Indicates whether to show the error.
   * @type {boolean}
   */
  showError: boolean = false;
  
  /**
   * Indicates the current date for HTML date picker.
   * @type {Date}
   */
  currentDate = new Date();

  /**
   * Represents the form group for mage creation.
   * @type {FormGroup}
   */
  public mageFormGroup: FormGroup = this.formBuilder.group({
    mag_name: [null, [Validators.required]],
    mag_hou_name: [null, [Validators.required]],
    mag_birthdate: [null, [Validators.required, this.validatorService.birthDateValidate.bind(this.validatorService)]],
    mag_aaln: [null, [Validators.required, Validators.pattern(this.validatorService.aalnPatternValidation)]]
  }, {
    validators: [this.validatorService.aalnAndHousePatterValidation('mag_hou_name', 'mag_aaln')]
  });

  /**
   * Constructor for NewMageComponent.
   * @param {HouseService} houseService - Instance of the house service.
   * @param {MageService} mageService - Instance of the mage service.
   * @param {FormBuilder} formBuilder - Instance of Angular's FormBuilder service.
   * @param {ValidatorService} validatorService - Instance of the validator service.
   * @param {Location} location - Instance of Angular's Location service.
   */
  constructor(
    private houseService: HouseService,
    private mageService: MageService,
    private formBuilder: FormBuilder,
    private validatorService: ValidatorService,
    private location: Location,
  ) {
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.listHouses();
  }

  /**
   * Retrieves the list of houses.
   * @returns {Promise<void>} - A promise indicating the completion of the listHouses operation.
   */
  async listHouses(): Promise<void> {
    try {
      const resultGetHouse = await this.houseService.getHouseList();
      if (resultGetHouse.ok) {
        this.houseList = resultGetHouse.data;
      } else {
        const errorMessage = resultGetHouse.data.error;
        this.errorMsg = errorMessage;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  /**
   * Checks if a form field is valid.
   * @param {string} field - The name of the form field.
   * @returns {boolean} - True if the field is valid, false otherwise.
   */
  isValidField(field: string): boolean {
    return this.validatorService.isValidField(this.mageFormGroup, field);
  }

  /**
   * Gets the error message for the birthdate form field.
   * @param {string} birthControl - The name of the form field.
   * @returns {string} - The error message for the birthdate form field.
   */
  isValidBirthdate(birthControl: string): string {
    return this.validatorService.getFieldError(this.mageFormGroup, birthControl);
  }

  /**
   * Gets the error message for the AALN form field.
   * @param {string} aalnControl - The name of the form field.
   * @returns {string} - The error message for the AALN form field.
   */
  isValidAALN(aalnControl: string): string {
    return this.validatorService.getFieldError(this.mageFormGroup, aalnControl);
  }

  /**
   * Submits the mage creation form.
   * @returns {Promise<void>} - A promise indicating the completion of the submitMage operation.
   */
  async submitMage(): Promise<void> {
    this.mageFormGroup.markAllAsTouched();

    if (this.mageFormGroup.valid) {
      this.newMage = this.mageFormGroup.value;
      this.newMage.mag_hou_id = this.getHouseNameById(this.mageFormGroup.get('mag_hou_name').value);

      try {
        let postNewMage = await this.mageService.postNewMage(this.newMage);

        if (postNewMage.ok) {
          this.newMage = postNewMage.data;

          Swal.fire({
            title: "Register successful!",
            text: "The mage " + this.newMage.mag_name + " is registered!",
            icon: "success"
          });
          this.mageFormGroup.reset();
          this.showError = false;
          this.goBack();

        } else {
          this.errorMsg = postNewMage.errors[0].error;
          this.showError = true;
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      this.mageFormGroup.enable();
    }
  }

  /**
   * Gets the house ID by name.
   * @param {string} selectedHou_name - The name of the selected house.
   * @returns {number} - The ID of the selected house.
   */
  getHouseNameById(selectedHou_name: string): number {
    for (let index = 0; index < this.houseList.length; index++) {
      if (this.houseList[index].hou_name == selectedHou_name) {
        return this.houseList[index].hou_id;
      }
    }
  }

  /**
   * Navigates back in the browser history.
   */
  goBack(): void {
    this.location.back();
  }
}
