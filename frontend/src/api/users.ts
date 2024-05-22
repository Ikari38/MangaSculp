import { authAxios, axio } from "./useAxios";

export const search_users = async (query: string) => {
    const response = await authAxios.get(`users/search/?query=${query}`);
    return response.data;
}

export const delete_user = async (id: number) => {
    await authAxios.delete(`/users/delete/${id}/`)
}

export const get_users = async () => {
    const response = await authAxios.get('/users/get/')
    return response.data
}

export const registerRequest = async (email: string, name: string, last_name: string, password: string) => {
    await axio.post("/users/register/", {email, name, last_name, password})
}

export const loginRequest = async (email: string, password: string) => {
    const response = await axio.post("/users/login/", {email,  password})
    return response;
}
