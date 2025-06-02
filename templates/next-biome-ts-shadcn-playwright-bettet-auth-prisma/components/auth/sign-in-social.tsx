"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/auth-client";
import { Loader } from "lucide-react";
import { useState } from "react";
import type React from "react";

export default function SignInSocial({
	provider,
	children,
}: {
	provider:
		| "github"
		| "apple"
		| "discord"
		| "facebook"
		| "google"
		| "microsoft"
		| "spotify"
		| "twitch"
		| "twitter"
		| "dropbox"
		| "linkedin"
		| "gitlab"
		| "tiktok"
		| "reddit"
		| "roblox"
		| "vk"
		| "kick";
	children: React.ReactNode;
}) {
	const [loading, setLoading] = useState(false);

	const handleClick = async () => {
		setLoading(true);

		await signIn.social({
			provider,
			callbackURL: "/login/business-registration",
		});
	};

	return (
		<Button
			onClick={handleClick}
			type="button"
			variant="outline"
			className="cursor-pointer rounded p-2"
			disabled={loading}
		>
			{loading ? (
				<span className="flex items-center gap-2">
					<Loader className="animate-spin" />
					<span className="sr-only">Cargando...</span>
				</span>
			) : (
				children
			)}
		</Button>
	);
}
