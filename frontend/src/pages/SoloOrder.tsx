/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { solo_order } from "../api/orders";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const SoloOrder = () => {
    // Obtiene parametro de la url
    const { id } = useParams();

    // Convierte el ID a un número si lo hay
    let new_id: number;
    if (id !== undefined) {
        new_id = Number(id);
    }

    //Realiza una consulta para obtener un pedido especifico
    const { data, isError, isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: () => solo_order(new_id),
    });

    // Maneja estado de carga y error de la consulta
    if (isError) return toast.error("Error!");
    if (isLoading) return <p>Cargando ... </p>;

    return (
        <section className="overflow-x-auto container mx-auto px-4 pt-11">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-3">
                            Precio total
                        </th>
                        <th scope="col" className="px-4 py-3">
                            Entregado
                        </th>

                        <th scope="col" className="px-4 py-3">
                            Creado
                        </th>

                        <th scope="col" className="px-4 py-3">
                            Enviado
                        </th>

                        <th scope="col" className="px-4 py-3">
                            Ciudad
                        </th>

                        <th scope="col" className="px-4 py-3">
                            Direccion
                        </th>

                        <th scope="col" className="px-4 py-3">
                            Codigo postal
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr className="border-b dark:border-gray-700">
                        <th
                            scope="row"
                            className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {data && data.total_price !== undefined && (
                                <>
                                    {data.total_price} &euro;
                                </>
                            )}
                        </th>

                        <td className="px-4 py-3">
                        {data.is_delivered !== null && data.is_delivered === false ? (
                                <p>No entregado</p>
                            ) : (
                                <p>Entregado</p>
                            )}
                        </td>

                        <td className="px-4 py-3">
                            {data && data.created_at !== undefined || null && (
                                <>{data.created_at.slice(0, 10)}</>
                            )}
                        </td>

                        <td className="px-4 py-3">
                            {data && data.delivered_at !== undefined || null && (
                                <>{data.delivered_at.slice(0, 10)}</>
                            )}
                        </td>

                        <td className="px-4 py-3">
                            <section className="flex justify-center gap-4">
                                {data && data.shipping_address !== undefined && (
                                    <>
                                        {data.shipping_address.city}
                                    </>
                                )}
                            </section>
                        </td>

                        <td className="px-4 py-3">
                            <section className="flex justify-center gap-4">

                                {data && data.shipping_address !== undefined && (
                                    <>
                                        {data.shipping_address.address}
                                    </>
                                )}
                            </section>
                        </td>

                        <td className="px-4 py-3">
                            <section className="flex justify-center gap-4">

                                {data && data.shipping_address !== undefined && (
                                    <>
                                        {data.shipping_address.postal_code}
                                    </>
                                )}
                            </section>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-11 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-3">
                            Producto
                        </th>
                        <th scope="col" className="px-4 py-3">
                            Cantidad
                        </th>

                        <th scope="col" className="px-4 py-3">
                            Pecio
                        </th>
                    </tr>
                </thead>


                <tbody>
                    {data.order_items && data.order_items.map((p: any) => (

                        <tr className="border-b dark:border-gray-700">
                            <th
                                scope="row"
                                className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                {p.product}
                            </th>

                            <td className="px-4 py-3">
                                {p.quantity}
                            </td>

                            <td className="px-4 py-3">
                                {p.price} &euro;
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};
export default SoloOrder;