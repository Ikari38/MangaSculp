import { axio } from "./useAxios";

export const get_products = async ({ pageParam = 1 }) => {
    const response = await axio.get(`/products/?page=${pageParam}&pages=9`);
    return response.data;

}