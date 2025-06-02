import { z } from "zod";

const envSchema = z.object({
	/* BETTER AUTH */
	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_URL: z.string().url(),
	AUTH_GITHUB_ID: z.string(),
	AUTH_GITHUB_SECRET: z.string(),
	AUTH_GOOGLE_ID: z.string(),
	AUTH_GOOGLE_SECRET: z.string(),
	/* EMAIL */
	EMAIL_FROM: z.string(),
	EMAIL_USER: z.string(),
	EMAIL_PASS: z.string(),
	/* DATABASE */
	POSTGRES_USER: z.string(),
	POSTGRES_PASSWORD: z.string(),
	POSTGRES_DB: z.string(),
	DATABASE_URL: z.string(),
	/* GOOGLE GENERATIVE AI */
	GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
	/* ADMIN */
	ADMIN_EMAIL: z.string(),
	ADMIN_NAME: z.string(),
	ADMIN_PASSWORD: z.string(),
});

export const env = envSchema.parse(process.env);
