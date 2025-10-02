"use client";

import { Button, Modal } from "@turbo-pokedex/ui";
import PokemonsTable from "./components/PokemonsTable";
import { useState } from "react";
import PokemonModal from "./components/PokemonModal";

export default function Home() {
	const [page, setPage] = useState(1);
	const [selected, setSelected] = useState<string | null>(null);
	//<PokemonModal name={selected} onClose={setSelected} />
	return (
		<div>
			<main>
				{selected && (
					<Modal
						isOpen={!!selected}
						onClose={() => setSelected(null)}
						title={`Pokémon: ${selected}`}
					>
						<p>pepe More info about {selected}…</p>
					</Modal>
				)}
				<PokemonsTable
					page={page}
					onPageChange={setPage}
					onSelect={setSelected}
					pageSize={0}
				/>
			</main>
			<footer></footer>
		</div>
	);
}
