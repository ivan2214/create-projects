export const TEMPLATES = [
  {
    title: "Next.js + ESLint + TS + Shadcn",
    value: "next-eslint-ts-shadcn",
  },
  {
    title: "React (Vite) + TS + Tailwind",
    value: "react-eslint-ts-tw",
  },
];

export const EXTRAS: Record<string, { title: string; value: string }[]> = {
  "next-eslint-ts-shadcn": [
    { title: "Mercado Pago", value: "mercadopago" },
    { title: "Supabase", value: "supabase" },
  ],
};
