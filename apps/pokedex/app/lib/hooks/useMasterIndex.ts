import { useQuery } from "@tanstack/react-query";
import type { PokemonListItem } from "../types/pokemon";

export const fetchFullList = async (): Promise<PokemonListItem[]> => {
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
