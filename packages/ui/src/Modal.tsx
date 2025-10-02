"use client";

import {
	Dialog,
	DialogPanel,
	Description,
	Transition,
	DialogTitle,
	TransitionChild,
} from "@headlessui/react";
import { Fragment, type ReactNode } from "react";

import styles from "./Modal.module.css";

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description?: string;
	children?: ReactNode;
};

export function Modal({
	isOpen,
	onClose,
	title,
	description,
	children,
}: ModalProps) {
	return (
		// 1. Transition wrapper for the entire Dialog (Modal)
		<Transition show={isOpen} as={Fragment}>
			<Dialog as="div" onClose={onClose}>
				{/* 2. Backdrop/Overlay Transition */}
				<TransitionChild
					as={Fragment}
					enter="ease-out duration-300" // Longer fade in
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200" // Slightly longer fade out
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					{/* Assuming styles.overlay handles the fixed position and background color */}
					<div className={styles.overlay} aria-hidden="true" />
				</TransitionChild>

				{/* Container for centering the panel */}
				<div className={styles.container}>
					{/* 3. Panel Content Transition */}
					<Transition.Child
						as={Fragment}
						// Enter: Slightly longer duration, softer ease-out
						enter="ease-out duration-350"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						// Leave: Slightly longer duration, smoother ease-in
						leave="ease-in duration-250"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<DialogPanel className={styles.panel}>
							{/* 4. Use h2/h3 and the recommended DialogPanel */}
							<h3>{title}</h3>
							{description && <p>{description}</p>}

							<div>{children}</div>
						</DialogPanel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
}
