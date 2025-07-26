import axios from "@/lib/axios";

const getDocuments = async () => {
	const response = await axios.get("/api/documents");
	return response.data;
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
