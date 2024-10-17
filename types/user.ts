/*
 * This component represents a user in the system.
 * It includes the user's first name, last name, email, password, birth date, phone number, and user id.
 * The user id is the primary key of the user in the system.
 * The password is encrypted and is used for authentication.
 * The birth date is a date object and is used to calculate the user's age.
 * The phone number is a string and is used for communication with the user.
 */

export type User= {
    user_id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
    img?: string,

    //***************/

    gender?: string,
    height?: number,
    startWeight?: number,
    currentWeight: number,
    goalWeight?: number,
    targetDate?: Date,
    dailyCalories?: number,

    //***************/
 
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active',

    //***************/
    
    isActive?: boolean,
    gallery?: string[];

    measurements?: {
        date: Date; 
        weight: number; //DailyWeight
        bodyImage?: string; //DailyPicture
    }[];
};