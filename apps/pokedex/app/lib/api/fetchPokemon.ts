export type PokemonListItem = {
	name: string;
	url: string;
};

export type PokemonList = {
	count: number;
	next: string | null;
	previous: string | null;
	results: PokemonListItem[];
};

export type PokemonDetail = {
	id: number;
	name: string;
	base_experience: number;
	height: number;
	weight: number;
	sprites: { front_default: string | null };
	types: { slot: number; type: { name: string } }[];
	abilities: { is_hidden: boolean; ability: { name: string } }[];
};

const API_URL = "https://pokeapi.co/api/v2";

export async function getPokemonList(
	limit = 20,
	offset = 0,
): Promise<PokemonList> {
	const res = await fetch(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`);
	if (!res.ok) throw new Error("Error fetching pokemons list");
	return res.json();
}

export async function getPokemonByName(name: string): Promise<PokemonDetail> {
	const res = await fetch(`${API_URL}/pokemon/${name}`);
	if (!res.ok) throw new Error(`Error fetching the pokemon: ${name}`);
	return res.json();
}
