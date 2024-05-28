import { create } from "zustand";
import { persist } from "zustand/middleware";

// Definir la interfaz para el darkmode
interface DarkModeStore {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

//Crear exportar y persistencia del darkmode con zustand
export const useDarkMode = create<DarkModeStore>()(
    persist(
        (set) => ({
            darkMode: false,
            toggleDarkMode: () => set((state) => ({
                darkMode: !state.darkMode})),
                }),
                {
                    name: "darkMode",
                }
    )
)