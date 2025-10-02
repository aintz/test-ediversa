"use client";

import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import { type CSSProperties, Fragment, type ReactNode } from "react";

import styles from "./Modal.module.css";

type ModalProps = {
	width: string;
	borderRadius: string;
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description?: string;
	children?: ReactNode;
};

export function Modal({
	width,
	borderRadius,
	isOpen,
	onClose,
	children,
}: ModalProps) {
	const modalStyle: CSSProperties = {
		maxWidth: width,
		borderRadius: borderRadius,
	};
	return (
		<Transition show={isOpen} as={Fragment}>
			<Dialog as="div" onClose={onClose}>
				<TransitionChild
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className={styles.overlay} aria-hidden="true" />
				</TransitionChild>

				<div className={styles.container}>
					<TransitionChild
						as={Fragment}
						enter="ease-out duration-350"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-250"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<DialogPanel className={styles.panel} style={modalStyle}>
							<div>{children}</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</Dialog>
		</Transition>
	);
}
