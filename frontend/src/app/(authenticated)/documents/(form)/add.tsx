"use client";

import FormDialog from "./dialog";
import { Category } from "@/types";

interface PropTypes {
	categories: Category[];
}

export default function AddDocumentButton({ categories }: PropTypes) {
	return (
		<>
			<FormDialog categories={categories} />
		</>
	);
}
