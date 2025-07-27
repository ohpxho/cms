import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Document } from "@/types";

const columns: ColumnDef<Document>[] = [
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
		accessorKey: "name",
		header: "Document",
		cell: ({ row }) => (
			<div className="capitalize truncate max-w-75">{row.getValue("name")}</div>
		),
	},
	{
		accessorKey: "issuing_authority",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Issuing Authority
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="lowercase">{row.getValue("issuing_authority")}</div>
		),
	},
	{
		accessorKey: "date_issued",
		header: () => <div>Date Issued</div>,
		cell: ({ row }) => {
			return <div>{row.getValue("date_issued")}</div>;
		},
	},
	{
		accessorKey: "date_expired",
		header: () => <div>Date Expired</div>,
		cell: ({ row }) => {
			return <div>{row.getValue("date_expired")}</div>;
		},
	},
	{
		accessorKey: "status",
		header: () => <div>Status</div>,
		cell: ({ row }) => {
			return <div>uploaded</div>;
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
						<DropdownMenuItem>Edit</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Archive</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

export default columns;
