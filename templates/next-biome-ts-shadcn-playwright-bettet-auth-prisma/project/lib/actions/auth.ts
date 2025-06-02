"use server";
import { getUserById } from "@/data/user";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";
import {
	type LoginInput,
	type RegisterInput,
	loginSchema,
	registerSchema,
} from "@/schemas/auth";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export interface StateLogin {
	errorMessage?: string | null;
}

export async function loginAction(
	_prevState: StateLogin,
	data: LoginInput,
): Promise<StateLogin> {
	const validatedFields = loginSchema.safeParse(data);

	if (!validatedFields.success) {
		return { errorMessage: "Datos inválidos" };
	}

	const { email, password } = validatedFields.data;

	try {
		await auth.api.signInEmail({
			body: {
				email,
				password,
			},
		});
	} catch (error) {
		if (error instanceof APIError) {
			switch (error.status) {
				case "UNAUTHORIZED":
					return { errorMessage: "User Not Found." };
				case "BAD_REQUEST":
					return { errorMessage: "Invalid email." };
				default:
					return { errorMessage: "Something went wrong." };
			}
		}
		console.error("sign in with email has not worked", error);
		throw error;
	} finally {
		redirect("/profile");
	}
}

export interface StateRegister {
	errorMessage?: string;
}

export async function registerAction(
	_prevState: StateRegister,
	data: RegisterInput,
): Promise<StateRegister> {
	const validatedFields = registerSchema.safeParse(data);

	if (!validatedFields.success) {
		return { errorMessage: "Datos inválidos" };
	}

	const { email, password, address, name, phone } = validatedFields.data;

	try {
		const user = await auth.api.signUpEmail({
			body: {
				email,
				name,
				password,
			},
		});

		const existUserDB = await getUserById(user.user.id);

		if (!existUserDB) {
			await db.user.create({
				data: {
					id: user.user.id,
					email,
					name,
					emailVerified: false,
				},
			});
		} else {
			await db.user.update({
				where: {
					id: user.user.id,
				},
				data: {
					email,
					name,

					emailVerified: false,
				},
			});
		}
	} catch (error) {
		if (error instanceof APIError) {
			switch (error.status) {
				case "UNPROCESSABLE_ENTITY":
					return { errorMessage: "User already exists." };
				case "BAD_REQUEST":
					return { errorMessage: "Invalid email." };
				default:
					return { errorMessage: "Something went wrong." };
			}
		}
		console.error("sign up with email and password has not worked", error);
	} finally {
		redirect("/profile");
	}
}

export interface StateSearchAccount {
	found: boolean;
	errorMessage: string;
}

export async function searchAccount(
	_prevState: StateSearchAccount,
	email: string,
): Promise<StateSearchAccount> {
	const user = await db.user.findUnique({
		where: { email },
	});

	if (!user)
		return {
			found: false,
			errorMessage: "User not found",
		};

	return {
		found: true,
		errorMessage: "",
	};
}

export async function logoutAction() {
	try {
		await auth.api.signOut({
			headers: await headers(),
		});
	} catch (error) {
		console.error("sign in with email has not worked", error);
		throw error;
	} finally {
		revalidatePath("/");
		redirect("/");
	}
}
