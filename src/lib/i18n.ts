/**
 * Internationalization (i18n) System
 *
 * Lightweight i18n implementation for the travel blog.
 * Supports content translation and locale switching.
 */

export type SupportedLocale = "en" | "cs" | "es" | "de";

export interface TranslationMessages {
	[key: string]: string | TranslationMessages;
}

export interface LocaleConfig {
	code: SupportedLocale;
	name: string;
	flag: string;
	direction: "ltr" | "rtl";
}

// ============================================================================
// LOCALE CONFIGURATION
// ============================================================================

export const SUPPORTED_LOCALES: LocaleConfig[] = [
	{ code: "en", name: "English", flag: "🇺🇸", direction: "ltr" },
	{ code: "cs", name: "Čeština", flag: "🇨🇿", direction: "ltr" },
	{ code: "es", name: "Español", flag: "🇪🇸", direction: "ltr" },
	{ code: "de", name: "Deutsch", flag: "🇩🇪", direction: "ltr" },
];

export const DEFAULT_LOCALE: SupportedLocale = "en";

// ============================================================================
// TRANSLATION MESSAGES
// ============================================================================

const translations: Record<SupportedLocale, TranslationMessages> = {
	en: {
		// Navigation
		nav: {
			home: "Home",
			destinations: "Destinations",
			about: "About",
			contact: "Contact",
			privacy: "Privacy",
			terms: "Terms",
			cookies: "Cookies",
			articles: "Articles",
		},

		// Header
		header: {
			search: "Search",
			searchPlaceholder: "Search destinations...",
			navHome: "Home",
			navHomeDesc: "Explore featured destinations",
			navDestinations: "Destinations",
			navDestinationsDesc: "Browse travel destinations",
			navArticles: "Articles",
			navArticlesDesc: "Travel tips and guides",
			navAbout: "About",
			navAboutDesc: "Learn about our mission",
		},

		// Footer
		footer: {
			description:
				"Your trusted companion for budget travel adventures. Discover amazing destinations, practical tips, and insider knowledge to explore the world affordably.",
			email: "hello@lowcosttraveling.com",
			location: "Traveling the world, virtually",
			explore: "Explore",
			travelTips: "Travel Tips",
			legal: "Legal",
			followUs: "Follow Us",
			newsletterTitle: "Get travel tips & destination updates",
			newsletterPlaceholder: "Your email",
			newsletterButton: "Subscribe",
			copyright: "All rights reserved.",
			affiliate:
				"Some links may be affiliate links. We may earn a commission at no extra cost to you.",
			destinations: "Destinations",
			articles: "Articles",
			aboutUs: "About Us",
			contact: "Contact",
			budgetTips: "Budget Tips",
			travelPlanning: "Travel Planning",
			packingGuides: "Packing Guides",
			safetyTips: "Safety Tips",
			privacyPolicy: "Privacy Policy",
			termsOfUse: "Terms of Use",
			cookiePolicy: "Cookie Policy",
			disclaimer: "Disclaimer",
		},

		// Common UI
		common: {
			readMore: "Read more",
			readGuide: "Read guide",
			viewDestination: "View destination",
			explore: "Explore",
			search: "Search",
			loading: "Loading...",
			errorLoading: "Failed to load content. Please try again.",
			error: "Error",
			notFound: "Not found",
			back: "Back",
			next: "Next",
			previous: "Previous",
		},

		// SEO
		seo: {
			title: "Lowcost Traveling - Budget Travel Guides & Tips",
			description:
				"Discover budget travel destinations, practical guides, and insider tips for lowcost traveling around the world.",
			keywords:
				"budget travel, lowcost destinations, travel guides, backpacking, cheap travel",
		},

		// Home page
		home: {
			hero: {
				title: "Travel Smart, Travel Cheap",
				description:
					"Discover amazing destinations, practical travel guides, and insider tips to make your next adventure unforgettable without breaking the bank.",
				exploreDestinations: "Explore Destinations",
				readGuides: "Read Guides",
			},
			featuredDestinations: {
				title: "Popular Destinations",
			},
			latestArticles: {
				title: "Latest Travel Guides",
			},
			cta: {
				title: "Ready for Your Next Adventure?",
				description:
					"Get personalized travel recommendations and start planning your budget-friendly journey today.",
				contactUs: "Contact Us",
			},
		},

		// Analytics
		analytics: {
			consentTitle: "We value your privacy",
			consentDescription:
				"We use cookies and analytics to improve your experience. Your data is anonymized and never shared.",
			accept: "Accept Analytics",
			decline: "Decline",
			dismiss: "Maybe later",
			privacyPolicy: "Privacy Policy",
			cookiePolicy: "Cookie Policy",
			privacySettings: "Privacy Settings",
		},

		// GDPR Consent Banner
		consent: {
			title: "🍪 We value your privacy",
			description:
				"We use cookies and analytics to improve your experience and understand how our site is used. Your data is anonymized and never shared with third parties. You can change your preferences anytime.",
			accept: "Accept Analytics",
			decline: "Decline",
			dismiss: "Maybe later",
			privacyPolicy: "Privacy Policy",
			cookiePolicy: "Cookie Policy",
		},

		// Article types
		articleTypes: {
			"destination-guide": "Destination Guide",
			"place-guide": "Place Guide",
			"practical-info": "Practical Info",
			itinerary: "Itinerary",
			list: "List",
		},

		// Destinations
		destinations: {
			continent: {
				europe: "Europe",
				asia: "Asia",
				"north-america": "North America",
				"south-america": "South America",
				africa: "Africa",
				oceania: "Oceania",
			},
			type: {
				country: "Country",
				region: "Region",
				city: "City",
			},
		},

		// Errors
		errors: {
			generic: "Something went wrong. Please try again.",
			network: "Network error. Please check your connection.",
			notFound: "The requested page was not found.",
			articleNotFound: "Article not found.",
			destinationNotFound: "Destination not found.",
		},

		// 404 Page
		notFound: {
			title: "Page Not Found",
			description:
				"Looks like you've wandered off the beaten path. The page you're looking for doesn't exist.",
			backToHome: "Back to Home",
			exploreDestinations: "Explore Destinations",
		},

		// Home Page
		homePage: {
			heroTitle: "Travel More, Spend Less",
			heroDescription:
				"Discover budget-friendly travel guides, insider tips, and destination insights to help you explore the world without breaking the bank.",
			exploreDestinations: "Explore Destinations",
			featuredDestinations: "Featured Destinations",
			latestTravelGuides: "Latest Travel Guides",
			readGuide: "Read guide",
			readyToStart: "Ready to Start Planning?",
			newsletterDescription:
				"Get weekly travel tips, deals, and destination guides delivered to your inbox.",
			newsletterPlaceholder: "Your email",
			subscribe: "Subscribe",
			noSpam: "No spam, unsubscribe anytime.",
			country: "Country",
			from: "From",
			perDay: "/day",
			bestTime: "Best",
			readTravelGuide: "Read travel guide",
		},

		// About Page
		about: {
			title: "About Lowcost Traveling",
			subtitle: "Helping budget travelers explore the world since 2020.",
			missionTitle: "Our Mission",
			missionText1:
				"We believe that travel should be accessible to everyone. Our mission is to provide honest, practical travel guides that help you explore amazing destinations without breaking the bank.",
			missionText2:
				"Every guide we create is based on real experiences and thorough research. We focus on what matters most: how to get there affordably, where to stay on a budget, and what to see and do without overspending.",
			offerTitle: "What We Offer",
			offer1: "In-depth destination guides with real budget breakdowns",
			offer2: "Practical tips from experienced budget travelers",
			offer3: "Honest recommendations without hidden agendas",
			offer4: "Regular updates to keep information current",
			moneyTitle: "How We Make Money",
			moneyText1:
				"We're transparent about how we sustain this project. When you book flights, hotels, or tours through our affiliate links, we may earn a small commission at no extra cost to you.",
			moneyText2:
				"This helps us keep creating free content while maintaining our independence. We only recommend services we'd use ourselves.",
			contactTitle: "Get in Touch",
			contactText:
				"Have questions, suggestions, or just want to say hello? We'd love to hear from you. Reach out at",
		},

		// Destinations Page
		destinationsPage: {
			title: "Travel Destinations",
			description:
				"Explore our budget travel guides for destinations around the world. Each guide includes practical tips, costs, and insider advice.",
			all: "All",
			continents: {
				europe: "Europe",
				asia: "Asia",
				africa: "Africa",
				caribbean: "Caribbean",
				northAmerica: "North America",
				southAmerica: "South America",
				oceania: "Oceania",
			},
			continentDescriptions: {
				europe:
					"From Mediterranean beaches to Alpine peaks, Europe offers incredible diversity for budget travelers. Explore historic cities, charming villages, and world-class cuisine.",
				asia: "Discover ancient temples, bustling markets, and pristine beaches. Asia is a paradise for budget travelers with affordable food, accommodation, and endless adventures.",
				africa:
					"Experience wildlife safaris, stunning landscapes, and rich cultures. Africa offers unique adventures from the Sahara to tropical rainforests.",
				caribbean:
					"Crystal-clear waters, white sand beaches, and vibrant culture. The Caribbean islands offer tropical paradise with options for every budget.",
				northAmerica:
					"From bustling cities to national parks, North America has something for everyone. Explore diverse landscapes and cultures across the continent.",
				southAmerica:
					"Explore the Amazon, Andes, and Patagonia. South America offers incredible natural beauty, ancient ruins, and vibrant cities.",
				oceania:
					"Discover the unique wildlife and stunning landscapes of Australia, New Zealand, and the Pacific islands.",
			},
			viewAll: "All destinations",
			viewByContinent: "By continent",
		},

		// Articles Page
		articlesPage: {
			title: "Travel Articles & Guides",
			description:
				"Browse our collection of budget travel guides, destination articles, and insider tips to help you explore the world affordably.",
			featured: "Featured Articles",
			allArticles: "All Articles",
			noArticles: "No articles found. Check back soon for new travel guides!",
			exploreDestinations: "Explore Destinations",
		},

		// Article type labels
		articles: {
			typeDestinationGuide: "Destination Guides",
			typePlaceGuide: "Place Guides",
			typePracticalInfo: "Practical Information",
			typeItinerary: "Itineraries",
			typeList: "Travel Lists",
			typeOther: "Other Articles",
		},
	},

	cs: {
		// Navigation
		nav: {
			home: "Domů",
			destinations: "Destinace",
			about: "O nás",
			contact: "Kontakt",
			privacy: "Soukromí",
			terms: "Podmínky",
			cookies: "Cookies",
			articles: "Články",
		},

		// Header
		header: {
			search: "Hledat",
			searchPlaceholder: "Hledat destinace...",
			navHome: "Domů",
			navHomeDesc: "Prozkoumat doporučené destinace",
			navDestinations: "Destinace",
			navDestinationsDesc: "Procházet destinace",
			navArticles: "Články",
			navArticlesDesc: "Cestovní tipy a průvodci",
			navAbout: "O nás",
			navAboutDesc: "Zjistit více o naší misi",
		},

		// Footer
		footer: {
			description:
				"Váš spolehlivý společník pro levné cestování. Objevte úžasné destinace, praktické tipy a insider znalosti pro prozkoumání světa za rozumnou cenu.",
			email: "hello@lowcosttraveling.com",
			location: "Cestujeme po světě, virtuálně",
			explore: "Prozkoumat",
			travelTips: "Cestovní tipy",
			legal: "Právní",
			followUs: "Sledujte nás",
			newsletterTitle: "Získejte cestovní tipy a aktualizace destinací",
			newsletterPlaceholder: "Váš email",
			newsletterButton: "Přihlásit se",
			copyright: "Všechna práva vyhrazena.",
			affiliate:
				"Některé odkazy mohou být affiliate odkazy. Můžeme získat provizi bez dalších nákladů pro vás.",
			destinations: "Destinace",
			articles: "Články",
			aboutUs: "O nás",
			contact: "Kontakt",
			budgetTips: "Tipy na rozpočet",
			travelPlanning: "Plánování cesty",
			packingGuides: "Průvodci balením",
			safetyTips: "Bezpečnostní tipy",
			privacyPolicy: "Zásady ochrany osobních údajů",
			termsOfUse: "Podmínky použití",
			cookiePolicy: "Zásady cookies",
			disclaimer: "Vyloučení odpovědnosti",
		},

		// Common UI
		common: {
			readMore: "Číst více",
			readGuide: "Číst průvodce",
			viewDestination: "Zobrazit destinaci",
			explore: "Prozkoumat",
			search: "Hledat",
			loading: "Načítání...",
			error: "Chyba",
			notFound: "Nenalezeno",
			back: "Zpět",
			next: "Další",
			previous: "Předchozí",
		},

		// SEO
		seo: {
			title: "Lowcost Traveling - Průvodci levným cestováním",
			description:
				"Objevte destinace pro levné cestování, praktické průvodce a tipy pro cestování po světě.",
			keywords:
				"levné cestování, destinace, průvodci, backpacking, cheap travel",
		},

		// Analytics
		analytics: {
			consentTitle: "Ceníme si vašeho soukromí",
			consentDescription:
				"Používáme cookies a analytiku pro zlepšení vašich zkušeností. Vaše data jsou anonymizována a nikdy nesdílena.",
			accept: "Přijmout analytiku",
			decline: "Odmítnout",
			dismiss: "Možná později",
			privacyPolicy: "Zásady soukromí",
			cookiePolicy: "Zásady cookies",
			privacySettings: "Nastavení soukromí",
		},

		// Article types
		articleTypes: {
			"destination-guide": "Průvodce destinací",
			"place-guide": "Průvodce místem",
			"practical-info": "Praktické informace",
			itinerary: "Itinerář",
			list: "Seznam",
		},

		// Destinations
		destinations: {
			continent: {
				europe: "Evropa",
				asia: "Asie",
				"north-america": "Severní Amerika",
				"south-america": "Jižní Amerika",
				africa: "Afrika",
				oceania: "Oceánie",
			},
			type: {
				country: "Země",
				region: "Region",
				city: "Město",
			},
		},

		// Home page
		home: {
			hero: {
				title: "Cestujte chytře, cestujte levně",
				description:
					"Objevte úžasné destinace, praktické průvodce a insider tipy, abyste udělali své další dobrodružství nezapomenutelné bez přílišného utrácení.",
				exploreDestinations: "Prozkoumat destinace",
				readGuides: "Číst průvodce",
			},
			featuredDestinations: {
				title: "Oblíbené destinace",
			},
			latestArticles: {
				title: "Nejnovější cestovní průvodce",
			},
			cta: {
				title: "Připraveni na další dobrodružství?",
				description:
					"Získejte personalizovaná cestovní doporučení a začněte plánovat svou rozpočtovou cestu ještě dnes.",
				contactUs: "Kontaktujte nás",
			},
		},

		// GDPR Consent Banner
		consent: {
			title: "🍪 Ceníme si vašeho soukromí",
			description:
				"Používáme cookies a analytiku ke zlepšení vašich zkušeností a pochopení, jak se naše stránka používá. Vaše data jsou anonymizována a nikdy se nesdílejí se třetími stranami. Svou volbu můžete kdykoli změnit.",
			accept: "Přijmout analytiku",
			decline: "Odmítnout",
			dismiss: "Možná později",
			privacyPolicy: "Zásady ochrany osobních údajů",
			cookiePolicy: "Zásady používání cookies",
		},

		// Errors
		errors: {
			generic: "Něco se pokazilo. Zkuste to prosím znovu.",
			network: "Chyba sítě. Zkontrolujte prosím připojení.",
			notFound: "Požadovaná stránka nebyla nalezena.",
			articleNotFound: "Článek nenalezen.",
			destinationNotFound: "Destinace nenalezena.",
		},

		// 404 Page
		notFound: {
			title: "Stránka nenalezena",
			description:
				"Vypadá to, že jste zabloudili. Stránka, kterou hledáte, neexistuje.",
			backToHome: "Zpět na domů",
			exploreDestinations: "Prozkoumat destinace",
		},

		// Home Page
		homePage: {
			heroTitle: "Cestujte více, utrácejte méně",
			heroDescription:
				"Objevte průvodce levným cestováním, insider tipy a poznatky o destinacích, které vám pomohou prozkoumat svět bez přílišného utrácení.",
			exploreDestinations: "Prozkoumat destinace",
			featuredDestinations: "Doporučené destinace",
			latestTravelGuides: "Nejnovější cestovní průvodci",
			readGuide: "Číst průvodce",
			readyToStart: "Připraveni začít plánovat?",
			newsletterDescription:
				"Získejte týdenní cestovní tipy, nabídky a průvodce destinacemi přímo do vaší schránky.",
			newsletterPlaceholder: "Váš email",
			subscribe: "Přihlásit se",
			noSpam: "Žádný spam, odhlásit se můžete kdykoli.",
			country: "Země",
			from: "Od",
			perDay: "/den",
			bestTime: "Nejlepší",
			readTravelGuide: "Číst cestovní průvodce",
		},

		// About Page
		about: {
			title: "O Lowcost Traveling",
			subtitle: "Pomáháme levným cestovatelům prozkoumávat svět od roku 2020.",
			missionTitle: "Naše mise",
			missionText1:
				"Věříme, že cestování by mělo být dostupné všem. Naší misí je poskytovat upřímné, praktické průvodce, které vám pomohou prozkoumat úžasné destinace bez přílišného utrácení.",
			missionText2:
				"Každý průvodce, který vytváříme, je založen na skutečných zkušenostech a důkladném výzkumu. Zaměřujeme se na to, co je nejdůležitější: jak se tam dostat levně, kde zůstat s omezeným rozpočtem a co vidět a dělat bez přeplácení.",
			offerTitle: "Co nabízíme",
			offer1: "Podrobné průvodce destinacemi se skutečnými rozpočty",
			offer2: "Praktické tipy od zkušených levných cestovatelů",
			offer3: "Upřímná doporučení bez skrytých agend",
			offer4: "Pravidelné aktualizace pro aktuální informace",
			moneyTitle: "Jak vyděláváme peníze",
			moneyText1:
				"Jsme transparentní ohledně toho, jak tento projekt udržujeme. Když rezervujete lety, hotely nebo zájezdy prostřednictvím našich affiliate odkazů, můžeme získat malou provizi bez dalších nákladů pro vás.",
			moneyText2:
				"To nám pomáhá pokračovat ve vytváření bezplatného obsahu při zachování naší nezávislosti. Doporučujeme pouze služby, které bychom sami používali.",
			contactTitle: "Kontaktujte nás",
			contactText:
				"Máte otázky, návrhy nebo jen chcete pozdravit? Rádi bychom vás slyšeli. Kontaktujte nás na",
		},

		// Destinations Page
		destinationsPage: {
			title: "Cestovní destinace",
			description:
				"Prozkoumejte naše průvodce levným cestováním pro destinace po celém světě. Každý průvodce obsahuje praktické tipy, náklady a insider rady.",
			all: "Vše",
			continents: {
				europe: "Evropa",
				asia: "Asie",
				africa: "Afrika",
				caribbean: "Karibik",
				northAmerica: "Severní Amerika",
				southAmerica: "Jižní Amerika",
				oceania: "Oceánie",
			},
			continentDescriptions: {
				europe:
					"Od středomořských pláží po alpské štíty – Evropa nabízí nevídanou rozmanitost pro cestovatelé s rozpočtem. Objevte historická města, malebné vesničky a světovou gastronomii.",
				asia: "Objevte starobylé chrámy, rušné trhy a nedotčené pláže. Asie je rájem pro cestovatele s malým rozpočtem díky cenově dostupnému jídlu, ubytování a nekonečným dobrodružstvím.",
				africa:
					"Zažijte safari, úchvatné krajiny a bohaté kultury. Afrika nabízí jedinečná dobrodružství od Sahary po tropické deštné pralesy.",
				caribbean:
					"Křišťálově čistá voda, bílé písečné pláže a živá kultura. Karibské ostrovy nabízí tropický ráj s možnostmi pro každý rozpočet.",
				northAmerica:
					"Od rušných měst po národní parky – Severní Amerika má něco pro každého. Prozkoumejte rozmanité krajiny a kultury celého kontinentu.",
				southAmerica:
					"Prozkoumejte Amazonii, Andy a Patagonii. Jižní Amerika nabízí nevídanou přírodní krásu, starobylé ruiny a pulzující města.",
				oceania:
					"Objevte jedinečnou faunu a úchvatnou přírodu Austrálie, Nového Zélandu a tichomořských ostrovů.",
			},
			viewAll: "Všechny destinace",
			viewByContinent: "Podle kontinentu",
		},

		// Articles Page
		articlesPage: {
			title: "Cestovní články a průvodci",
			description:
				"Procházejte naši sbírku průvodců levným cestováním, článků o destinacích a insider tipů pro cenově dostupné cestování.",
			featured: "Doporučené články",
			allArticles: "Všechny články",
			noArticles:
				"Žádné články nenalezeny. Brzy přidáme nové cestovní průvodce!",
			exploreDestinations: "Prozkoumat destinace",
		},

		// Article type labels
		articles: {
			typeDestinationGuide: "Průvodci destinacemi",
			typePlaceGuide: "Průvodci místy",
			typePracticalInfo: "Praktické informace",
			typeItinerary: "Itineráře",
			typeList: "Cestovní seznamy",
			typeOther: "Ostatní články",
		},
	},

	es: {
		// Navigation
		nav: {
			home: "Inicio",
			destinations: "Destinos",
			about: "Acerca de",
			contact: "Contacto",
			privacy: "Privacidad",
			terms: "Términos",
			cookies: "Cookies",
			articles: "Artículos",
		},

		// Header
		header: {
			search: "Buscar",
			searchPlaceholder: "Buscar destinos...",
			navHome: "Inicio",
			navHomeDesc: "Explorar destinos destacados",
			navDestinations: "Destinos",
			navDestinationsDesc: "Navegar destinos",
			navArticles: "Artículos",
			navArticlesDesc: "Consejos y guías de viaje",
			navAbout: "Acerca de",
			navAboutDesc: "Conocer nuestra misión",
		},

		// Footer
		footer: {
			description:
				"Tu compañero de confianza para aventuras de viaje económicas. Descubre destinos increíbles, consejos prácticos y conocimientos internos para explorar el mundo de manera asequible.",
			email: "hello@lowcosttraveling.com",
			location: "Viajando por el mundo, virtualmente",
			explore: "Explorar",
			travelTips: "Consejos de viaje",
			legal: "Legal",
			followUs: "Síguenos",
			newsletterTitle: "Recibe consejos de viaje y actualizaciones de destinos",
			newsletterPlaceholder: "Tu email",
			newsletterButton: "Suscribirse",
			copyright: "Todos los derechos reservados.",
			affiliate:
				"Algunos enlaces pueden ser enlaces de afiliados. Podemos ganar una comisión sin costo adicional para ti.",
			destinations: "Destinos",
			articles: "Artículos",
			aboutUs: "Acerca de nosotros",
			contact: "Contacto",
			budgetTips: "Consejos de presupuesto",
			travelPlanning: "Planificación de viajes",
			packingGuides: "Guías de equipaje",
			safetyTips: "Consejos de seguridad",
			privacyPolicy: "Política de privacidad",
			termsOfUse: "Términos de uso",
			cookiePolicy: "Política de cookies",
			disclaimer: "Descargo de responsabilidad",
		},

		// Common UI
		common: {
			readMore: "Leer más",
			readGuide: "Leer guía",
			viewDestination: "Ver destino",
			explore: "Explorar",
			search: "Buscar",
			loading: "Cargando...",
			error: "Error",
			notFound: "No encontrado",
			back: "Atrás",
			next: "Siguiente",
			previous: "Anterior",
		},

		// SEO
		seo: {
			title: "Lowcost Traveling - Guías de viaje económicas",
			description:
				"Descubre destinos de viaje económicos, guías prácticas y consejos para viajar por el mundo.",
			keywords:
				"viaje económico, destinos, guías de viaje, mochilero, viaje barato",
		},

		// Analytics
		analytics: {
			consentTitle: "Valoramos tu privacidad",
			consentDescription:
				"Usamos cookies y analíticas para mejorar tu experiencia. Tus datos están anonimizados y nunca compartidos.",
			accept: "Aceptar analíticas",
			decline: "Rechazar",
			dismiss: "Quizás después",
			privacyPolicy: "Política de privacidad",
			cookiePolicy: "Política de cookies",
			privacySettings: "Configuración de privacidad",
		},

		// Article types
		articleTypes: {
			"destination-guide": "Guía de destino",
			"place-guide": "Guía de lugar",
			"practical-info": "Información práctica",
			itinerary: "Itinerario",
			list: "Lista",
		},

		// Destinations
		destinations: {
			continent: {
				europe: "Europa",
				asia: "Asia",
				"north-america": "América del Norte",
				"south-america": "América del Sur",
				africa: "África",
				oceania: "Oceanía",
			},
			type: {
				country: "País",
				region: "Región",
				city: "Ciudad",
			},
		},

		// Home page
		home: {
			hero: {
				title: "Viaja inteligente, viaja barato",
				description:
					"Descubre destinos increíbles, guías prácticas de viaje y consejos de expertos para hacer que tu próxima aventura sea inolvidable sin gastar demasiado.",
				exploreDestinations: "Explorar destinos",
				readGuides: "Leer guías",
			},
			featuredDestinations: {
				title: "Destinos populares",
			},
			latestArticles: {
				title: "Últimas guías de viaje",
			},
			cta: {
				title: "¿Listo para tu próxima aventura?",
				description:
					"Obtén recomendaciones de viaje personalizadas y comienza a planificar tu viaje económico hoy mismo.",
				contactUs: "Contáctanos",
			},
		},

		// GDPR Consent Banner
		consent: {
			title: "🍪 Valoramos tu privacidad",
			description:
				"Utilizamos cookies y análisis para mejorar tu experiencia y entender cómo se usa nuestro sitio. Tus datos están anonimizados y nunca se comparten con terceros. Puedes cambiar tus preferencias en cualquier momento.",
			accept: "Aceptar análisis",
			decline: "Rechazar",
			dismiss: "Quizás después",
			privacyPolicy: "Política de privacidad",
			cookiePolicy: "Política de cookies",
		},

		// Errors
		errors: {
			generic: "Algo salió mal. Por favor, inténtalo de nuevo.",
			network: "Error de red. Por favor, verifica tu conexión.",
			notFound: "La página solicitada no fue encontrada.",
			articleNotFound: "Artículo no encontrado.",
			destinationNotFound: "Destino no encontrado.",
		},

		// 404 Page
		notFound: {
			title: "Página no encontrada",
			description:
				"Parece que te has desviado del camino. La página que buscas no existe.",
			backToHome: "Volver al inicio",
			exploreDestinations: "Explorar destinos",
		},

		// Home Page
		homePage: {
			heroTitle: "Viaja más, gasta menos",
			heroDescription:
				"Descubre guías de viaje económicas, consejos de expertos e información sobre destinos para ayudarte a explorar el mundo sin gastar demasiado.",
			exploreDestinations: "Explorar destinos",
			featuredDestinations: "Destinos destacados",
			latestTravelGuides: "Últimas guías de viaje",
			readGuide: "Leer guía",
			readyToStart: "¿Listo para empezar a planificar?",
			newsletterDescription:
				"Recibe consejos de viaje semanales, ofertas y guías de destinos directamente en tu bandeja de entrada.",
			newsletterPlaceholder: "Tu email",
			subscribe: "Suscribirse",
			noSpam: "Sin spam, cancela la suscripción en cualquier momento.",
			country: "País",
			from: "Desde",
			perDay: "/día",
			bestTime: "Mejor",
			readTravelGuide: "Leer guía de viaje",
		},

		// About Page
		about: {
			title: "Acerca de Lowcost Traveling",
			subtitle:
				"Ayudando a viajeros con presupuesto limitado a explorar el mundo desde 2020.",
			missionTitle: "Nuestra misión",
			missionText1:
				"Creemos que viajar debería ser accesible para todos. Nuestra misión es proporcionar guías de viaje honestas y prácticas que te ayuden a explorar destinos increíbles sin gastar demasiado.",
			missionText2:
				"Cada guía que creamos se basa en experiencias reales y una investigación exhaustiva. Nos enfocamos en lo que más importa: cómo llegar de manera económica, dónde alojarse con un presupuesto limitado y qué ver y hacer sin gastar de más.",
			offerTitle: "Lo que ofrecemos",
			offer1:
				"Guías detalladas de destinos con desgloses reales de presupuesto",
			offer2:
				"Consejos prácticos de viajeros experimentados con presupuesto limitado",
			offer3: "Recomendaciones honestas sin agendas ocultas",
			offer4:
				"Actualizaciones regulares para mantener la información actualizada",
			moneyTitle: "Cómo ganamos dinero",
			moneyText1:
				"Somos transparentes sobre cómo mantenemos este proyecto. Cuando reservas vuelos, hoteles o tours a través de nuestros enlaces de afiliados, podemos ganar una pequeña comisión sin costo adicional para ti.",
			moneyText2:
				"Esto nos ayuda a seguir creando contenido gratuito mientras mantenemos nuestra independencia. Solo recomendamos servicios que usaríamos nosotros mismos.",
			contactTitle: "Contáctanos",
			contactText:
				"¿Tienes preguntas, sugerencias o solo quieres saludar? Nos encantaría saber de ti. Escríbenos a",
		},

		// Destinations Page
		destinationsPage: {
			title: "Destinos de viaje",
			description:
				"Explora nuestras guías de viaje económicas para destinos de todo el mundo. Cada guía incluye consejos prácticos, costos y recomendaciones de expertos.",
			all: "Todos",
			continents: {
				europe: "Europa",
				asia: "Asia",
				africa: "África",
				caribbean: "Caribe",
				northAmerica: "Norteamérica",
				southAmerica: "Sudamérica",
				oceania: "Oceanía",
			},
			continentDescriptions: {
				europe:
					"Desde playas mediterráneas hasta picos alpinos, Europa ofrece una diversidad increíble para viajeros con presupuesto. Explora ciudades históricas, pueblos encantadores y gastronomía de clase mundial.",
				asia: "Descubre templos antiguos, mercados bulliciosos y playas vírgenes. Asia es un paraíso para viajeros con presupuesto con comida, alojamiento y aventuras asequibles.",
				africa:
					"Experimenta safaris, paisajes impresionantes y culturas ricas. África ofrece aventuras únicas desde el Sáhara hasta las selvas tropicales.",
				caribbean:
					"Aguas cristalinas, playas de arena blanca y cultura vibrante. Las islas del Caribe ofrecen un paraíso tropical con opciones para cada presupuesto.",
				northAmerica:
					"Desde ciudades bulliciosas hasta parques nacionales, Norteamérica tiene algo para todos. Explora paisajes y culturas diversas en todo el continente.",
				southAmerica:
					"Explora el Amazonas, los Andes y la Patagonia. Sudamérica ofrece una belleza natural increíble, ruinas antiguas y ciudades vibrantes.",
				oceania:
					"Descubre la fauna única y los paisajes impresionantes de Australia, Nueva Zelanda y las islas del Pacífico.",
			},
			viewAll: "Todos los destinos",
			viewByContinent: "Por continente",
		},

		// Articles Page
		articlesPage: {
			title: "Artículos y Guías de Viaje",
			description:
				"Explora nuestra colección de guías de viaje económicas, artículos de destinos y consejos de expertos para viajar de manera asequible.",
			featured: "Artículos Destacados",
			allArticles: "Todos los Artículos",
			noArticles:
				"No se encontraron artículos. ¡Vuelve pronto para nuevas guías de viaje!",
			exploreDestinations: "Explorar Destinos",
		},

		// Article type labels
		articles: {
			typeDestinationGuide: "Guías de Destino",
			typePlaceGuide: "Guías de Lugares",
			typePracticalInfo: "Información Práctica",
			typeItinerary: "Itinerarios",
			typeList: "Listas de Viaje",
			typeOther: "Otros Artículos",
		},
	},

	de: {
		// Navigation
		nav: {
			home: "Startseite",
			destinations: "Reiseziele",
			about: "Über uns",
			contact: "Kontakt",
			privacy: "Datenschutz",
			terms: "AGB",
			cookies: "Cookies",
			articles: "Artikel",
		},

		// Header
		header: {
			search: "Suchen",
			searchPlaceholder: "Reiseziele suchen...",
			navHome: "Startseite",
			navHomeDesc: "Empfohlene Reiseziele erkunden",
			navDestinations: "Reiseziele",
			navDestinationsDesc: "Reiseziele durchsuchen",
			navArticles: "Artikel",
			navArticlesDesc: "Reisetipps und Anleitungen",
			navAbout: "Über uns",
			navAboutDesc: "Mehr über unsere Mission erfahren",
		},

		// Footer
		footer: {
			description:
				"Ihr vertrauenswürdiger Begleiter für günstige Reiseabenteuer. Entdecken Sie fantastische Ziele, praktische Tipps und Insider-Wissen, um die Welt erschwinglich zu erkunden.",
			email: "hello@lowcosttraveling.com",
			location: "Reisen um die Welt, virtuell",
			explore: "Erkunden",
			travelTips: "Reisetipps",
			legal: "Rechtliches",
			followUs: "Folgen Sie uns",
			newsletterTitle: "Erhalten Sie Reisetipps und Zielaktualisierungen",
			newsletterPlaceholder: "Ihre E-Mail",
			newsletterButton: "Abonnieren",
			copyright: "Alle Rechte vorbehalten.",
			affiliate:
				"Einige Links können Affiliate-Links sein. Wir können eine Provision ohne zusätzliche Kosten für Sie verdienen.",
			destinations: "Reiseziele",
			articles: "Artikel",
			aboutUs: "Über uns",
			contact: "Kontakt",
			budgetTips: "Budget-Tipps",
			travelPlanning: "Reiseplanung",
			packingGuides: "Packanleitungen",
			safetyTips: "Sicherheitstipps",
			privacyPolicy: "Datenschutzrichtlinie",
			termsOfUse: "Nutzungsbedingungen",
			cookiePolicy: "Cookie-Richtlinie",
			disclaimer: "Haftungsausschluss",
		},

		// Common UI
		common: {
			readMore: "Mehr lesen",
			readGuide: "Reiseführer lesen",
			viewDestination: "Reiseziel ansehen",
			explore: "Entdecken",
			search: "Suchen",
			loading: "Laden...",
			error: "Fehler",
			notFound: "Nicht gefunden",
			back: "Zurück",
			next: "Weiter",
			previous: "Zurück",
		},

		// SEO
		seo: {
			title: "Lowcost Traveling - Günstige Reiseanleitungen",
			description:
				"Entdecken Sie günstige Reiseziele, praktische Anleitungen und Insider-Tipps für günstiges Reisen.",
			keywords:
				"günstig reisen, reiseziele, reiseanleitungen, rucksackreisen, günstig reisen",
		},

		// Analytics
		analytics: {
			consentTitle: "Wir schätzen Ihre Privatsphäre",
			consentDescription:
				"Wir verwenden Cookies und Analysen, um Ihre Erfahrung zu verbessern. Ihre Daten sind anonymisiert und werden niemals geteilt.",
			accept: "Analysen akzeptieren",
			decline: "Ablehnen",
			dismiss: "Vielleicht später",
			privacyPolicy: "Datenschutzrichtlinie",
			cookiePolicy: "Cookie-Richtlinie",
			privacySettings: "Datenschutzeinstellungen",
		},

		// Article types
		articleTypes: {
			"destination-guide": "Reiseführer",
			"place-guide": "Ortsführer",
			"practical-info": "Praktische Informationen",
			itinerary: "Reiseroute",
			list: "Liste",
		},

		// Destinations
		destinations: {
			continent: {
				europe: "Europa",
				asia: "Asien",
				"north-america": "Nordamerika",
				"south-america": "Südamerika",
				africa: "Afrika",
				oceania: "Ozeanien",
			},
			type: {
				country: "Land",
				region: "Region",
				city: "Stadt",
			},
		},

		// Home page
		home: {
			hero: {
				title: "Reisen Sie klug, reisen Sie günstig",
				description:
					"Entdecken Sie fantastische Ziele, praktische Reiseanleitungen und Insider-Tipps, um Ihr nächstes Abenteuer unvergesslich zu machen, ohne die Bank zu sprengen.",
				exploreDestinations: "Ziele erkunden",
				readGuides: "Reiseführer lesen",
			},
			featuredDestinations: {
				title: "Beliebte Reiseziele",
			},
			latestArticles: {
				title: "Neueste Reiseanleitungen",
			},
			cta: {
				title: "Bereit für Ihr nächstes Abenteuer?",
				description:
					"Erhalten Sie personalisierte Reiseempfehlungen und beginnen Sie noch heute mit der Planung Ihrer budgetfreundlichen Reise.",
				contactUs: "Kontaktieren Sie uns",
			},
		},

		// GDPR Consent Banner
		consent: {
			title: "🍪 Wir schätzen Ihre Privatsphäre",
			description:
				"Wir verwenden Cookies und Analysen, um Ihre Erfahrung zu verbessern und zu verstehen, wie unsere Website verwendet wird. Ihre Daten sind anonymisiert und werden niemals mit Dritten geteilt. Sie können Ihre Einstellungen jederzeit ändern.",
			accept: "Analysen akzeptieren",
			decline: "Ablehnen",
			dismiss: "Vielleicht später",
			privacyPolicy: "Datenschutzrichtlinie",
			cookiePolicy: "Cookie-Richtlinie",
		},

		// Errors
		errors: {
			generic: "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.",
			network: "Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung.",
			notFound: "Die angeforderte Seite wurde nicht gefunden.",
			articleNotFound: "Artikel nicht gefunden.",
			destinationNotFound: "Reiseziel nicht gefunden.",
		},

		// 404 Page
		notFound: {
			title: "Seite nicht gefunden",
			description:
				"Es sieht so aus, als wären Sie vom Weg abgekommen. Die Seite, die Sie suchen, existiert nicht.",
			backToHome: "Zurück zur Startseite",
			exploreDestinations: "Reiseziele erkunden",
		},

		// Home Page
		homePage: {
			heroTitle: "Mehr reisen, weniger ausgeben",
			heroDescription:
				"Entdecken Sie günstige Reiseanleitungen, Insider-Tipps und Zielinformationen, die Ihnen helfen, die Welt zu erkunden, ohne die Bank zu sprengen.",
			exploreDestinations: "Reiseziele erkunden",
			featuredDestinations: "Empfohlene Reiseziele",
			latestTravelGuides: "Neueste Reiseanleitungen",
			readGuide: "Reiseführer lesen",
			readyToStart: "Bereit mit der Planung zu beginnen?",
			newsletterDescription:
				"Erhalten Sie wöchentliche Reisetipps, Angebote und Zielanleitungen direkt in Ihr Postfach.",
			newsletterPlaceholder: "Ihre E-Mail",
			subscribe: "Abonnieren",
			noSpam: "Kein Spam, jederzeit abbestellbar.",
			country: "Land",
			from: "Ab",
			perDay: "/Tag",
			bestTime: "Beste",
			readTravelGuide: "Reiseführer lesen",
		},

		// About Page
		about: {
			title: "Über Lowcost Traveling",
			subtitle: "Hilft Budget-Reisenden seit 2020, die Welt zu erkunden.",
			missionTitle: "Unsere Mission",
			missionText1:
				"Wir glauben, dass Reisen für jeden zugänglich sein sollte. Unsere Mission ist es, ehrliche, praktische Reiseanleitungen bereitzustellen, die Ihnen helfen, fantastische Ziele zu erkunden, ohne die Bank zu sprengen.",
			missionText2:
				"Jede Anleitung, die wir erstellen, basiert auf echten Erfahrungen und gründlicher Recherche. Wir konzentrieren uns auf das, was am wichtigsten ist: wie man günstig dorthin kommt, wo man mit begrenztem Budget übernachtet und was man sehen und tun kann, ohne zu viel auszugeben.",
			offerTitle: "Was wir bieten",
			offer1: "Detaillierte Zielanleitungen mit echten Budgetaufschlüsselungen",
			offer2: "Praktische Tipps von erfahrenen Budget-Reisenden",
			offer3: "Ehrliche Empfehlungen ohne versteckte Agenden",
			offer4: "Regelmäßige Updates, um Informationen aktuell zu halten",
			moneyTitle: "Wie wir Geld verdienen",
			moneyText1:
				"Wir sind transparent darüber, wie wir dieses Projekt aufrechterhalten. Wenn Sie Flüge, Hotels oder Touren über unsere Affiliate-Links buchen, können wir eine kleine Provision ohne zusätzliche Kosten für Sie verdienen.",
			moneyText2:
				"Dies hilft uns, weiterhin kostenlose Inhalte zu erstellen und gleichzeitig unsere Unabhängigkeit zu wahren. Wir empfehlen nur Dienstleistungen, die wir selbst nutzen würden.",
			contactTitle: "Kontaktieren Sie uns",
			contactText:
				"Haben Sie Fragen, Vorschläge oder möchten Sie einfach Hallo sagen? Wir würden gerne von Ihnen hören. Schreiben Sie uns an",
		},

		// Destinations Page
		destinationsPage: {
			title: "Reiseziele",
			description:
				"Erkunden Sie unsere günstigen Reiseanleitungen für Ziele auf der ganzen Welt. Jede Anleitung enthält praktische Tipps, Kosten und Insider-Ratschläge.",
			all: "Alle",
			continents: {
				europe: "Europa",
				asia: "Asien",
				africa: "Afrika",
				caribbean: "Karibik",
				northAmerica: "Nordamerika",
				southAmerica: "Südamerika",
				oceania: "Ozeanien",
			},
			continentDescriptions: {
				europe:
					"Von Mittelmeerstränden bis zu Alpengipfeln bietet Europa unglaubliche Vielfalt für Budget-Reisende. Entdecken Sie historische Städte, charmante Dörfer und Weltklasse-Küche.",
				asia: "Entdecken Sie alte Tempel, geschäftige Märkte und unberührte Strände. Asien ist ein Paradies für Budget-Reisende mit erschwinglichem Essen, Unterkünften und endlosen Abenteuern.",
				africa:
					"Erleben Sie Safaris, atemberaubende Landschaften und reiche Kulturen. Afrika bietet einzigartige Abenteuer von der Sahara bis zu tropischen Regenwäldern.",
				caribbean:
					"Kristallklares Wasser, weiße Sandstrände und lebendige Kultur. Die karibischen Inseln bieten tropisches Paradies mit Optionen für jedes Budget.",
				northAmerica:
					"Von geschäftigen Städten bis zu Nationalparks hat Nordamerika für jeden etwas. Erkunden Sie vielfältige Landschaften und Kulturen auf dem ganzen Kontinent.",
				southAmerica:
					"Erkunden Sie den Amazonas, die Anden und Patagonien. Südamerika bietet unglaubliche Naturschönheit, alte Ruinen und lebendige Städte.",
				oceania:
					"Entdecken Sie die einzigartige Tierwelt und atemberaubende Landschaften Australiens, Neuseelands und der pazifischen Inseln.",
			},
			viewAll: "Alle Reiseziele",
			viewByContinent: "Nach Kontinent",
		},

		// Articles Page
		articlesPage: {
			title: "Reiseartikel & Anleitungen",
			description:
				"Durchsuchen Sie unsere Sammlung von Budget-Reiseanleitungen, Zielartikeln und Insider-Tipps für erschwingliches Reisen.",
			featured: "Empfohlene Artikel",
			allArticles: "Alle Artikel",
			noArticles:
				"Keine Artikel gefunden. Schauen Sie bald wieder für neue Reiseanleitungen!",
			exploreDestinations: "Reiseziele erkunden",
		},

		// Article type labels
		articles: {
			typeDestinationGuide: "Zielanleitungen",
			typePlaceGuide: "Ortsanleitungen",
			typePracticalInfo: "Praktische Informationen",
			typeItinerary: "Reiserouten",
			typeList: "Reiselisten",
			typeOther: "Andere Artikel",
		},
	},
};

// ============================================================================
// I18N CONTEXT & HOOKS
// ============================================================================

class I18nManager {
	private currentLocale: SupportedLocale = DEFAULT_LOCALE;
	private listeners: Set<(locale: SupportedLocale) => void> = new Set();

	constructor() {
		// Load from localStorage on client
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("locale") as SupportedLocale;
			if (stored && SUPPORTED_LOCALES.some((l) => l.code === stored)) {
				this.currentLocale = stored;
			}
		}
	}

	getCurrentLocale(): SupportedLocale {
		return this.currentLocale;
	}

	setLocale(locale: SupportedLocale): void {
		if (!SUPPORTED_LOCALES.some((l) => l.code === locale)) {
			console.warn(`Unsupported locale: ${locale}`);
			return;
		}

		this.currentLocale = locale;

		// Save to localStorage on client
		if (typeof window !== "undefined") {
			localStorage.setItem("locale", locale);
		}

		// Notify listeners
		this.listeners.forEach((listener) => listener(locale));
	}

	subscribe(callback: (locale: SupportedLocale) => void): () => void {
		this.listeners.add(callback);
		return () => this.listeners.delete(callback);
	}

	t(key: string, fallback?: string): string {
		const keys = key.split(".");
		let value: any = translations[this.currentLocale];

		for (const k of keys) {
			value = value?.[k];
		}

		if (typeof value === "string") {
			return value;
		}

		// Try fallback to English
		if (this.currentLocale !== "en") {
			let fallbackValue: any = translations.en;
			for (const k of keys) {
				fallbackValue = fallbackValue?.[k];
			}
			if (typeof fallbackValue === "string") {
				return fallbackValue;
			}
		}

		return fallback || key;
	}

	getLocaleConfig(locale?: SupportedLocale): LocaleConfig | undefined {
		return SUPPORTED_LOCALES.find(
			(l) => l.code === (locale || this.currentLocale),
		);
	}
}

// Global instance
export const i18n = new I18nManager();

// ============================================================================
// REACT PROVIDER
// ============================================================================

import type { FC } from "react";
import React, { createContext, ReactNode, useContext } from "react";

const I18nContext = createContext<I18nManager | null>(null);

export const I18nProvider: FC<{ children: ReactNode }> = ({ children }) => {
	return React.createElement(I18nContext.Provider, { value: i18n }, children);
};

export function useI18n() {
	const context = useContext(I18nContext);
	if (!context) {
		throw new Error("useI18n must be used within an I18nProvider");
	}
	return context;
}

// ============================================================================
// REACT HOOKS
// ============================================================================

import { useCallback, useEffect, useState } from "react";

export function useTranslation() {
	const [locale, setLocale] = useState<SupportedLocale>(
		i18n.getCurrentLocale(),
	);

	useEffect(() => {
		const unsubscribe = i18n.subscribe(setLocale);
		return unsubscribe;
	}, []);

	// Include locale in dependencies so components re-render when locale changes
	const t = useCallback(
		(key: string, fallback?: string) => {
			return i18n.t(key, fallback);
		},
		[locale],
	);

	const changeLocale = useCallback((newLocale: SupportedLocale) => {
		i18n.setLocale(newLocale);
	}, []);

	return {
		t,
		locale,
		changeLocale,
		localeConfig: i18n.getLocaleConfig(),
	};
}

export function useLocale() {
	const [locale, setLocale] = useState<SupportedLocale>(
		i18n.getCurrentLocale(),
	);

	useEffect(() => {
		const unsubscribe = i18n.subscribe(setLocale);
		return unsubscribe;
	}, []);

	return locale;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatLocalizedDate(
	date: Date,
	locale: SupportedLocale = i18n.getCurrentLocale(),
): string {
	return date.toLocaleDateString(getLocaleForIntl(locale), {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function getLocaleForIntl(locale: SupportedLocale): string {
	const mapping: Record<SupportedLocale, string> = {
		en: "en-US",
		cs: "cs-CZ",
		es: "es-ES",
		de: "de-DE",
	};
	return mapping[locale] || "en-US";
}

// ============================================================================
// CONTENT LOCALIZATION HELPERS
// ============================================================================

/**
 * Get localized content path
 * e.g., /articles/my-post -> /cs/articles/my-post
 */
export function getLocalizedPath(
	path: string,
	locale?: SupportedLocale,
): string {
	const currentLocale = locale || i18n.getCurrentLocale();
	if (currentLocale === DEFAULT_LOCALE) return path;

	// Add locale prefix for non-default locales
	return `/${currentLocale}${path}`;
}

/**
 * Remove locale prefix from path
 * e.g., /cs/articles/my-post -> /articles/my-post
 */
export function getPathWithoutLocale(path: string): {
	path: string;
	locale: SupportedLocale;
} {
	const segments = path.split("/").filter(Boolean);

	if (
		segments.length > 0 &&
		SUPPORTED_LOCALES.some((l) => l.code === segments[0])
	) {
		const locale = segments[0] as SupportedLocale;
		const cleanPath = "/" + segments.slice(1).join("/");
		return { path: cleanPath, locale };
	}

	return { path, locale: DEFAULT_LOCALE };
}

/**
 * Check if content exists for locale
 */
export function hasLocalizedContent(
	contentId: string,
	locale: SupportedLocale,
): boolean {
	// In a real app, this would check if translated content exists
	// For now, assume English content exists for all locales
	return locale === "en" || Math.random() > 0.5; // Simulate some content being translated
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
