import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { House } from 'src/app/core/models/house';
import { MAGEEMPTY, Mage } from 'src/app/core/models/mage';
import { mageListRequest } from 'src/app/core/models/mageListRequest';
import { HouseService } from 'src/app/core/services/house.service';
import { MageService } from 'src/app/core/services/mage.service';
import { ValidatorService } from 'src/app/core/services/validator.service';
import Modal from 'bootstrap/js/dist/modal'
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-modify-mage',
  templateUrl: './modify-mage.component.html',
  styleUrls: ['./modify-mage.component.css']
})
export class ModifyMageComponent implements OnInit {



  mageByAaln: Mage = MAGEEMPTY;
  /** Error message to display if there's an error. */
  errorMsg: string = null;

  /** Error message to display in console if there's an error. */
  consoleError: string = null;

  /** Object representing the request for mage list. */
  mageListRequest: mageListRequest;

  /**
   * Represents the list of houses available.
   * @type {House[]}
   */
  houseList: House[];

  /**
 * Represents the new mage being created.
 * @type {Mage}
 */
  mageToUpdate: Mage = MAGEEMPTY;

  /**
 * Indicates the current date for HTML date picker.
 * @type {Date}
 */
  birthDateMage = new Date();

  private myModal: Modal;

  private mageIdFromList: number;

  private routeSubscription: Subscription;

  /**
   * Indicates whether to show the error.
   * @type {boolean}
   */
  showError: boolean = false;
    /**
   * Indicates whether to show the error in the modal.
   * @type {boolean}
   */
    showErrorModal: boolean = false;

  /**
   * Constructor for MagesListComponent.
   * @param houseService Instance of the house service.
   * @param mageService Instance of the mage service.
   * @param formBuilder Instance of Angular's FormBuilder service.
   * @param validatorService Instance of the validator service.
   */
  constructor(
    private houseService: HouseService,
    private mageService: MageService,
    private formBuilder: FormBuilder,
    private validatorService: ValidatorService,
    private location: Location,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) { }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.listHouses();


    const element = document.getElementById('UpdateModalForm') as HTMLElement;
    this.myModal = new Modal(element);

    this.chargeMageSelectedInList();

  }
  chargeMageSelectedInList() {
    this.routeSubscription = this.route.params.subscribe(params => {

      if (params['id']) {
        this.mageIdFromList = params['id'];
        this.findMageById(this.mageIdFromList);
        this.ngZone.run(() => {
          this.myModal.show();
        });
      }
    });
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
        this.errorMsg = resultGetHouse.data.error;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  /**
   * Form for mage finder
   */
  public mageAllnUpdate: FormGroup = this.formBuilder.group({
    AALN: [null, [Validators.required, Validators.pattern(this.validatorService.aalnPatternValidation)]]
  });

  /**
   * Represents the form group for mage creation.
   * @type {FormGroup}
   */
  public mageUpdateForm: FormGroup = this.formBuilder.group({
    mag_name: [null, [Validators.required]],
    mag_hou_name: [null, [Validators.required]],
    mag_birthdate: [null, [Validators.required, this.validatorService.birthDateValidate.bind(this.validatorService)]],
    mag_aaln: [null, [Validators.required, Validators.pattern(this.validatorService.aalnPatternValidation)]]
  }, {
    validators: [this.validatorService.aalnAndHousePatterValidation('mag_hou_name', 'mag_aaln')]
  });

  /**
   * Searches for a mage based on AALN.
   * If found, updates the UI with mage data.
   */
  async searchMage(): Promise<void> {
    try {
      this.mageAllnUpdate.markAllAsTouched();

      if (this.mageAllnUpdate.valid) {
        this.mageByAaln = MAGEEMPTY

        this.mageListRequest = this.mageAllnUpdate.value;

        let resultGetMage = await this.mageService.getMagesList(this.mageListRequest);
        if (resultGetMage.ok) {
          this.mageByAaln = resultGetMage.data[0];
          if (typeof this.mageByAaln == "undefined" || resultGetMage.data.length == 0) {
            this.errorMsg = 'There is no mage with this AALN';
            this.showError = true;
          }
          else if (this.mageByAaln.mag_id != null && resultGetMage.data.length != 0) {
            this.findMageById(this.mageByAaln.mag_id);
            this.showError = false;
          }
        } else {
          this.errorMsg = resultGetMage.data.error;
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  /**
   * Finds a mage by ID and updates the UI with mage data.
   * @param {number} idMage - The ID of the mage to find.
   */
  async findMageById(idMage: number): Promise<void> {
    try {
      this.birthDateMage = null;
      if (this.mageAllnUpdate.valid || this.mageIdFromList != undefined) {

        this.mageToUpdate = MAGEEMPTY
        this.mageListRequest = this.mageAllnUpdate.value;
        let mageIdToUpdate: number = idMage;
        let resultGetMage = await this.mageService.getMageById(mageIdToUpdate);
        if (resultGetMage.ok) {
          this.mageToUpdate = resultGetMage.data;

          this.mageUpdateForm.patchValue({
            mag_name: this.mageToUpdate.mag_name,
            mag_hou_name: this.getHouseNameByIdOrIdByName(this.mageToUpdate.mag_hou_id),
            mag_birthdate: new Date(this.mageToUpdate.mag_birthdate),
            mag_aaln: this.mageToUpdate.mag_aaln
          });
          this.birthDateMage = new Date(this.mageToUpdate.mag_birthdate);
        } else {
          this.errorMsg = resultGetMage.data.error;
        }

        this.myModal.show();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  /**
   * Retrieves the house name by ID or ID by name.
   * @param {number | string} selectedHouIdOrName - The ID or name of the house.
   * @returns {string | number} - The name or ID of the house.
   */
  getHouseNameByIdOrIdByName(selectedHouIdOrName: number | string): string | number {

    if (typeof selectedHouIdOrName === 'number') {
      let index = this.houseList.findIndex(x => x.hou_id == selectedHouIdOrName)
      return this.houseList[index].hou_name;
    }
    else {
      let index = this.houseList.findIndex(x => x.hou_name == selectedHouIdOrName)
      return this.houseList[index].hou_id;
    }
  }

  /**
   * Updates the mage data based on the form input.
   * If successful, displays a success message and navigates back.
   */
  async updateMage(): Promise<void> {
    try {
      this.errorMsg = "";
      this.mageUpdateForm.updateValueAndValidity();
      this.mageUpdateForm.markAllAsTouched();
      this.mageUpdateForm.get('mag_aaln').updateValueAndValidity();

      if (this.mageUpdateForm.valid) {
        let mageUpdated: Mage = this.mageUpdateForm.value;
        let houseSelected = this.mageUpdateForm.get('mag_hou_name').value;

        if (typeof houseSelected === 'string') {
          let mageIdToUpdate: string | number = this.getHouseNameByIdOrIdByName(houseSelected);
          if (typeof mageIdToUpdate === 'number') {
            mageUpdated.mag_hou_id = mageIdToUpdate;
          }
        }
        let localBirthdate = new Date(mageUpdated.mag_birthdate);
        let utcBirthdate = new Date(
          localBirthdate.getUTCFullYear(),
          localBirthdate.getUTCMonth(),
          localBirthdate.getUTCDate(),
          localBirthdate.getUTCHours(),
          localBirthdate.getUTCMinutes(),
          localBirthdate.getUTCSeconds(),
          localBirthdate.getUTCMilliseconds()
        );
        mageUpdated.mag_birthdate = utcBirthdate.toISOString();

        let resultUpdateMage = await this.mageService.putMage(mageUpdated, this.mageToUpdate.mag_id);
        
        if (resultUpdateMage.ok) {
          this.mageToUpdate = resultUpdateMage.data;
          Swal.fire({
            title: "Update successful!",
            text: "The mage " + this.mageToUpdate.mag_name + " is updated!",
            icon: "success"
          }).then((result) => {
            if (result.isConfirmed) {
              this.myModal.hide();
              this.location.back();
            }
          });

        } else {
          this.errorMsg = resultUpdateMage.errors[0].error;
          console.log(this.errorMsg);
          this.showErrorModal = true;
          console.log("error: ", this.errorMsg);
        }
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
  isValidField(form: FormGroup, field: string): boolean {
    return this.validatorService.isValidField(form, field);
  }

  /**
   * Gets the error message for the AALN form field.
   * @param {string} aalnControl - The name of the form field.
   * @returns {string} - The error message for the AALN form field.
   */
  isValidAALN(form: FormGroup, aalnControl: string): string {
    this.showError = false;
    return this.validatorService.getFieldError(form, aalnControl);
  }

  /**
   * Gets the error message for the birthdate form field.
   * @param {string} birthControl - The name of the form field.
   * @returns {string} - The error message for the birthdate form field.
   */
  isValidBirthdate(birthControl: string): string {
    return this.validatorService.getFieldError(this.mageUpdateForm, birthControl);
  }
  
  /**
   * Close the modal and go to last windows
   */
  goBeforeWindow():void{
    this.myModal.hide();
    this.location.back();
  }
  
}