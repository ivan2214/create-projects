"use client";

import { Icons } from "@/components/icons";
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
import { type StateLogin, loginAction } from "@/lib/actions/auth";
import { type LoginInput, loginSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SignInSocial from "./sign-in-social";

export default function LoginForm() {
	const initialState: StateLogin = { errorMessage: "" };
	const [state, formAction, pending] = useActionState(
		loginAction,
		initialState,
	);

	useEffect(() => {
		if (state.errorMessage?.length) {
			toast.error(state.errorMessage);
		}
	}, [state.errorMessage]);

	const form = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	return (
		<Form {...form}>
			<form
				action={() => formAction(form.getValues())}
				className="m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border bg-card p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
			>
				<div className="p-8 pb-6">
					<div>
						<Link href="/" aria-label="go home">
							<Icons.logo />
							<span className="sr-only">TucuMarket</span>
						</Link>
						<h1 className="mt-4 mb-1 font-semibold text-xl">
							Iniciar sesión en Tailark
						</h1>
						<p className="text-sm">
							Bienvenido de nuevo! Inicia sesión para continuar
						</p>
					</div>

					<div className="mt-6 grid grid-cols-2 gap-3">
						<SignInSocial provider="google">
							<Icons.google />
							<span>Google</span>
						</SignInSocial>
						<SignInSocial provider="github">
							<Icons.github />
							<span>Github</span>
						</SignInSocial>
						<SignInSocial provider="discord">
							<Icons.discord />
							<span>Discord</span>
						</SignInSocial>
					</div>

					<hr className="my-4 border-dashed" />

					<div className="space-y-6">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel>Correo electrónico</FormLabel>
									<FormControl>
										<Input
											placeholder="tu@email.com"
											{...field}
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
								<FormItem className="space-y-0.5">
									<div className="flex items-center justify-between">
										<FormLabel className="text-sm text-title">
											Contraseña
										</FormLabel>
										<Button
											asChild
											variant="link"
											size="sm"
										>
											<Link
												href="/login/forgot-account"
												className="link intent-info variant-ghost text-sm"
											>
												¿Olvidaste tu cuenta ?
											</Link>
										</Button>
									</div>

									<FormControl>
										<Input
											type="password"
											placeholder="••••••••"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full"
							disabled={pending}
						>
							{pending ? "Iniciando sesión..." : "Iniciar sesión"}
						</Button>
					</div>
				</div>
				<div className="rounded-(--radius) border bg-muted p-3">
					<p className="text-center text-accent-foreground text-sm">
						¿No tienes una cuenta ?
						<Button asChild variant="link" className="px-2">
							<Link href="/sign-up">Crear cuenta</Link>
						</Button>
					</p>
				</div>
			</form>
		</Form>
	);
}
