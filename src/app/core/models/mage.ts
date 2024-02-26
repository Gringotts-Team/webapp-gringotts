/**
 * Represents a mage in the system.
 */
export class Mage{
    mag_id?:number;
    mag_name:string;
    mag_birthdate: string;
    mag_hou_id?:number;
    mag_aaln:string;
    mag_inscription?:string;
}

/**
 * Represents an empty user object.
 */
export const MAGEEMPTY ={
    mag_name:"",
    mag_birthdate:null,
    mag_hou_id:-1,
    mag_aaln:""
}
