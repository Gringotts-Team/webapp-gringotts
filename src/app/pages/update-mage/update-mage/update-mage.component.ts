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
  selector: 'app-update-mage',
  templateUrl: './update-mage.component.html',
  styleUrls: ['./update-mage.component.css']
})
export class UpdateMageComponent implements OnInit {



  mageByAaln: Mage = MAGEEMPTY;
  /** Error message to display if there's an error. */
  errorMsg: string = null;

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

  private routeSubscription : Subscription;


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
      console.log(params['id'])

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
        const errorMessage = resultGetHouse.data.error;
        this.errorMsg = errorMessage;
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

  async searchMage(): Promise<void> {
    this.mageAllnUpdate.markAllAsTouched();

    if (this.mageAllnUpdate.valid) {
      try {
        this.mageByAaln = MAGEEMPTY

        this.mageListRequest = this.mageAllnUpdate.value;
        const resultGetMage = await this.mageService.getMagesList(this.mageListRequest);
        if (resultGetMage.ok) {
          this.mageByAaln = resultGetMage.data[0];
          if (this.mageByAaln.mag_id != null) {
            this.findMageById(this.mageByAaln.mag_id);
          }

        } else {
          const errorMessage = resultGetMage.data.error;
          this.errorMsg = errorMessage;
        }


      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
  async findMageById(idMage: number): Promise<void> {
    try {
      console.log(this.mageIdFromList)
      if (this.mageAllnUpdate.valid || this.mageIdFromList != undefined ) {

        this.mageToUpdate = MAGEEMPTY
        this.mageListRequest = this.mageAllnUpdate.value;
        let mageIdToUpdate: number = idMage;
        const resultGetMage = await this.mageService.getMageById(mageIdToUpdate);
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
          const errorMessage = resultGetMage.data.error;
          this.errorMsg = errorMessage;
        }

        this.myModal.show();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }


  getHouseNameByIdOrIdByName(selectedHouIdOrName: number | string): string | number {
    if (typeof selectedHouIdOrName === 'number') {
      for (let index = 0; index < this.houseList.length; index++) {

        if (this.houseList[index].hou_id == selectedHouIdOrName) {
          return this.houseList[index].hou_name;
        }
      }
    }
    else {
      for (let index = 0; index < this.houseList.length; index++) {
        if (this.houseList[index].hou_name == selectedHouIdOrName) {
          return this.houseList[index].hou_id;
        }
      }
    }
  }


  async updateMage(): Promise<void> {
    try {
      if (this.mageUpdateForm.valid) {
        let mageUpdated: Mage = this.mageUpdateForm.value;
        let houseSelected = this.mageUpdateForm.get('mag_hou_name').value; // Get the value of the FormControl

        if (typeof houseSelected === 'string') {
          let mageIdToUpdate: string | number = this.getHouseNameByIdOrIdByName(houseSelected);

          if (typeof mageIdToUpdate === 'number') {
            mageUpdated.mag_hou_id = mageIdToUpdate;
          }

          const resultUpdateMage = await this.mageService.putMage(mageUpdated, this.mageToUpdate.mag_id);
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
            const errorMessage = resultUpdateMage.data.error;
            this.errorMsg = errorMessage;
          }
        
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
  isValidField(field: string): boolean {
    return this.validatorService.isValidField(this.mageAllnUpdate, field);
  }

  /**
   * Gets the error message for the AALN form field.
   * @param {string} aalnControl - The name of the form field.
   * @returns {string} - The error message for the AALN form field.
   */
  isValidAALN(aalnControl: string): string {
    return this.validatorService.getFieldError(this.mageAllnUpdate, aalnControl);
  }



  goBack() {
    this.location.back();
  }
}



