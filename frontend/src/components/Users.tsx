import { FaTrashCan } from "react-icons/fa6";
import { delete_user, get_users } from "../api/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { User } from "../Interfaces";
import Loader from "./Loader";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results: any;
}

const Users = ({ results }: Props) => {
    const queryClient = useQueryClient();

    const { data, isError, isLoading } = useQuery({
        queryKey: [`users`],
        queryFn: get_users,
    })


    const deleteUserMutation = useMutation({
        mutationFn: delete_user,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("El Usuario se ha eliminado con exito")
        },
        onError: (error) => {
            console.error(error);
            toast.error("Ha habido un error al eliminar el Usuario")
        },
    });


    useEffect(() => {
        if (isError) {
            toast.error("Error!");
        }
    }, [isError]);


    if (isError) return toast.error("Error!")
    if (isLoading) return <Loader />;


    return (
        <section className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-3">ID Usuario</th>
                        <th scope="col" className="px-4 py-3">Email</th>
                        <th scope="col" className="px-4 py-3">Nombre</th>
                        <th scope="col" className="px-4 py-3">Apellido</th>
                        <th scope="col" className="px-4 py-3 flex items-center justify-center gap-4">Acciones</th>
                    </tr>
                </thead>

                {results && results.users.length > 0 ? (
                    <tbody>
                        {results && results.users.map((user: User) => (
                            <tr className="border-b dark:border-gray-700">
                                <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.id}</th>
                                <td className="px-4 py-3">{user.email}</td>
                                <td className="px-4 py-3">{user.name}</td>
                                <td className="px-4 py-3">{user.last_name}</td>
                                <td className="px-4 py-3 flex items-center justify-center gap-4">
                                    <FaTrashCan
                                        onClick={() =>
                                            user.id && deleteUserMutation.mutate(user.id)}
                                        size={22}
                                        className="text-red-500 cursor-pointer" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                ) : (
                    <tbody>
                        {data && data.map((user: User) => (
                            <tr className="border-b dark:border-gray-700">
                                <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.id}</th>
                                <td className="px-4 py-3">{user.email}</td>
                                <td className="px-4 py-3">{user.name}</td>
                                <td className="px-4 py-3">{user.last_name}</td>
                                <td className="px-4 py-3 flex items-center justify-center gap-4">
                                    <FaTrashCan
                                        onClick={() =>
                                            user.id && deleteUserMutation.mutate(user.id)}
                                        size={22}
                                        className="text-red-500 cursor-pointer" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>
        </section>
    )
}

export default Users