"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import axios from "@/lib/axios";
import Link from "next/link";
import { AxiosError, isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/hooks/auth";
import { LoaderCircle } from "lucide-react";

const LoginSchema = z.object({
	email: z.email({ message: "Invalid email address" }),
	password: z.string().min(1, { message: "Password is required" }),
	remember: z.boolean(),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<LoginSchemaType>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
			remember: false,
		},
	});

	const { login } = useAuth({
		middleware: "guest",
		redirectIfAuthenticated: "/dashboard",
	});

	const onSubmit = async (values: LoginSchemaType) => {
		try {
			setIsLoading(true);
			await login(values);
		} catch (error: Error | AxiosError | unknown) {
			if (isAxiosError(error) && error.response?.status === 422) {
				toast.error("Oops, something went wrong", {
					description: error.response?.data?.message,
				});
			} else {
				toast.error("An unknown error occured", {
					description:
						"Please refresh the page and try again. If the issue persists, contact IT support.",
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			className="flex min-h-screen items-center justify-center text-sm"
			style={{ backgroundColor: "var(--background)" }}
		>
			<Toaster richColors position="bottom-center" />
			<Card
				className="relative w-full max-w-md"
				style={{
					backgroundColor: "var(--card)",
					color: "var(--card-foreground)",
					borderColor: "var(--border)",
				}}
			>
				<CardHeader className="flex flex-col items-center gap-2">
					<CardTitle
						className="mt-8 text-2xl font-bold tracking-wide"
						style={{ color: "var(--primary)" }}
					>
						Sign in
					</CardTitle>
					<CardDescription style={{ color: "var(--muted-foreground)" }}>
						Enter your credentials to access your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="mt-2 flex flex-col gap-5"
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel style={{ color: "var(--primary)" }}>
											Email
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												id="email"
												type="email"
												autoComplete="email"
												required
												placeholder="you@example.com"
												style={{
													backgroundColor: "var(--input)",
													borderColor: "var(--border)",
													color: "var(--primary)",
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel style={{ color: "var(--primary)" }}>
											Password
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												id="password"
												type="password"
												autoComplete="current-password"
												required
												placeholder="••••••••"
												style={{
													backgroundColor: "var(--input)",
													borderColor: "var(--border)",
													color: "var(--primary)",
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="mt-1 flex items-center justify-between text-sm">
								<FormField
									control={form.control}
									name="remember"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center space-y-0 space-x-2">
											<FormControl>
												<Checkbox
													id="remember"
													checked={field.value}
													onCheckedChange={field.onChange}
													style={{ borderColor: "var(--border)" }}
												/>
											</FormControl>
											<FormLabel
												style={{ color: "var(--secondary)", marginBottom: 0 }}
											>
												Remember me
											</FormLabel>
										</FormItem>
									)}
								/>
								<Link
									href="#"
									style={{ color: "var(--accent)", transition: "color 0.2s" }}
									className="hover:underline hover:brightness-125"
								>
									Forgot password?
								</Link>
							</div>
							<Button
								type="submit"
								style={{
									backgroundColor: "var(--primary)",
									color: "var(--primary-foreground)",
									border: "none",
								}}
								className="mt-3 text-base font-semibold hover:brightness-90 focus:ring-2 focus:ring-[var(--ring)]"
								disabled={isLoading ? true : false}
							>
								{isLoading ? (
									<LoaderCircle className="animate-spin" />
								) : (
									<span>Login</span>
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
