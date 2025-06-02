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
import { type StateSearchAccount, searchAccount } from "@/lib/actions/auth";
import { type ForgotAccountInput, forgotAccountSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotAccountPage() {
	const initialState: StateSearchAccount = { found: false, errorMessage: "" };
	const [state, formAction, _pending] = useActionState(
		searchAccount,
		initialState,
	);

	useEffect(() => {
		if (state.errorMessage.length) {
			toast.error(state.errorMessage);
		}
		if (state.found) {
			router.push(
				`/login/forgot-account/forgot-password?email=${encodeURIComponent(
					form.getValues().email,
				)}`,
			);
		}
	}, [state.errorMessage.length, state.found]);
	const router = useRouter();

	const form = useForm<ForgotAccountInput>({
		resolver: zodResolver(forgotAccountSchema),
		defaultValues: {
			email: "",
		},
	});

	/* const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		const found = await searchAccount(email);
		if (found) {
			router.push(
				`/login/forgot-account/forgot-password?email=${encodeURIComponent(
					email,
				)}`,
			);
		} else {
			router.push("/sign-up");
		}
	}; */

	return (
		<Form {...form}>
			<form
				action={() => formAction(form.getValues().email)}
				className="container mx-auto max-w-md space-y-4 p-6"
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="font-semibold text-lg">
								Find Your Account
							</FormLabel>
							<FormControl>
								<Input
									type="email"
									autoComplete="email"
									{...field}
									placeholder="Email"
									className="w-full border p-2"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Search</Button>
			</form>
		</Form>
	);
}
