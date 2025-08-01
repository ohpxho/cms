import axios from "@/lib/axios";
import {
	getStatusOfDocumentByEXpiration,
	getDueOnByExpiration,
} from "@/lib/service/documents";
import { Document } from "@/types";
import { formatDateToStandardForm } from "@/lib/date";

const getDocuments = async () => {
	const response = await axios.get("/api/documents");
	const documents = response.data;
	const formatted = documents.data.map((document: Document) => {
		const status = getStatusOfDocumentByEXpiration(document.date_expired);
		const due = getDueOnByExpiration(document.date_expired);
		const formattedDateIssued = formatDateToStandardForm(document.date_issued);
		const formattedDateExpiration = formatDateToStandardForm(
			document.date_expired
		);
		return {
			...document,
			date_issued: formattedDateIssued,
			date_expired: formattedDateExpiration,
			status,
			due,
		};
	});
	return formatted;
};

const addDocument = async (data: FormData) => {
	try {
		const response = await axios.post("/api/document", data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return { success: true, data: response.data };
	} catch (error) {
		return { success: false, error: error };
	}
};

const getCategories = async () => {
	const response = await axios.get("/api/categories");
	return response.data;
};

export { getDocuments, addDocument, getCategories };
