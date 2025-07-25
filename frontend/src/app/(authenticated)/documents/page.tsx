"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Columns2, ListFilter, Search } from "lucide-react";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import AddDocumentButton from "./(form)/add";
import { Toaster } from "sonner";
import { Combobox } from "@/components/ui/combobox";
import { getCategories } from "./apis";

const data: Payment[] = [
	{
		id: "m5gr84i9",
		amount: 316,
		status: "success",
		email: "ken99@example.com",
	},
	{
		id: "3u1reuv4",
		amount: 242,
		status: "success",
		email: "Abe45@example.com",
	},
	{
		id: "derv1ws0",
		amount: 837,
		status: "processing",
		email: "Monserrat44@example.com",
	},
	{
		id: "5kma53ae",
		amount: 874,
		status: "success",
		email: "Silas22@example.com",
	},
	{
		id: "bhqecj4p",
		amount: 721,
		status: "failed",
		email: "carmella@example.com",
	},
];

type Payment = {
	id: string;
	amount: number;
	status: "pending" | "processing" | "success" | "failed";
	email: string;
};

const columns: ColumnDef<Payment>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "status",
		header: "STATUS",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("status")}</div>
		),
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					EMAIL
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
	},
	{
		accessorKey: "amount",
		header: () => <div className="text-right">AMOUNT</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("amount"));
			// Format the amount as a dollar amount
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(amount);
			return <div className="text-right font-medium">{formatted}</div>;
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const payment = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(payment.id)}
						>
							Copy payment ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View customer</DropdownMenuItem>
						<DropdownMenuItem>View payment details</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

export default function DocumentsPage() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [categories, setCategories] = useState([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	useEffect(() => {
		const fetchData = async () => {
			const categories = await getCategories();
			setCategories(categories.data);
		};

		fetchData();
	}, []);

	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

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
						<div className="w-full">
							<div className="flex gap-2 justify-between items-center py-4">
								<div className="relative flex gap-2">
									<Button className="text-xs p-1">Overall 2</Button>
									<Button className="bg-gray-100 text-gray-700 p-1 text-xs">
										Ongoing 2
									</Button>
									<Button className="bg-gray-100 text-gray-700 p-1 text-xs">
										Expired 1
									</Button>
								</div>

								<div className="flex gap-4 text-gray-500 items-center">
									<Search className="w-4 h-4 hover:text-black cursor-pointer" />

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Columns2 className="w-4 h-4 hover:text-black cursor-pointer" />
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="bg-white">
											{table
												.getAllColumns()
												.filter((column) => column.getCanHide())
												.map((column) => {
													return (
														<DropdownMenuCheckboxItem
															key={column.id}
															className="capitalize"
															checked={column.getIsVisible()}
															onCheckedChange={(value) =>
																column.toggleVisibility(!!value)
															}
														>
															{column.id}
														</DropdownMenuCheckboxItem>
													);
												})}
										</DropdownMenuContent>
									</DropdownMenu>

									<AddDocumentButton categories={categories} />
								</div>
							</div>
							<div className="overflow-hidden">
								<Table className="rounded-sm text-sm">
									<TableHeader className="bg-gray-100 ">
										{table.getHeaderGroups().map((headerGroup) => (
											<TableRow key={headerGroup.id} className="">
												{headerGroup.headers.map((header) => {
													return (
														<TableHead
															key={header.id}
															className="text-gray-700"
														>
															{header.isPlaceholder
																? null
																: flexRender(
																		header.column.columnDef.header,
																		header.getContext()
																  )}
														</TableHead>
													);
												})}
											</TableRow>
										))}
									</TableHeader>
									<TableBody>
										{table.getRowModel().rows?.length ? (
											table.getRowModel().rows.map((row) => (
												<TableRow
													key={row.id}
													data-state={row.getIsSelected() && "selected"}
												>
													{row.getVisibleCells().map((cell) => (
														<TableCell key={cell.id}>
															{flexRender(
																cell.column.columnDef.cell,
																cell.getContext()
															)}
														</TableCell>
													))}
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell
													colSpan={columns.length}
													className="h-24 text-center"
												>
													No results.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
							<div className="flex items-center justify-end space-x-2 py-4">
								<div className="text-muted-foreground flex-1 text-sm">
									{table.getFilteredSelectedRowModel().rows.length} of{" "}
									{table.getFilteredRowModel().rows.length} row(s) selected.
								</div>
								<div className="space-x-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => table.previousPage()}
										disabled={!table.getCanPreviousPage()}
									>
										Previous
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => table.nextPage()}
										disabled={!table.getCanNextPage()}
									>
										Next
									</Button>
								</div>
							</div>
						</div>
					</TabsContent>
					<TabsContent value="archived"></TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
