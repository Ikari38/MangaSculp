import { Product } from "../Interfaces";
import { authAxios, axio } from "./useAxios";

export const post_product = async (data: Product) => {
    try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('count_in_stock', data.count_in_stock.toString());
    formData.append('category', data.category);
    formData.append('price',data.price.toString());
    if (data.image) {
        formData.append('image', data.image);
        console.log("Datos enviados:"+formData)
    }
    await authAxios.post('/products/post/', formData)
} catch (error) {
    console.log('Error al enviar el producto:', error);
    throw error; // Puedes manejar el error según sea necesario aquí
}
}

export const get_products = async ({ pageParam = 1 }) => {
    const response = await axio.get(`/products/?page=${pageParam}&pages=9`);
    return response.data;
};