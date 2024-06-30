// ייצוא טייפ של מוצר
export type Product = {
    product_id: string; // ?
    name: string; 
    category: string; 
    description: string; 
    image: string; 
    in_stock: number; 
    price: number; 
    sale_price?: number; 
};
