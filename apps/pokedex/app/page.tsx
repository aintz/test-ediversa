import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import HomeClient from "./HomeClient";
import { getPokemonsPage } from "./lib/api/fetchPokemosPage";
import type { SearchParams } from "next/dist/server/request/search-params";

export default async function Home({
	searchParams,
}: {
	searchParams?: Promise<SearchParams>;
}) {
	const pageSize = 20;
	const params = await searchParams;
	const page = Math.max(1, Number(params?.page ?? "1"));
	const offset = (page - 1) * pageSize; // Necesitas el offset para el queryKey

	// 1. Crear una nueva instancia de QueryClient
	const queryClient = new QueryClient();

	// 2. Pre-cargar los datos en la caché del servidor
	// Esto coincide con el queryKey que usarás en el cliente.
	await queryClient.prefetchQuery({
		queryKey: ["pokemons:list", pageSize, offset], // Usa tu clave exacta
		queryFn: () => getPokemonsPage(page, pageSize),
	});

	// Opcional: Obtener la data sin usar prefetchQuery si ya la tienes
	// const initialData = await getPokemonsPage(page, pageSize);
	// queryClient.setQueryData(["pokemons:list", pageSize, offset], initialData);

	// 3. Deshidratar el estado de la caché
	const dehydratedState = dehydrate(queryClient);

	// 4. Renderizar el componente cliente con la caché deshidratada
	// MUEVE la tabla y paginación dentro de HomeClient
	return (
		<main style={{ padding: 16 }}>
			<h1 style={{ marginBottom: 12 }}>Pokédex (SSR)</h1>

			{/* ⭐️ PASA EL ESTADO DE SSR (Cache) AL CLIENTE ⭐️ */}
			<HydrationBoundary state={dehydratedState}>
				<HomeClient
					initialPage={page}
					pageSize={pageSize}
					// No pasamos 'results' directamente, sino la caché de TanStack Query.
				/>
			</HydrationBoundary>
		</main>
	);
}
