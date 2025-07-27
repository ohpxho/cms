"use client";

import {
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Search, Columns2 } from "lucide-react";
import AddDocumentButton from "../(form)/add";
import { Category, Document } from "@/types";
import columns from "./columns-definition";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PropTypes {
	categories: Category[];
	documents: Document[];
}

export default function DocumentsTable({ categories, documents }: PropTypes) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const table = useReactTable({
		data: documents,
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

	useEffect(() => {}, [selectedRowId]);

	return (
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
										<TableHead key={header.id} className="text-gray-700">
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
						{table.getRowModel()?.rows?.length ? (
							table?.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className="cursor-pointer"
									data-state={row.getIsSelected() && "selected"}
									onClick={() => setSelectedRowId(Number(row.id))}
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

			<Dialog
				open={selectedRowId != null ? true : false}
				onOpenChange={() => setSelectedRowId(null)}
			>
				<DialogContent>TEST</DialogContent>
			</Dialog>
		</div>
	);
}
