import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../Interfaces";
import toast from "react-hot-toast";

//Definimos los tipos
interface State {
    cart: Product[]
    totalPrice: number
}

//Funciones a usar
interface Actions {
    addToCart: (Item: Product) => void
    removeFromCart: (Item: Product) => void
    removeAll: () => void
}

//Estado inicial del carrito
const State = {
    cart: [],
    totalPrice: 0,
}


export const useCartStore = create(persist<State & Actions>((set, get) => ({
    //Conseguimos el estado inicial
    cart: State.cart,
    totalPrice: State.totalPrice,

    //Funciona para Borrar todo el carrito
    removeAll: () => {
        set({
            cart: [],
            totalPrice: 0
        })
    },

    //Funcion para agregar productos al carrito
    addToCart: (product: Product) => {
        const cart = get().cart
        const cartItem = cart.find(item => item.id === product.id)
        const availableStock = product.stock || 0 ;

        // Verificar si hay suficiente stock disponible
        if (cartItem && cartItem.quantity && cartItem.quantity >= availableStock) {
            toast.error('No hay suficiente stock disponible para agregar este producto al carrito');
            return;
        }

        // Restar el stock disponible si el producto no está en el carrito
        if (!cartItem && availableStock <= 0) {
            toast.error('No hay suficiente stock disponible para agregar este producto al carrito');
            return;
        }

        //Si ya esta en el carrito sumamos +1 a la cantidad
        if (cartItem) {
            const updatedCart = cart.map(item =>
                item.id === product.id ? { ...item, quantity: (item.quantity as number) + 1 } : item
            )
            set(state => ({
                cart: updatedCart,
                totalPrice: state.totalPrice + Number(product.price)
            }))
            //Si no esta en el carrito Sumamos el producto
        } else {
            const updatedCart = [...cart, { ...product, quantity: 1 }]
            //Actualizamos el precio total del carrito
            set(state => ({
                cart: updatedCart,
                totalPrice: state.totalPrice + Number(product.price)
            }))
        }
    },

    //Funcion para eliminar productos del carrito
    removeFromCart: (product: Product) => {
        const cart = get().cart
        const cartItem = cart.find(item => item.id === product.id)
        //Si el producto esta en el carrito y hay mas de 1 restamos uno y actualizamos
        if (cartItem && cartItem.quantity && cartItem.quantity > 1) {
            const updatedCart = cart.map(item =>
                item.id === product.id ? { ...item, quantity: (item.quantity as number) - 1 } : item
            )
            set(state => ({
                cart: updatedCart,
                totalPrice: state.totalPrice - Number(product.price)
            }))
            //Si queda solo 1 producto, eliminamos el objeto del carrito y actualizamos
        } else {
            set(state => ({
                cart: state.cart.filter(item => item.id !== product.id),
                totalPrice: state.totalPrice - Number(product.price),
            }))
        }
    }
}),

    {
        name: "cart-storage",
    }
))