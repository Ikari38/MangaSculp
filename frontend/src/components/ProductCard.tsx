import { Link } from "react-router-dom";
import { Product } from "../Interfaces";
import { useCartStore } from "../store/cart"
import Rating from "./Rating";

interface Props {
    product: Product
    page: string
}

// Componente de tarjeta de producto con datos del producto y pagina
const ProductCard = ({ product, page }: Props) => {

    const addToCart = useCartStore(state => state.addToCart)

    return (
        <section className="mb-8 w-full max-w-xs mx-auto">
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

                    <section className="pb-3 flex justify-center">
                        <button
                            onClick={() => addToCart(product)}
                            className="inline-flex items-center mx-3 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Añadir al carrito
                        </button>
                    </section>
                    <section className="flex justify-center">
                        <Link to={`/products/get/${product.slug}`} className="inline-flex items-center mx-3
                            px-3 py-2 text-sm font-medium text-center text-white 
                            bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 
                            focus:outline-none focus:ring-blue-300 dark:bg-blue-600 
                            dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            {page === 'home' && ''}
                            Ver
                            <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd">
                                </path>
                            </svg>
                        </Link>
                    </section>
                </section>

            </section>
        </section>
    )
};
export default ProductCard;