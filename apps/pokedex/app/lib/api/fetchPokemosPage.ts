import {
	getPokemonList,
	getPokemonByName,
	type PokemonDetail,
} from "./fetchPokemon";

export async function getPokemonsPage(page: number, pageSize: number) {
	const offset = (page - 1) * pageSize;

	const pokemonsList = await getPokemonList(pageSize, offset);

	const pokemonsListWithDetails: PokemonDetail[] = await Promise.all(
		pokemonsList.results.map((pokemon) => getPokemonByName(pokemon.name)),
	);

	return { count: pokemonsList.count, results: pokemonsListWithDetails };
}
