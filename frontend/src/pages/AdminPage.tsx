import Users from "../components/Users"
import Orders from "../components/Orders"
import Products from "../components/Products"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { search_product } from "../api/products"
import { search_users } from "../api/users"
import { search_order } from "../api/orders"


useQuery
const AdminPage = () => {
    // Estados locales para la gestion del estado
    const [show, setShow] = useState(0)
    const [search, setSearch] = useState("")

    // Consulta para obtener los datos de los productos
    const { data } = useQuery({
        queryKey: ['products', search],
        queryFn: () => {
            if (search && show === 0) {
                return search_product(search)
            }
            return {products: []}
        }
    })

    // Consulta para obtener los datos de los usuarios
    const { data: users } = useQuery({
        queryKey: ['users', search],
        queryFn: () => {
            if (search && show === 2) {
                return search_users(search)
            }
            return {users: []}
        }
    })

    // Consulta para obtener los datos de los pedidos
    const {data: orders } = useQuery({
        queryKey: ['orders', search],
        queryFn: () => {
            if (search && show === 1) {
                return search_order(search);
            }
            return {orders: []};
        }
    })


    return (
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
            <section className="mx-auto max-w-screen-xl px-4 lg:px-12">
                <section className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                    <section className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        <section className="w-full md:w-1/2">
                            <section className="flex items-center">
                                <label htmlFor="simple-search" className="sr-only">Buscar</label>
                                <section className="relative w-full">
                                    <section className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </section>
                                    <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Buscar" />
                                </section>
                            </section>
                        </section>
                        <section className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                            <button
                                onClick={() => setShow(0)}
                                type="button" className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-900 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-100">
                                Productos
                            </button>
                            <button
                                onClick={() => setShow(1)}
                                type="button" className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-100">
                                Pedidos
                            </button>
                            <button
                                onClick={() => setShow(2)}
                                type="button" className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-100">
                                Usuarios
                            </button>
                        </section>
                    </section>
                    {show === 0 && <Products results={data} />}
                    {show === 1 && <Orders results={orders}/>}
                    {show === 2 && <Users results={users}/>}
                </section>
            </section>
        </section>
    )
}

export default AdminPage