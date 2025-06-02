"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
	const router = useRouter();
	const handleClick = async () => {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/"); // redirect to login page
					router.refresh();
				},
			},
		});
	};

	return (
		<Button
			onClick={handleClick}
			className="flex w-full cursor-pointer items-center justify-start gap-3 p-4"
		>
			<Icons.logOut className="h-5 w-5 " />
			Log out
		</Button>
	);
}
