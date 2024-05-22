import { Product } from "../Interfaces";
import { authAxios, axio } from "./useAxios";

export const search_product = async (query: string) => {
    const response = await authAxios.get(`/products/search/?query=${query}`);
    return response.data;
}

export const get_prods_by_category = async(category: string) => {
    const response = await authAxios.get(`/products/category/${category}`);
    return response.data;
}

export const delete_product = async (id: number) => {
    await authAxios.delete(`/products/delete/${id}/`)
}

export const get_solo_prod = async (id: number) => {
    const response = await authAxios.get(`/products/get/admin/${id}/`)
    return response.data
}

export const edit_product = async (data: Product) => {
    try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('stock', data.stock.toString());
    formData.append('category', data.category);
    formData.append('price',data.price.toString());
    if (data.image) {
        formData.append('image', data.image);
        console.log("Datos enviados:"+formData)
    }
    await authAxios.put(`/products/edit/${data.id}/`, formData)
} catch (error) {
    console.log('Error al enviar el producto:', error);
    throw error;
}
}

export const get_solo = async (slug: string) => {
    const response = await authAxios.get(`/products/get/${slug}/`)
    return response.data
}

export const post_product = async (data: Product) => {
    try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('stock', data.stock.toString());
    formData.append('category', data.category);
    formData.append('price',data.price.toString());
    if (data.image) {
        formData.append('image', data.image);
        console.log("Datos enviados:"+formData)
    }
    await authAxios.post('/products/post/', formData)
} catch (error) {
    console.log('Error al enviar el producto:', error);
    throw error;
}
}

export const get_products = async ({ pageParam = 1 }) => {
    const response = await axio.get(`/products/?page=${pageParam}&pages=9`);
    return response.data;
};

