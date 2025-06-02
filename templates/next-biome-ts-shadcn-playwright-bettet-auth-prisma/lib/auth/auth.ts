import { sendEmail } from "@/lib/email";
import { db } from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: "postgresql", // or "mysql", "postgresql", ...etc
	}),
	emailAndPassword: {
		enabled: true,
		account: {
			accountLinking: {
				enabled: true,
			},
		},
		minPasswordLength: 6,
		sendResetPassword: async ({ user, url }) => {
			await sendEmail({
				to: user.email,
				subject: "Reset your password",
				resetPasswordLink: url,
				userFirstname: user.name,
			});
		},
		resetPasswordTokenExpiresIn: 3600,
	},
	socialProviders: {
		github: {
			clientId: process.env.AUTH_GITHUB_ID as string,
			clientSecret: process.env.AUTH_GITHUB_SECRET as string,
		},
		google: {
			clientId: process.env.AUTH_GOOGLE_ID as string,
			clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
		},
	},
	plugins: [nextCookies()],
	account: {
		accountLinking: {
			enabled: true,
		},
	},
});
