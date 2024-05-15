import ProductCard from "../components/ProductCard";
import { Product } from "../Interfaces";
import { get_products } from "../api/products";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";


const HomePage = () => {

    const { ref, inView } = useInView()

    const { data, isLoading, error, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery(
        ['product'],
        get_products,
        {
            getNextPageParam: (page) => page.meta.next
        }
    );

    useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
    }, [fetchNextPage, inView]);

    if (isLoading) return <p>Cargando...</p>
    if (error instanceof Error) return <>{toast.error(error.message)}</>


    return (
        <>
            {data?.pages.map((page: any) => (
                <>
                    <section className="flex justify-center">
                        <section
                            key={page.meta.next}
                            className="p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-16"
                        >
                            {page.data.map((product: Product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </section>
                    </section>

                    {!isLoading && data?.pages.length === 0 && (
                        <p className="text-xl text-slate-800 dark:text-slate-200">
                            No hay mas resultados
                        </p>
                    )}
                    {!isLoading &&
                        data?.pages?.length !== undefined &&
                        data.pages.length > 0 &&
                        hasNextPage && (
                            <section ref={ref}>
                                {isLoading || isFetchingNextPage ? (
                                    <p>Cargando...</p>
                                ) : null}
                            </section>
                        )}
                </>
            ))}
        </>
    );
};



export default HomePage;