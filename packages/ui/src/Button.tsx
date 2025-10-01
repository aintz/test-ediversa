import type { ReactNode } from "react";

type ButtonProps = {
	children: ReactNode;
	onClick?: () => void;
};

export const Button = ({ children, onClick }: ButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			style={{
				padding: "8px 16px",
				borderRadius: "6px",
				backgroundColor: "#4f46e5",
				color: "white",
				border: "none",
				cursor: "pointer",
			}}
		>
			{children}
		</button>
	);
};
