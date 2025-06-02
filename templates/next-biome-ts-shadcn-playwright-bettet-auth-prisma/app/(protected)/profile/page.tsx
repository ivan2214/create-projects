import SignOutButton from "@/components/auth/sign-out-button";
import { getCurrentUser } from "@/data/user";
import { HelpCircle, Settings, User } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/login");
	}

	return (
		<div className="h-full w-full max-w-4xl p-4 py-10">
			<div className="mb-8 flex flex-col items-center">
				<div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
					<User className="h-10 w-10 text-primary" />
				</div>
				<h2 className="font-bold text-xl">{user.name}</h2>
				<p className="text-muted-foreground">{user.email}</p>
			</div>

			<div className="space-y-4">
				<div className="flex items-center gap-3 rounded-lg bg-muted/40 p-4">
					<Settings className="h-5 w-5 text-muted-foreground" />
					<span>Configuración</span>
				</div>

				<div className="flex items-center gap-3 rounded-lg bg-muted/40 p-4">
					<HelpCircle className="h-5 w-5 text-muted-foreground" />
					<span>Ayuda</span>
				</div>

				<SignOutButton />
			</div>
		</div>
	);
}
