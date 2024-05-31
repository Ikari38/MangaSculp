import axios, { AxiosRequestHeaders } from "axios";
import { useAuthStore } from "../store/auth";
import { jwtDecode } from "jwt-decode";
import { Token } from "../Interfaces";

// Funcion para cerrar sesion y redirigir a la pagina de login
function logOutFunc(){
    useAuthStore.getState().logout()
    window.location.href = '/login'
}

// Declaracion de la variable que es la ruta del backend
const baseURL = import.meta.env.VITE_BACKEND_URL

// Configuracion de axios para peticiones no autenticadas
export const axio = axios.create({
    baseURL
})

// Configuracion de axios para peticiones autenticadas
export const authAxios = axios.create({
    baseURL,
    withCredentials: true
})

// Interceptor para gregar el token de acceso a las cabeceras de las peticiones aunteticadas
authAxios.interceptors.request.use(async (config) => {
    const token : string = useAuthStore.getState().access;
    config.headers = {
        Authorization: `Bearer ${token}`,
    } as AxiosRequestHeaders

    // Decodifica el token para obtener cuando caduca
    const tokenDecoded : Token = jwtDecode(token);

    const expiration = new Date(tokenDecoded.exp * 1000);
    const now = new Date();
    
    // Actualizamos el refresh token para que no caduque la sesion
    if (expiration.getTime() - now.getTime() < 6000)
        try{
            const res = await axio.post('/users/refresh', {refresh: useAuthStore.getState().refresh})
            useAuthStore.getState().setToken(res.data.access, res.data.refresh)
        } catch (err) {
                console.log(err)
                logOutFunc()
        }
        return config;
    });
    
