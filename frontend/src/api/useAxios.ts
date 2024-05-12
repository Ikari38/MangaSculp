import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL

console.log(import.meta.env.VITE_BACKEND_URL)

export const axio = axios.create({
    baseURL
})