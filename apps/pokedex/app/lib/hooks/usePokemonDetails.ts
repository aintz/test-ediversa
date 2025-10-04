import { useQuery } from "@tanstack/react-query";
import type { PokemonDetail } from "../api/fetchPokemon";

export function usePokemonDetails(pokeUrl: string) {
	return useQuery<PokemonDetail>({
		queryKey: ["pokemonDetail", pokeUrl],
		queryFn: async () => {
			const res = await fetch(pokeUrl);
			if (!res.ok) throw new Error(`Failed to pokemon url: ${pokeUrl}`);
			return res.json();
		},
		enabled: !!pokeUrl,
		staleTime: Infinity,
	});
}
