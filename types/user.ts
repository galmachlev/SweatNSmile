// ייצוא טייפ של משתמש - תכונות
export type User= {
    user_id: string, // ?
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    birthDate: Date,
    birthDateValidate?: string,
    phoneNumber: string,
    img?: string,

    //***************/

    gender?: string,
    height?: number,
    currentWeight: number,
    goalWeight?: number,
    goalDate?: Date,
    dailyCalories?: number,

    //***************/
 
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active',

    //***************/
    
    isActive?: boolean,

    measurements?: {
        date: Date; 
        weight: number; //DailyWeight
        bodyImage?: string; //DailyPicture
    }[];
};