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
import { type StateRegister, registerAction } from "@/lib/actions/auth";

import { type RegisterInput, registerSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SignInSocial from "./sign-in-social";

export default function SignupForm() {
	const initialState: StateRegister = { errorMessage: "" };
	const [state, formAction, pending] = useActionState(
		registerAction,
		initialState,
	);

	useEffect(() => {
		if (state.errorMessage?.length) {
			toast.error(state.errorMessage);
		}
	}, [state.errorMessage]);

	const form = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			address: "",
			name: "",
			phone: "",
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
							<Icons.logOut />
						</Link>
						<h1 className="mt-4 mb-1 font-semibold text-title text-xl">
							Crear una cuenta de TucuMarket
						</h1>
						<p className="text-sm">
							Bienvenido! Crea una cuenta para comenzar
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

					<div className="space-y-5">
						{/* Datos personales */}
						<h2 className="mb-4 font-bold text-xl">
							Datos personales
						</h2>
						<div className="grid grid-cols-2 gap-3">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>
											Tu nombre completo
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Jhon Doe"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>Dirección</FormLabel>
										<FormControl>
											<Input
												placeholder="Calle 123, Ciudad, Pais"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>Teléfono</FormLabel>
										<FormControl>
											<Input
												placeholder="+54 381 555 1234"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<hr className="my-4 border-dashed" />

						{/* Datos de acceso */}

						<hr className="my-4 border-dashed" />

						<h2 className="mb-4 font-bold text-xl">
							Datos de acceso
						</h2>

						<div className="space-y-2">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>Email</FormLabel>
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
						</div>

						<div className="space-y-2">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>Contraseña</FormLabel>
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
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={pending}
						>
							{pending ? "Registrando..." : "Registrarse"}
						</Button>
					</div>
				</div>
				<div className="rounded-(--radius) border bg-muted p-3">
					<p className="text-center text-accent-foreground text-sm">
						¿Ya tienes una cuenta ?
						<Button asChild variant="link" className="px-2">
							<Link href="/login">Iniciar sesión</Link>
						</Button>
					</p>
				</div>
			</form>
		</Form>
	);
}
