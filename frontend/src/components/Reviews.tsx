/* eslint-disable @typescript-eslint/no-explicit-any */
import Rating from "./Rating"
import toast from "react-hot-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { create_review } from "../api/products"
import StarRating from "./StarRating"
import { useAuthStore } from "../store/auth"
import { Link } from "react-router-dom"

interface Props {
    productId: number
    productName: string
    reviews: []
}

const Reviews = ({ productId, reviews, productName }: Props) => {

    // Variables de estado para controlar el modal de visibilidad, descripcion y puntuacion
    const [show, setShow] = useState(false)
    const [description, setDescription] = useState("")
    const [rating, setRating] = useState(0)
    const { isAuth } = useAuthStore();

    const queryClient = useQueryClient();

    // Mutacion para crear una rese�a
    const CreateReview = useMutation({
        mutationFn: () => create_review(description, rating, productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            toast.success("Reseña creada con exito")
            setShow(false)
            handleReload()
        },
        onError: () => {
            toast.error("La reseña no se ha podido crear")
        },
    });

    // Funcion manejadora del envio de formulario
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!validateDescription(description)){
            toast.error("La descripcion no es valida. Debe tener entre 1 y 200 caracteres y no contener caracteres especiales.")
            return;
        }
        CreateReview.mutate();
    }

    // Funcion para recargar la p�gina para que se actualice al instante cuando haces una review nueva
    const handleReload = () => {
        const currentUrl = window.location.href;
        window.location.href = currentUrl;
    };

    // Funcion para validar la descripcion
    const validateDescription = (desc: string) => {
        const regex = /^[a-zA-Z�-�0-9\u00f1\u00d1\s.,!?']{1,200}$/;
        return regex.test(desc);
    }

    return (
        <>
            {show &&
                <section className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 ">
                    <section className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[700px] w-[600px] rounded-md">
                        <section className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                            <section className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                                <section className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Producto
                                        Añadir reseña
                                    </h3>
                                    <button
                                        onClick={() => setShow(false)}
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
                                        <span className="sr-only">Cerrar modal</span>
                                    </button>
                                </section>
                                <form onSubmit={handleSubmit}>
                                    <section className="grid gap-4 mb-4 sm:grid-cols-2">
                                        <section>
                                            <label
                                                htmlFor="name"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Descripcion
                                            </label>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Escriba una descripcion"
                                            />
                                        </section>
                                        <section className="star-rating text-3xl text-center mt-8">
                                            <StarRating rating={rating} setRating={setRating}/>
                                        </section>
                                    </section>
                                    
                                    <button
                                        type="submit"
                                        className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    >
                                        <svg
                                            className="mr-1 -ml-1 w-6 h-6"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        Crear reseña
                                    </button>
                                </form>
                            </section>
                        </section>
                    </section>
                </section>
            }
            <section className="bg-white dark:bg-gray-900">
                <section className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
                    <section className="mx-auto max-w-screen-sm">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                            Reseñas de {productName}
                        </h2>
                        <p className="mb-8 font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
                            Explora las reseñas de este producto
                        </p>
                        {isAuth ? (
                            <button
                                onClick={() => {
                                    setShow(true)
                                }}
                                className="inline-flex items-center mx-3 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >Crear la reseña</button>
                        ) : (
                            <Link
                            to="/login"
                                className="inline-flex items-center mx-3 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >Crear una reseña</Link>
                        ) }
                    </section>
                </section>
            </section>

            {reviews && reviews.map((r: any) => (
                <article key={r.id} className="container mx-auto ">
                    <section className="flex items-center mb-4 space-x-4">
                        <img
                            className="w-10 h-10 rounded-full"
                            src={`${import.meta.env.VITE_BACKEND_URL}${r.avatar}`}
                            alt=""
                        />
                        <section className="space-y-1 font-medium dark:text-white">
                            <p>{r.username} {' '} {r.user_last_name}</p>
                        </section>
                    </section>

                    <Rating value={r.rating} />

                    <section className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                        <p>{r.created.slice(0, 10)}</p>
                    </section>
                    <p className="pb-8 text-gray-500 dark:text-gray-400">
                        {r.description}
                    </p>
                </article>
            ))}
        </>
    );

}

export default Reviews;