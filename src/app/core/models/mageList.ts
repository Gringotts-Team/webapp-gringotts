import { House } from "./house";

export class MageListModel{
        mag_name:string;
        mag_age: number;
        mag_house?:House;
        mag_aaln:string;
        mag_inscription?:string;
    
}

export const MAGELISTEMPTY ={
        mag_name:"",
        mag_age:null,
        mag_house:null,
        mag_aaln:"",
        mag_inscription:null

}