import type { PokemonDetail } from "./fetchPokemon";
export async function fetchInitialData(
	page: number,
	pageSize: number,
): Promise<PokemonDetail[] | null> {
	const offset = (page - 1) * pageSize;
	const listUrl = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pageSize}`;

	try {
		// 1. Obtener la lista de nombres/URLs
		const listResponse = await fetch(listUrl, { next: { revalidate: 3600 } });
		const listData = await listResponse.json();
		const urls = listData.results.map((p: any) => p.url);

		// 2. Obtener los detalles en paralelo (N+1)
		const detailPromises = urls.map((url: string) =>
			fetch(url).then((res) => res.json()),
		);
		const details = await Promise.all(detailPromises);

		return details; // Array de 20 detalles completos
	} catch (error) {
		console.error("Error fetching initial data on server:", error);
		return null;
	}
}
