"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	type SortingState,
} from "@tanstack/react-table";

// Imports de Hooks
import useMasterIndex from "./lib/hooks/useMasterIndex";
import { usePokemonDetails } from "./lib/hooks/usePokemonDetails";
import { usePaginatedDetails } from "./lib/hooks/usePaginatedDetails";

// Imports de UI y Tipos (Asegúrate de que estos paths sean correctos)
import { Modal } from "@turbo-pokedex/ui";
import PokemonsTable from "./components/PokemonsTable";
import type { PokemonDetail } from "./lib/api/fetchPokemon";
import Link from "next/link";
import type React from "react";

// Definición de Tipos
type HomeClientProps = {
	initialPage: number;
	pageSize: number;
};

// -----------------------------------------------------------
// 1. DEFINICIÓN DE COLUMNAS (Para TanStack Table)
// -----------------------------------------------------------
// Estas columnas se basan en el 'fullIndexData' (nombre/url)
// La columna 'name' es la única que podemos ordenar globalmente.
const columns = [
	{
		accessorKey: "name",
		header: "Nombre",
		enableSorting: true, // ⬅️ Habilita la ordenación global
	},
	// Añadimos las demás columnas estáticas que PokemonsTable renderizará
	// Deben tener un accessorKey para ser mapeadas, aunque el contenido venga de 'currentDetails'.
	{ accessorKey: "miniatura", header: "Miniatura", enableSorting: false },
	{ accessorKey: "base_experience", header: "XP Base", enableSorting: false },
	{ accessorKey: "types", header: "Tipos", enableSorting: false },
	{ accessorKey: "abilities", header: "Habilidades", enableSorting: false },
	{ accessorKey: "actions", header: "Acciones", enableSorting: false },
];

// =======================================================================
// === HOMECLIENT COMPONENTE PRINCIPAL ===
// =======================================================================
export default function HomeClient({ initialPage, pageSize }: HomeClientProps) {
	const router = useRouter();

	// -----------------------------------------------------------
	// 2. ESTADO DE LA TABLA (Controlado por TanStack Table)
	// -----------------------------------------------------------
	// La paginación usa index base 0, por eso restamos 1 a initialPage
	const [pagination, setPagination] = useState({
		pageIndex: initialPage - 1,
		pageSize: pageSize,
	});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState(""); // Filtro global (Búsqueda)
	const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(
		null,
	);

	// -----------------------------------------------------------
	// 3. FUENTE DE DATOS PRINCIPAL (El Índice de 1302 Nombres/URLs)
	// -----------------------------------------------------------
	const { data: fullIndexData = [], isLoading: isMasterLoading } =
		useMasterIndex();

	// -----------------------------------------------------------
	// 4. INICIALIZACIÓN DE TANSTACK TABLE
	// -----------------------------------------------------------
	const table = useReactTable({
		data: fullIndexData, // ⬅️ TanStack Table gestiona los 1302 ítems (NOMBRES/URLs)
		columns: columns,

		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),

		// Estados controlados
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,

		state: {
			sorting,
			globalFilter,
			pagination,
		},
		// TanStack Table tiene un filtro por defecto (fuzzing), para el nombre es suficiente
	});

	// -----------------------------------------------------------
	// 5. OBTENER LAS URLs A CARGAR (El Core de la Lógica Optimista)
	// -----------------------------------------------------------

	// Obtener las filas que TanStack Table decidió mostrar después de ordenar/filtrar
	const rows = table.getFilteredRowModel().rows;

	const totalFilteredRows = rows.length;
	const totalPages = table.getPageCount();
	const currentPageIndex = table.getState().pagination.pageIndex;

	// Extraemos las URLs de la rebanada (slice) de la página actual
	const urlsToFetch = rows
		.slice(currentPageIndex * pageSize, (currentPageIndex + 1) * pageSize)
		.map((row) => row.original.url);

	// -----------------------------------------------------------
	// 6. CARGA DE DETALLES Y HANDLERS
	// -----------------------------------------------------------

	// Carga los detalles de las 20 URLs actuales (N+1 optimizado)
	const { data: currentDetails, isLoading: isDetailsLoading } =
		usePaginatedDetails(urlsToFetch);

	// Carga los detalles para el modal
	const { data: pokemonDetails } = usePokemonDetails(
		selectedPokemonName
			? fullIndexData.find((p) => p.name === selectedPokemonName)?.url || null
			: null,
	);

	// Handler para el input de búsqueda
	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setGlobalFilter(value);
			// Resetear a la primera página de resultados filtrados
			table.setPageIndex(0);
		},
		[table],
	);

	// Handler de Paginación y Sincronización de URL
	const handlePageChange = useCallback(
		(newPageIndex: number) => {
			table.setPageIndex(newPageIndex);

			// Sincronizar la URL del navegador
			const sortParam = sorting
				.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`)
				.join(",");
			router.push(`/?page=${newPageIndex + 1}&sort=${sortParam}`, {
				scroll: false,
			});
		},
		[router, sorting, table],
	);

	const openModal = useCallback(
		(name: string) => setSelectedPokemonName(name),
		[],
	);
	const closeModal = useCallback(() => setSelectedPokemonName(null), []);

	// -----------------------------------------------------------
	// 7. RENDERIZADO
	// -----------------------------------------------------------

	const isTableLoading = isMasterLoading || isDetailsLoading;
	const isPrevDisabled = !table.getCanPreviousPage();
	const isNextDisabled = !table.getCanNextPage();

	if (isMasterLoading) {
		return <p style={{ padding: 16 }}>Cargando índice de Pokédex...</p>;
	}

	return (
		<>
			{/* Input de Búsqueda (Actualiza el globalFilter de TanStack Table) */}
			<div style={{ marginBottom: "20px" }}>
				<input
					type="text"
					placeholder="Buscar Pokémon (filtra los 1302)..."
					value={globalFilter}
					onChange={handleSearchChange}
					style={{ padding: "8px", width: "300px" }}
				/>
				{isDetailsLoading && (
					<span style={{ marginLeft: "10px" }}>🔎 Cargando detalles...</span>
				)}
			</div>

			{/* Controles de Paginación */}
			<nav style={{ paddingBottom: "16px" }}>
				<Link
					href="#"
					prefetch={false}
					onClick={(e) => {
						e.preventDefault();
						handlePageChange(currentPageIndex - 1);
					}}
					aria-disabled={isPrevDisabled}
					className={`px-4 py-2 rounded ${isPrevDisabled ? "pointer-events-none text-gray-400 cursor-not-allowed" : "text-blue-600 hover:underline"}`}
				>
					Anterior
				</Link>

				<span style={{ margin: "0 12px" }}>
					Página {currentPageIndex + 1} de {totalPages} (Mostrando{" "}
					{currentDetails?.length || 0} de {totalFilteredRows} Pokémon)
				</span>

				<Link
					href="#"
					prefetch={false}
					onClick={(e) => {
						e.preventDefault();
						handlePageChange(currentPageIndex + 1);
					}}
					aria-disabled={isNextDisabled}
					className={`px-4 py-2 rounded ${isNextDisabled ? "pointer-events-none text-gray-400 cursor-not-allowed" : "text-blue-600 hover:underline"}`}
				>
					Siguiente
				</Link>
			</nav>

			{/* Tabla de Pokémon */}
			{isDetailsLoading && currentDetails === null ? (
				<p>Cargando detalles de la página actual...</p>
			) : (
				<PokemonsTable
					// Los datos que le pasamos a la tabla son los 20 detalles cargados
					data={currentDetails || []}
					onSelect={openModal}
					instance={table} // ⬅️ Pasamos la instancia de control de TanStack Table
				/>
			)}

			{/* Mensaje de no encontrado */}
			{table.getFilteredRowModel().rows.length === 0 && !isTableLoading && (
				<p style={{ marginTop: "20px" }}>
					No se encontraron resultados para "{globalFilter}".
				</p>
			)}

			{/* Modal de Detalles */}
			<Modal
				isOpen={!!selectedPokemonName}
				onClose={closeModal}
				title={
					pokemonDetails ? `Detalles de ${pokemonDetails.name}` : "Detalles"
				}
			>
				{/* ... (renderizado de pokemonDetails) ... */}
			</Modal>
		</>
	);
}
