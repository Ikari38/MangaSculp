/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaTrashCan } from "react-icons/fa6";
import { FaPlusSquare } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { delete_product, get_products } from "../api/products";
import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Product } from "../Interfaces";
import React from "react";
import Loader from "./Loader";

interface Props {
    results: any;
}

const Products = ({ results }: Props) => {

    // Hook para detectar si el elemento esta en vista
    const { ref, inView } = useInView()

    // useInfinityQuery para manejar la paginacion de productos
    const {
        data,
        isLoading,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ['products'],
        queryFn: get_products,
        getNextPageParam: (page: any) => page.meta.next,
        initialPageParam: 1
    });

    // Manejo del cache
    const queryClient = useQueryClient();

    // Mutacion para eliminar un producto
    const deleteProdMutation = useMutation({
        mutationFn: delete_product,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("El producto se ha eliminado con exito")
        },
        onError: (error) => {
            console.error(error);
            toast.error("Ha habido un error al eliminar el Producto")
        },
    });

    // Carga mas productos cuando el elemento esta en vista
    useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
    }, [fetchNextPage, inView]);

    // Manejo de errores y estado de carga
    if (error instanceof Error) return <>{toast.error(error.message)}</>
    if (isLoading) return <Loader />

    return (
        <section className="overflow-x-auto">
            <section className="flex justify-center">
                <Link to="/admin/add" className="w-1/6 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-md font-bold transition duration-300 ease-in-out 
                    bg-green-500 dark:bg-green-700 
                    text-white hover:bg-green-600 dark:hover:bg-green-800 
                    focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-800">
                    Agregar Producto
                    <FaPlusSquare size={22} className="text-white cursor-pointer" />
                </Link>
            </section>
            <table className="w-full text-sm text-left mt-4 text-gray-500 dark:text-gray-400">
                <caption>
                </caption>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-3">ID Producto</th>
                        <th scope="col" className="px-4 py-3">Nombre</th>
                        <th scope="col" className="px-4 py-3">Precio</th>
                        <th scope="col" className="px-4 py-3">Stock</th>
                        <th scope="col" className="px-4 py-3 flex items-center justify-center gap-4">Acciones</th>
                    </tr>
                </thead>
                {results && results.products.length > 0 ? (
                    <>
                        {results && results.products.map((product: Product) => (
                            <tbody>
                                <tr className="border-b dark:border-gray-700">
                                    <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white ">{product.id}</th>
                                    <td className="px-4 py-3">{product.name}</td>
                                    <td className="px-4 py-3">{product.price} &euro;</td>
                                    <td className="px-4 py-3">{product.stock}</td>
                                    <td className="px-4 py-3 flex items-center justify-center gap-4">
                                        <FaTrashCan
                                            onClick={() => {
                                                if (product.id !== undefined) {
                                                    deleteProdMutation.mutate(product.id)
                                                }
                                            }
                                            }
                                            size={22}
                                            className="text-red-500 cursor-pointer" />
                                        <Link to={`/admin/edit/${product.id}`}>
                                            <FaEdit size={22} className="text-gray-900 dark:text-white cursor-pointer" />
                                        </Link>

                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </>
                ) : (
                    <>
                        <tbody>
                            {data?.pages.map((page: any) => (
                                <React.Fragment key={page.meta.next}>
                                    {page.data.map((product: Product) => (
                                        <tr key={product.id} className="border-b dark:border-gray-700">
                                            <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white ">{product.id}</th>
                                            <td className="px-4 py-3">{product.name}</td>
                                            <td className="px-4 py-3">{product.price} &euro;</td>
                                            <td className="px-4 py-3">{product.stock}</td>
                                            <td className="px-4 py-3 flex items-center justify-center gap-4">
                                                <FaTrashCan
                                                    onClick={() => {
                                                        if (product.id !== undefined) {
                                                            deleteProdMutation.mutate(product.id)
                                                        }
                                                    }
                                                    }
                                                    size={22}
                                                    className="text-red-500 cursor-pointer" />
                                                <Link to={`/admin/edit/${product.id}`}>
                                                    <FaEdit size={22} className="text-gray-900 dark:text-white cursor-pointer" />
                                                </Link>

                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </>
                )}
            </table>
            {!isLoading && data?.pages.length === 0 && (
                <p key="no_results" className="text-xl text-slate-800 dark:text-slate-200">
                    No hay mas resultados
                </p>
            )}
            {!isLoading &&
                data?.pages?.length !== undefined &&
                data.pages.length > 0 &&
                hasNextPage && (
                    <section key="loading_key" ref={ref}>
                        {isLoading || isFetchingNextPage ? (
                            <Loader/>
                        ) : null}
                    </section>
                )}
        </section>
    )
}

export default Products;