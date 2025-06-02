"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { resetPassword } from "@/lib/auth/auth-client";
import { type ResetPasswordInput, resetPasswordSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ResetPasswordPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get("token") || "";
	const [state, setState] = useState({
		message: "",
		pending: false,
		success: false,
	});

	const form = useForm<ResetPasswordInput>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			token: token,
			password: "",
		},
	});
	const handleSubmit = async (values: ResetPasswordInput) => {
		if (!token) return;

		setState({
			...state,
			pending: true,
		});
		try {
			const { error, data } = await resetPassword({
				token,
				newPassword: values.password,
			});

			if (error?.message || !data?.status) {
				setState((old) => ({
					...old,
					message:
						error?.message ||
						"Something went wrong. Please try again.",
					success: false,
				}));
				return;
			}
			setState((old) => ({
				...old,
				message:
					"Password reset successfully. Password reset! You can now sign in. Redirecting...",
				success: data.status || true,
			}));
			setTimeout(() => router.push("/login"), 4000);
		} catch (error) {
			setState((old) => ({
				...old,
				message: "Something went wrong. Please try again.",
				success: false,
			}));
			console.error("reset password has not worked", error);
		} finally {
			setState((old) => ({
				...old,
				pending: false,
			}));
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="container mx-auto max-w-md space-y-4 p-6"
			>
				<h1 className="font-bold text-xl">Reset Password</h1>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									autoComplete="off"
									autoCorrect="off"
									autoCapitalize="off"
									spellCheck="false"
									className="w-full border p-2"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					variant="secondary"
					disabled={state.pending}
				>
					Reset Password
				</Button>

				{state.message && (
					<div className="flex items-center gap-2">
						{state.success ? (
							<Badge variant="success">
								<AlertCircle className="mr-2 h-4 w-4" />
								{state.message}
							</Badge>
						) : (
							<Badge variant="destructive">
								<AlertCircle className="mr-2 h-4 w-4" />
								{state.message}
							</Badge>
						)}
					</div>
				)}
			</form>
		</Form>
	);
}
