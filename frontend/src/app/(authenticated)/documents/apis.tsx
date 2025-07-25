"use client";

import axios from "@/lib/axios";
import { toast } from "sonner";

const getDocuments = async () => {};

const addDocument = async () => {};

const getCategories = async () => {
	try {
		const response = await axios.get("/api/categories");
		return response.data;
	} catch (error) {
		toast.error("Failed to load Categories", {
			description:
				"The categories are not loaded properly. Please refresh your browser",
		});
	}
};

export { getDocuments, addDocument, getCategories };
