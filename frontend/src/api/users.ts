import { User } from "../Interfaces";
import { authAxios, axio } from "./useAxios";

// Obtiene los datos de un usuario por ID
export const get_solo_user = async (id: number) => {
    const response = await authAxios.get(`/users/get/solo/${id}/`)
    return response.data
}

// Funcion para editar los usuarios
export const edit_user = async (data: User) => {
    try {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.last_name) formData.append('last_name', data.last_name);
    if (data.email) formData.append('email',data.email);
    if (data.avatar instanceof File) {
        formData.append('avatar', data.avatar);
        // console.dir ([...formData.entries()])
    }
    await authAxios.put(`/users/edit/${data.email}/`, formData)
} catch (error) {
    console.log('Error al enviar el producto:', error);
    throw error;
}
}

// Busqueda de usuarios que coincidan con la consulta
export const search_users = async (query: string) => {
    const response = await authAxios.get(`users/search/?query=${query}`);
    return response.data;
}

// Borrar usuario por ID
export const delete_user = async (id: number) => {
    await authAxios.delete(`/users/delete/${id}/`)
}

// Obtiene todos los usuarios
export const get_users = async () => {
    const response = await authAxios.get('/users/get/')
    return response.data
}

// Solicitud de registro del usuario
export const registerRequest = async (email: string, name: string, last_name: string, password: string) => {
    await axio.post("/users/register/", {email, name, last_name, password})
}

// Funcion para solicitar el acceso de inicio de sesion
export const loginRequest = async (email: string, password: string) => {
    const response = await axio.post("/users/login/", {email,  password})
    return response;
}
