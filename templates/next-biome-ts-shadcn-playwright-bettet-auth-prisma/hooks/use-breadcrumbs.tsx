"use client";
// hooks/useBreadcrumbs.ts
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface BreadCrumb {
	label: string;
	href: string;
	isLast?: boolean;
	isHome?: boolean;
}

export function useBreadcrumbs() {
	const pathname = usePathname();
	// Función para formatear segmentos de ruta
	const formatSegment = (segment: string): string => {
		// Si es un ID (números o UUID), mostrar como "Detalle"
		if (
			/^[0-9]+$/.test(segment) || // ID numérico
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
				segment,
			) || // UUID
			/^c[a-z0-9]{24}$/i.test(segment) // CUID
		) {
			return "Detalles";
		}

		// Mapeo automático de rutas comunes en español
		const routeMap: { [key: string]: string } = {
			dashboard: "Dashboard",
			products: "Productos",
			services: "Servicios",
			business: "Negocios",
			listings: "Anuncios",
			listing: "Anuncio",
			subscriptions: "Suscripciones",
			subscription: "Suscripción",

			profile: "Perfil",
			settings: "Configuración",
			admin: "Administración",
			users: "Usuarios",
			orders: "Pedidos",
			categories: "Categorías",
			category: "Categoría",
			reports: "Reportes",
			analytics: "Analíticas",
			search: "Búsqueda",
			cart: "Carrito",
			checkout: "Checkout",
			payments: "Pagos",
			payment: "Pago",
			account: "Cuenta",
			help: "Ayuda",
			contact: "Contacto",
			about: "Acerca de",
			blog: "Blog",
			news: "Noticias",
			events: "Eventos",
			gallery: "Galería",
			portfolio: "Portafolio",
			team: "Equipo",
			careers: "Carreras",
			pricing: "Precios",
			features: "Características",
			docs: "Documentación",
			api: "API",
			support: "Soporte",
			faq: "FAQ",
			terms: "Términos",
			privacy: "Privacidad",
			login: "Iniciar Sesión",
			register: "Registrarse",
			signup: "Registrarse",
			signin: "Iniciar Sesión",
			logout: "Cerrar Sesión",
			edit: "Editar",
			create: "Crear",
			new: "Nuevo",
			add: "Agregar",
			delete: "Eliminar",
			update: "Actualizar",
			view: "Ver",
			list: "Lista",
			detail: "Detalle",
			details: "Detalles",
			info: "Información",
			config: "Configuración",
			manage: "Gestionar",
			management: "Gestión",
			locatons: "Ubicaciones",
			locaiton: "Ubicación",
			signUp: "Registrarse",
			"sign-up": "Registrarse",
			"sign-in": "Iniciar Sesión",
			"sign in": "Iniciar Sesión",
			"forgot-account": "Recuperar Cuenta",
			"forgot-password": "Recuperar Contraseña",
			"reset-password": "Restablecer Contraseña",
			"my-business": "Mi Negocio",
			"my-listings": "Mis Anuncios",
			"my-subscriptions": "Mis Suscripciones",
			"my-account": "Mi Cuenta",
			"my-settings": "Mis Configuraciones",
			"my-profile": "Mi Perfil",
			"my-reports": "Mis Reportes",
			"my-analytics": "Mis Analíticas",
			"my-search": "Mi Búsqueda",
			"my-cart": "Mi Carrito",
			"business-registration": "Registro de Negocio",
		};

		// Si existe en el mapeo, usarlo
		if (routeMap[segment.toLowerCase()]) {
			return routeMap[segment.toLowerCase()];
		}

		// Formatear automáticamente: kebab-case o snake_case a Title Case
		return segment
			.replace(/[-_]/g, " ")
			.split(" ")
			.map(
				(word) =>
					word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
			)
			.join(" ");
	};

	const breadcrumbs = useMemo(() => {
		const segments = pathname.split("/").filter(Boolean);
		const crumbs: BreadCrumb[] = [
			{ label: "Inicio", href: "/", isHome: true },
		];

		// Generar breadcrumbs para cada segmento
		let currentPath = "";
		segments.forEach((segment, index) => {
			currentPath += `/${segment}`;
			const isLast = index === segments.length - 1;

			crumbs.push({
				label: formatSegment(segment),
				href: currentPath,
				isLast,
			});
		});

		return crumbs;
	}, [pathname]);

	return breadcrumbs;
}
