/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get_orders, edit_order } from "../api/orders";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Loader from "./Loader";

interface Props {
    results: any;
}

const Orders = ({ results }: Props) => {
    const queryClient = useQueryClient();

    // Obtener los datos de los pedidos utilizando react-query
    const { data, isError, isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: get_orders,
    });

    // Configura una mutación para editar un pedido y actualiza la cache tras una edicion exitosa
    const editOrderMut = useMutation({
        mutationFn: edit_order,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast.success("Pedido enviado");
        },
        onError: () => {
            toast.error("Error no se ha podido enviar el pedido");
        },
    });

    const handleCheckboxClick = (isDelivered: boolean, orderId: number) => {
        if (isDelivered) {
            toast.error("Este pedido ya ha sido enviado");
        } else {
            editOrderMut.mutate(orderId);
        }
    };

    // Manejo de errores durante la carga de datos
    if (isError) return toast.error("Error algo ha salido mal");
    if (isLoading) return <Loader />;

    return (
        <section className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Enviar</th>
                        <th scope="col" className="px-6 py-3">ID Pedido</th>
                        <th scope="col" className="px-6 py-3">Creado</th>
                        <th scope="col" className="px-6 py-3">Enviado</th>
                        <th scope="col" className="px-6 py-3">Usuario</th>
                        <th scope="col" className="px-6 py-3">Precio total</th>
                        <th scope="col" className="px-6 py-3">Productos</th>
                        <th scope="col" className="px-6 py-3">Domicilio</th>
                    </tr>
                </thead>

                {results && results.orders.length > 0 ? (
                    results.orders.map((o: any) => (
                        <tbody key={o.id}>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="w-4 p-4">
                                    <section className="flex items-center">
                                        <input
                                            onClick={() => handleCheckboxClick(o.is_delivered, o.id)}
                                            id={`checkbox-table-search-${o.id}`}
                                            type="checkbox"
                                            checked={o.is_delivered}
                                            onChange={() => {}}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            readOnly={o.is_delivered}
                                        />
                                        <label
                                            htmlFor={`checkbox-table-search-${o.id}`}
                                            className="sr-only"
                                        >
                                            checkbox
                                        </label>
                                    </section>
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {o.id}
                                </th>
                                <td className="px-6 py-4">
                                    {o.created_at.slice(0, 10)}
                                </td>
                                <td className="px-6 py-4">
                                    {o.delivered_at !== null && o.delivered_at.slice(0, 10)}
                                </td>
                                <td className="px-6 py-4">
                                    {o.user}
                                </td>
                                <td className="px-6 py-4">
                                    {o.total_price} &euro;
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        to={`/order/solo/${o.id}`}
                                        className="text-blue-600 dark:text-blue-400 underline"
                                    >
                                        Ver
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        to={`/order/solo/${o.id}`}
                                        className="text-blue-600 dark:text-blue-400 underline"
                                    >
                                        Ver
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    ))
                ) : (
                    <tbody>
                        {Array.isArray(data) && data.map((o: any) => (
                            <tr key={o.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="w-4 p-4">
                                    <section className="flex items-center">
                                        <input
                                            onClick={() => handleCheckboxClick(o.is_delivered, o.id)}
                                            id={`checkbox-table-search-${o.id}`}
                                            type="checkbox"
                                            checked={o.is_delivered}
                                            onChange={() => {}}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label
                                            htmlFor={`checkbox-table-search-${o.id}`}
                                            className="sr-only"
                                        >
                                            checkbox
                                        </label>
                                    </section>
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {o.id}
                                </th>
                                <td className="px-6 py-4">
                                    {o.created_at.slice(0, 10)}
                                </td>
                                <td className="px-6 py-4">
                                    {o.delivered_at !== null && o.delivered_at.slice(0, 10)}
                                </td>
                                <td className="px-6 py-4">
                                    {o.user}
                                </td>
                                <td className="px-6 py-4">
                                    {o.total_price} &euro;
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        to={`/order/solo/${o.id}`}
                                        className="text-blue-600 dark:text-blue-400 underline"
                                    >
                                        Ver
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        to={`/order/solo/${o.id}`}
                                        className="text-blue-600 dark:text-blue-400 underline"
                                    >
                                        Ver
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>
        </section>
    );
};
export default Orders;
