import { useQuery } from "@tanstack/react-query";
import { pages } from "next/dist/build/templates/app-page";

interface UsePokemonsListOptions {
	enabled?: boolean;
}

type usePokemonsListProps = {
	page: number;
	pageSize: number;
	options: UsePokemonsListOptions;
};

export function usePokemonsList({
	page,
	pageSize,
	options,
}: usePokemonsListProps) {
	const offset = (page - 1) * pageSize;
	const apiUrl = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pageSize}`;
}
