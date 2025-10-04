import React from "react";
import useDebounce from "./useDebounce";
import { useQuery } from "@tanstack/react-query";

type fullListT = {
	name: string;
	url: string;
};

const fetchFullList = async (): Promise<fullListT[]> => {
	const list = await import("../../../data/full_pokemon_list.json");
	return list.default as fullListT[];
};

export function useFastSearch(searchName: string) {
	const debouncedSearch = useDebounce(searchName, 600);

	const { data: fullList } = useQuery({
		queryKey: ["fullPokeList"],
		queryFn: fetchFullList,
		staleTime: Infinity,
	});

	const searchResult = React.useMemo(() => {
		if (!debouncedSearch || !fullList) return null;
		const normalizedSearch = debouncedSearch.toLowerCase();

		return (
			fullList.find((pokemon) => pokemon.name === normalizedSearch) || null
		);
	}, [debouncedSearch, fullList]);

	return { searchIndexResult: searchResult, isSearching: !!searchName };
}
