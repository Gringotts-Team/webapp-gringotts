/**
 * Represents a user in the system.
 */
export class User{
    name:string;
    role:string;
    profile_picture:string;
    token:string;
    password?:string;
}

/**
 * Represents an empty user object.
 */
export const USEREMPTY ={
    name:"",
    role:"",
    profile_picture:"",
    token:"",
    password:""
}

