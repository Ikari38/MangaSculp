import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { get_prods_by_category } from "../api/products";
import toast from "react-hot-toast";
import { Product } from "../Interfaces";
import Rating from "../components/Rating";
import { useCartStore } from "../store/cart";
import { useEffect } from "react";
import Loader from "../components/Loader";

const SearchByCategory = () => {
    // Parametros de la url y funcion para a�adir al carrito
    const { category } = useParams();
    const addToCart = useCartStore(state => state.addToCart);

    // Consulta de productos por categoria
    const { data, isError, isLoading } = useQuery({
        queryKey: [`products`, category],
        queryFn: () => get_prods_by_category(category || ''),
    });

    // Manejador de errores durante la carga de la consulta
    useEffect(() => {
        if (isError) {
            toast.error("Error!");
        }
    }, [isError]);

    // Manejadores de errores
    if (isError) return toast.error("Error!");
    if (isLoading) return <Loader />;

    return (
        <section className="flex justify-center">
            <section className="p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-16">
                {data && data.map((product: Product) => (
                    <section key={product.id} className="mb-8 w-full max-w-xs mx-auto">
                        <section className="bg-white border border-gray-200 rounded-lg shadow overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                            <Link to={`/products/get/${product.slug}`}>
                                <img className="w-full h-64 object-cover" src={`${import.meta.env.VITE_BACKEND_URL}${product.image}`} alt={product.name} />
                            </Link>
                            <section className="p-4 ">
                                <Link to={`/products/get/${product.slug}`}>
                                    <h5 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {product.name}
                                    </h5>
                                    <section className="flex justify-between">
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-200">
                                            {product.price}&euro;
                                        </h5>
                                        <section className="flex items-center">
                                            <span className="flex items-center ml-1 text-gray-500 dark:text-gray-400">
                                                <Rating value={product.rating !== undefined ? product.rating : 0} />
                                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                                                    {product.rating !== null ? product.rating : '0.00'}
                                                </span>
                                            </span>
                                        </section>
                                    </section>
                                </Link>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                    {product.description}
                                </p>

                                <button
                                    onClick={() => addToCart(product)}
                                    className="inline-flex items-center mx-3 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Añadir al carrito
                                </button>

                                <Link to={`/products/get/${product.slug}`} className="inline-flex items-center mx-3
                                    px-3 py-2 text-sm font-medium text-center text-white 
                                    bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 
                                    focus:outline-none focus:ring-blue-300 dark:bg-blue-600 
                                    dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Ver

                                    <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd">
                                        </path>
                                    </svg>
                                </Link>
                            </section>
                        </section>
                    </section>
                ))}
            </section>
        </section>
    );
}

export default SearchByCategory;
