interface Template {
	title: string;
	value: string;
}

export const TEMPLATES: Template[] = [
	{
		title: "Next.js + Biome + TS + Shadcn + Playwright + Bettet Auth + Prisma",
		value: "next-biome-ts-shadcn-playwright-bettet-auth-prisma",
	},
	{
		title: "Next.js + Biome + TS + Shadcn + Playwright",
		value: "next-biome-ts-shadcn-playwright",
	},
	{
		title: "Next.js + Biome + TS + Shadcn + Playwright + GraphQL",
		value: "next-biome-ts-shadcn-playwright-graphql",
	},
];

interface Extra {
	title: string;
	value: string;
}

interface Extras {
	[key: string]: Extra[];
}

export const EXTRAS: Extras = {
	/* "next-biome-ts-shadcn-playwright": [
    { title: "Mercado Pago", value: "mercadopago" },
    { title: "Supabase", value: "supabase" },
  ], */
};
