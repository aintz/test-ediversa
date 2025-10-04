import fs from "node:fs";
import path from "node:path";

const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";

//we assume this is the total ok available pokemons, in an iteration we should call first to check
const TOTAL_POKEMON = 1302;

async function generateFullPokemonsList() {
	console.log("iniciando fetch");
	try {
		const res = await fetch(`${POKE_API_URL}?limit=${TOTAL_POKEMON}`);
		if (!res.ok) {
			throw new Error(`Error calling api: ${res.status} ${res.statusText}`);
		}
		const data = await res.json();
		const pokeList = data.results;

		const filePath = path.join(process.cwd(), "data", "full_pokemon_list.json");
		fs.writeFileSync(filePath, JSON.stringify(pokeList, null, 2));

		console.log("guardado!!");
	} catch (err) {
		console.log("Error calling de pokeAPI ->", err);
		process.exit(1);
	}
}

generateFullPokemonsList();
