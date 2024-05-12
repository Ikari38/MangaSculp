import { axio } from "./useAxios";


export const registerRequest = async (email: string, name: string, last_name: string, password: string) => {
    await axio.post("/users/register/", {email, name, last_name, password})
}

export const loginRequest = async (email: string, password: string) => {
    await axio.post("/users/login/", {email,  password})
}
