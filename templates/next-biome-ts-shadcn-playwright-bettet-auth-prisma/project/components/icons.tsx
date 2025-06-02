import { Discord } from "@/components/icons/discord";
import { Github } from "@/components/icons/github";
import { Google } from "@/components/icons/google";
import { ArrowLeft, LogOut, type LucideProps } from "lucide-react";

export const Icons = {
	arrowLeft: ArrowLeft,
	logOut: LogOut,
	logo: ({ ...props }: LucideProps) => {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				{...props}
			>
				<title>TucuMarket</title>
				<path d="M3 9l9-7 9 7v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
				<polyline points="9 22 9 12 15 12 15 22" />
			</svg>
		);
	},
	discord: Discord,
	github: Github,
	google: Google,
};
