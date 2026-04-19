/**
 * Internationalization (i18n) System
 *
 * Lightweight i18n implementation for the travel blog.
 * Supports content translation and locale switching.
 */

export type SupportedLocale = "cs" | "en";

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
	{ code: "cs", name: "Čeština", flag: "🇨🇿", direction: "ltr" },
	{ code: "en", name: "English", flag: "🇺🇸", direction: "ltr" },
];

export const DEFAULT_LOCALE: SupportedLocale = "cs";

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
			navBook: "Book",
			navBookDesc: "Budget travel book – info & purchase",
			navAbout: "About",
			navAboutDesc: "Learn about our mission",
		},

		// Footer
		footer: {
			description:
				"Your trusted companion for budget travel adventures. Discover amazing destinations, practical tips, and insider knowledge to explore the world affordably.",
			email: "hello@lowcost-traveling.com",
			location: "Traveling the world, virtually",
			explore: "Explore",
			travelTips: "Travel Tips",
			legal: "Legal",
			followUs: "Follow Us",
			newsletterTitle: "Get travel tips & destination updates",
			newsletterPlaceholder: "Your email",
			newsletterButton: "Subscribe",
			newsletterSuccess: "Thank you for subscribing!",
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
			siteName: "World for ",
			siteNameHighlight: "Less",
			siteNameFull: "World for Less",
		},

		// SEO
		seo: {
			title: "World for Less – Budget Travel Guides & Tips",
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
			heroTagline: "Guides & tips for smart travelers.",
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
			// New dashboard sections
			mainHeadline: "Travel More, Spend Less",
			mainIntro:
				"Practical guides and tips so you can explore the world on a budget. No fluff—just what you need to plan a great trip.",
			whatWeBringTitle: "What you get here",
			whatWeBring1: "Budget-friendly destination guides with real costs",
			whatWeBring2: "Practical tips: transport, accommodation, food",
			whatWeBring3: "Honest recommendations without the hype",
			ebookTitle: "Free e‑book: Budget travel starter pack",
			ebookDescription:
				"Get our PDF with 20+ tips for planning your first (or next) budget trip. Enter your email and we’ll send it right away.",
			ebookPlaceholder: "Your email",
			ebookCta: "Send me the free e‑book",
			bookTitle: "The World for Less Handbook",
			bookDescription:
				"Our full guide to planning and enjoying budget trips—destinations, saving tips, and real itineraries. Available as e‑book and paperback.",
			bookCta: "View the book",
			articlesTitle: "Latest guides & articles",
		},

		// About Page
		book: {
			title: "The Budget Travel Book",
			subtitle:
				"Practical guide to traveling the world for less – tips, budgets, and inspiration.",
			comingSoon:
				"The book is in preparation. We'll announce it here as soon as it's available.",
			coverNote: "Cover coming soon",
			descriptionTitle: "About the book",
			description:
				"This book brings together the best of our experience and guides: how to plan a trip on a budget, where to save money without losing the experience, and how to choose destinations that offer the most for your money. Whether you're planning your first long trip or you're a seasoned backpacker, you'll find concrete tips and real numbers.",
			features:
				"Real daily budgets by destination | How to find cheap flights and accommodation | When to go and what to avoid | Packing and preparation | Safety and visas in one place",
			registerTitle: "Get notified when the book is out",
			registerDesc:
				"Leave your email and we'll let you know as soon as the book is available and where to buy it.",
			registerPlaceholder: "Your email",
			registerButton: "Notify me",
			registerSuccess: "Thanks! We'll email you when the book is available.",
			registerError: "Something went wrong. Please try again later.",
			ebookTitle: "Free e‑book: Budget travel starter",
			ebookDesc:
				"Enter your email and get instant access to our PDF with practical tips for your first (or next) budget trip.",
			ebookPlaceholder: "Your email",
			ebookButton: "Send me the free e‑book",
			ebookSuccess: "Thank you! Use the link below to download.",
			ebookSuccessNoUrl:
				"Download link will be set up soon. We have saved your email.",
			ebookDownloadBtn: "Download e‑book (PDF)",
			buyTitle: "Buy the book",
			buyNote:
				"Purchase the e‑book or paperback securely. After payment you'll receive the download link by email.",
			buyPrice: "Price",
			buyEmailPlaceholder: "Your email",
			buyFullNamePlaceholder: "Your name",
			buyButton: "Buy now",
			buySubmitButton: "Go to payment",
			buyError:
				"Payment could not be started. Try again or use the link below.",
			buyAlternativeLink: "alternative link",
			buyUrl: "#",
			successTitle: "Thank you for your purchase",
			successMessage:
				"Your payment was successful. We've sent the download link to your email.",
			successCheckSpam: "If you don't see it, check your spam folder.",
			successBackToBook: "Back to the book page",
		},

		about: {
			title: "About World for Less",
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
			talksTitle: "Live Talks & Presentations",
			talksIntro:
				"Travel guides aren't enough — sometimes you just need to hear it from someone who's been there. That's why we give live presentations about budget travel, sharing real stories, tips, and practical advice directly with audiences.",
			talksOffer1: "Talks for schools, universities, and clubs",
			talksOffer2:
				"Themed presentations: budget travel, gap years, solo travel, specific regions",
			talksOffer3: "Q&A sessions and personal consultations",
			talksOffer4: "Custom presentations tailored to your event or audience",
			talksPastTitle: "Where you've seen us",
			talksPast1: "Festival Cestovatelů (Prague, 2023 & 2024)",
			talksPast2: "Travel evening at Faculty of Science, Masaryk University",
			talksPast3: "Meetup Levné Cestování (Brno, Prague)",
			talksReferencesTitle: "Event references",
			talksTopicsTitle: "Talk topics",
			talksTopic1: "New Zealand: van life and day-to-day reality on the road",
			talksTopic2: "Australia",
			talksTopic3: "Japan",
			talksTopic4: "Seychelles and Kenya",
			talksTopic5: "Vietnam",
			talksTopic6: "Ecuador",
			talksUpcomingTitle: "Upcoming events",
			talksUpcomingEmpty:
				"No events scheduled right now — follow us on social media or reach out to book a talk for your event.",
			talksContact: "Want us at your event? Write to us at",
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
			navBook: "Kniha",
			navBookDesc: "Kniha o levném cestování – info a nákup",
			navAbout: "O nás",
			navAboutDesc: "Zjistit více o naší misi",
		},

		// Footer
		footer: {
			description:
				"Váš spolehlivý společník pro levné cestování. Objevte úžasné destinace, praktické tipy a insider znalosti pro prozkoumání světa za rozumnou cenu.",
			email: "hello@lowcost-traveling.com",
			location: "Cestujeme po světě, virtuálně",
			explore: "Prozkoumat",
			travelTips: "Cestovní tipy",
			legal: "Právní",
			followUs: "Sledujte nás",
			newsletterTitle: "Získejte cestovní tipy a aktualizace destinací",
			newsletterPlaceholder: "Váš email",
			newsletterButton: "Přihlásit se",
			newsletterSuccess: "Děkujeme za přihlášení k odběru!",
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
			siteName: "Svět za ",
			siteNameHighlight: "málo",
			siteNameFull: "Svět za málo",
		},

		// SEO
		seo: {
			title: "Svět za málo – Průvodce levným cestováním",
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
			heroTagline: "Průvodce a tipy pro chytré cestovatele.",
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
			mainHeadline: "Cestujte více, utrácejte méně",
			mainIntro:
				"Praktické průvodce a tipy, díky kterým prozkoumáte svět levně. Žádná omáčka—jen to, co potřebujete na skvělou dovolenou.",
			whatWeBringTitle: "Co vám nabízíme",
			whatWeBring1: "Průvodce destinacemi s reálnými náklady",
			whatWeBring2: "Praktické tipy: doprava, ubytování, jídlo",
			whatWeBring3: "Upřímná doporučení bez zbytečné reklamy",
			ebookTitle: "E‑book zdarma: Začínáme s levným cestováním",
			ebookDescription:
				"Stáhněte si PDF s 20+ tipy na plánování první (nebo další) levné cesty. Zadejte email a pošleme vám ho okamžitě.",
			ebookPlaceholder: "Váš email",
			ebookCta: "Chci e‑book zdarma",
			bookTitle: "Průvodce Svět za málo",
			bookDescription:
				"Kompletní průvodce plánováním a užíváním si levných cest—destinace, tipy na úspory a reálné itineráře. K dispozici jako e‑book i brožovaná kniha.",
			bookCta: "Zobrazit knihu",
			articlesTitle: "Nejnovější průvodce a články",
		},

		// About Page
		book: {
			title: "Kniha o levném cestování",
			subtitle:
				"Praktický průvodce světem za málo – tipy, rozpočty a inspirace.",
			comingSoon:
				"Kniha se připravuje. Ozveme se zde, jakmile bude k dispozici.",
			coverNote: "Obálka bude doplněna",
			descriptionTitle: "O knize",
			description:
				"Kniha shrnuje to nejlepší z našich zkušeností a průvodců: jak naplánovat cestu na rozpočet, kde ušetřit bez ztráty zážitku a jak vybírat destinace, které nabídnou nejvíc za vaše peníze. Ať plánujete první dálkovou cestu, nebo jste ostřílený backpacker, najdete v ní konkrétní tipy a reálná čísla.",
			features:
				"Reálné denní rozpočty podle destinací | Jak na levné letenky a ubytování | Kdy vyrazit a čemu se vyhnout | Balení a příprava | Bezpečnost a víza na jednom místě",
			registerTitle: "Dejte vědět, až kniha vyjde",
			registerDesc:
				"Nechte e-mail a my vás upozorníme, jakmile bude kniha k dispozici a kde ji koupit.",
			registerPlaceholder: "Váš e-mail",
			registerButton: "Upozornit mě",
			registerSuccess: "Díky! Až bude kniha k dispozici, napíšeme vám.",
			registerError: "Něco se pokazilo. Zkuste to prosím později.",
			ebookTitle: "Zdarma e‑book: Začátečník levného cestování",
			ebookDesc:
				"Zadejte e-mail a získejte okamžitý přístup k našemu PDF s praktickými tipy na první (nebo další) cestu na rozpočet.",
			ebookPlaceholder: "Váš e-mail",
			ebookButton: "Pošlete mi zdarma e‑book",
			ebookSuccess: "Děkujeme! Ke stažení použijte odkaz níže.",
			ebookSuccessNoUrl:
				"Odkaz ke stažení bude brzy doplněn. Váš e-mail jsme uložili.",
			ebookDownloadBtn: "Stáhnout e‑book (PDF)",
			buyTitle: "Koupit knihu",
			buyNote:
				"Knihu si můžete koupit přímo zde – e‑book nebo tištěnou. Po platbě vám pošleme odkaz ke stažení na e‑mail.",
			buyPrice: "Cena",
			buyEmailPlaceholder: "Váš e-mail",
			buyFullNamePlaceholder: "Jméno a příjmení",
			buyButton: "Koupit knihu",
			buySubmitButton: "Přejít k platbě",
			buyError:
				"Platbu se nepodařilo spustit. Zkuste to znovu nebo použijte odkaz níže.",
			buyAlternativeLink: "alternativní odkaz",
			buyUrl: "#",
			successTitle: "Děkujeme za nákup",
			successMessage:
				"Platba proběhla v pořádku. Odkaz ke stažení knihy jsme odeslali na váš e‑mail.",
			successCheckSpam:
				"Pokud e‑mail nevidíte, zkontrolujte složku nevyžádané pošty.",
			successBackToBook: "Zpět na stránku knihy",
		},

		about: {
			title: "O Svět za málo",
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
			talksTitle: "Přednášky a prezentace",
			talksIntro:
				"Průvodce na webu nestačí — někdy potřebujete slyšet příběh přímo od toho, kdo tam byl. Proto pořádáme živé přednášky o levném cestování, kde sdílíme reálné zážitky, tipy a praktické rady.",
			talksOffer1: "Přednášky pro školy, univerzity, spolky a kluby",
			talksOffer2:
				"Tematické prezentace: levné cestování, gap year, sólové cestování, konkrétní oblasti",
			talksOffer3: "Diskuze, Q&A a osobní konzultace",
			talksOffer4: "Přednáška na míru pro váš event nebo publikum",
			talksPastTitle: "Kde jste nás mohli vidět",
			talksPast1: "Festival Cestovatelů (Praha, 2023 a 2024)",
			talksPast2: "Cestovatelský večer na Přírodovědecké fakultě MU",
			talksPast3: "Meetup Levné Cestování (Brno, Praha)",
			talksReferencesTitle: "Zpětné reference",
			talksTopicsTitle: "Možnosti přednášek",
			talksTopic1: "Nový Zéland aneb život v dodávce",
			talksTopic2: "Austrálie",
			talksTopic3: "Japonsko",
			talksTopic4: "Seychely a Keňa",
			talksTopic5: "Vietnam",
			talksTopic6: "Ekvádor",
			talksUpcomingTitle: "Nadcházející přednášky",
			talksUpcomingEmpty:
				"Momentálně žádné termíny — sledujte nás na sociálních sítích nebo nás kontaktujte pro domluvení přednášky na vaši akci.",
			talksContact: "Chcete nás na svém eventu? Napište nám na",
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
		this.listeners.forEach((listener) => {
			listener(locale);
		});
	}

	subscribe(callback: (locale: SupportedLocale) => void): () => void {
		this.listeners.add(callback);
		return () => this.listeners.delete(callback);
	}

	/** Translate by key. Use overrideLocale to avoid hydration mismatch (e.g. pass hook's locale state). */
	t(key: string, fallback?: string, overrideLocale?: SupportedLocale): string {
		const locale = overrideLocale ?? this.currentLocale;
		const keys = key.split(".");
		let value: unknown = translations[locale];

		for (const k of keys) {
			value = (value as Record<string, unknown>)?.[k];
		}

		if (typeof value === "string") {
			return value;
		}

		// Try fallback to English
		if (locale !== "en") {
			let fallbackValue: unknown = translations.en;
			for (const k of keys) {
				fallbackValue = (fallbackValue as Record<string, unknown>)?.[k];
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
import React, { createContext, type ReactNode, useContext } from "react";

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
	// Use default locale for initial render so server and client match (avoid hydration mismatch).
	// After mount, useEffect syncs from localStorage via subscribe.
	const [locale, setLocale] = useState<SupportedLocale>(DEFAULT_LOCALE);

	useEffect(() => {
		setLocale(i18n.getCurrentLocale());
		const unsubscribe = i18n.subscribe(setLocale);
		return unsubscribe;
	}, []);

	// Use hook's locale (not i18n.currentLocale) so first render is always DEFAULT_LOCALE and matches server.
	const t = useCallback(
		(key: string, fallback?: string) => {
			return i18n.t(key, fallback, locale);
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
	const [locale, setLocale] = useState<SupportedLocale>(DEFAULT_LOCALE);

	useEffect(() => {
		setLocale(i18n.getCurrentLocale());
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
		cs: "cs-CZ",
		en: "en-US",
	};
	return mapping[locale] || "cs-CZ";
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
		const cleanPath = `/${segments.slice(1).join("/")}`;
		return { path: cleanPath, locale };
	}

	return { path, locale: DEFAULT_LOCALE };
}

/**
 * Check if content exists for locale
 */
export function hasLocalizedContent(
	_contentId: string,
	locale: SupportedLocale,
): boolean {
	// In a real app, this would check if translated content exists
	// For now, assume English content exists for all locales
	return locale === "en" || Math.random() > 0.5; // Simulate some content being translated
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
