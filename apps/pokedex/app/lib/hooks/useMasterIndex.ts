// app/lib/hooks/useMasterIndex.ts
import { useQuery } from "@tanstack/react-query";

interface PokemonListItem {
	name: string;
	url: string;
}

// Función que carga el JSON estático (solo se ejecuta una vez por TanStack Query)
const fetchFullList = async (): Promise<PokemonListItem[]> => {
	// La ruta es relativa a Webpack/Next.js
	const list = await import("../../../data/full_pokemon_list.json");
	return list.default as PokemonListItem[];
};

export default function useMasterIndex() {
	return useQuery<PokemonListItem[]>({
		queryKey: ["fullPokemonList"],
		queryFn: fetchFullList,
		staleTime: Infinity,
	});
}
