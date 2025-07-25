"use client";
import { useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/auth";
import Link from "next/link";
import Loading from "@/components/loading";
import {
	Box,
	LayoutDashboard,
	Files,
	Shapes,
	ChevronsUpDown,
	BadgeCheck,
	LogOut,
	CircleQuestionMark,
	Sun,
	PanelRightOpen,
	Search,
	Command as CommandIcon,
} from "lucide-react";
import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "@/components/ui/menubar";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
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
import { Button } from "@/components/ui/button";

interface AuthenticatedLayoutProps {
	children: ReactNode;
}

export default function AuthenticatedLayout({
	children,
}: AuthenticatedLayoutProps) {
	const [isLoading, setIsLoading] = useState(true);
	const { user, logout } = useAuth({
		middleware: "auth",
		redirectIfAuthenticated: "/login",
	});

	useEffect(() => {
		if (user) setIsLoading(false);
	}, [user]);

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<div className="flex h-screen w-full">
					{/* Sidebar */}
					<aside className="w-64 border-r border-gray-200 flex flex-col py-2 bg-white">
						<div className="h-16 flex items-center gap-2 p-4 tracking-wide">
							<div className="p-2 bg-black rounded">
								<Box className="text-white" />
							</div>
							<div className="flex flex-col text-sm">
								<span className="text-xs font-bold">CMS - User</span>
								<span className="text-xs">Compliance Management</span>
							</div>
						</div>
						<nav className="flex flex-col gap-4 p-2 text-sm py-6">
							<div className="flex flex-col gap-2">
								<span className="text-xs text-gray-500 px-2">General</span>
								<div className="flex flex-col">
									<Link
										href="/dashboard"
										className="flex gap-2 rounded items-center text-gray-900 hover:bg-gray-100 p-2 transition"
									>
										<LayoutDashboard className="h-4 w-4" strokeWidth={2} />
										<span>Dashboard</span>
									</Link>

									<Link
										href="/documents"
										className="flex gap-2 items-center rounded text-gray-900 hover:bg-gray-100 p-2 transition"
									>
										<Files className="h-4 w-4" strokeWidth={2} />
										<span>Documents</span>
									</Link>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<span className="text-xs text-gray-500 px-2">Maintenance</span>
								<div className="flex flex-col gap-2">
									<Link
										href="/maintenance/category"
										className="flex items-center gap-2 rounded text-gray-900 hover:bg-gray-100 p-2 transition"
									>
										<Shapes className="h-4 w-4" strokeWidth={2} />
										<span>Category</span>
									</Link>
								</div>
							</div>
						</nav>

						<div className="mt-auto px-2 pb-2">
							<Menubar className="bg-white shadow-none border-none h-full">
								<MenubarMenu>
									<MenubarTrigger className="bg-none" asChild>
										<button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 bg-none hover:bg-gray-100 transition group data-[state=open]:bg-gray-100 focus:bg-gray-100">
											<span className="inline-block h-8 w-8 rounded-sm bg-blue-300 overflow-hidden">
												{/* User avatar, fallback to initials if no image */}
												{user?.avatar ? (
													<img
														src={user.avatar}
														alt={user.name || "User"}
														className="h-8 w-8 rounded-full object-cover"
													/>
												) : (
													<span className="flex items-center justify-center h-8 w-8 text-sm font-bold text-blue-700 rounded-full">
														{user?.name
															? user.name
																	.split(" ")
																	.map((n: string) => n[0])
																	.join("")
																	.slice(0, 2)
																	.toUpperCase()
															: "U"}
													</span>
												)}
											</span>
											<span className="flex flex-col text-left flex-1 min-w-0">
												<span className="font-medium text-sm text-gray-900 truncate">
													{user?.name || "User"}
												</span>
												<span className="text-xs text-gray-500 truncate">
													{user?.email || "user@email.com"}
												</span>
											</span>
											<ChevronsUpDown className="h-5 w-5" strokeWidth={1} />
										</button>
									</MenubarTrigger>
									<MenubarContent
										align="end"
										side="right"
										className="w-full p-1 bg-white"
									>
										<div className="flex items-center gap-3 p-2 border-b border-gray-100">
											<span className="inline-block h-10 w-10 rounded-sm bg-blue-300 overflow-hidden">
												{user?.avatar ? (
													<img
														src={user.avatar}
														alt={user.name || "User"}
														className="h-10 w-10 rounded-sm object-cover"
													/>
												) : (
													<span className="flex items-center justify-center h-10 w-10 text-lg font-semibold text-blue-700 rounded-sm">
														{user?.name
															? user.name
																	.split(" ")
																	.map((n: string) => n[0])
																	.join("")
																	.slice(0, 2)
																	.toUpperCase()
															: "U"}
													</span>
												)}
											</span>
											<div className="flex flex-col min-w-0">
												<span className="font-medium text-sm text-gray-900 truncate">
													{user?.name || "User"}
												</span>
												<span className="text-xs text-gray-500 truncate">
													{user?.email || "user@email.com"}
												</span>
											</div>
										</div>
										<MenubarItem className="focus:bg-gray-100">
											<BadgeCheck className="h-5 w-5" strokeWidth={1.5} />
											<span className="text-sm">Profile</span>
										</MenubarItem>

										<MenubarItem className="focus:bg-gray-100">
											<CircleQuestionMark
												className="h-5 w-5"
												strokeWidth={1.5}
											/>
											<span className="text-sm">Help</span>
										</MenubarItem>
										<div className="border-b border-gray-100"></div>

										<MenubarItem className="focus:bg-gray-100" onClick={logout}>
											<LogOut className="h-5 w-5" strokeWidth={1.5} />
											<span className="text-sm">Logout</span>
										</MenubarItem>
									</MenubarContent>
								</MenubarMenu>
							</Menubar>
						</div>
					</aside>
					{/* Main Content Area */}
					<div className="flex-1 flex flex-col">
						{/* Top Navigation */}
						<header className="h-16 border-b border-gray-200 flex items-center px-6 justify-between bg-white">
							<div className="flex gap-4 items-center">
								<PanelRightOpen className="h-5 w-5" strokeWidth={1.5} />
								<div className="h-4 border-r border-gray-200"></div>
								<Dialog>
									<DialogTrigger asChild>
										<Button
											type="button"
											className="flex items-center gap-2 px-3 rounded-sm h-fit py-1 bg-linear-to-r from-gray-100 via-gray-100 to-gray-50 hover:bg-gray-100 cursor-pointer border border-gray-200 text-sm text-gray-400 w-60"
										>
											<span className="flex items-center gap-1 flex-1 font-normal text-gray-500 ">
												<Search className="h-4 w-4" strokeWidth={1.5} />
												Search
											</span>
											<span className="flex items-center gap-1 bg-gray-50 rounded px-1  text-xs text-gray-700 font-mono border border-gray-200">
												<CommandIcon className="h-2 w-2" strokeWidth={1} />
												<span className="text-[9px]"> K</span>
											</span>
										</Button>
									</DialogTrigger>
									<DialogContent className="p-0">
										<Command className="rounded-lg border shadow-md md:min-w-[450px] py-2">
											<CommandInput placeholder="Type a command or search..." />
											<CommandList>
												<CommandEmpty>No results found.</CommandEmpty>
												<CommandGroup heading="Suggestions">
													<CommandItem>
														<span>Calendar</span>
													</CommandItem>
													<CommandItem>
														<span>Search Emoji</span>
													</CommandItem>
													<CommandItem disabled>
														<span>Calculator</span>
													</CommandItem>
												</CommandGroup>
												<CommandSeparator />
												<CommandGroup heading="Settings">
													<CommandItem>
														<span>Profile</span>
														<CommandShortcut>⌘P</CommandShortcut>
													</CommandItem>
													<CommandItem>
														<span>Billing</span>
														<CommandShortcut>⌘B</CommandShortcut>
													</CommandItem>
													<CommandItem>
														<span>Settings</span>
														<CommandShortcut>⌘S</CommandShortcut>
													</CommandItem>
												</CommandGroup>
											</CommandList>
										</Command>
									</DialogContent>
								</Dialog>
							</div>
							<div>
								<Select defaultValue="light">
									<SelectTrigger className="[&>svg:last-child]:hidden outline-none border-none shadow-none rounded-full hover:bg-gray-100 cursor-pointer transition-colors focus-visible:border-none focus-visible:ring-1 focus-visible:shadow-none focus:border-none">
										<Sun className="h-5 w-5" />
									</SelectTrigger>
									<SelectContent className="bg-white">
										<SelectGroup>
											<SelectLabel>Theme</SelectLabel>
											<SelectItem value="light">Light</SelectItem>
											<SelectItem value="dark">Dark</SelectItem>
											<SelectItem value="system">System</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						</header>
						<main className="flex bg-white overflow-y-auto p-6 justify-center">
							{children}
						</main>
					</div>
				</div>
			)}
		</>
	);
}
