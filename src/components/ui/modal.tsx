import React from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
	if (!isOpen) return null;

	const sizeClasses = {
		sm: "max-w-md",
		md: "max-w-lg",
		lg: "max-w-2xl",
		xl: "max-w-4xl",
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>
			
			{/* Modal */}
			<div
				className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full mx-4 ${sizeClasses[size]}`}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
						{title}
					</h2>
					<Button
						variant="ghost"
						size="sm"
						onClick={onClose}
						className="h-8 w-8 p-0"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
				
				{/* Content */}
				<div className="p-6">
					{children}
				</div>
			</div>
		</div>
	);
}

interface DeleteModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	itemName?: string;
	isLoading?: boolean;
	confirmText?: string;
	cancelText?: string;
}

export function DeleteModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	itemName,
	isLoading = false,
	confirmText = "Sil",
	cancelText = "İptal",
}: DeleteModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
			<div className="space-y-4">
				{/* Icon */}
				<div className="flex justify-center">
					<div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
						<svg
							className="w-8 h-8 text-red-600 dark:text-red-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
							/>
						</svg>
					</div>
				</div>

				{/* Message */}
				<div className="text-center space-y-2">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white">
						{message}
					</h3>
					{itemName && (
						<p className="text-sm text-gray-600 dark:text-gray-400">
							<strong>"{itemName}"</strong>
						</p>
					)}
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Bu işlem geri alınamaz.
					</p>
				</div>

				{/* Actions */}
				<div className="flex justify-end space-x-3 pt-4">
					<Button
						variant="outline"
						onClick={onClose}
						disabled={isLoading}
						className="text-gray-700 dark:text-gray-300"
					>
						{cancelText}
					</Button>
					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={isLoading}
						className="bg-red-600 hover:bg-red-700 text-white"
					>
						{isLoading ? "Siliniyor..." : confirmText}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
