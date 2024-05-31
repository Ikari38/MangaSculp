/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";
import { Token } from "../Interfaces";
import { useAuthStore } from "../store/auth";
import { Link } from "react-router-dom";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { edit_user, get_solo_user } from "../api/users";
import { my_orders } from "../api/orders"
import Loader from "../components/Loader";


const UserProfile = () => {

    // Declaramos los estados
    
    const [show, setShow] = useState(true)
    const [stateName, setStateName] = useState<string>('');
    const [stateLast, setStateLast] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string>('');
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Declaramos los estados iniciales para comprobaciones posteriores
    const [initialName, setInitialName] = useState<string>('');
    const [initialLast, setInitialLast] = useState<string>('');
    const [initialImage, setInitialImage] = useState<File | null>(null);
    // Declaramos las variables del token
    const token: string = useAuthStore.getState().access;
    const tokenDecoded: Token = jwtDecode(token)
    const id = tokenDecoded.user_id;

    // Fetching d elos datos de usuario para sacar el id
    const { data: user } = useQuery({
        queryFn: () => get_solo_user(id),
        queryKey: ['users', id],
    })

    // Fetch de datos para que se muestren segun se carga el componente
    useEffect(()=> {
        if (user) {
            setStateName(user.name)
            setStateLast(user.last_name)
            setImage(user.avatar)

            setInitialName(user.name);
            setInitialLast(user.last_name);
            setInitialImage(user.avatar);
        }
    }, [user])


    const queryClient = useQueryClient();

    // Funcion que valida el Query de productos
    const editProfileMutation = useMutation({
        mutationFn: edit_user,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("El Perfil se ha editado con exito")
            setShow(true)
        },
        onError: (error) => {
            console.error(error);
            toast.error("Ha habido un error al editar el Perfil")
            setShow(true)
        },
    });

    // Fetching de datos del token
    const { data, isError,isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: my_orders
    })

    // Funcion Manejadora del envio del form y envia los datos al server
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) return;
        editProfileMutation.mutate({
            name: stateName,
            last_name: stateLast,
            avatar: image,
            email: user.email
        });
    };

    // Funcion de validacion de datos
    const validateForm = () => {
        const regex = /^[a-zA-ZÀ-ÿ0-9\s]{1,100}$/;
        const nameValid = regex.test(stateName);
        const lastNameValid = regex.test(stateLast);

        if (!nameValid) {
            toast.error('El nombre debe tener entre 1 y 100 caracteres y no contener caracteres especiales.');
            return false;
        }
        if (!lastNameValid) {
            toast.error('El apellido debe tener entre 1 y 100 caracteres y no contener caracteres especiales.');
            return false;
        }
        if (stateName === initialName && stateLast === initialLast && image === initialImage) {
            toast.error('Debe cambiar al menos uno de los campos: nombre, apellido o foto.');
            return false;
        }
        return true;
    };


    // Funcion para subir archivo si no hay, no cargamos nada
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Funcion manejadora de arrastrar dentro del drag and drop
    const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsHovered(true);
    };

    // Funcion manejadora de arrastrar fuera del drag and drop
    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsHovered(false);
    };

    // Funcion para borrar la imagen
    const removeImage = () => {
        setImage(null)
        setIsHovered(false)
    }

    // Comprobacion para verificar si el usuario esta definido
    if (user === undefined) return <p>No Hay usuario</p>
    // Comprobacion para verificar si hay un error en la carga de datos
    if(isError) return toast.error("Error")
    // Comprobacion para verificar si los datos estan cargando
    if(isLoading) return <Loader />

    return (

        <section className="flex justify-center pt-[100px]">
            <section className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                {show ? (
                    <>
                        <section className="flex flex-col items-center pb-10">

                            {user && user.avatar !== undefined &&
                                <img
                                    className="w-24 h-24 mb-3 mt-3 rounded-full shadow-lg"

                                    src={`${import.meta.env.VITE_BACKEND_URL}${user.avatar}`}
                                    alt="User image"
                                />
                            }
                            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                                {user.email}
                            </h5>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {user.name} {user.last_name}
                            </span>
                            <section className="flex mt-4 space-x-3 md:mt-6">
                                <button
                                    onClick={() => setShow(false)}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                                >
                                    Editar perfil
                                </button>
                            </section>
                        </section>

                        <section className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">ID Pedido</th>
                                        <th scope="col" className="px-4 py-3">Ver</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {Array.isArray(data) && data.map((order: any) => (

                                        <tr key={order.id} className="border-b dark:border-gray-700">
                                            <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {order.id}
                                            </th>
                                            <td className="px-4 py-3">
                                                <Link
                                                    to={`/order/solo/${order.id}/`}
                                                    className="p-2 cursor-pointer rounded-lg bg-gray-900 hover:bg-gray-700">
                                                    Ver Pedido
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>

                    </>
                ) : (
                    <section className="p-11">
                        <form onSubmit={handleSubmit}>
                            <section className="p-3">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={stateName}
                                    onChange={(e) =>
                                        setStateName(e.target.value)
                                    }
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Nombre"
                                />
                            </section>

                            <section className="p-3">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    value={stateLast}
                                    onChange={(e) =>
                                        setStateLast(e.target.value)
                                    }
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Apellido"
                                />
                            </section>

                            <section className="sm:col-span-2 p-2">
                                <section className="flex items-center justify-center w-full">
                                    {image === null ? (
                                        <label
                                            htmlFor="dropzone-file"
                                            className={`flex flex-col items-center justify-center w-full h-64 
    border-2 border-gray-600 border-dashed rounded-lg 
    cursor-pointer bg-gray-40 ${isHovered ? "bg-gray-600" : "hover:bg-gray-600"
                                                }`}
                                            onDragEnter={handleDragEnter}
                                            onDragLeave={handleDragLeave}
                                        >
                                            <svg
                                                aria-hidden="true"
                                                className="w-10 h-10 mb-3 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                ></path>
                                            </svg>
                                            <section className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">
                                                        Haz click para subir
                                                    </span>{" "}
                                                    o arrastra y suelta
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    SVG, PNG, JPG or GIF (MAX.
                                                    800x400px)
                                                </p>
                                            </section>
                                            <input
                                                ref={inputRef}
                                                type="file"
                                                id="dropzone-file"
                                                multiple={true}
                                                onChange={handleFileChange}
                                                className="absolute w-full h-[300px] opacity-0"
                                            />
                                        </label>
                                    ) : (
                                        <section>
                                            <button
                                                onClick={removeImage}
                                                type="button"
                                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                data-modal-toggle="defaultModal"
                                            >
                                                <svg
                                                    aria-hidden="true"
                                                    className="w-5 h-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    ></path>
                                                </svg>
                                                <span className="sr-only">
                                                    Close modal
                                                </span>
                                            </button>
                                            <img
                                                className="h-48 w-96"
                                                src={
                                                    filePreview || `${import.meta.env.VITE_BACKEND_URL}${user.avatar}`
                                                }
                                                alt="Imagen seleccionada"
                                            />
                                        </section>
                                    )}
                                </section>
                            </section>

                            <section className="flex mt-4 space-x-3 md:mt-6">
                                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                                    Guardar cambios
                                </button>
                            </section>
                        </form>
                    </section>
                )}
            </section>
        </section>
    );
}

export default UserProfile