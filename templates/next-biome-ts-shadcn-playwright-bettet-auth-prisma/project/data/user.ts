import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";

export const getUserByEmail = async (email: string) => {
	try {
		const user = await db.user.findUnique({
			where: {
				email,
			},
		});

		return user;
	} catch {
		return null;
	}
};

export const getUserById = async (id: string | undefined) => {
	try {
		if (!id) return null;
		const user = await db.user.findUnique({
			where: {
				id,
			},
		});

		return user;
	} catch {
		return null;
	}
};

export const getCurrentUser = async () => {
	const session = await auth.api.getSession({
		headers: await headers(), // you need to pass the headers object.
	});

	if (!session) {
		return null;
	}

	const user = await db.user.findUnique({
		where: {
			id: session.user.id,
		},
	});
	return user;
};
