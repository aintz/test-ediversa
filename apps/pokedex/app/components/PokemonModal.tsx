import { Modal } from "../../../../packages/ui/src/Modal";
import type { PokemonModalDetail } from "../lib/types/pokemon";
import Image from "next/image";
import styles from "../styles/page.module.css";

type PokemonModalProps = {
	isOpen: boolean;
	onClose: () => void;
	data: PokemonModalDetail;
};

export default function PokemonModal({
	isOpen,
	onClose,
	data,
}: PokemonModalProps) {
	return (
		<Modal
			width="280px"
			borderRadius="12px"
			isOpen={!!isOpen}
			onClose={onClose}
			title={data.name}
		>
			<article className={styles.pokeModal}>
				<Image
					src={data.sprites?.front_default ?? ""}
					alt={
						data.sprites?.front_default
							? `Foto del pokémon ${data.name}`
							: `Imagen no disponible para ${data.name}`
					}
					width={150}
					height={150}
				/>

				<h1>{data.name}</h1>
				<p>
					<b>Altura:</b> {data.height}
				</p>
				<p>
					<b>Peso:</b> {data.weight}
				</p>
				<p>
					<b>Habilidades:</b>{" "}
					{data.abilities?.map((a) => a.ability?.name).join(", ")}
				</p>
			</article>
		</Modal>
	);
}
