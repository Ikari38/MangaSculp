import { Link, useNavigate, Navigate} from "react-router-dom";
import Logo from "../assets/Logo.png";
import { registerRequest } from "../api/users";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useAuthStore } from "../store/auth";
import { toast } from "react-hot-toast";



const RegisterPage = () => {

    const navigate = useNavigate();
    const { isAuth } = useAuthStore();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [last_name, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [re_password, setRePassword] = useState("");

    const registerMutation = useMutation({
        //Registramos el usuario
        mutationFn: () => registerRequest(email, name, last_name, password),
        onSuccess: () => {
            toast.success("Se ha registrado exitosamente")
            navigate("/login")
        },
        onError: (error) => {
            toast.error("Se ha producido un error")
            console.error(error)
        }
    })

    const handleMatch = () => {
        //Verificamos que coincidan las contraseñas
        if (password !== re_password) {
            return false
        }else {
            return true
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        //manejamos el envio del formulario y volvemos a verificar las contraseñas
        event.preventDefault();
        if( password !== re_password ){
            toast.error("Las contraseñas deben ser iguales")
        } else {
            registerMutation.mutate()
        }
    }

    if(isAuth){
        return (<Navigate to="/"/>)
    }

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-[800px] lg:py-0">
        <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src={Logo} alt="logo"/>
            <span>Shop Zone</span>
        </Link>
        <div className="w-full md:w-[400px] lg:w-[500px] bg-slate-300 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Crear cuenta nueva 
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo</label>
                    <input 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="nombre@gmail.com"/>
                </div>

                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                    <input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="name" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="nombre"/>
                </div>

                <div>
                    <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellido</label>
                    <input 
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    type="last_name" name="last_name" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="apellido"/>
                </div>

                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                    <input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                </div>

                <div>
                    <label htmlFor="re-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmar Contraseña</label>
                    <input 
                    value={re_password}
                    onChange={(e) => setRePassword(e.target.value)}
                    type="password" name="re_password" id="re_password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                </div>

                { handleMatch() ? false :
                <p className="text-sm font-medium text-red-500">Las contraseñas tienen que coincidir</p>
                }
                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Registrarse</button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                ¿Ya tienes una cuenta? <Link to={'/login'} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Iniciar sesion</Link>
                </p>

            </form>
            </div>
            </div>
        </div>
    )
}

export default RegisterPage;