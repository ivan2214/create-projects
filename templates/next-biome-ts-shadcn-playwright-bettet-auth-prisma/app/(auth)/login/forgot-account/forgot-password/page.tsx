"use client";

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
import { forgetPassword } from "@/lib/auth/auth-client";
import { type ForgotPasswordInput, forgotPasswordSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ForgotPasswordPage() {
	const params = useSearchParams();
	const emailFromQuery = params.get("email") || "";
	const [message, setMessage] = useState("");
	const [pending, setPending] = useState(false);

	const form = useForm<ForgotPasswordInput>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: emailFromQuery || "",
		},
	});

	const handleSubmit = async (values: ForgotPasswordInput) => {
		setPending(true);

		try {
			const { error } = await forgetPassword({
				email: values.email,
				redirectTo: `${window.location.origin}/login/forgot-account/forgot-password/reset-password`, // This page will be created next
			});

			if (error) {
				setMessage("Something went wrong. Please try again.");
			} else {
				setMessage("Check your email for the reset link.");
			}
		} catch (error) {
			setMessage("Something went wrong. Please try again.");
			console.error("send reset password email has not worked", error);
		} finally {
			form.reset();
			setPending(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="container mx-auto max-w-md space-y-4 p-6"
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="font-bold text-xl">
								Forgot Password?
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="email"
									placeholder="Enter your email"
									disabled={pending}
									className="w-full border p-2"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="grid grid-cols-3 gap-2">
					<Button type="submit">Send Reset Link</Button>
					<Button type="button" asChild variant={"outline"}>
						<Link href="/login">Sign In</Link>
					</Button>
				</div>
				{message && <p>{message}</p>}
			</form>
		</Form>
	);
}
