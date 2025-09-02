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
	FormDescription,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Info, BellRing, Upload, File } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";
import { addDocument } from "../apis";
import { TimeUnit, Frequency } from "@/enums";
import { Category, Document } from "@/types";

const step1DocumentSchema = z.object({
	name: z.string("Name is required").min(1),
	issuing_authority: z.string("Issuing Authority is required").min(1),
	date_issued: z.date("Date issued is required"),
	date_expired: z.date("Date expired is required"),
	attachment: z
		.file()
		.max(5 * 1024 * 1024, { message: "Max file size is 5MB" })
		.optional(),
	category: z.string("Category is required"),
});

const step2DocumentSchema = z.object({
	remarks: z.string().optional(),
	notify_before: z.number("Invalid Input"),
	time_unit: z.enum(TimeUnit, "Unit is required"),
	frequency: z.enum(Frequency, "Frequency is required"),
});

const documentSchema = z.object({
	...step1DocumentSchema.shape,
	...step2DocumentSchema.shape,
});

type documentSchemaType = z.infer<typeof documentSchema>;

type Mode = "add" | "edit" | "renew";

interface PropTypes {
	categories?: Category[];
	data?: Document;
	modeType: Mode | null;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FormDialog({
	isOpen,
	setIsOpen,
	categories,
	data,
	modeType,
}: PropTypes) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [mode, setMode] = useState<"add" | "renew" | "edit" | null>(modeType);
	const [currentStep, setCurrentStep] = useState(0);
	const [isDragOver, setIsDragOver] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const form = useForm<documentSchemaType>({
		resolver: zodResolver(documentSchema),
		mode: "onChange",
	});

	useEffect(() => {
		if (data) {
			console.log(data);
			form.reset({
				name: data.name || "",
				issuing_authority: data.issuing_authority || "",
				category: data.category.id.toString() || "",
			});
		}
	}, [data]);

	const handleNext = async () => {
		let isValid = false;

		isValid = await form.trigger([
			"name",
			"issuing_authority",
			"date_issued",
			"date_expired",
			"attachment",
			"category",
		]);

		if (isValid) setCurrentStep(currentStep + 1);
	};

	const onSubmit = async (data: documentSchemaType) => {
		setIsLoading(true);

		const formData = new FormData();
		formData.append("name", data.name);
		formData.append("issuing_authority", data.issuing_authority);
		formData.append("remarks", data.remarks || "");
		formData.append("category_id", data.category);
		formData.append(
			"date_issued",
			data.date_issued.toISOString().split("T")[0]
		);
		formData.append(
			"date_expired",
			data.date_expired.toISOString().split("T")[0]
		);
		formData.append("notify_before", data.notify_before.toString());
		formData.append("time_unit", data.time_unit);
		formData.append("frequency", data.frequency);

		if (data.attachment) formData.append("attachment", data.attachment);

		const response = await addDocument(formData);

		if (!response.success) {
			toast.error("Failed to Save the Document", {
				description: `${response.error}`,
			});
		} else {
			toast.success("New document added", {
				description: "Document has been uploaded successfuly",
			});
			form.reset();
		}
		setIsLoading(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-2xl">New Document</DialogTitle>
					<DialogDescription>
						Add new document for monitoring.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-10"
						encType="multipart/form-data"
						method="POST"
					>
						{currentStep === 0 ? (
							<>
								<div className="flex w-full flex-col gap-6">
									<div className="space-y-4">
										<h3 className="flex items-center gap-2 text-lg font-semibold">
											<Info className="h-5 w-5" strokeWidth={1.5} />
											<span>Document Information</span>
										</h3>
										<p className="text-muted-foreground text-sm">
											Enter the basic information about your document.
										</p>
									</div>

									<div className="space-y-6">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="">Document Name</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., License, Subscriptions, Certificate"
															{...field}
															disabled={mode == "add" ? false : true}
														/>
													</FormControl>
													<FormMessage className="text-xs" />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="issuing_authority"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="">Issuing Authority</FormLabel>
													<FormDescription className="text-muted-foreground text-sm">
														The organization or authority that issued or
														provided this
													</FormDescription>
													<FormControl>
														<Input
															placeholder="e.g., Suppliers, Government Offices"
															{...field}
															disabled={mode == "add" ? false : true}
														/>
													</FormControl>
													<FormMessage className="text-xs" />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="category"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="">Category</FormLabel>
													<FormControl>
														{mode == "add" ? (
															<Combobox
																options={categories!.map((category) => ({
																	value: category.id.toString(),
																	label: category.name,
																}))}
																value={field.value?.toString() || ""}
																onValueChange={field.onChange}
																placeholder="Select a category"
																popoverWidth="100%"
																className={cn(
																	"placeholder:text-muted-foreground bg-white font-normal",
																	{
																		"border-red-500":
																			!!form.formState.errors.category,
																	}
																)}
															/>
														) : (
															<Combobox
																options={[
																	{
																		value: data?.category.id.toString() || "",
																		label: data?.category.name || "",
																	},
																]}
																onValueChange={field.onChange}
																value={field.value?.toString() || ""}
																disabled={true}
																placeholder="Select a category"
																popoverWidth="100%"
																className={cn(
																	"placeholder:text-muted-foreground bg-white font-normal",
																	{
																		"border-red-500":
																			!!form.formState.errors.category,
																	}
																)}
															/>
														)}
													</FormControl>
													<FormMessage className="text-xs" />
												</FormItem>
											)}
										/>

										<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
											<FormField
												control={form.control}
												name="date_issued"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="">Date Issued</FormLabel>
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
														<FormMessage className="text-xs" />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="date_expired"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="">Expiration Date</FormLabel>
														<FormControl>
															<div>
																<Input
																	type="date"
																	className="relative w-full"
																	{...field}
																	value={
																		field.value
																			? typeof field.value === "string"
																				? field.value
																				: field.value
																						.toISOString()
																						.split("T")[0]
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
															</div>
														</FormControl>
														<FormMessage className="text-xs" />
													</FormItem>
												)}
											/>
										</div>

										<FormField
											control={form.control}
											name="attachment"
											render={({ field }) => {
												const handleFileChange = (file: File | null) => {
													field.onChange(file);
													setSelectedFile(file);
												};

												const handleDrop = (e: React.DragEvent) => {
													e.preventDefault();
													setIsDragOver(false);
													const files = e.dataTransfer.files;
													if (files && files[0]) {
														handleFileChange(files[0]);
													}
												};

												const handleDragOver = (e: React.DragEvent) => {
													e.preventDefault();
													setIsDragOver(true);
												};

												const handleDragLeave = (e: React.DragEvent) => {
													e.preventDefault();
													setIsDragOver(false);
												};

												return (
													<FormItem>
														<FormLabel className="">
															Document Attachment
														</FormLabel>
														<FormDescription className="text-muted-foreground text-sm">
															Upload a copy of your document (PDF or image
															files, max 5MB)
														</FormDescription>
														<FormControl>
															<div className="relative bg-gray-50 hover:bg-gray-100">
																<Input
																	type="file"
																	accept="image/*,application/pdf"
																	onChange={(e) =>
																		handleFileChange(
																			e.target.files?.[0] || null
																		)
																	}
																	className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
																/>
																<div
																	className={cn(
																		"relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-200 hover:bg-gray-50/50",
																		{
																			"border-primary bg-primary/5": isDragOver,
																			"border-gray-300": !isDragOver,
																			"border-red-500":
																				!!form.formState.errors.attachment,
																		}
																	)}
																	onDrop={handleDrop}
																	onDragOver={handleDragOver}
																	onDragLeave={handleDragLeave}
																>
																	{selectedFile ? (
																		<div className="flex items-center justify-center gap-3">
																			<File className="text-primary h-5 w-5" />
																			<div className="text-left">
																				<p className="text-sm font-medium">
																					{selectedFile.name}
																				</p>
																				<p className="text-muted-foreground text-xs">
																					{(
																						selectedFile.size /
																						1024 /
																						1024
																					).toFixed(2)}{" "}
																					MB
																				</p>
																			</div>
																		</div>
																	) : (
																		<div className="space-y-4">
																			<Upload className="text-muted-foreground mx-auto h-5 w-5" />
																			<div className="space-y-2">
																				<p className="font-medium">
																					Drag & drop your file here
																				</p>
																				<p className="text-muted-foreground text-sm">
																					or{" "}
																					<span className="text-primary hover:text-primary/80 font-medium">
																						click to browse
																					</span>
																				</p>
																				<p className="text-muted-foreground text-xs">
																					Supports PDF and image files (max 5MB)
																				</p>
																			</div>
																		</div>
																	)}
																</div>
															</div>
														</FormControl>
														<FormMessage className="text-xs" />
													</FormItem>
												);
											}}
										/>
									</div>
								</div>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline" type="button">
											Cancel
										</Button>
									</DialogClose>
									<Button onClick={handleNext} type="button">
										Next
									</Button>
								</DialogFooter>
							</>
						) : (
							<div className="flex w-full flex-col gap-6">
								<div className="space-y-4">
									<h3 className="flex items-center gap-2 text-lg font-semibold">
										<BellRing className="h-5 w-5" strokeWidth={1.5} />
										<span>Notification Settings</span>
									</h3>
									<p className="text-muted-foreground text-sm">
										Set up when and how you'd like to be notified about document
										expiration.
									</p>
								</div>
								<div className="space-y-4">
									<div className="space-y-3">
										<FormLabel className="">
											Notify me before document expires
										</FormLabel>
										<div className="flex items-center gap-3">
											<FormField
												control={form.control}
												name="notify_before"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Input
																type="number"
																placeholder="30"
																min="1"
																max="365"
																className="w-24 text-center [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
																{...field}
																onChange={(e) =>
																	field.onChange(parseInt(e.target.value) || 0)
																}
															/>
														</FormControl>
														<FormMessage className="text-xs" />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="time_unit"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Select
																value={field.value}
																onValueChange={field.onChange}
																defaultValue={TimeUnit.DAY}
															>
																<SelectTrigger className="w-32">
																	<SelectValue placeholder="Select unit" />
																</SelectTrigger>
																<SelectContent className="bg-white">
																	<SelectItem value={TimeUnit.DAY}>
																		Day(s)
																	</SelectItem>
																	<SelectItem value={TimeUnit.WEEK}>
																		Week(s)
																	</SelectItem>
																	<SelectItem value={TimeUnit.MONTH}>
																		Month(s)
																	</SelectItem>
																</SelectContent>
															</Select>
														</FormControl>
														<FormMessage className="text-xs" />
													</FormItem>
												)}
											/>
										</div>
									</div>
								</div>
								<FormField
									control={form.control}
									name="frequency"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="">Notification Frequency</FormLabel>
											<FormDescription className="text-muted-foreground text-sm">
												How often would you like to receive notifications?
											</FormDescription>
											<FormControl>
												<Select
													value={field.value}
													onValueChange={field.onChange}
													defaultValue={Frequency.ONCE_A_WEEK}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select frequency" />
													</SelectTrigger>
													<SelectContent className="bg-white">
														<SelectItem value={Frequency.ONCE_A_WEEK}>
															Once A Week
														</SelectItem>
														<SelectItem value={Frequency.TWICE_A_WEEK}>
															Twice A Week
														</SelectItem>
														<SelectItem value={Frequency.EVERY_OTHER_DAY}>
															Every Other Day
														</SelectItem>
														<SelectItem value={Frequency.EVERYDAY}>
															Everyday
														</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage className="text-xs" />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="remarks"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="">Additional Notes</FormLabel>
											<FormDescription className="text-muted-foreground text-sm">
												Add any additional information or special instructions
												for this document.
											</FormDescription>
											<FormControl>
												<Textarea
													placeholder="Enter any additional notes or remarks..."
													rows={4}
													className="resize-none"
													{...field}
												/>
											</FormControl>
											<FormMessage className="text-xs" />
										</FormItem>
									)}
								/>

								<DialogFooter className="flex justify-between">
									<Button
										type="button"
										variant="outline"
										onClick={() => setCurrentStep(currentStep - 1)}
									>
										Back
									</Button>
									<div className="flex gap-2">
										<DialogClose asChild>
											<Button variant="outline" type="button">
												Cancel
											</Button>
										</DialogClose>
										<Button type="submit" disabled={isLoading}>
											{isLoading ? (
												<span className="flex items-center gap-2">
													<LoaderCircle className="h-4 w-4 animate-spin" />
													Saving...
												</span>
											) : (
												"Save Document"
											)}
										</Button>
									</div>
								</DialogFooter>
							</div>
						)}
						{/* 							<Button type="submit" disabled={isLoading}>
								{isLoading ? (
									<span className="flex items-center gap-2">
										<LoaderCircle className="animate-spin w-4 h-4" />
										Saving...
									</span>
								) : (
									"Save changes"
								)}
							</Button> */}
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
