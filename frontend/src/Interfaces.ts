export interface Product {
    id?: number
    name: string
    slug?: string
    description: string
    price: number
    rating?: number
    stock: number
    category:string
    image: File | null
    quantity?: number
    num_reviews?: number
}

export interface User {
    id?: number;
    email: string;
    name: string;
    last_name: string;
    avatar: File | null;
}
export interface Token {
    user_id: number;
    exp: number;
    is_staff: boolean;
    avatar: File | null;
    email: string;
    name: string;
    last_name: string;
    
}

export interface Order {
    total_price: number;
    address: string;
    city: string;
    postal_code: string;
    order_items: Product[];

}