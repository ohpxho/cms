import useSWR from "swr";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { AxiosResponse, isAxiosError } from "axios";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export const useAuth = ({
	middleware,
	redirectIfAuthenticated,
}: {
	middleware: string;
	redirectIfAuthenticated: string;
}) => {
	const router = useRouter();
	const params = useParams();

	const {
		data: user,
		error,
		mutate,
	} = useSWR("/api/user", () =>
		axios
			.get("/api/user")
			.then((res) => res.data.data)
			.catch((error) => {
				if (error.response.status !== 409) throw error;

				router.push("/verify-email");
			})
	);

	const csrf = () => axios.get("/sanctum/csrf-cookie");

	const register = async (data: {
		firstname: string;
		lastname: string;
		email: string;
		password: string;
		center: number;
		department: number;
		position: number;
		google_id?: string;
		avatar?: string;
	}) => {
		try {
			await csrf();
			await axios.post("/register", data);
			mutate();
		} catch (error) {
			throw error;
		}
	};

	const login = async ({
		email,
		password,
		remember,
	}: {
		email?: string;
		password?: string;
		remember?: boolean;
		provider?: string;
		code?: string | null;
	}) => {
		await csrf();

		await axios.post("/login", { email, password });
		mutate();
	};

	const forgotPassword = async (data: {
		email: string;
	}): Promise<AxiosResponse> => {
		try {
			await csrf();
			return await axios.post("/forgot-password", data);
		} catch (error) {
			throw error;
		}
	};

	const resetPassword = async (data: {
		email: string;
		password: string;
		password_confirmation: string;
	}) => {
		try {
			await csrf();

			const response = await axios.post("/reset-password", {
				...data,
				token: params.token,
			});

			router.push("/login?reset=" + btoa(response.data.status));
		} catch (error) {
			throw error;
		}
	};

	const resendEmailVerification = async () => {
		try {
			return await axios.post("/email/verification-notification");
		} catch (error) {
			throw error;
		}
	};

	const logout = async () => {
		if (!error) {
			try {
				await axios.post("/logout");
				await mutate(null, false);
			} catch (logoutErr) {
				console.error("Logout failed ", logoutErr);
			}
		}
		window.location.pathname = "/login";
	};

	useEffect(() => {
		if (middleware === "guest" && redirectIfAuthenticated && user)
			router.push(redirectIfAuthenticated);
		if (window.location.pathname === "/verify-email" && user?.email_verified_at)
			router.push(redirectIfAuthenticated);
		if (middleware === "auth" && error) logout();
	}, [user, error]);

	return {
		register,
		login,
		forgotPassword,
		resetPassword,
		resendEmailVerification,
		logout,
		user,
	};
};
