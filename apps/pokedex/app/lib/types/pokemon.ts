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

export interface PokemonListItem {
	name: string;
	url: string;
}

interface NamedAPIResource {
	name?: string;
	url?: string;
}

interface VersionGameIndex {
	game_index?: number;
	version?: NamedAPIResource;
}

interface PokemonAbility {
	ability?: NamedAPIResource;
	is_hidden?: boolean;
	slot?: number;
}

interface PokemonMoveVersion {
	level_learned_at?: number;
	move_learn_method?: NamedAPIResource;
	order?: number | null;
	version_group?: NamedAPIResource;
}

interface PokemonMove {
	move?: NamedAPIResource;
	version_group_details?: PokemonMoveVersion[];
}

interface PokemonStat {
	base_stat?: number;
	effort?: number;
	stat?: NamedAPIResource;
}

interface PokemonType {
	slot?: number;
	type?: NamedAPIResource;
}

interface PokemonCries {
	latest?: string;
	legacy?: string;
}

interface HomeSprites {
	front_default?: string | null;
	front_female?: string | null;
	front_shiny?: string | null;
	front_shiny_female?: string | null;
}

interface OfficialArtwork {
	front_default?: string | null;
	front_shiny?: string | null;
}

interface PokemonSprites {
	back_default?: string | null;
	back_female?: string | null;
	back_shiny?: string | null;
	back_shiny_female?: string | null;
	front_default?: string | null;
	front_female?: string | null;
	front_shiny?: string | null;
	front_shiny_female?: string | null;

	other?: {
		dream_world?: HomeSprites; // Reusing HomeSprites for simplicity
		home?: HomeSprites;
		"official-artwork"?: OfficialArtwork;
		// Showing other versions is excessively deep; using any for brevity:
		showdown?: any;
	};
	versions?: any;
}

export interface PokemonModalDetail {
	abilities?: PokemonAbility[];
	base_experience?: number;
	cries?: PokemonCries;
	forms?: NamedAPIResource[];
	game_indices?: VersionGameIndex[];
	height?: number;
	held_items?: any[];
	id?: number;
	is_default?: boolean;
	location_area_encounters?: string;
	moves?: PokemonMove[];
	name: string;
	order?: number;
	past_abilities?: any[];
	past_types?: PokemonType[];
	species?: NamedAPIResource;
	sprites?: PokemonSprites;
	stats?: PokemonStat[];
	types?: PokemonType[];
	weight?: number;
}
