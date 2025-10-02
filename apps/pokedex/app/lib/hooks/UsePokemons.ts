"use client";
import {
	getPokemonList,
	getPokemonByName,
	PokemonDetail,
} from "../api/fetchPokemon";

import { useQuery, useQueryClient } from "@tanstack/react-query";

type UsePokemonsListProps = {
	page: number;
	pageSize: number;
};
export function UsePokemonsList({ page, pageSize }: UsePokemonsListProps) {
	const queryClient = useQueryClient();
	const offset = (page - 1) * pageSize;
	console.log("llamo hook");
	return useQuery({
		queryKey: ["pokemons:list", pageSize, offset],
		queryFn: async () => {
			const { count, results } = await getPokemonList(pageSize, offset);

			// fetch pokemons details
			const pokemonsDetails: PokemonDetail[] = await Promise.all(
				results.map(({ name }) => getPokemonByName(name)),
			);

			// seed into the cache
			pokemonsDetails.forEach((pokemon) => {
				queryClient.setQueryData(["pokemon", pokemon.name], pokemon);
			});

			return { count, results: pokemonsDetails };
		},
		placeholderData: (prev) => prev,
		staleTime: 5 * 60 * 1000, //5 minutes
	});
}

export function UsePokemon(name: string | null) {
	return useQuery({
		queryKey: ["pokemon", name],
		queryFn: () => getPokemonByName(name as string),
		enabled: !!name,
		staleTime: Infinity,
	});
}
