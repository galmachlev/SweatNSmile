// ייצוא טייפ של משתמש - תכונות
export type User= {
    email: string,
    fullName: string,
    phoneNumber: string,
    img?: string,
    birthDate: Date,
    password: string,
    birthDateValidate?: string,
    isActive?: boolean
    address: { 
        city:string,
        street:string,
        houseNum: string
    },
    shippmentAddress?: {
        city:string,
        street:string,
        houseNum: string
    },
    purchase_history?: {
        date: Date;
        items: {
            productName: string;
            quantity: number;
            price: number;
        }[];
    }[],
    measurements?: {
        date: Date;
        weight: number;
        bodyImage?: string; // optional field
    }[];
};