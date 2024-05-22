import { search_product } from "../api/products";
import { useQuery } from "@tanstack/react-query";
import { useSearchStore } from "../store/search";
import ProductCard from "../components/ProductCard";
import { Product } from "../Interfaces";

const SearchResults = () => {

    const search = useSearchStore((state) => state.search);

    const { data } = useQuery({
        queryKey: ['products', search],
        queryFn: () => {
            if (search) {
                return search_product(search)
            }
            return {products: []}
        }
    })

    return (
        <section className="flex justify-center">
            <section className="p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-16">
                { data && data.products.map((product: Product) =>(
                    <ProductCard product={product} page={""} />
                ))}
            </section>
        </section>
    )
}

export default SearchResults;