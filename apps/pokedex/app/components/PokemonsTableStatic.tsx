import styles from "../styles/page.module.css";
import Image from "next/image";
import type { PokemonDetail } from "../lib/types/pokemon";

type PokemonsTableProps = {
	data: PokemonDetail[];
};

export default function PokemonsTableStatic({ data }: PokemonsTableProps) {
	return (
		<section className={styles.mainContainer}>
			<table className={`${styles.table} no-js-table`}>
				<thead>
					<tr>
						<th align="center">Miniatura</th>
						<th align="center">Nombre</th>
						<th align="center">XP Base</th>
						<th align="center">Tipos</th>
					</tr>
				</thead>
				<tbody>
					{data.length > 0 ? (
						data.map((pokemon) => (
							<tr key={pokemon.id}>
								<td align="center">
									<Image
										src={pokemon.sprites?.front_default ?? "/placeholder.png"}
										alt={pokemon.name}
										width={50}
										height={50}
									></Image>
								</td>
								<td align="center">{pokemon.name}</td>
								<td align="center">{pokemon.base_experience}</td>
								<td align="center">
									{pokemon.types.map((t) => t.type.name).join(", ")}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td>No hay Pokémon disponibles.</td>
						</tr>
					)}
				</tbody>
			</table>
		</section>
	);
}
