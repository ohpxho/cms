"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { AxiosError, isAxiosError } from "axios";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { addDocument } from "../apis";

const documentSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	issuing_authority: z
		.string()
		.min(1, { message: "Issuing Authority is required" }),
	date_issued: z.date("Date issued is required"),
	date_expired: z.date("Date expired is required"),
	attachment: z
		.file()
		.max(5 * 1024 * 1024, { message: "Max file size is 5MB" })
		.optional(),
	remarks: z.string(),
	category: z.string().min(1, { message: "Select a category" }),
});

type documentSchemaType = z.infer<typeof documentSchema>;

interface Category {
	id: number;
	name: string;
	color: string;
	desc: string | null;
}

interface PropTypes {
	categories: Category[];
}

export default function AddDocumentButton({ categories }: PropTypes) {
	const [isLoading, setisLoading] = useState<boolean>(false);

	const form = useForm<documentSchemaType>({
		resolver: zodResolver(documentSchema),
		defaultValues: {
			name: "",
			issuing_authority: "",
			date_issued: undefined,
			date_expired: undefined,
			attachment: undefined,
			remarks: "",
			category: "",
		},
	});

	const onSubmit = async (data: documentSchemaType) => {
		try {
			setisLoading(true);
			const formData = new FormData();
			if (data.attachment) formData.append("file", data.attachment);
		} catch (error: Error | AxiosError | unknown) {}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="bg-gray-950 text-white cursor-pointer hover:bg-black hover:text-white"
				>
					<Plus className="h-4 w-4" strokeWidth={1.5} />
					New Document
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>New Document</DialogTitle>
					<DialogDescription>
						Add new document for monitoring.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-10"
						encType="multipart/form-data"
					>
						<div className="flex flex-col gap-6 w-full">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Document Name" {...field} />
										</FormControl>
										<FormMessage className="  text-xs" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="issuing_authority"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Issuing Authority</FormLabel>
										<FormControl>
											<Input placeholder="Issuing Authority" {...field} />
										</FormControl>
										<FormMessage className="  text-xs" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category</FormLabel>
										<FormControl>
											<Combobox
												options={categories.map((category) => ({
													value: category.id.toString(),
													label: category.name,
												}))}
												value={field.value?.toString() || ""}
												onValueChange={field.onChange}
												placeholder="Select a category"
												popoverWidth="100%"
												className={cn(
													"bg-white placeholder:text-muted-foreground font-normal",
													{
														"border-red-500": !!form.formState.errors.category,
													}
												)}
											/>
										</FormControl>
										<FormMessage className="  text-xs" />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="date_issued"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Date Issued</FormLabel>
											<FormControl>
												<Input
													type="date"
													{...field}
													value={
														field.value
															? typeof field.value === "string"
																? field.value
																: field.value.toISOString().split("T")[0]
															: ""
													}
													onChange={(e) =>
														field.onChange(
															e.target.value
																? new Date(e.target.value)
																: undefined
														)
													}
												/>
											</FormControl>
											<FormMessage className="  text-xs" />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="date_expired"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Date Expired</FormLabel>
											<FormControl>
												<Input
													type="date"
													{...field}
													value={
														field.value
															? typeof field.value === "string"
																? field.value
																: field.value.toISOString().split("T")[0]
															: ""
													}
													onChange={(e) =>
														field.onChange(
															e.target.value
																? new Date(e.target.value)
																: undefined
														)
													}
												/>
											</FormControl>
											<FormMessage className="  text-xs" />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="attachment"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Attachment</FormLabel>
										<FormControl>
											<Input
												type="file"
												accept="image/*,application/pdf"
												onChange={(e) => {
													field.onChange(e.target.files?.[0]);
												}}
											/>
										</FormControl>
										<FormMessage className="  text-xs" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="remarks"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Remarks</FormLabel>
										<FormControl>
											<Textarea {...field}></Textarea>
										</FormControl>
										<FormMessage className="  text-xs" />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline" type="button">
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? (
									<span className="flex items-center gap-2">
										<LoaderCircle className="animate-spin w-4 h-4" />
										Saving...
									</span>
								) : (
									"Save changes"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
