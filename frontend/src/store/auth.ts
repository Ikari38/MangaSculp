import { create } from "zustand";
import { persist } from "zustand/middleware";

// Definir el tipo de estado y las acciones disponibles
type State = {
    access: string;
    refresh: string;
    isAuth: boolean;
}

type Actions = {
    setToken: (access: string, refresh: string) => void;
    logout: () => void;
}

// Crear el store de autenticacion y persistencia en el almacenamiento local
export const useAuthStore = create(
    persist<State & Actions>(
        // Definir el estado inicial y las acciones
        (set) => ({
            access: '',
            refresh: '',
            isAuth: false,
            // Accion para establecer el token de acceso y actualizacion
            setToken: (access: string, refresh: string ) =>
                set(()=>({
                    access,
                    refresh,
                    isAuth: !!access && !!refresh,
                })),
                logout: () => set(()=> ({ access: '', refresh: '', isAuth: false})),
            }
        ),
        // Configuracion de la persistencia de datos
        {
            name: 'auth',
            getStorage: () => localStorage,
        }
    )
)