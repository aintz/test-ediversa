"use client";

type ErrorProps = {
	error: Error;
	reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
	return (
		<div style={{ padding: 16 }}>
			<h2>Algo ha fallado al cargar la Pokédex</h2>
			<p>{error.message}</p>
			<button type="button" onClick={reset}>
				Reintentar
			</button>
		</div>
	);
}
