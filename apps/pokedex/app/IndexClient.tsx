"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePokemonsList, usePokemon } from "./lib/hooks/UsePokemons";
import { Modal, Button } from "@turbo-pokedex/ui";
import PokemonsTable from "./components/PokemonsTable";
import type { PokemonDetail } from "./lib/api/fetchPokemon";
import Link from "next/link";
import type React from "react";
import useDebounce from "./lib/hooks/useDebounce";

type IndexClientProps = {
	initialPage: number;
	pageSize: number;
};

export default function IndexClient({
	initialPage,
	pageSize,
}: IndexClientProps) {
	const router = useRouter();
	const [page, setPage] = useState(initialPage);
	const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(
		null,
	);
	const [searchPokemon, setSearchPokemon] = useState<string>("");
	const debouncedValue = useDebounce(searchPokemon, 800);

	const { data, isLoading, isFetching, isPlaceholderData, isError } =
		usePokemonsList(page, pageSize);

	// search of the pokemon for the modal + table details
	const { data: pokemonDetails, isLoading: isDetailsLoading } =
		usePokemon(selectedPokemonName);

	//search of the pokemon by the input
	const {
		data: searchData,
		isLoading: isSearchLoading,
		//irError: isSearchError,
	} = usePokemon(debouncedValue || null);

	let tableData: PokemonDetail[] = [];

	if (searchPokemon && searchData) {
		tableData = [searchData];
	} else if (searchPokemon && !searchData) {
		tableData = [];
	} else {
		tableData = data?.results || [];
	}

	const totalPages = data ? Math.ceil(data.count / pageSize) : 1;
	const isReady = !isLoading && !isError;

	const prevPage = page - 1;
	const nextPage = page + 1;

	const isPrevDisabled = page === 1 || isFetching || !isReady;
	const isNextDisabled = page === totalPages || isFetching || !isReady;

	const handlePageChange = useCallback(
		(newPage: number) => {
			if (newPage < 1) return;
			setPage(newPage);
			router.push(`/?page=${newPage}`, { scroll: false });
		},
		[router],
	);

	const handleLinkClick = useCallback(
		(e: React.MouseEvent, targetPage: number) => {
			const isDisabled =
				targetPage < 1 || targetPage > totalPages || isFetching || !isReady;

			if (isDisabled) {
				e.preventDefault();
				return;
			}
			e.preventDefault();
			handlePageChange(targetPage);
		},
		[totalPages, isFetching, isReady, handlePageChange],
	);

	const openModal = useCallback((name: string) => {
		setSelectedPokemonName(name);
	}, []);

	const closeModal = useCallback(() => {
		setSelectedPokemonName(null);
	}, []);

	if (isError) {
		//|| isSearchError
		return <div>Error al cargar los datos iniciales. Inténtalo de nuevo.</div>;
	}

	if (
		(isLoading && !data && !searchData) ||
		(isSearchLoading && searchPokemon)
	) {
		return <p>Cargando Pokédex...</p>;
	}

	function handleSearchPokemon(e: React.ChangeEvent<HTMLInputElement>) {
		setSearchPokemon(e.target.value.toLowerCase());
		setPage(1);
	}

	function handleResetTable() {
		setSearchPokemon("");
	}

	return (
		<>
			<div>
				<input
					type="text"
					placeholder="Search pokemon by name"
					value={searchPokemon}
					onChange={handleSearchPokemon}
				></input>
				{searchPokemon && (
					<button type="button" onClick={handleResetTable}>
						reset table
					</button>
				)}
			</div>
			{!searchPokemon && (
				<nav>
					<Link
						href={prevPage > 0 ? `/?page=${prevPage}` : "#"}
						prefetch={false}
						onClick={(e) => handleLinkClick(e, prevPage)}
						aria-disabled={isPrevDisabled}
						className={`px-4 py-2 rounded ${
							isPrevDisabled
								? "pointer-events-none text-gray-400 cursor-not-allowed"
								: "text-blue-600 hover:underline"
						}`}
					>
						Anterior
					</Link>

					<span>
						Página {page} de {totalPages}
					</span>

					<Link
						href={nextPage <= totalPages ? `/?page=${nextPage}` : "#"}
						prefetch={false}
						onClick={(e) => handleLinkClick(e, nextPage)}
						aria-disabled={isNextDisabled}
						className={`px-4 py-2 rounded ${
							isNextDisabled
								? "pointer-events-none text-gray-400 cursor-not-allowed"
								: "text-blue-600 hover:underline"
						}`}
					>
						Siguiente
					</Link>

					{isFetching && (
						<span style={{ color: "blue", marginLeft: "12px" }}>
							Actualizando...
						</span>
					)}
				</nav>
			)}

			<PokemonsTable
				data={tableData}
				isStale={isPlaceholderData || isFetching}
				onSelect={openModal}
			/>

			<Modal
				isOpen={!!selectedPokemonName}
				onClose={closeModal}
				title={
					pokemonDetails ? `Detalles de ${pokemonDetails.name}` : "Detalles"
				}
			>
				{isDetailsLoading && !pokemonDetails ? (
					<p>Cargando detalles de {selectedPokemonName}...</p>
				) : pokemonDetails ? (
					<div>
						<h3>{pokemonDetails.name}</h3>
						<p>ID: {pokemonDetails.id}</p>
						<p>
							Tipos: {pokemonDetails.types.map((t) => t.type.name).join(", ")}
						</p>
					</div>
				) : (
					<p>No se encontraron detalles o ha ocurrido un error.</p>
				)}
			</Modal>
		</>
	);
}
