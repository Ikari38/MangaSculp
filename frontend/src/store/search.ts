import { create } from "zustand"

interface SearchStore {
    search: string;
    setSearch: (term: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
    search: '',
    setSearch: (term) => set({ search: term })
}));