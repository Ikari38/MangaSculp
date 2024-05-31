import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png"

const CategoryPage = () => {
    return (
        <section className="flex justify-center">
            <section className="p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-16">
                <section className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <Link to={`/category/figura`}>
                        <img 
                        className="rounded-t-lg"
                        src={Logo}
                        alt="Logo"
                        />
                    </Link>
                    <section className="p-5">
                        <Link to={`/category/figura`}>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Figuras
                            </h5>
                        </Link>
                    </section>
                </section>
                <section className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <Link to={`/category/plano`}>
                        <img
                            className="rounded-t-lg"
                    src={Logo}
                            alt="Logo"
                        />
                    </Link>
                    <section className="p-5 ">
                        <Link to={`/category/plano`}>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Planos
                            </h5>
                        </Link>
                    </section>
                </section>
            </section>
        </section>
    )
}

export default CategoryPage;