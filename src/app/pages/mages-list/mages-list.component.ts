import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HouseService } from 'src/app/core/services/house.service';
import { MageService } from 'src/app/core/services/mage.service';
import { ValidatorService } from 'src/app/core/services/validator.service';
import { House } from 'src/app/core/models/house';
import { Mage } from 'src/app/core/models/mage';
import { mageListRequest } from '../../core/models/mageListRequest';
import { ColDef } from 'ag-grid-community';

/**
 * Component for displaying a list of mages.
 */
@Component({
  selector: 'app-mages-list',
  templateUrl: './mages-list.component.html',
  styleUrls: ['./mages-list.component.css']
})
export class MagesListComponent implements OnInit {


  /** Array containing the list of houses. */
  houseList: House[];

  /** Error message to display if there's an error. */
  errorMsg: string = null;

  /** Holds the current date. */
  currentDate = new Date();

  /** Array containing the list of mages. */
  magesList: Mage[];

  /** Object representing the request for mage list. */
  mageListRequest: mageListRequest;

  /** Data for ag-grid. */
  rowData: any[];

  /** Column definitions for ag-grid. */
  colDefs: ColDef[] = [
    { headerName: 'AALN', field: 'mag_aaln', cellStyle: { 'text-align': "left" }, flex: 2 , resizable: false, suppressMovable: true },
    { headerName: 'Name', field: 'mag_name', cellStyle: { 'text-align': "left" }, flex: 3 , resizable: false, suppressMovable: true },
    { headerName: 'House', field: 'mag_house.hou_name', cellStyle: { 'text-align': "left" }, flex: 2 , resizable: false, suppressMovable: true },
    { headerName: 'Age', field: 'mag_age', type: 'rightAligned', flex: 1 , resizable: false, suppressMovable: true },
    { 
      headerName: 'Inscription Date', 
      field: 'mag_inscription',
      type: 'rightAligned',
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: (params: any) => {
          const date = new Date(params.value);
          return date.toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric'});
        }
      },
      flex: 2 ,
      resizable: false,
      suppressMovable: true
    }
  ];


  /**
   * Form for mage list.
   */
  
  public mageListFormGroup: FormGroup = this.formBuilder.group({
    mageName: [null],
    AALN: [null, [Validators.pattern(this.validatorService.aalnPatternValidation)]],
    houseId: [null],
    minAge: [null],
    maxAge: [null],
    minRegDate: [null],
    maxRegDate: [null]
  });

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
    private validatorService: ValidatorService
  ) {
  }

  /**
   * Method executed when the component is initialized.
   */
  ngOnInit(): void {
    this.listHouses();
    this.searchMages();
  }

  /**
   * Asynchronous method to retrieve the list of houses.
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
   * Asynchronous method to retrieve the list of mages.
   * @returns {Promise<void>} - A promise indicating the completion of the listMages operation.
   */
  async listMages(): Promise<void> {
    try {
      this.magesList=[];
      this.mageListRequest = this.mageListFormGroup.value;

      const resultGetMage = await this.mageService.postMagesList(this.mageListRequest);

      if (resultGetMage.ok) {
        this.magesList = resultGetMage.data;
        this.rowData = this.magesList;
      }else {
        const errorMessage = resultGetMage.data.error;
        this.errorMsg = errorMessage;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  /**
   * Method to validate if a field is valid.
   * @param {string} field - The field to validate.
   * @returns {boolean} - A boolean indicating if the field is valid.
   */
  isValidField(field: string): boolean {
    return this.validatorService.isValidField(this.mageListFormGroup, field);
  }

/**
   * Method to convert an empty string field to null in a form group
   * @param {string} field - The name of the field to convert
   * @param {string} value - The value of the field to check for emptiness
   * @returns {void}
   * 
   * This method checks if the provided value is an empty string. If it is, it sets the corresponding field in the form group to null.
   * This helps ensure that fields with empty string values are properly handled, typically to maintain data consistency.
   */
  handleFieldInput(field: string, value: string) {
    if (value.trim() === '') {
      this.mageListFormGroup.get(field)?.patchValue(null, { emitEvent: false });
    }
  }


  /**
   * Asynchronous method to search for mages.
   * @returns {Promise<void>} - A promise indicating the completion of the searchMages operation.
   */
  async searchMages(): Promise<void> {
    if(this.mageListFormGroup.valid){
      try {
        await this.listMages();
      } catch (error) {
        console.error("Error:", error);
      }    
    }
  }
}
