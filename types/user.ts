// ייצוא טייפ של משתמש - תכונות
export type User= {
    
    email: string,
    fullName: string,
    phoneNumber: string,
    img?: string,
    birthDate: Date,
    password: string,
    birthDateValidate?: string,
    isActive?: boolean,

    //כתובת ראשית
    address: { 
        country:string,
        city:string,
        street:string,
        postalCode:number,
        houseNum: number,
        comments?: string //הערות משתמש לכתובת - אופציונלי
    },

    //כתובת משלוח - ברירת מחדל זהה לכתובת ראשית
    shippmentAddress?: {
        country:string,
        city:string,
        street:string,
        postalCode:number,
        houseNum: number,
        comments?: string
    },

    //היסטוריית רכישות של המשתמש
    purchase_history?: { 
        date: Date; //תאריך ביצוע ההזמנה
        items: { //מערך מכיל שמות + כמויות + מחירי המוצרים שנרכשו
            productName: string; 
            quantity: number; 
            price: number;
        }[],
        totalPrice: number, //סכום ההזמנה הכולל
        status: string; //סטטוס ההזמנה - Pending/Processing/Shipped/Delivered/Cancelled
    }[],

    //היסטוריית מדדים
    measurements?: {
        date: Date; //תאריך מדידה
        weight: number; //משקל יומי
        bodyImage?: string; //תמונת גוף יומית - אופציונלי
    }[];
};