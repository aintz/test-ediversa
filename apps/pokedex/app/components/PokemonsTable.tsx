// PokemonsTable.jsx o el archivo que renderiza el <table>

import { flexRender, type Table } from "@tanstack/react-table";
import type { PokemonDetail } from "../lib/types/pokemon";
import Image from "next/image";
import styles from "../styles/page.module.css";
import { Button } from "@headlessui/react";

type PokemonsTableProps = {
	data: PokemonDetail[];
	instance: Table<any>;
	onSelect: (name: string) => void;
};

export default function PokemonsTable({
	data,
	instance,
	onSelect,
}: PokemonsTableProps) {
	const headerGroup = instance.getHeaderGroups()[0];

	const rows = data;
	return (
		<table className={styles.table}>
			<thead>
				<tr>
					<th align="center">Miniatura</th>
					{headerGroup.headers.map((header) => {
						if (header.id === "name") {
							return (
								<th
									key={header.id}
									align="center"
									style={{
										cursor: header.column.getCanSort() ? "pointer" : "default",
									}}
									onClick={header.column.getToggleSortingHandler()}
								>
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
									{header.column.getIsSorted()
										? header.column.getIsSorted() === "desc"
											? " ⬇️"
											: " ⬆️"
										: " ↕️"}
								</th>
							);
						}
						return null;
					})}
					{["XP Base", "Tipos", "Acciones"].map((headerText) => (
						<th key={headerText} align="center">
							{headerText}
						</th>
					))}
				</tr>
			</thead>

			<tbody>
				{rows.length > 0 ? (
					rows.map((pokemon) => (
						<tr key={pokemon.name}>
							<td align="center">
								{pokemon.sprites?.front_default && (
									<Image
										src={pokemon.sprites.front_default}
										alt={pokemon.name}
										width={50}
										height={50}
									/>
								)}
							</td>
							<td align="center">{pokemon.name}</td>
							<td align="center">{pokemon.base_experience}</td>
							<td align="center">
								{pokemon.types.map((t) => t.type.name).join(", ")}
							</td>
							<td align="center">
								<Button
									style={{
										backgroundColor: "#5b4b8a",
										color: "#fff",
										border: "1px solid #5b4b8a",
										fontFamily: "Space Grotesk",
										padding: "8px 12px",
										cursor: "pointer",
										fontSize: "15px",
									}}
									type="button"
									onClick={() => onSelect(pokemon.name)}
								>
									Ver Detalles
								</Button>
							</td>
						</tr>
					))
				) : (
					<tr>
						<td colSpan={6} align="center">
							Nada para mostrar
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
}
