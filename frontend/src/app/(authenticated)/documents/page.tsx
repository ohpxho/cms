"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast, Toaster } from "sonner";
import DocumentsTable from "./(table)/table";
import { getCategories, getDocuments } from "./apis";
import useSWR from "swr";

export default function DocumentsPage() {
	const { data: categories, error: errorInFetchingCategories } = useSWR(
		"/api/categories",
		getCategories,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		}
	);

	const { data: documents, error: errorInFetchingDocuments } = useSWR(
		"/api/documents",
		getDocuments
	);

	if (errorInFetchingCategories) {
		toast.error("Failed to load categories", {
			description:
				"Please refresh your browser. If error persist, contact an IT for support",
		});
	}

	if (errorInFetchingDocuments) {
		toast.error("Failed to load documents", {
			description:
				"Please refresh your browser. If error persist, contact an IT for support",
		});
	}

	return (
		<div className="relative w-full max-w-[1440px]">
			<Toaster richColors position="bottom-center" />
			<div className="flex w-full gap-6 pt-6">
				<Tabs defaultValue="open" className="w-full">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="font-bold text-2xl">Documents</h2>
							<span className="text-gray-500">
								Manage you for expiry documents.
							</span>
						</div>
						<TabsList className="bg-transparent">
							<TabsTrigger
								value="open"
								className="flex text-xs items-center h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-gray-700  text-gray-400 hover:text-gray-700 cursor-pointer"
							>
								<span>Ongoing (9)</span>
							</TabsTrigger>

							<Separator orientation="vertical" />

							<TabsTrigger
								value="archived"
								className="flex text-xs items-center h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-gray-700  text-gray-400 hover:text-gray-700 cursor-pointer"
							>
								<span>Archive (12)</span>
							</TabsTrigger>
						</TabsList>
					</div>
					<TabsContent value="open" className="w-full mt-4">
						<DocumentsTable
							categories={categories?.data || []}
							documents={documents?.data || []}
						/>
					</TabsContent>
					<TabsContent value="archived"></TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
