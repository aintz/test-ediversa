import { QueryClient, dehydrate } from "@tanstack/react-query";
import HomeClient from "./HomeClient";
import { fetchFullList } from "./lib/hooks/useMasterIndex";
import { Providers } from "./providers";
import PokemonsTableStatic from "./components/PokemonsTableStatic";
import styles from "./styles/page.module.css";
import PageTitle from "../../../packages/ui/src/PageTitle";
import "./styles/global.css";

type PageSearchParams = {
	page?: string;
	[key: string]: string | string[] | undefined;
};

export default async function Home({
	searchParams,
}: {
	searchParams?: Promise<PageSearchParams>;
}) {
	const pageSize = 10;
	const params = await searchParams;
	const page = Math.max(1, Number(params?.page ?? "1"));

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["fullPokemonList"],
		queryFn: fetchFullList,
	});

	const dehydratedState = dehydrate(queryClient);
	const fullIndexData = queryClient.getQueryData(["fullPokemonList"]) as
		| { name: string; url: string }[]
		| undefined;

	const start = (page - 1) * pageSize;
	const end = start + pageSize;
	const firstPage = fullIndexData?.slice(start, end) ?? [];

	const staticDetails = await Promise.all(
		firstPage.map(async (pokemon) => {
			try {
				const res = await fetch(pokemon.url);
				if (!res.ok) throw new Error("Failed to fetch Pokémon details");
				return await res.json();
			} catch (e) {
				console.error(e);
				return null;
			}
		}),
	);

	const filteredStaticDetails = staticDetails.filter(Boolean);

	return (
		<main className={styles.container}>
			<PageTitle title="Pokédex" imageUrl="/pokemon-logo.png" />
			<PokemonsTableStatic data={filteredStaticDetails} />
			<Providers dehydratedState={dehydratedState}>
				<HomeClient initialPage={page} pageSize={pageSize} />
			</Providers>
		</main>
	);
}
