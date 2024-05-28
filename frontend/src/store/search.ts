import { create } from "zustand"

// Definir la interfaz para el sotre de busqueda
interface SearchStore {
    search: string;
    setSearch: (term: string) => void;
}

//Crear y exportar el store de busqueda usando zustand
export const useSearchStore = create<SearchStore>((set) => ({
    search: '',
    setSearch: (term) => set({ search: term })
}));