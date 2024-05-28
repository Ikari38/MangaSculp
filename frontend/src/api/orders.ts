import { Order } from "../Interfaces";
import { authAxios, } from "./useAxios";

// Funcion para buscar un pedido
export const search_order = async (query: string) => {
    const response = await authAxios.get(`/orders/search/?query=${query}`);
    return response.data
}

// Funcion para marcar un pedido como entregado
export const edit_order = async (id: number) => {
    await authAxios.put(`/orders/deliver/${id}/`)
}

// Funcion para obtener todos los pedidos
export const get_orders = async () => {
    const response = await authAxios.get(`/orders/`)
    return response.data
}

// Funcion para conseguir los detalles de un pedido
export const solo_order = async (id: number) => {
    const response = await authAxios.get(`/orders/solo/${id}`)
    return response.data
}

// Funcion para obtener todos los pedidos del usuario actual
export const my_orders = async () => {
    const response = await authAxios.get('/orders/my/orders/');
    return response.data
}

// Funcion para crear un pedido
export const create_order = async (data: Order) => {
    await authAxios.post("/orders/create/", data)
}