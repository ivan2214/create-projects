import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";
import { AutoBreadcrumb } from "@/components/auto-breadcrumb";

import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

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
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AutoBreadcrumb />

				<main className="pb-16">
					{" "}
					{/* pb-16 es padding-bottom: 4rem = 64px */}
					{children}
				</main>

				<Toaster richColors />
			</body>
		</html>
	);
}
