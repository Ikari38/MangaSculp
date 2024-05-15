import axios, { AxiosRequestHeaders } from "axios";
import { useAuthStore } from "../store/auth";
import { jwtDecode } from "jwt-decode";
import { Token } from "../Interfaces";

function logOutFunc(){
    useAuthStore.getState().logout()
    window.location.href = '/login'
}

const baseURL = import.meta.env.VITE_BACKEND_URL

console.log(import.meta.env.VITE_BACKEND_URL)

export const axio = axios.create({
    baseURL
})

export const authAxios = axios.create({
    baseURL,
    withCredentials: true
})

authAxios.interceptors.request.use(async (config) => {
    const token : string = useAuthStore.getState().access;
    config.headers = {
        Authorization: `Bearer ${token}`,
    } as AxiosRequestHeaders

    const tokenDecoded : Token = jwtDecode(token);

    const expiration = new Date(tokenDecoded.exp * 1000);
    const now = new Date();
    
    // Actualizamos el refresh token para que no caduque la sesion
    if (expiration.getTime() - now.getTime() < 6000)
        try{
            const res = await axio.post('/users/refresh', {refresh: useAuthStore.getState().refresh})
            useAuthStore.getState().setToken(res.data.access, res.data.refresh)
        // Me cargo en linter para la siguiente linea para que no tire error con el tipo any
        } catch (err) {
                console.log(err)
                logOutFunc()
        }
        return config;
    });
    
