import { render, screen } from "@testing-library/react";
import type { PokemonModalDetail } from "@/app/lib/types/pokemon";
import "@testing-library/jest-dom";
import PokemonModal from "@/app/components/PokemonModal";
import userEvent from "@testing-library/user-event";

const mockData: PokemonModalDetail = {
	id: 25,
	name: "pikachu",
	base_experience: 112,
	height: 4,
	weight: 60,
	is_default: true,
	order: 35,
	location_area_encounters: "https://pokeapi.co/api/v2/pokemon/25/encounters",

	abilities: [
		{
			ability: { name: "static", url: "https://pokeapi.co/api/v2/ability/9/" },
			is_hidden: false,
			slot: 1,
		},
		{
			ability: {
				name: "lightning-rod",
				url: "https://pokeapi.co/api/v2/ability/31/",
			},
			is_hidden: true,
			slot: 3,
		},
	],

	types: [
		{
			slot: 1,
			type: { name: "electric", url: "https://pokeapi.co/api/v2/type/13/" },
		},
	],

	cries: {
		latest: "https://pokeapi.co/media/cries/pokemon/latest/25.ogg",
		legacy: "https://pokeapi.co/media/cries/pokemon/legacy/25.ogg",
	},

	forms: [
		{ name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon-form/25/" },
	],

	sprites: {
		front_default:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
		front_shiny:
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png",
		other: {
			home: {
				front_default:
					"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/25.png",
				front_shiny:
					"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/25.png",
			},
			"official-artwork": {
				front_default:
					"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
				front_shiny:
					"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/25.png",
			},
		},
	},

	stats: [
		{
			base_stat: 35,
			effort: 0,
			stat: { name: "hp", url: "https://pokeapi.co/api/v2/stat/1/" },
		},
		{
			base_stat: 55,
			effort: 0,
			stat: { name: "attack", url: "https://pokeapi.co/api/v2/stat/2/" },
		},
		{
			base_stat: 40,
			effort: 0,
			stat: { name: "defense", url: "https://pokeapi.co/api/v2/stat/3/" },
		},
		{
			base_stat: 90,
			effort: 2,
			stat: { name: "speed", url: "https://pokeapi.co/api/v2/stat/6/" },
		},
	],

	moves: [
		{
			move: {
				name: "thunder-shock",
				url: "https://pokeapi.co/api/v2/move/84/",
			},
			version_group_details: [
				{
					level_learned_at: 1,
					move_learn_method: {
						name: "level-up",
						url: "https://pokeapi.co/api/v2/move-learn-method/1/",
					},
					version_group: {
						name: "red-blue",
						url: "https://pokeapi.co/api/v2/version-group/1/",
					},
				},
			],
		},
	],

	species: {
		name: "pikachu",
		url: "https://pokeapi.co/api/v2/pokemon-species/25/",
	},
};

const isOpenMock = true;

describe("Pokemons Modal", () => {
	it("should render", () => {
		render(
			<PokemonModal
				isOpen={isOpenMock}
				onClose={jest.fn()}
				data={mockData}
			></PokemonModal>,
		);
	});
	it("should render the data correctly", () => {
		render(
			<PokemonModal
				isOpen={isOpenMock}
				onClose={jest.fn()}
				data={mockData}
			></PokemonModal>,
		);

		const pokeImage = screen.getByRole("img");

		expect(screen.getByText("pikachu")).toBeInTheDocument();
		expect(screen.getByText(4)).toBeInTheDocument();
		expect(screen.getByText(60)).toBeInTheDocument();
		expect(screen.getByText(/static/i)).toBeInTheDocument();
		expect(pokeImage).toBeInTheDocument();
		expect(pokeImage).toHaveAttribute("alt", "Foto del pokémon pikachu");
	});
	it("should close the modal if the user clicks outside", async () => {
		const user = userEvent.setup();
		const handleClose = jest.fn();
		render(
			<PokemonModal
				isOpen={isOpenMock}
				onClose={handleClose}
				data={mockData}
			></PokemonModal>,
		);

		await user.keyboard("{escape}");

		expect(handleClose).toHaveBeenCalledTimes(1);
	});
});
