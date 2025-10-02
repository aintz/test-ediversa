"use client";

import { UsePokemonsList } from "../lib/hooks/UsePokemons";
import type { PokemonDetail } from "../lib/api/fetchPokemon";
import { Button } from "@turbo-pokedex/ui";

type PokemonsTableProps = {
	page: number;
	pageSize: number;
	onSelect: (name: string) => void;
	onPageChange: (nextPage: number) => void;
};

export default function PokemonsTable({
	page,
	pageSize = 20,
	onSelect,
	onPageChange,
}: PokemonsTableProps) {
	const { data, isLoading, isError, isFetching } = UsePokemonsList(page, 20);
	console.log("data", data);

	if (isLoading) return <p>Loading pokemons…</p>;
	if (isError || !data) return <p>Error loading pokemons</p>;

	//data.count -> available pokemons
	const totalPages = Math.ceil(data.count / 20);
	//ANADIR QUE LOS LIMITES DE PAGINACIOOOOOOOONNNN
	return (
		<div>
			<div style={{ marginBottom: "1rem" }}>
				<Button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
					Prev
				</Button>
				<span style={{ margin: "0 1rem" }}>
					Page {page} / {totalPages}
				</span>
				<Button
					disabled={page >= totalPages}
					onClick={() => onPageChange(page + 1)}
				>
					Next
				</Button>
				{isFetching && <span style={{ marginLeft: "1rem" }}>Updating…</span>}
			</div>

			<table style={{ width: "100%", borderCollapse: "collapse" }}>
				<thead>
					<tr>
						<th>Thumbnail</th>
						<th>Name</th>
						<th>Base XP</th>
						<th>Types</th>
						<th>Abilities</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{data.results.map((p) => (
						<tr key={p.name}>
							<td>
								{p.sprites.front_default && (
									<img src={p.sprites.front_default} alt={p.name} width={50} />
								)}
							</td>
							<td>{p.name}</td>
							<td>{p.base_experience}</td>
							<td>{p.types.map((t) => t.type.name).join(", ")}</td>
							<td>{p.abilities.map((a) => a.ability.name).join(", ")}</td>
							<td>
								<Button onClick={() => onSelect(p.name)}>Details</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div style={{ marginTop: "1rem" }}>
				<Button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
					Prev
				</Button>
				<span style={{ margin: "0 1rem" }}>
					Page {page} / {totalPages}
				</span>
				<Button
					disabled={page >= totalPages}
					onClick={() => onPageChange(page + 1)}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
