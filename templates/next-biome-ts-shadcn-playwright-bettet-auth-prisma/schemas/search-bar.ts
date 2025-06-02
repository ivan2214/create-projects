import { z } from "zod";

export const SearchBarSchema = z.object({
	query: z.string().min(2, "Ingrese al menos 2 caracteres"),
});

export type SearchBarInput = z.infer<typeof SearchBarSchema>;
