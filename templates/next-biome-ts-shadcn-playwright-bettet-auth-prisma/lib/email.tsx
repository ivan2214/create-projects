import { env } from "@/env";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";

import { EmailTemplateVerifyResetPassword } from "@/components/email-template-verify-reset-password";

export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: env.EMAIL_USER,
		pass: env.EMAIL_PASS,
	},
	secure: true,
});

export async function sendEmail({
	to,
	subject,
	resetPasswordLink,
	userFirstname,
}: {
	to: string;
	subject: string;
	resetPasswordLink: string;
	userFirstname?: string;
}) {
	const html = await render(
		<EmailTemplateVerifyResetPassword
			resetPasswordLink={resetPasswordLink}
			userFirstname={userFirstname}
		/>,
	);

	await transporter.sendMail({
		from: env.EMAIL_FROM,
		to,
		subject,
		html,
	});
}
