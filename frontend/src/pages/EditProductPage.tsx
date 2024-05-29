import React, { useState, ChangeEvent, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { edit_product, get_solo_prod } from '../api/products';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditProductPage = () => {
        // Estados para los valores iniciales
        const [initialName, setInitialName] = useState<string>('');
        const [initialCountInStock, setInitialCountInStock] = useState<number>(0);
        const [initialCategory, setInitialCategory] = useState<string>('');
        const [initialDescription, setInitialDescription] = useState<string>('');
        const [initialPrice, setInitialPrice] = useState<number>(0);
        const [initialImage, setInitialImage] = useState<string | null>(null);

        // Estados para los valores actuales
        const [name, setName] = useState<string>('');
        const [countInStock, setCountInStock] = useState<number>(0);
        const [category, setCategory] = useState<string>('');
        const [description, setDescription] = useState<string>('');
        const [price, setPrice] = useState<number>(0);
        const [image, setImage] = useState<File | null>(null);
        const [filePreview, setFilePreview] = useState<string>('');
        const inputRef = React.useRef<HTMLInputElement>(null);
        const [isHovered, setIsHovered] = useState(false);


        //Consigo el id y lo paso a number para evitar problemas
        const { id } = useParams();
        let prodId: number;
        if (id !== undefined) {
            prodId= Number(id)
        }

        // Consulta para obtener los datos del producto especifico
        const { data } = useQuery({
            queryFn: () => get_solo_prod(prodId),
            queryKey: ['products', id],
        })

            //Fetch de datos para que se muestren segun se carga
        useEffect(()=> {
            if (data) {
                setName(data.name)
                setCountInStock(data.stock)
                setDescription(data.description)
                setCategory(data.category)
                setPrice(data.price)
                setImage(data.image)

                setInitialName(data.name);
                setInitialCountInStock(data.stock);
                setInitialDescription(data.description);
                setInitialCategory(data.category);
                setInitialPrice(data.price);
                setInitialImage(data.image);
            }
        }, [data])

        const navigate = useNavigate();
        const queryClient = useQueryClient();

       // Mutacion para editar el producto
        const editProdMutation = useMutation({
            mutationFn: edit_product,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["products"] });
                toast.success("El producto se ha editado con exito")
                navigate("/admin")
            },
            onError: (error) => {
                console.error(error);
                toast.error("Ha habido un error al editar el Producto")
                navigate("/admin")
            },
        });

        //Funcion Manejadora del envio del form y envia los datos al server
        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (isTextFormModified()) {
                toast.error("Se debe modificar al menos uno de los campos.");
                return;
            }
            editProdMutation.mutate({
                name: name,
                stock: countInStock,
                category: category,
                description: description,
                price: price,
                image: image,
                id: prodId
            });
        };

        // Funcion para verificar si hay cambios en los campos
        const isTextFormModified = () => {
            if(
                name == initialName &&
                countInStock == initialCountInStock &&
                category == initialCategory &&
                description == initialDescription &&
                price == initialPrice &&
                image == initialImage){
                    return true;
                }
            return false;
        };

        //Manejadores de eventos para los cambios en los campos del formulario
        const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
        };

        const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
            setCategory(event.target.value);
        };

        const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
            setDescription(event.target.value);
        };

        const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newNumber = parseInt(event.target.value, 10);
            setCountInStock(newNumber);
        };

        const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newNumber = parseInt(event.target.value, 10);
            setPrice(newNumber);
        };

        //Funcion para subir archivo si no hay, no cargamos nada
        const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files && event.target.files[0];
            if (file) {
                setImage(file);
                const reader = new FileReader();
                reader.onload = () => {
                    setFilePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        };

        //Funcion manejadora de arrastrar dentro del drag and drop
        const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
            event.preventDefault();
            setIsHovered(true);
        };

        //Funcion manejadora de arrastrar fuera del drag and drop
        const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
            event.preventDefault();
            setIsHovered(false);
        };

        // Funcion para eliminar la imagen seleccionada
        const removeImage = () => {
            setImage(null)
            setIsHovered(false)
        }
        
        return (
            <section className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 ">
                <section className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[700px] w-[600px] rounded-md">
                    <section className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                        <section className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                            <section className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Editar Producto
                                </h3>
                                <Link
                                    to="/admin"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    data-modal-toggle="defaultModal"
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    <span className="sr-only">Cerrar modal</span>
                                </Link>
                            </section>
                            <form onSubmit={handleSubmit}>
                                <section className="grid gap-4 mb-4 sm:grid-cols-2">
                                    <section>
                                        <label
                                            htmlFor="name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Nombre
                                        </label>
                                        <input
                                            value={name}
                                            onChange={handleNameChange}
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Nombre del producto"
                                        />
                                    </section>

                                    <section>
                                        <label
                                            htmlFor="stock"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Cantidad en stock
                                        </label>
                                        <input
                                            value={countInStock}
                                            onChange={handleCountChange}
                                            type="number"
                                            name="stock"
                                            id="stock"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Cantidad en stock"
                                        />
                                    </section>

                                    <section>
                                        <label
                                            htmlFor="price"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Precio
                                        </label>
                                        <input
                                            value={price}
                                            onChange={handlePriceChange}
                                            type="number"
                                            name="price"
                                            id="price"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="1000€"
                                        />
                                    </section>

                                    <section>
                                        <label
                                            htmlFor="category"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Categoria
                                        </label>
                                        <select
                                            value={category}
                                            onChange={handleCategoryChange}
                                            name="category"
                                            id="category"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        >
                                            <option value="" disabled>Categoria</option>
                                            <option value="figura">Figura</option>
                                            <option value="plano">Plano</option>
                                        </select>
                                    </section>

                                    <section className="sm:col-span-2">
                                        <label
                                            htmlFor="description"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Descripcion
                                        </label>
                                        <input
                                            value={description}
                                            onChange={handleDescriptionChange}
                                            id="description"
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Escriba la descripcion del producto aqui"
                                        ></input>
                                    </section>

                                    <section className="sm:col-span-2">
                                        <section className="flex items-center justify-center w-full">
                                            {image === null ? (
                                                <label
                                                    htmlFor="dropzone-file"
                                                    className={`flex flex-col items-center justify-center w-full h-64 
        border-2 border-gray-600 border-dashed rounded-lg 
        cursor-pointer bg-gray-40 ${isHovered ? "bg-gray-600" : "hover:bg-gray-600"
                                                        }`}
                                                    onDragEnter={handleDragEnter}
                                                    onDragLeave={handleDragLeave}
                                                >
                                                    <svg
                                                        aria-hidden="true"
                                                        className="w-10 h-10 mb-3 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                        ></path>
                                                    </svg>
                                                    <section className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="font-semibold">
                                                                Haz click para subir
                                                            </span>{" "}
                                                            o arrastra y suelta
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            SVG, PNG, JPG or GIF (MAX.
                                                            800x400px)
                                                        </p>
                                                    </section>
                                                    <input
                                                        ref={inputRef}
                                                        type="file"
                                                        id="dropzone-file"
                                                        multiple={true}
                                                        onChange={handleFileChange}
                                                        className="absolute w-full h-[300px] opacity-0"
                                                    />
                                                </label>
                                            ) : (
                                                <section>
                                                    <button
                                                        onClick={removeImage}
                                                        type="button"
                                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                        data-modal-toggle="defaultModal"
                                                    >
                                                        <svg
                                                            aria-hidden="true"
                                                            className="w-5 h-5"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                        <span className="sr-only">
                                                            Cerrar modal
                                                        </span>
                                                    </button>
                                                    <img
                                                        className="h-48 w-96"
                                                        src={filePreview || `${import.meta.env.VITE_BACKEND_URL}${data.image}`}
                                                        alt="Imagen seleccionada"
                                                    />
                                                </section>
                                            )}
                                        </section>
                                    </section>
                                </section>
                                <button
                                    
                                    type="submit"
                                    className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    <svg
                                        className="mr-1 -ml-1 w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    Guardar cambios
                                </button>
                            </form>
                        </section>
                    </section>
                </section>
            </section>
        )
    }

    export default EditProductPage