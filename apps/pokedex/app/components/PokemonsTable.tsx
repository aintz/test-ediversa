// PokemonsTable.tsx - Solo estructura HTML de la tabla y las filas

"use client";
import { Button } from "@turbo-pokedex/ui";
import type { PokemonDetail } from "../lib/api/fetchPokemon";

type PokemonsTableProps = {
	data: PokemonDetail[];
	isStale: boolean;
	onSelect: (name: string) => void;
};

export default function PokemonsTable({ data, onSelect }: PokemonsTableProps) {
	return (
		<table>
			<thead>
				<tr>
					<th align="left">Miniatura</th>
					<th align="left">Nombre</th>
					<th align="left">XP Base</th>
					<th align="left">Tipos</th>
					<th align="left">Habilidades</th>
					<th align="left">Acciones</th>
				</tr>
			</thead>
			<tbody>
				{data.length > 0 ? (
					data.map((p) => (
						<tr key={p.name}>
							<td>
								{p.sprites.front_default && (
									<img src={p.sprites.front_default} alt={p.name} width={50} />
								)}
							</td>
							<td>{p.name}</td>
							<td>{p.base_experience}</td>
							<td>{p.types?.map((t) => t.type.name).join(", ")}</td>
							<td>{p.abilities?.map((a) => a.ability.name).join(", ")}</td>
							<td>
								<Button onClick={() => onSelect(p.name)}>Más detalles</Button>
							</td>
						</tr>
					))
				) : (
					<tr>
						<td colSpan={6}>No hay datos para mostrar.</td>
					</tr>
				)}
			</tbody>
		</table>
	);
}
