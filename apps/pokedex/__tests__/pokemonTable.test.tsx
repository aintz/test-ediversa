import { fireEvent, render, screen } from "@testing-library/react";
import PokemonsTable from "@/app/components/PokemonsTable";
import type { PokemonDetail } from "@/app/lib/types/pokemon";
import "@testing-library/jest-dom";

describe("Sanity check", () => {
	it("runs a basic test", () => {
		expect(1 + 1).toBe(2);
	});
});

jest.mock("next/image", () => ({
	__esModule: true,
	default: (props: any) => <img {...props} alt={props.alt || "mocked image"} />,
}));
const mockInstance = {
	getHeaderGroups: () => [
		{
			id: "header-group-1",
			headers: [
				{
					id: "name",
					column: {
						getCanSort: () => true,
						getToggleSortingHandler: () => jest.fn(),
						getIsSorted: () => false,
						columnDef: { header: "Nombre" },
					},
					getContext: () => ({}),
				},
			],
		},
	],
};
const mockData: PokemonDetail[] = [
	{
		id: 10,
		name: "caterpie",
		base_experience: 39,
		height: 3,
		weight: 29,
		sprites: {
			front_default:
				"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png",
		},
		types: [{ slot: 1, type: { name: "bug" } }],
		abilities: [],
	},
];

describe("PokemonsTable", () => {
	it("should render the component", () => {
		render(
			<PokemonsTable
				data={mockData}
				instance={mockInstance as any}
				onSelect={jest.fn()}
			/>,
		);
	});

	it("should render the table headers correctly", () => {
		render(
			<PokemonsTable
				data={mockData}
				instance={mockInstance as any}
				onSelect={jest.fn()}
			/>,
		);
		expect(screen.getByRole("columnheader", { name: /nombre/i }));
		expect(screen.getByRole("columnheader", { name: /miniatura/i }));
		expect(screen.getByRole("columnheader", { name: /xp base/i }));
		expect(screen.getByRole("columnheader", { name: /tipos/i }));
		expect(screen.getByRole("columnheader", { name: /acciones/i }));
	});

	it("should render data on the table correctly", () => {
		render(
			<PokemonsTable
				data={mockData}
				instance={mockInstance as any}
				onSelect={jest.fn()}
			/>,
		);
		expect(screen.getByText("caterpie")).toBeInTheDocument();
		expect(screen.getByText("39")).toBeInTheDocument();
		expect(screen.getByText("bug")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Ver Detalles/i }),
		).toBeInTheDocument();
	});

	it("should call the onSelect function when the button Ver detalles is clicked", () => {
		const handleSelect = jest.fn();
		render(
			<PokemonsTable
				data={mockData}
				instance={mockInstance as any}
				onSelect={handleSelect}
			/>,
		);
		const button = screen.getByRole("button", { name: /Ver Detalles/i });
		fireEvent.click(button);

		expect(handleSelect).toHaveBeenCalledWith("caterpie");
		expect(handleSelect).toHaveBeenCalledTimes(1);
	});

	it("should render one data row", () => {
		render(
			<PokemonsTable
				data={mockData}
				instance={mockInstance as any}
				onSelect={jest.fn()}
			/>,
		);
		const rows = screen.getAllByRole("row");
		expect(rows).toHaveLength(2);
	});

	it("should render  a message if there is no data on the table", () => {
		render(
			<PokemonsTable
				data={[]}
				instance={mockInstance as any}
				onSelect={jest.fn()}
			/>,
		);
		const emptyMessageCell = screen.getByRole("cell", {
			name: /nada para mostrar/i,
		});

		expect(emptyMessageCell).toBeInTheDocument();
	});
});
