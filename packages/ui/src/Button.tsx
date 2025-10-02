import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
	style: string;
	children: ReactNode;
	onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ style, children, onClick }: ButtonProps) => {
	return (
		<button type="button" onClick={onClick} style={style}>
			{children}
		</button>
	);
};
