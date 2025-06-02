import {
	Body,
	Button,
	Container,
	Head,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";

interface EmailTemplateVerifyResetPasswordProps {
	userFirstname?: string;
	resetPasswordLink?: string;
}

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "";

const urlMoreInfo = `${baseUrl}/info`;

export const EmailTemplateVerifyResetPassword = ({
	userFirstname,
	resetPasswordLink,
}: EmailTemplateVerifyResetPasswordProps) => {
	return (
		<Html>
			<Head />
			<Body style={main}>
				<Preview>TucuMarket - Reestablecer contraseña</Preview>
				<Container style={container}>
					<Img
						src={`${baseUrl}/static/tucumarket-logo.png`}
						width="40"
						height="33"
						alt="TucuMarket logo"
					/>
					<Section>
						<Text style={text}>Hola {userFirstname},</Text>
						<Text style={text}>
							Alguien solicitó recientemente un cambio de
							contraseña para tu cuenta. Si fue tu caso, puedes
							establecer una nueva contraseña aquí:
						</Text>
						<Button style={button} href={resetPasswordLink}>
							Reestablecer contraseña
						</Button>
						<Text style={text}>
							Si no desea cambiar su contraseña o no lo solicitó,
							simplemente ignore y elimine este mensaje.
						</Text>
						<Text style={text}>
							Para proteger su cuenta, no reenvíe este correo
							electrónico. Consulte nuestro Centro de ayuda para
							obtener más{" "}
							<Link style={anchor} href={urlMoreInfo}>
								consejos de seguridad
							</Link>
						</Text>
						<Text style={text}>Feliz día!</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

EmailTemplateVerifyResetPassword.PreviewProps = {
	userFirstname: "Alan",
	resetPasswordLink: "https://www.tucumarket.com",
} as EmailTemplateVerifyResetPasswordProps;

export default EmailTemplateVerifyResetPassword;

const main = {
	backgroundColor: "#f6f9fc",
	padding: "10px 0",
};

const container = {
	backgroundColor: "#ffffff",
	border: "1px solid #f0f0f0",
	padding: "45px",
};

const text = {
	fontSize: "16px",
	fontFamily:
		"'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
	fontWeight: "300",
	color: "#404040",
	lineHeight: "26px",
};

const button = {
	backgroundColor: "#e92932",
	borderRadius: "6px",
	color: "#fff",
	fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
	fontSize: "15px",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	width: "210px",
	padding: "14px 7px",
};

const anchor = {
	textDecoration: "underline",
	color: "#e92932",
};
