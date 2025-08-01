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
import { MoreHorizontal, ArrowUpDown, History } from "lucide-react";
import { Category, Document } from "@/types";
import Status from "@/components/status";
import { formatDateToStandardForm } from "@/lib/date";
import { ClockFading, FileMinus, Pencil, Archive } from "lucide-react";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

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
			<div className="capitalize truncate max-w-75 flex gap-1">
				{" "}
				<FileMinus strokeWidth={1} className="w-5 h-5" /> {row.getValue("name")}
			</div>
		),
	},
	{
		accessorKey: "category",
		header: "Type",
		cell: ({ row }) => {
			const category = row.getValue("category") as Category;
			const name = category.name;
			const color = category.color;
			return (
				<div
					className={`capitalize truncate text-xs p-1 rounded-sm w-fit flex gap-1 bg-black text-white`}
				>
					{name}
				</div>
			);
		},
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
		header: "Date Issued",
		cell: ({ row }) => {
			const formattedDate = formatDateToStandardForm(
				row.getValue("date_issued")
			);
			return <div>{formattedDate}</div>;
		},
		enableHiding: true,
	},
	{
		accessorKey: "date_expired",
		header: "Date Expired",
		cell: ({ row }) => {
			const formattedDate = formatDateToStandardForm(
				row.getValue("date_expired")
			);
			return <div>{formattedDate}</div>;
		},
	},
	{
		accessorKey: "due",
		header: "Due on",
		cell: ({ row }) => {
			return (
				<div className="flex gap-2">
					<ClockFading strokeWidth={1.5} className="w-5 h-5" />{" "}
					{row.getValue("due")}
				</div>
			);
		},
	},
	{
		id: "status",
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			return <Status status={row.getValue("status")} />;
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			return (
				<div className="flex py-2 px-1" onClick={(e) => e.stopPropagation()}>
					<Dialog>
						<Tooltip>
							<TooltipTrigger asChild>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										className="flex items-center bg-none text-xs text-gray-500 shadow-none hover:text-green-700 border-none group-hover:transparent hover:bg-transparent cursor-pointer hover:shadow-none bg-transparent h-fit w-0 p-0"
									>
										<History className="m-0 p-0 h-5 w-5" strokeWidth={1.5} />
									</Button>
								</DialogTrigger>
							</TooltipTrigger>
							<TooltipContent>
								<span>renew</span>
							</TooltipContent>
						</Tooltip>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Edit profile</DialogTitle>
								<DialogDescription>
									Make changes to your profile here. Click save when you&apos;re
									done.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4">
								<div className="grid gap-3"></div>
								<div className="grid gap-3"></div>
							</div>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<Button type="submit">Save changes</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<Dialog>
						<Tooltip>
							<TooltipTrigger asChild>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										className="flex items-center bg-none text-xs text-gray-500 shadow-none hover:text-black border-none group-hover:transparent hover:bg-transparent cursor-pointer hover:shadow-none bg-transparent h-fit w-0 p-0"
									>
										<Pencil className="m-0 p-0 h-5 w-5" strokeWidth={1.5} />
									</Button>
								</DialogTrigger>
							</TooltipTrigger>
							<TooltipContent>
								<span>edit</span>
							</TooltipContent>
						</Tooltip>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Edit profile</DialogTitle>
								<DialogDescription>
									Make changes to your profile here. Click save when you&apos;re
									done.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4">
								<div className="grid gap-3"></div>
								<div className="grid gap-3"></div>
							</div>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<Button type="submit">Save changes</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<Dialog>
						<Tooltip>
							<TooltipTrigger asChild>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										className="flex items-center bg-none text-xs text-gray-500 shadow-none hover:text-red-700 border-none group-hover:transparent hover:bg-transparent cursor-pointer hover:shadow-none bg-transparent h-fit w-0 p-0"
									>
										<Archive className="m-0 p-0 h-5 w-5" strokeWidth={1.5} />
									</Button>
								</DialogTrigger>
							</TooltipTrigger>
							<TooltipContent>
								<span>archive</span>
							</TooltipContent>
						</Tooltip>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Edit profile</DialogTitle>
								<DialogDescription>
									Make changes to your profile here. Click save when you&apos;re
									done.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4">
								<div className="grid gap-3"></div>
								<div className="grid gap-3"></div>
							</div>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<Button type="submit">Save changes</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			);
		},
	},
];

export default columns;
