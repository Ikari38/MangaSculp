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

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results: any;
}

const Products = ({ results }: Props) => {

    const { ref, inView } = useInView()

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getNextPageParam: (page: any) => page.meta.next,
        initialPageParam: 1
    });


    const queryClient = useQueryClient();

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

    useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
    }, [fetchNextPage, inView]);

    if (error instanceof Error) return <>{toast.error(error.message)}</>
    return (
        <section className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">

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
                            <tr className="border-b dark:border-gray-700">
                                <td className="px-4 py-3"></td>
                                <td className="px-4 py-3"></td>
                                <td className="px-4 py-3 flex items-center justify-center gap-4 font-medium text-gray-900 whitespace-nowrap dark:text-white " >
                                    <Link to="/admin/add" className="flex  justify-center gap-4">
                                        Agregar Producto
                                        <FaPlusSquare size={22} className="text-green-500 cursor-pointer" />
                                    </Link>
                                </td>
                                <td className="px-4 py-3"></td>
                                <td className="px-4 py-3"></td>
                            </tr>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
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
                            <p>Cargando...</p>
                        ) : null}
                    </section>
                )}
        </section>
    )
}

export default Products;