"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ComboboxOption {
	value: string;
	label: string;
	disabled?: boolean;
}

interface ComboboxProps {
	options: ComboboxOption[];
	value?: string;
	loading?: boolean;
	onValueChange: (value: string) => void;
	placeholder?: string;
	emptyMessage?: string;
	searchPlaceholder?: string;
	disabled?: boolean;
	className?: string;
	popoverWidth?: number | string;
	children?: React.ReactNode;
}

export function Combobox({
	options = [],
	value,
	loading = false,
	onValueChange,
	placeholder = "Select an option",
	emptyMessage = "No results found.",
	searchPlaceholder = "Search...",
	disabled = false,
	className,
	popoverWidth = "100%",
	children,
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState("");

	// Calculate popup width and ensure it's reactive to changes
	const popupWidth = React.useMemo(() => {
		return typeof popoverWidth === "number" ? `${popoverWidth}` : popoverWidth;
	}, [popoverWidth]);

	// Ensure options is always an array
	const safeOptions = React.useMemo(() => {
		return Array.isArray(options) ? options : [];
	}, [options]);

	// Filter options based on search value
	const filteredOptions = React.useMemo(() => {
		if (!searchValue) return safeOptions;

		return safeOptions.filter((option) =>
			option.label.toLowerCase().includes(searchValue.toLowerCase())
		);
	}, [safeOptions, searchValue]);

	// Reset search when opening/closing the popover
	React.useEffect(() => {
		if (!open) {
			setSearchValue("");
		}
	}, [open]);

	// If children are provided, use the compound component pattern
	if (children) {
		return (
			<ComboboxProvider
				value={{
					options: safeOptions,
					value,
					onValueChange,
					open,
					setOpen,
					loading,
					disabled,
					popupWidth,
					searchValue,
					setSearchValue,
					filteredOptions,
					emptyMessage,
					searchPlaceholder,
					placeholder,
					className,
				}}
			>
				<Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
					{children}
				</Popover>
			</ComboboxProvider>
		);
	}

	// Otherwise, use the all-in-one component
	return (
		<Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn("w-full justify-between", className)}
					disabled={disabled}
				>
					{value
						? safeOptions.find((option) => option.value === value)?.label
						: placeholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="p-0 popover-content-width-full bg-white">
				<Command shouldFilter={false}>
					<CommandInput
						placeholder={searchPlaceholder}
						value={searchValue}
						onValueChange={setSearchValue}
						disabled={loading}
					/>
					<CommandList className="max-h-[200px]">
						{loading ? (
							<div className="flex items-center justify-center p-4">
								<Loader2 className="h-6 w-6 animate-spin" />
								<span className="ml-2 text-sm">Loading options...</span>
							</div>
						) : filteredOptions.length === 0 ? (
							<CommandEmpty>{emptyMessage}</CommandEmpty>
						) : (
							<ScrollArea className="h-[200px]">
								<CommandGroup>
									{filteredOptions.map((option) => (
										<CommandItem
											key={option.value}
											onSelect={() => {
												if (!option.disabled) {
													onValueChange(option.value);
													setOpen(false);
													setSearchValue("");
												}
											}}
											disabled={option.disabled}
											data-disabled={option.disabled ? "true" : undefined}
										>
											{option.label}
											<Check
												className={cn(
													"ml-auto h-4 w-4",
													value === option.value ? "opacity-100" : "opacity-0"
												)}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							</ScrollArea>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

// Context for compound components
type ComboboxContextValue = {
	options: ComboboxOption[];
	value?: string;
	onValueChange: (value: string) => void;
	open: boolean;
	loading: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	disabled: boolean;
	popupWidth: string | number;
	searchValue: string;
	setSearchValue: React.Dispatch<React.SetStateAction<string>>;
	filteredOptions: ComboboxOption[];
	emptyMessage: string;
	searchPlaceholder: string;
	placeholder: string;
	className?: string;
};

const ComboboxContext = React.createContext<ComboboxContextValue | undefined>(
	undefined
);

function ComboboxProvider({
	children,
	value,
}: {
	children: React.ReactNode;
	value: ComboboxContextValue;
}) {
	return (
		<ComboboxContext.Provider value={value}>
			{children}
		</ComboboxContext.Provider>
	);
}

function useCombobox() {
	const context = React.useContext(ComboboxContext);
	if (!context) {
		throw new Error("useCombobox must be used within a ComboboxProvider");
	}
	return context;
}

// Compound components
export function ComboboxTrigger({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
	const {
		value,
		placeholder,
		options,
		open,
		disabled,
		className: ctxClassName,
	} = useCombobox();

	return (
		<PopoverTrigger asChild>
			<Button
				variant="outline"
				role="combobox"
				aria-expanded={open}
				className={cn("w-full justify-between", ctxClassName, className)}
				disabled={disabled}
				{...props}
			>
				{value
					? options.find((option) => option.value === value)?.label
					: placeholder}
				<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</PopoverTrigger>
	);
}

export function ComboboxInput({
	placeholder,
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof CommandInput>) {
	const { searchValue, setSearchValue, searchPlaceholder } = useCombobox();

	return (
		<CommandInput
			placeholder={placeholder || searchPlaceholder}
			value={searchValue}
			onValueChange={setSearchValue}
			className={className}
			{...props}
		/>
	);
}

export function ComboboxContent({
	className,
	children,
	...props
}: React.ComponentPropsWithoutRef<typeof PopoverContent>) {
	const { popupWidth, searchValue, disabled, setOpen, open } = useCombobox();

	return (
		<PopoverContent
			className={cn("p-0 popover-content-width-full", className)}
			{...props}
		>
			<Command shouldFilter={false}>{children}</Command>
		</PopoverContent>
	);
}

export function ComboboxEmpty({
	children,
	...props
}: React.ComponentPropsWithoutRef<typeof CommandEmpty>) {
	const { emptyMessage } = useCombobox();

	return <CommandEmpty {...props}>{children || emptyMessage}</CommandEmpty>;
}

export function ComboboxList({
	className,
	children,
	...props
}: React.ComponentPropsWithoutRef<typeof CommandList>) {
	return (
		<CommandList
			className={cn("max-h-[200px] overflow-y-auto", className)}
			{...props}
		>
			{children}
		</CommandList>
	);
}

export function ComboboxGroup({
	className,
	children,
	...props
}: React.ComponentPropsWithoutRef<typeof CommandGroup>) {
	return (
		<CommandGroup className={className} {...props}>
			{children}
		</CommandGroup>
	);
}

export function ComboboxItem({
	className,
	children,
	value,
	disabled,
	...props
}: React.ComponentPropsWithoutRef<typeof CommandItem> & { value: string }) {
	const {
		onValueChange,
		setOpen,
		setSearchValue,
		value: selectedValue,
	} = useCombobox();

	return (
		<CommandItem
			className={cn("cursor-pointer", className)}
			onSelect={() => {
				if (!disabled) {
					onValueChange(value);
					setOpen(false);
					setSearchValue("");
				}
			}}
			disabled={disabled}
			data-disabled={disabled ? "true" : undefined}
			{...props}
		>
			{children}
			<Check
				className={cn(
					"ml-auto h-4 w-4",
					selectedValue === value ? "opacity-100" : "opacity-0"
				)}
			/>
		</CommandItem>
	);
}
