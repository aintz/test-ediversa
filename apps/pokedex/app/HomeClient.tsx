"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePokemonsList, usePokemon } from "./lib/hooks/UsePokemons";
import { Modal, Button } from "@turbo-pokedex/ui";
import PokemonsTable from "./components/PokemonsTable";
import type { PokemonDetail } from "./lib/api/fetchPokemon";
import Link from "next/link";

type HomeClientProps = {
	initialPage: number;
	pageSize: number;
};

export default function HomeClient({ initialPage, pageSize }: HomeClientProps) {
	const router = useRouter();
	// El estado de la página comienza con el valor de la URL (initialPage)
	const [page, setPage] = useState(initialPage);
	const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(
		null,
	);

	// 1. Fetch de Datos Principal con TanStack Query
	// isLoading: true solo en la carga inicial (si no hay caché)
	// isFetching: true para cualquier fetch en curso (ej. al cambiar de página)
	// isPlaceholderData: true si estamos mostrando datos viejos mientras se carga lo nuevo
	const { data, isLoading, isFetching, isPlaceholderData, isError } =
		usePokemonsList(page, pageSize);

	// 2. Fetch de Datos para el Modal
	const { data: pokemonDetails, isLoading: isDetailsLoading } =
		usePokemon(selectedPokemonName);

	// 3. Handlers de Navegación y Modal
	const handlePageChange = useCallback(
		(newPage: number) => {
			// No permitimos navegación a páginas inválidas
			if (newPage < 1) return;

			// Actualiza el estado local (dispara usePokemonsList)
			setPage(newPage);

			// Actualiza la URL para sincronizar y permitir compartir la página
			router.push(`/?page=${newPage}`, { scroll: false });
		},
		[router],
	);

	const openModal = useCallback((name: string) => {
		setSelectedPokemonName(name);
	}, []);

	const closeModal = useCallback(() => {
		setSelectedPokemonName(null);
	}, []);

	// 4. Cálculos y Renderizado Condicional

	const tableData: PokemonDetail[] = data?.results || [];
	const totalPages = data ? Math.ceil(data.count / pageSize) : 1;
	const isReady = !isLoading && !isError;

	// Mostrar un error fatal si la carga inicial falla
	if (isError) {
		return (
			<div style={{ padding: 16, color: "red" }}>
				Error al cargar los datos iniciales. Inténtalo de nuevo.
			</div>
		);
	}

	// Mostrar un estado de carga si la hidratación falló
	if (isLoading && !data) {
		return <p style={{ padding: 16 }}>Cargando Pokédex...</p>;
	}

	function handlePepe(e) {
		e.preventDefault();
		handlePageChange(page + 1);
	}

	return (
		<>
			{/* -------------------- Controles de Paginación Superior -------------------- */}
			<nav>
				<Link
					onNavigate={handlePepe}
					href={page < totalPages ? `/?page=${page + 1}` : "#"}
				>
					Pepe
				</Link>

				<Button
					onClick={() => handlePageChange(page - 1)}
					disabled={page === 1 || isFetching || !isReady}
				>
					⬅ Anterior
				</Button>
				<span style={{ opacity: isFetching ? 0.5 : 1 }}>
					Página {page} / {totalPages}
				</span>

				<Button
					onClick={() => handlePageChange(page + 1)}
					disabled={page === totalPages || isFetching || !isReady}
				>
					Siguiente ➡
				</Button>

				{isFetching && (
					<span style={{ color: "blue", marginLeft: "12px" }}>
						Actualizando...
					</span>
				)}
			</nav>

			{/* -------------------- Tabla de Pokémon -------------------- */}
			<PokemonsTable
				data={tableData}
				isStale={isPlaceholderData || isFetching}
				onSelect={openModal}
			/>

			{/* -------------------- Modal de Detalles -------------------- */}
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
						{/* Agrega aquí más detalles del Pokémon */}
					</div>
				) : (
					<p>No se encontraron detalles o ha ocurrido un error.</p>
				)}
			</Modal>
		</>
	);
}
