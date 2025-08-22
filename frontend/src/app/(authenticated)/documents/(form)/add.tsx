"use client";

import FormDialog from "./dialog";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

interface PropTypes {
	categories: Category[];
}

export default function AddDocumentButton({ categories }: PropTypes) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onClick = () => {
		setIsOpen(true);
	};

	return (
		<>
			<Button
				variant="outline"
				className="cursor-pointer bg-gray-950 text-white hover:bg-black hover:text-white"
				onClick={onClick}
			>
				<Plus className="h-4 w-4" strokeWidth={1.5} />
				New Document
			</Button>
			<FormDialog
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				categories={categories}
				modeType={"add"}
			/>
		</>
	);
}
