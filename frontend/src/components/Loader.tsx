const Loader = () => (
    <section className="flex items-center justify-center min-h-screen">
        <section className="flex flex-col items-center">
            <section className="mb-4">
                <section className="animate-spin w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full"></section>
            </section>
            <p className="text-gray-700 dark:text-gray-300">Cargando...</p>
        </section>
    </section>
);

export default Loader;