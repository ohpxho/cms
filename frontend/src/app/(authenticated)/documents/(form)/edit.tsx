"use client";

import FormDialog from "./dialog";
import { Document, Category } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface PropType {
	data: Document;
	categories: Category[] | undefined;
}

export default function EditDocument({ data, categories }: PropType) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onClick = () => {
		setIsOpen(true);
	};

	return (
		<>
			<Button
				variant="outline"
				className="group-hover:transparent flex h-fit w-0 cursor-pointer items-center border-none bg-transparent bg-none p-0 text-xs text-gray-500 shadow-none hover:bg-transparent hover:text-green-700 hover:shadow-none"
				onClick={onClick}
			>
				<Pencil className="m-0 h-5 w-5 p-0" strokeWidth={1.5} />
			</Button>
			<FormDialog
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				categories={categories}
				data={data}
				modeType={"edit"}
			/>
		</>
	);
}
