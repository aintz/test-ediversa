// PokemonsTable.jsx o el archivo que renderiza el <table>

import { flexRender, type Table } from "@tanstack/react-table";
import type { PokemonDetail } from "../lib/api/fetchPokemon";
// Asegúrate de importar el tipo correcto para PokemonDetail
// import type { PokemonDetail } from '../lib/api/fetchPokemon';

interface PokemonsTableProps {
	data: PokemonDetail[];
	// La instancia de la tabla que gestiona los 1302 ítems (ordenación/filtrado)
	instance: Table<any>;
	onSelect: (name: string) => void;
}

const PokemonsTable = ({ data, instance, onSelect }: PokemonsTableProps) => {
	// Obtenemos los encabezados que la instancia ha determinado
	const headerGroup = instance.getHeaderGroups()[0];

	// Mapeamos los detalles cargados a las filas (solo 20, ya ordenados/filtrados)
	// Usamos 'data' para el cuerpo, ya que 'instance.getRowModel().rows' contiene 1302 filas de ÍNDICE, no de DETALLES.
	const rows = data;

	// Función para obtener un valor seguro
	const getDetailValue = (pokemon: PokemonDetail, key: string) => {
		// En un componente real, usarías un switch o un mapeo más robusto
		switch (key) {
			case "XP Base":
				return pokemon.base_experience;
			case "Tipos":
				return pokemon.types.map((t) => t.type.name).join(", ");
			case "Habilidades":
				return pokemon.abilities.map((a) => a.ability.name).join(", ");
			default:
				return "";
		}
	};

	return (
		<table
			style={{
				width: "100%",
				borderCollapse: "collapse",
				border: "1px solid #ddd",
			}}
		>
			<thead>
				<tr>
					{/* ---------------------------------------------------- */}
					{/* 1. Encabezados Estáticos/Funcionales */}
					{/* ---------------------------------------------------- */}

					<th
						align="left"
						style={{ padding: "8px", borderBottom: "2px solid #ccc" }}
					>
						Miniatura
					</th>

					{/* Encabezado ORDENABLE: Usa la instancia de TanStack Table */}
					{headerGroup.headers.map((header) => {
						// Solo renderizamos el encabezado 'Nombre' de la instancia
						if (header.id === "name") {
							return (
								<th
									key={header.id}
									align="left"
									style={{
										cursor: header.column.getCanSort() ? "pointer" : "default",
										padding: "8px",
										borderBottom: "2px solid #ccc",
										fontWeight: "bold",
									}}
									// 💡 LÓGICA DE CLIC: Activa la ordenación global en los 1302 ítems
									onClick={header.column.getToggleSortingHandler()}
								>
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
									{/* Indicador de Ordenación */}
									{header.column.getIsSorted()
										? header.column.getIsSorted() === "desc"
											? " ⬇️"
											: " ⬆️"
										: ""}
								</th>
							);
						}
						return null; // Ignora cualquier otro encabezado que venga de la instancia
					})}

					{/* Encabezados ESTÁTICOS (No Ordenables Globalmente) */}
					{["XP Base", "Tipos", "Habilidades", "Acciones"].map((headerText) => (
						<th
							key={headerText}
							align="left"
							style={{
								padding: "8px",
								borderBottom: "2px solid #ccc",
								fontWeight: "bold",
							}}
						>
							{headerText}
						</th>
					))}
				</tr>
			</thead>

			<tbody>
				{/* ---------------------------------------------------- */}
				{/* 2. Cuerpo de la Tabla (Renderiza los 20 Detalles Cargados) */}
				{/* ---------------------------------------------------- */}
				{rows.length > 0 ? (
					rows.map((pokemon) => (
						<tr key={pokemon.name} style={{ borderBottom: "1px solid #eee" }}>
							{/* Miniatura */}
							<td align="left" style={{ padding: "8px" }}>
								{/* Asume que la URL de la imagen está en sprites.front_default */}
								{pokemon.sprites?.front_default && (
									<img
										src={pokemon.sprites.front_default}
										alt={pokemon.name}
										style={{ width: "50px", height: "50px" }}
									/>
								)}
							</td>

							{/* Nombre (Ya viene ordenado/filtrado por el índice maestro) */}
							<td align="left" style={{ padding: "8px" }}>
								{pokemon.name}
							</td>

							{/* XP Base */}
							<td align="left" style={{ padding: "8px" }}>
								{pokemon.base_experience}
							</td>

							{/* Tipos */}
							<td align="left" style={{ padding: "8px" }}>
								{pokemon.types.map((t) => t.type.name).join(", ")}
							</td>

							{/* Habilidades */}
							<td align="left" style={{ padding: "8px" }}>
								{pokemon.abilities.map((a) => a.ability.name).join(", ")}
							</td>

							{/* Acciones */}
							<td align="left" style={{ padding: "8px" }}>
								<button
									type="button"
									onClick={() => onSelect(pokemon.name)}
									style={{ padding: "5px", cursor: "pointer" }}
								>
									Ver Detalles
								</button>
							</td>
						</tr>
					))
				) : (
					<tr>
						<td colSpan={6} align="center" style={{ padding: "16px" }}>
							No hay datos para mostrar en esta página.
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};

export default PokemonsTable;
