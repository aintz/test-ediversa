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
	const offset = (page - 1) * pageSize;

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["pokemons:list", pageSize, offset],
		queryFn: () => getPokemonsPage(page, pageSize),
	});

	const dehydratedState = dehydrate(queryClient);

	return (
		<main>
			<h1>Pokédex (SSR)</h1>
			<HydrationBoundary state={dehydratedState}>
				<HomeClient initialPage={page} pageSize={pageSize} />
			</HydrationBoundary>
		</main>
	);
}
