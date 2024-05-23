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
    id: number;
    email: string;
    name: string;
    last_name: string;
}
export interface Token {
    exp: number;
    is_staff: boolean;
    avatar: string;
}

export interface Order {
    total_price: number;
    address: string;
    city: string;
    postal_code: string;
    order_items: Product[];

}