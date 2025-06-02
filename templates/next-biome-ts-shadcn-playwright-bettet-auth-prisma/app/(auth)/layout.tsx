export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<section className="mx-auto flex h-full bg-zinc-50 py-10 dark:bg-transparent">
			{children}
		</section>
	);
}
