/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCartStore } from "../store/cart"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { create_order } from "../api/orders"
import { useNavigate } from "react-router-dom"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const CartPage = () => {

    // Funciones del carrito
    const removeFromCart = useCartStore((state) => state.removeFromCart)
    const addToCart = useCartStore((state) => state.addToCart)
    const removeAll = useCartStore((state) => state.removeAll)

    // Estados del carrito
    const cart = useCartStore(state => state.cart);
    const total_price = useCartStore(state => state.totalPrice);

    // Estados del formulario
    const [address, setAddress] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [postal_code, setPostal_code] = useState<string>('');

    // Referencias de los estados
    const addressRef = useRef<string>(address);
    const cityRef = useRef<string>(city);
    const postalCodeRef = useRef<string>(postal_code);

    // Efectos para actualizar las referencias de los estados
    useEffect(() => {
        addressRef.current = address;
    }, [address]);

    useEffect(() => {
        cityRef.current = city;
    }, [city]);

    useEffect(() => {
        postalCodeRef.current = postal_code;
    }, [postal_code]);

    // Hooks adicionales necesarios
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Mutacion para crear un pedido
    const createOrderMutation = useMutation({
        mutationFn: create_order,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast.success("El Pedido se ha creado con exito")
            removeAll();
            navigate("/")
        },
        onError: (error) => {
            console.error(error);
            toast.error("Ha habido un error al crear el Pedido")
            navigate("/")
        },
    });

    // Crea una orden de PayPal con el precio total del carrito y sin preferencia de envío.
    const createOrder = (data: any, actions: any) => {
        console.log(data)
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: total_price,
                    },
                },
            ],
            application_context: {
                shipping_preference: "NO_SHIPPING"
            }
        })
    }

    // Captura el pago aprobado por PayPal y llama a handleSubmit para crear el pedido en el servidor.
    const onApprove = async (data: any, actions: any) => {
        try {
            console.log(data)
            await actions.order.capture()
            handleSubmit(addressRef.current, cityRef.current, postalCodeRef.current)
        } catch (error) {
            console.log(error)
            toast.error("Error al capturar el pago")
        }
    }

    // Envia los datos del formulario al servidor para crear un pedido, validando los campos necesarios.
    const handleSubmit = (currentAddress: string, currentCity: string, currentPostalCode: string) => {
        if (!validateForm(currentAddress, currentCity, currentPostalCode)) {
            return;
        }
        createOrderMutation.mutate({
            order_items: cart,
            total_price: total_price,
            address: currentAddress,
            city: currentCity,
            postal_code: currentPostalCode,
        });
    };

    // Valida los campos del formulario
    const validateForm = (address: string, city: string, postal_code: string) => {
        if (!address.trim() || address.length > 250) {
            toast.error("La dirección es obligatoria y debe tener menos de 250 caracteres.");
            return false;
        }
        if (!city.trim() || city.length > 100) {
            toast.error("La ciudad es obligatoria y debe tener menos de 100 caracteres.");
            return false;
        }
        const postalCodeRegex = /^[a-zA-Z0-9\s-]{1,100}$/;
        if (!postal_code.trim() || !postalCodeRegex.test(postal_code)) {
            toast.error("El código postal es obligatorio y debe ser válido.");
            return false;
        }
        return true;
    };

    // Actualiza el estado de la direccion cuando el usuario escribe en el input de address.
    const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
        console.log(address)
    };

    // Actualiza el estado de la ciudad cuando el usuario escribe en el input de city.
    const handleCityChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
        console.log(city)
    };

    // Actualiza el estado del codigo postal cuando el usuario escribe en el input de postal_code
    const handlePostalCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPostal_code(event.target.value);
        console.log(postal_code)
    };

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
                <section className="mx-auto max-w-screen-xl px-4 lg:px-12">
                    <section className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                        <section className="relative mt-5 overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
                            <section className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                                <section className="flex items-center flex-1 space-x-4">
                                    <h5>
                                        <span className="text-gray-300 text-xl font-bold">Productos en el carrito: {cart.length}</span>
                                    </h5>
                                    <h5>
                                        <span className="text-gray-300 text-xl font-bold">
                                            Total: {total_price === null && '0'} {total_price} &euro;
                                        </span>
                                    </h5>
                                </section>
                            </section>
                            <section className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-4 py-3">Producto</th>
                                            <th scope="col" className="px-4 py-3">Categoria</th>
                                            <th scope="col" className="px-4 py-3">Cantidad</th>
                                            <th scope="col" className="px-4 py-3">Precio</th>
                                            <th scope="col" className="px-4 py-3">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <>
                                            {cart.map(product => (

                                                <tr key={product.id} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <th scope="row" className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        <img src={`${import.meta.env.VITE_BACKEND_URL}${product.image}`} alt={product.name} className="w-auto h-8 mr-3" />

                                                        {product.name}
                                                    </th>
                                                    <td className="px-4 py-2">
                                                        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                                                            {product.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        <section className="flex items-center space-x-3">
                                                            <button
                                                                onClick={() => removeFromCart(product)}
                                                                className="inline-flex items-center p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                                                                <span className="sr-only">Boton de cantidad</span>
                                                                <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                                                            </button>
                                                            <section>
                                                                {product.quantity}
                                                                <input type="number" id="first_product" className="hidden bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1" required />
                                                            </section>
                                                            <button
                                                                onClick={() => addToCart(product)}
                                                                className="inline-flex items-center p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                                                                <span className="sr-only">Boton de cantidad</span>
                                                                <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                                            </button>
                                                        </section>
                                                    </td>
                                                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.price} &euro;</td>
                                                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.quantity !== undefined ? product.price * product.quantity : 0} &euro;</td>
                                                </tr>
                                            ))}
                                        </>
                                    </tbody>
                                </table>
                            </section>
                        </section>
                    </section>
                </section>
                <section className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Direccion de envio
                    </h1>
                    <form className="space-y-4 md:space-y-6"
                        onSubmit={(e) => { e.preventDefault(), handleSubmit(addressRef.current, cityRef.current, postalCodeRef.current) }}
                    >
                        <section>
                            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Direccion</label>
                            <input
                                value={address}
                                onChange={handleAddressChange}
                                type="text" name="address" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Domicilio" />
                        </section>
                        <section>
                            <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ciudad</label>
                            <input
                                value={city}
                                onChange={handleCityChange}
                                type="text" name="city" id="city" placeholder="Mieres" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </section>

                        <section>
                            <label htmlFor="postal_code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Codigo postal</label>
                            <input
                                value={postal_code}
                                onChange={handlePostalCodeChange}
                                type="text" name="postal_code" id="postal_code" placeholder="33600" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </section>
                        <section className="flex justify-center items-center" >
                            <section className="w-full max-w-md">
                                <PayPalScriptProvider options={{
                                    clientId: "AVWTCXAak4uX_4bkHZ8zEcTABM2pyxhcCNxw6gVICNWpn_T3KcINlCQveb9xDTcWoQzI4kl_-JvN5Z8W",
                                    currency: "EUR"
                                }} >
                                    <PayPalButtons
                                        createOrder={(data, actions) => createOrder(data, actions)}
                                        onApprove={(data, actions) => onApprove(data, actions)}
                                        style={{ layout: "horizontal" }} />
                                </PayPalScriptProvider>
                            </section>
                        </section>
                    </form>
                </section>
            </section>
        </>
    )

}

export default CartPage;