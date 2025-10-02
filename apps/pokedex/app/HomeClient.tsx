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
	type ColumnDef,
} from "@tanstack/react-table";

import useMasterIndex from "./lib/hooks/useMasterIndex";
import { usePokemonDetails } from "./lib/hooks/usePokemonDetails";
import { usePaginatedDetails } from "./lib/hooks/usePaginatedDetails";
import PokemonsTable from "./components/PokemonsTable";
import Link from "next/link";
import type React from "react";
import type { PokemonListItem } from "./lib/types/pokemon";
import PokemonModal from "./components/PokemonModal";
import type { PokemonModalDetail } from "./lib/types/pokemon";
import styles from "./styles/page.module.css";

type HomeClientProps = {
	initialPage: number;
	pageSize: number;
};

const columns: ColumnDef<PokemonListItem>[] = [
	{
		accessorKey: "name",
		header: "Nombre",
		enableSorting: true,
		sortingFn: "alphanumeric",
	},
	{ accessorKey: "miniatura", header: "Miniatura", enableSorting: false },
	{ accessorKey: "base_experience", header: "XP Base", enableSorting: false },
	{ accessorKey: "types", header: "Tipos", enableSorting: false },
	{ accessorKey: "abilities", header: "Habilidades", enableSorting: false },
	{ accessorKey: "actions", header: "Acciones", enableSorting: false },
];

export default function HomeClient({ initialPage, pageSize }: HomeClientProps) {
	const router = useRouter();

	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(
		null,
	);
	const [selectedPokemonData, setSelectedPokemonData] =
		useState<PokemonModalDetail | null>(null);

	const { data: fullIndexData = [], isLoading: isMasterLoading } =
		useMasterIndex();

	const table = useReactTable({
		data: fullIndexData,
		columns: columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			globalFilter,
			pagination: {
				pageIndex: initialPage - 1,
				pageSize: pageSize,
			},
		},
	});

	const rows = table.getSortedRowModel().rows;

	useEffect(() => {
		const staticTable = document.querySelector(".no-js-table");
		staticTable?.classList.add("no-display");
	}, []);

	useEffect(() => {
		const currentPage = table.getState().pagination.pageIndex + 1;

		if (sorting.length > 0) {
			const sortParam = sorting
				.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`)
				.join(",");

			router.replace(`/?page=${currentPage}&sort=${sortParam}`, {
				scroll: false,
			});
		} else {
			router.replace(`/?page=${currentPage}`, {
				scroll: false,
			});
		}
	}, [sorting, table, router]);

	const totalFilteredRows = rows.length;
	const totalPages = table.getPageCount();
	const currentPageIndex = table.getState().pagination.pageIndex;

	const urlsToFetch = rows
		.slice(currentPageIndex * pageSize, (currentPageIndex + 1) * pageSize)
		.map((row) => row.original.url);

	const { data: currentDetails, isLoading: isDetailsLoading } =
		usePaginatedDetails(urlsToFetch);

	const { data: pokemonDetails } = usePokemonDetails(
		selectedPokemonName
			? fullIndexData.find((p) => p.name === selectedPokemonName)?.url || null
			: null,
	);

	useEffect(() => {
		if (selectedPokemonName && currentDetails) {
			const index = currentDetails.findIndex(
				(pokemon) => pokemon.name === selectedPokemonName,
			);
			setSelectedPokemonData(currentDetails[index]);
		}
	}, [selectedPokemonName, currentDetails]);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setGlobalFilter(value);
			table.setPageIndex(0);

			const sortParam = sorting
				.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`)
				.join(",");
			router.push(`/?page=1&sort=${sortParam}`, {
				scroll: false,
			});
		},
		[table, router, sorting],
	);

	const handlePageChange = useCallback(
		(newPageIndex: number) => {
			const sortParam = sorting
				.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`)
				.join(",");
			router.push(`/?page=${newPageIndex + 1}&sort=${sortParam}`, {
				scroll: false,
			});
		},
		[router, sorting],
	);

	const openModal = useCallback(
		(name: string) => setSelectedPokemonName(name),
		[],
	);
	const closeModal = useCallback(() => setSelectedPokemonName(null), []);

	const isTableLoading = isMasterLoading || isDetailsLoading;
	const isPrevDisabled = !table.getCanPreviousPage();
	const isNextDisabled = !table.getCanNextPage();

	const sortParam = sorting
		.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`)
		.join(",");
	const prevPageUrl = `/?page=${currentPageIndex}&sort=${sortParam}`;
	const nextPageUrl = `/?page=${currentPageIndex + 2}&sort=${sortParam}`;

	return (
		<section className={`${styles.mainContainer} js-enabled`}>
			<search className={styles.searchContainer}>
				<label>
					Busca a tu pokémon por nombre 🔎
					<input
						type="text"
						value={globalFilter}
						onChange={handleSearchChange}
					/>
				</label>
			</search>
			{rows.length === 0 && !isTableLoading && (
				<p>No se encontraron resultados para "{globalFilter}".</p>
			)}
			{isDetailsLoading && currentDetails === null ? (
				<p>Cargando lista de pokemones...</p>
			) : (
				<PokemonsTable
					data={currentDetails || []}
					onSelect={openModal}
					instance={table}
				/>
			)}

			{selectedPokemonName && selectedPokemonData && (
				<PokemonModal
					isOpen={!!selectedPokemonName}
					onClose={closeModal}
					data={selectedPokemonData}
				></PokemonModal>
			)}
			<nav className={styles.navigation}>
				{totalPages > 1 && (
					<Link
						href={isPrevDisabled ? "#" : prevPageUrl}
						prefetch={false}
						onClick={(e) => {
							if (!isPrevDisabled) {
								e.preventDefault();
								handlePageChange(currentPageIndex - 1);
							}
						}}
						aria-disabled={isPrevDisabled}
					>
						Anterior
					</Link>
				)}

				<span>
					Página {currentPageIndex + 1} de {totalPages} (Mostrando{" "}
					{currentDetails?.length || 0} de {totalFilteredRows} Pokémons)
				</span>

				{totalPages > 1 && (
					<Link
						href={isNextDisabled ? "#" : nextPageUrl}
						prefetch={false}
						onClick={(e) => {
							if (!isNextDisabled) {
								e.preventDefault();
								handlePageChange(currentPageIndex + 1);
							}
						}}
						aria-disabled={isNextDisabled}
					>
						Siguiente
					</Link>
				)}
			</nav>
		</section>
	);
}
