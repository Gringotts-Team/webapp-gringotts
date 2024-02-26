import { House } from "./house";

export class MageListModel{
        mag_id:number;
        mag_name:string;
        mag_age: number;
        mag_house?:House;
        mag_aaln:string;
        mag_inscription?:string;
    
}

export const MAGELISTEMPTY ={
        mag_id:null,
        mag_name:"",
        mag_age:null,
        mag_house:null,
        mag_aaln:"",
        mag_inscription:null

}