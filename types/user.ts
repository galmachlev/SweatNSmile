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
    address: { 
        country:string,
        city:string,
        street:string,
        houseNum: number,
        postalCode: number,
        comments?: string
    },
    img?: string,

    //***************/

    gender: string,
    height: number,
    currentWeight: number,
    goalWeight: number,
    goalDate: Date,

    //***************/
 
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active';

    //***************/
    
    isActive?: boolean
    shippmentAddress?: {
        country:string,
        city:string,
        street:string,
        houseNum: number,
        postalCode: number,
        comments?: string 
    },
    purchase_history?: {
        date: Date,
        items: { 
            productName: string;
            quantity: number;
            price: number;
        }[],
        totalPrice: number;
        status: string; //Pending/Processing/Shipped/Delivered/Cancelled
        
    }[],
    measurements?: {
        date: Date; 
        weight: number; //DailyWeight
        bodyImage?: string; //DailyPicture
    }[];
};