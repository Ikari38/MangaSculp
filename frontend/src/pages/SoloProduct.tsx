import { useQuery } from "@tanstack/react-query"
import { get_solo } from "../api/products"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Reviews from "../components/Reviews";

const SoloProduct = () => {

    // Obtener el slug de los parametros de la URL
    const slug = useParams();

    // Realizar una consulta para obtener los detalles del producto basado en el slug
    const { data, isLoading,isError } = useQuery({
        queryFn: () => get_solo(slug.slug || ''),
        queryKey: ['products', slug.slug],
    });

    // Manejador de errores y tiempos de carga
    if (isLoading) return <Loader/>;
    if (isError) return toast.error("Error")

    return (
        <>
            <section className="bg-white dark:bg-gray-900">
                <section className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
                    <section className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                            {data.name}
                            <span className="text-green-500 ml-4">
                                {data.price} &euro;
                            </span>
                        </h2>
                        <p className="mb-4 font-bold">
                            {data.description}
                        </p>
                        <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Añadir al carrito
                            <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd">
                                </path>
                            </svg>
                        </a>
                    </section>

                    <img className="w-full"
                        src={`${import.meta.env.VITE_BACKEND_URL}${data.image}`}
                        alt={data.name} />

                </section>
                <section>
                    <Reviews productId={data.id} productName={data.name} reviews={data.reviews} />
                </section>
            </section>
        </>

    )
}

export default SoloProduct