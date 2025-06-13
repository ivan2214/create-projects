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
				buttonUrl: url,
				userFirstname: user.name,
				title: "Reset your password",
				description: "Please click the button to reset your password",
				buttonText: "Reset password",
			});
		},
		resetPasswordTokenExpiresIn: 3600,
	},
	/* emailVerification: {
		sendVerificationEmail(data) {
			return sendEmail({
				to: data.user.email, // esto es el email del usuario
				subject: "Verify your email", // esto es el asunto
				buttonUrl: data.url, // esto es el link
				userFirstname: data.user.name, // esto es el nombre
				title: "Verify your email",
				description: "Please click the button to verify your email",
				buttonText: "Verify email",
			});
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: false,
		expiresIn: 3600,
	}, */
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
