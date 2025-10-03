// PokemonsTable.tsx - Solo estructura HTML de la tabla y las filas

"use client";
import { Button } from "@turbo-pokedex/ui";
import type { PokemonDetail } from "../lib/api/fetchPokemon";

type PokemonsTableProps = {
	data: PokemonDetail[];
	isStale: boolean;
	onSelect: (name: string) => void;
};

export default function PokemonsTable({
	data,
	isStale,
	onSelect,
}: PokemonsTableProps) {
	// Aquí podrías mantener un filtro local si fuera necesario,
	// pero para simplicidad y para evitar confusión, lo omitimos por ahora.

	const tableOpacity = isStale ? 0.6 : 1;

	return (
		// ⚠️ Nota: Ya no hay botones de paginación ni inputs aquí.
		<table
			style={{
				width: "100%",
				borderCollapse: "collapse",
				opacity: tableOpacity,
				transition: "opacity 0.3s",
			}}
		>
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
						<tr key={p.name} style={{ borderTop: "1px solid #eee" }}>
							{/* ... celdas de datos ... */}
							<td style={{ textTransform: "capitalize" }}>{p.name}</td>
							<td>{p.base_experience}</td>
							<td>{p.types?.map((t) => t.type.name).join(", ")}</td>
							<td>{p.abilities?.map((a) => a.ability.name).join(", ")}</td>
							<td>
								<Button onClick={() => onSelect(p.name)}>Detalles</Button>
							</td>
						</tr>
					))
				) : (
					<tr>
						<td colSpan={6} style={{ textAlign: "center", padding: "16px" }}>
							No hay datos para mostrar.
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
}
