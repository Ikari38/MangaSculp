import { FaTrashCan } from "react-icons/fa6";
import { FaPlusSquare } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";


const Orders = () => {

    return (
        <section className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-3">Order ID</th>
                        <th scope="col" className="px-4 py-3">Email</th>
                        <th scope="col" className="px-4 py-3">Username</th>
                        <th scope="col" className="px-4 py-3 flex items-center justify-center gap-4">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    <tr className="border-b dark:border-gray-700">
                        <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">sdsd</th>
                        <td className="px-4 py-3">sdsdsd</td>
                        <td className="px-4 py-3">sdsdsd</td>
                        <td className="px-4 py-3 flex items-center justify-center gap-4">
                            <FaTrashCan size={22}
                                className="text-red-500 cursor-pointer" />
                            <FaEdit size={22} className="text-gray-900 dark:text-white cursor-pointer" />
                            <FaPlusSquare size={22} className="text-green-500 cursor-pointer" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    )
}

export default Orders