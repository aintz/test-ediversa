import { useQueries } from "@tanstack/react-query";
import type { PokemonDetail } from "../types/pokemon";

export function usePaginatedDetails(urls: string[]) {
	const queries = urls.map((url) => ({
		queryKey: ["pokemonDetail", url],
		queryFn: () =>
			fetch(url).then((res) => res.json()) as Promise<PokemonDetail>,
		enabled: urls.length > 0,
		staleTime: Infinity,
	}));

	const detailQueries = useQueries({ queries });

	const details = detailQueries
		.map((query) => query.data)
		.filter(Boolean) as PokemonDetail[];

	const isDetailsLoading = detailQueries.some(
		(q) => q.isPending || q.isFetching,
	);

	return {
		data: details.length === urls.length ? details : null,
		isLoading: isDetailsLoading,
	};
}
