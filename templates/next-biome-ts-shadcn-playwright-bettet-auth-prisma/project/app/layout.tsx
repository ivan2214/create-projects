import type { Metadata } from "next";
import type React from "react";
import "./globals.css";


import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";



export const metadata: Metadata = {
	title: "TucuMarket - Conectando Tucumán",
	description:
		"Plataforma para conectar tucumanos con negocios, eventos y servicios locales",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es">
			<body

			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>


					{children}


					<Toaster richColors closeButton />
				</ThemeProvider>
			</body>
		</html>
	);
}
