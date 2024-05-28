/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductCard from "../components/ProductCard";
import { Product } from "../Interfaces";
import { get_products } from "../api/products";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import React from "react";
import SearchResults from "./SearchResults";
import { useSearchStore } from "../store/search";
import Loader from "../components/Loader";


const HomePage = () => {

    // Observador de visibilidad y estado de busqueda
    const { ref, inView } = useInView()
    const search = useSearchStore((state) => state.search);

    // Consulta paginada para obtener productos
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
        initialPageParam:1
    });

    // Carga la siguiente página cuando el componente está en la vista
    useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
    }, [fetchNextPage, inView]);

    // Manejadores de errores y resultados
    if (isLoading) return <Loader />
    if (error instanceof Error) return <>{toast.error(error.message)}</>
    if (search) return <SearchResults />

    return (
        <>
            {data?.pages.map((page: any) => (
                <React.Fragment key="main">
                    <section className="flex justify-center">
                        <section
                            key={page.meta.next}
                            className="p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-16"
                        >
                            {page.data.map((product: Product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    page={"home"}
                                />
                            ))}
                        </section>
                    </section>

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
                                    <Loader />
                                ) : null}
                            </section>
                        )}
                </React.Fragment>
            ))}
        </>
    );
};



export default HomePage;