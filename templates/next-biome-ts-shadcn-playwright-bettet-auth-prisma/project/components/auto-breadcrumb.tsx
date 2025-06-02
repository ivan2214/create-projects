"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

import { Fragment } from "react";

export function AutoBreadcrumb() {
	const breadcrumbs = useBreadcrumbs();

	return (
		<header className="flex items-center gap-4 border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<Breadcrumb>
				<BreadcrumbList>
					{breadcrumbs.map((item, index) => (
						<Fragment key={item.href}>
							<BreadcrumbItem>
								{item.isLast ? (
									<BreadcrumbPage className="flex items-center gap-2 font-medium">
										{item.isHome && (
											<Home className="h-4 w-4" />
										)}
										{item.label}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link
											href={item.href}
											className="flex items-center gap-2 transition-colors hover:text-foreground"
										>
											{item.isHome && (
												<Home className="h-4 w-4" />
											)}
											{item.label}
										</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{index < breadcrumbs.length - 1 && (
								<BreadcrumbSeparator>
									<ChevronRight className="h-4 w-4" />
								</BreadcrumbSeparator>
							)}
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</header>
	);
}
