import { useQuery } from "@tanstack/react-query";
import type { PokemonDetail } from "../types/pokemon";

export function usePokemonDetails(pokeUrl: string | null) {
	return useQuery<PokemonDetail>({
		queryKey: ["pokemonDetail", pokeUrl],
		queryFn: async () => {
			if (!pokeUrl) {
				throw new Error("The url can't be null");
			}
			const res = await fetch(pokeUrl);
			if (!res.ok) throw new Error(`Failed to pokemon url: ${pokeUrl}`);
			return res.json();
		},
		enabled: !!pokeUrl,
		staleTime: Infinity,
	});
}
