import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "@headlessui/react";

describe("Button UI", () => {
	it("should render", () => {
		render(<Button></Button>);
	});
	it("should render the name passed as prop", () => {
		render(<Button>Ver detalles</Button>);
		expect(screen.getByText(/ver detalles/i)).toBeInTheDocument();
	});
});
