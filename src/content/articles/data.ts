import type { Article } from "@/types";

export const articles: Article[] = [
	{
		id: "dominican-republic-guide",
		slug: "dominican-republic",
		destinationId: "dominican-republic",
		articleType: "destination-guide",
		tags: ["caribbean", "beaches", "budget"],
		coverImage: {
			src: "https://images.unsplash.com/photo-1569700981638-cd61ef29d2e3?w=1600&q=80",
			alt: "Dominican Republic beach with palm trees",
		},
		title: "Dominican Republic: Complete Travel Guide 2026",
		intro:
			"The Dominican Republic is a Caribbean nation that shares the island of Hispaniola with Haiti. Known for its stunning beaches, vibrant culture, and affordable prices, it's a perfect destination for budget travelers seeking tropical paradise.",
		sections: [
			{
				id: "getting-there",
				title: "Getting There",
				content:
					"The main international airports are Punta Cana (PUJ) and Santo Domingo (SDQ). Many budget airlines offer direct flights from Europe and North America. The best deals are usually found flying midweek, and booking 2-3 months in advance can save you up to 40% on airfare.",
			},
			{
				id: "best-time-to-visit",
				title: "Best Time to Visit",
				content:
					"The best time to visit is from December to April when the weather is dry and sunny. Hurricane season runs from June to November, but September and October are the riskiest months. Visiting during shoulder season (May or November) offers good weather and lower prices.",
			},
			{
				id: "where-to-stay",
				title: "Where to Stay",
				content:
					"Punta Cana is famous for all-inclusive resorts, but budget travelers can find great deals in Bavaro. For a more authentic experience, consider staying in Santo Domingo or Las Terrenas. Hostels start from $15/night, and decent hotels from $40/night.",
			},
			{
				id: "budget-tips",
				title: "Budget & Costs",
				content:
					"The Dominican Republic is very affordable. Budget travelers can get by on $40-50/day including accommodation, food, and activities. Eat at local comedores for meals under $5, use guaguas (local buses) for cheap transport, and negotiate prices at markets.",
			},
		],
		places: [
			{
				id: "punta-cana",
				name: "Punta Cana",
				description:
					"Famous beach resort area with white sand beaches, turquoise waters, and endless all-inclusive options.",
				latitude: 18.5601,
				longitude: -68.3725,
				type: "beach",
			},
			{
				id: "santo-domingo",
				name: "Santo Domingo",
				description:
					"The capital city with the oldest colonial settlement in the Americas. Great for history and nightlife.",
				latitude: 18.4861,
				longitude: -69.9312,
				type: "city",
			},
			{
				id: "los-haitises",
				name: "Los Haitises National Park",
				description:
					"Stunning national park with mangroves, caves, and diverse wildlife. Perfect for nature lovers.",
				latitude: 19.0833,
				longitude: -69.5,
				type: "nature",
			},
		],
		faq: [
			{
				id: "faq-1",
				question: "What is the best time to visit Dominican Republic?",
				answer:
					"The best time to visit is December to April for dry, sunny weather. Avoid September-October for hurricane risk.",
			},
			{
				id: "faq-2",
				question: "Is Dominican Republic safe for tourists?",
				answer:
					"Yes, tourist areas are generally safe. Use common sense, avoid isolated areas at night, and keep valuables secure.",
			},
			{
				id: "faq-3",
				question: "How much money do I need per day?",
				answer:
					"Budget travelers can manage on $40-50/day. Mid-range travelers should budget $80-100/day.",
			},
		],
		seo: {
			metaTitle:
				"Dominican Republic: Complete Travel Guide 2026 | Lowcost Traveling",
			metaDescription:
				"Plan your Dominican Republic trip with our complete guide. Best beaches, budget tips, top attractions, and practical info for 2026.",
			keywords: [
				"dominican republic",
				"caribbean",
				"punta cana",
				"santo domingo",
				"budget travel",
			],
			ogImage: {
				src: "/images/dominican-republic-og.jpg",
				alt: "Dominican Republic beaches",
			},
		},
		publishedAt: "2026-01-15",
		updatedAt: "2026-01-20",
	},
	{
		id: "vatican-guide",
		slug: "vatican",
		destinationId: "vatican",
		articleType: "destination-guide",
		tags: ["europe", "culture", "history"],
		coverImage: {
			src: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1600&q=80",
			alt: "St. Peters Basilica in Vatican City",
		},
		title: "Vatican City: Complete Travel Guide 2026",
		intro:
			"Vatican City is the smallest independent state in the world, located within Rome, Italy. Home to the Pope and countless art treasures, it attracts millions of visitors each year to see St. Peter's Basilica, the Sistine Chapel, and the Vatican Museums.",
		sections: [
			{
				id: "getting-there",
				title: "Getting There",
				content:
					"Vatican City is located in Rome. Fly into Rome Fiumicino (FCO) or Ciampino (CIA) airports. From central Rome, take Metro Line A to Ottaviano station, which is a 5-minute walk from Vatican City. Alternatively, buses 40 and 64 stop nearby.",
			},
			{
				id: "what-to-see",
				title: "What to See",
				content:
					"The must-see attractions are St. Peter's Basilica (free entry), the Sistine Chapel, and the Vatican Museums. Book tickets online in advance to skip the long queues, especially during peak season. The climb to the dome offers stunning views of Rome.",
			},
			{
				id: "tips",
				title: "Visitor Tips",
				content:
					"Dress modestly – covered shoulders and knees are required for entry to St. Peter's. Visit early morning (8am) or late afternoon (4pm) to avoid the worst crowds. Free entry to St. Peter's Basilica; Vatican Museums require a ticket (€17 online).",
			},
			{
				id: "budget-tips",
				title: "Budget & Costs",
				content:
					"Vatican City itself has no accommodation, so you'll stay in Rome. Budget around €50-70/day for Rome including hostel, food, and Vatican entry. Free entry to St. Peter's Basilica helps keep costs down. Pack lunch to avoid expensive tourist restaurants.",
			},
		],
		places: [
			{
				id: "st-peters-basilica",
				name: "St. Peter's Basilica",
				description:
					"The largest church in the world and center of Christianity. Free entry, but expect queues.",
				latitude: 41.9022,
				longitude: 12.4539,
				type: "landmark",
			},
			{
				id: "sistine-chapel",
				name: "Sistine Chapel",
				description:
					"Famous for Michelangelo's ceiling frescoes and The Last Judgment. Part of Vatican Museums.",
				latitude: 41.903,
				longitude: 12.4545,
				type: "landmark",
			},
			{
				id: "vatican-museums",
				name: "Vatican Museums",
				description:
					"One of the world's greatest art collections spanning centuries. Book online to skip queues.",
				latitude: 41.9065,
				longitude: 12.4536,
				type: "landmark",
			},
		],
		faq: [
			{
				id: "faq-1",
				question: "How long do you need to visit Vatican City?",
				answer:
					"Plan at least half a day (4-5 hours) to see the main attractions. A full day allows for a more relaxed visit.",
			},
			{
				id: "faq-2",
				question: "Is the Vatican free to visit?",
				answer:
					"St. Peter's Basilica is free. Vatican Museums (including Sistine Chapel) cost €17 online. Free entry on last Sunday of each month.",
			},
			{
				id: "faq-3",
				question: "What should I wear to the Vatican?",
				answer:
					"Modest dress is required: covered shoulders and knees. No shorts, tank tops, or mini skirts.",
			},
		],
		seo: {
			metaTitle: "Vatican City: Complete Travel Guide 2026 | Lowcost Traveling",
			metaDescription:
				"Everything you need to know about visiting Vatican City. Skip the lines, see the Sistine Chapel, and explore St. Peter's Basilica.",
			keywords: [
				"vatican",
				"rome",
				"sistine chapel",
				"st peters basilica",
				"italy travel",
			],
			ogImage: {
				src: "/images/vatican-og.jpg",
				alt: "St. Peter's Basilica",
			},
		},
		publishedAt: "2026-01-10",
		updatedAt: "2026-01-18",
	},
	{
		id: "thailand-guide",
		slug: "thailand",
		destinationId: "thailand",
		articleType: "destination-guide",
		tags: ["asia", "beaches", "budget", "temples"],
		coverImage: {
			src: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1600&q=80",
			alt: "Thai temple at sunset",
		},
		title: "Thailand: Complete Travel Guide 2026",
		intro:
			"Thailand is the ultimate budget travel destination in Southeast Asia. From the bustling streets of Bangkok to pristine island beaches, ancient temples to world-class street food, Thailand offers incredible value and unforgettable experiences for travelers of all budgets.",
		sections: [
			{
				id: "getting-there",
				title: "Getting There",
				content:
					"Bangkok has two major airports: Suvarnabhumi (BKK) for international flights and Don Mueang (DMK) for budget carriers. Direct flights arrive from major cities worldwide. Budget airlines like AirAsia and Scoot offer incredibly cheap fares from neighboring countries. Book 1-2 months ahead for best prices.",
			},
			{
				id: "best-time-to-visit",
				title: "Best Time to Visit",
				content:
					"The best time to visit is November to February during the cool, dry season. March-May is hot and humid. June-October brings monsoon rains, but also lower prices and fewer tourists. The south has different weather patterns – eastern coast is best December-April, western coast June-October.",
			},
			{
				id: "where-to-stay",
				title: "Where to Stay",
				content:
					"Thailand has accommodation for every budget. Dorm beds in hostels start from $5-8/night. Private rooms in guesthouses cost $15-25/night. Mid-range hotels run $30-60/night. Bangkok and tourist islands are pricier; northern Thailand and smaller towns offer better value.",
			},
			{
				id: "budget-tips",
				title: "Budget & Costs",
				content:
					"Thailand is incredibly budget-friendly. Backpackers can live well on $30-40/day. Street food costs $1-3 per meal. Local transport is cheap – buses, trains, and songthaews. Skip taxis for tuk-tuks (negotiate!) or Grab. Avoid tourist traps and eat where locals eat.",
			},
			{
				id: "getting-around",
				title: "Getting Around",
				content:
					"Thailand has excellent transport. Overnight trains and buses connect major cities cheaply. Budget flights between cities cost $20-50. On islands, rent a scooter ($5-10/day) or use songthaews. In Bangkok, use BTS/MRT trains and avoid taxis in traffic.",
			},
		],
		places: [
			{
				id: "bangkok",
				name: "Bangkok",
				description:
					"The chaotic capital. Grand Palace, street food heaven, vibrant nightlife. 2-3 days recommended.",
				latitude: 13.7563,
				longitude: 100.5018,
				type: "city",
			},
			{
				id: "chiang-mai",
				name: "Chiang Mai",
				description:
					"Cultural heart of the north. Temples, night markets, cooking classes, and gateway to hill tribes.",
				latitude: 18.7883,
				longitude: 98.9853,
				type: "city",
			},
			{
				id: "phuket",
				name: "Phuket",
				description:
					"Thailand's largest island with beautiful beaches. Can be touristy, but great for island hopping.",
				latitude: 7.9519,
				longitude: 98.3381,
				type: "beach",
			},
			{
				id: "koh-phi-phi",
				name: "Koh Phi Phi",
				description:
					'Stunning island famous from "The Beach". Paradise scenery, great snorkeling, lively nightlife.',
				latitude: 7.7407,
				longitude: 98.7784,
				type: "beach",
			},
		],
		faq: [
			{
				id: "faq-1",
				question: "Is Thailand safe for solo travelers?",
				answer:
					"Yes, Thailand is very safe and popular with solo travelers. Use common sense with valuables and be aware of common scams in tourist areas.",
			},
			{
				id: "faq-2",
				question: "Do I need a visa for Thailand?",
				answer:
					"Most nationalities get 30-60 days visa-free. You can extend for 30 days at immigration offices for 1,900 baht.",
			},
			{
				id: "faq-3",
				question: "How much should I budget per day?",
				answer:
					"Budget travelers: $30-40/day. Mid-range: $50-80/day. You can go lower in rural areas or higher in tourist hotspots.",
			},
			{
				id: "faq-4",
				question: "Is it easy to travel around Thailand?",
				answer:
					"Very easy! Great bus and train network, cheap domestic flights, and tourist infrastructure everywhere. English is widely spoken.",
			},
		],
		seo: {
			metaTitle: "Thailand: Complete Travel Guide 2026 | Lowcost Traveling",
			metaDescription:
				"Complete Thailand travel guide. Bangkok, islands, temples, street food, and budget tips. Everything you need for 2026.",
			keywords: [
				"thailand",
				"bangkok",
				"phuket",
				"chiang mai",
				"thai islands",
				"budget travel asia",
			],
			ogImage: {
				src: "/images/thailand-og.jpg",
				alt: "Thailand temples and beaches",
			},
		},
		publishedAt: "2026-01-12",
		updatedAt: "2026-01-19",
	},
	{
		id: "portugal-guide",
		slug: "portugal",
		destinationId: "portugal",
		articleType: "destination-guide",
		tags: ["europe", "beaches", "culture", "food"],
		coverImage: {
			src: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1600&q=80",
			alt: "Lisbon tram on historic street",
		},
		title: "Portugal: Complete Travel Guide 2026",
		intro:
			"Portugal is one of Europe's best-value destinations, offering stunning Atlantic beaches, historic cities, world-class wine, and delicious cuisine. From Lisbon's charming neighborhoods to Porto's riverside beauty and the Algarve's golden cliffs, Portugal delivers unforgettable experiences without the Western European price tag.",
		sections: [
			{
				id: "getting-there",
				title: "Getting There",
				content:
					"Lisbon (LIS) and Porto (OPO) are the main international airports. Budget carriers like Ryanair and EasyJet offer cheap flights from across Europe. From outside Europe, TAP Air Portugal has good connections. The Algarve has Faro airport (FAO) for direct beach access.",
			},
			{
				id: "best-time-to-visit",
				title: "Best Time to Visit",
				content:
					"Best times are April-June and September-October: pleasant weather, smaller crowds. Summer (July-August) is hot and crowded, especially in the Algarve. Winter is mild but rainy – great for lower prices and fewer tourists in cities.",
			},
			{
				id: "where-to-stay",
				title: "Where to Stay",
				content:
					"Portugal offers great value accommodation. Lisbon hostels: €15-25/night. Budget hotels: €40-60/night. The Algarve is pricier in summer. Consider staying in local guesthouses (pensões) for authentic experiences and better prices than chain hotels.",
			},
			{
				id: "budget-tips",
				title: "Budget & Costs",
				content:
					'Portugal is affordable for Western Europe. Budget: €45-60/day, Mid-range: €80-120/day. Save money: eat "prato do dia" (daily special) at local restaurants (€7-10), drink local wine (€2-3/glass), use public transport. Porto and northern Portugal are cheaper than Lisbon.',
			},
			{
				id: "food-drink",
				title: "Food & Drink",
				content:
					"Portuguese cuisine is delicious and affordable. Must-try: pastéis de nata (custard tarts), bacalhau (salt cod), francesinha (Porto sandwich), grilled sardines. Wine is excellent and cheap – try Vinho Verde and Port wine. Coffee culture is strong – bica (espresso) costs €0.70.",
			},
		],
		places: [
			{
				id: "lisbon",
				name: "Lisbon",
				description:
					"Hilly capital with historic trams, stunning viewpoints, and vibrant nightlife. Allow 3-4 days.",
				latitude: 38.7223,
				longitude: -9.1393,
				type: "city",
			},
			{
				id: "porto",
				name: "Porto",
				description:
					"UNESCO-listed city famous for Port wine, riverside views, and azulejo tiles. Allow 2-3 days.",
				latitude: 41.1579,
				longitude: -8.6291,
				type: "city",
			},
			{
				id: "algarve",
				name: "Algarve",
				description:
					"Southern coast with stunning beaches, dramatic cliffs, and coastal caves. Perfect for beach lovers.",
				latitude: 37.0179,
				longitude: -7.9304,
				type: "beach",
			},
			{
				id: "sintra",
				name: "Sintra",
				description:
					"Fairytale town with colorful palaces and castles. Easy day trip from Lisbon.",
				latitude: 38.7976,
				longitude: -9.3906,
				type: "landmark",
			},
		],
		faq: [
			{
				id: "faq-1",
				question: "Is Portugal expensive?",
				answer:
					"Portugal is one of Western Europe's most affordable countries. Expect to spend 30-50% less than in France or UK.",
			},
			{
				id: "faq-2",
				question: "Do I need to speak Portuguese?",
				answer:
					"English is widely spoken in tourist areas. Portuguese people are friendly and will help. Learning a few words is appreciated.",
			},
			{
				id: "faq-3",
				question: "How many days do I need in Portugal?",
				answer:
					"10-14 days is ideal for Lisbon, Porto, and the Algarve. A week works if you focus on one region.",
			},
			{
				id: "faq-4",
				question: "Is it safe to travel in Portugal?",
				answer:
					"Portugal is very safe with low crime rates. Normal precautions apply in tourist areas. It's one of Europe's safest countries.",
			},
		],
		seo: {
			metaTitle: "Portugal: Complete Travel Guide 2026 | Lowcost Traveling",
			metaDescription:
				"Complete Portugal travel guide. Lisbon, Porto, Algarve beaches, food, wine, and budget tips for 2026.",
			keywords: [
				"portugal",
				"lisbon",
				"porto",
				"algarve",
				"europe travel",
				"budget travel europe",
			],
			ogImage: {
				src: "/images/portugal-og.jpg",
				alt: "Lisbon tram and cityscape",
			},
		},
		publishedAt: "2026-01-14",
		updatedAt: "2026-01-20",
	},
	{
		id: "morocco-guide",
		slug: "morocco",
		destinationId: "morocco",
		articleType: "destination-guide",
		tags: ["africa", "culture", "desert", "adventure"],
		coverImage: {
			src: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1600&q=80",
			alt: "Marrakech market street",
		},
		title: "Morocco: Complete Travel Guide 2026",
		intro:
			"Morocco is a gateway to Africa that feels like stepping into another world. From the maze-like medinas of Marrakech and Fes to the golden dunes of the Sahara, Morocco offers an intoxicating blend of Arab, Berber, and European influences. Budget-friendly and endlessly fascinating, it's an unforgettable destination.",
		sections: [
			{
				id: "getting-there",
				title: "Getting There",
				content:
					"Major airports are Marrakech (RAK), Casablanca (CMN), and Fes (FEZ). Budget airlines like Ryanair fly from Europe for as little as €20. From North America, connect through Casablanca. You can also take a ferry from Spain (Algeciras to Tangier).",
			},
			{
				id: "best-time-to-visit",
				title: "Best Time to Visit",
				content:
					"Best times are March-May and September-November for pleasant temperatures. Summer is extremely hot in interior cities (40°C+) but fine for coastal areas. Winter is mild but cold in mountains and desert nights. Ramadan affects restaurant hours.",
			},
			{
				id: "where-to-stay",
				title: "Where to Stay",
				content:
					"Stay in traditional riads (restored houses with courtyards) for an authentic experience. Budget riads: €15-30/night. Mid-range: €40-80/night. Hostels exist in major cities. Medina accommodation offers better cultural immersion than modern hotels.",
			},
			{
				id: "budget-tips",
				title: "Budget & Costs",
				content:
					"Morocco is very affordable. Budget: $35-50/day, Mid-range: $60-100/day. Always negotiate in souks (start at 50% of asking price). Eat at local stalls for €2-4 meals. Share grand taxis for cheap intercity transport. Avoid guides you didn't hire.",
			},
			{
				id: "safety",
				title: "Safety & Scams",
				content:
					'Morocco is generally safe but has persistent touts. Common issues: fake guides, carpet shop tricks, inflated prices. Be firm but polite saying "no." Dress modestly, especially women. The country has improved significantly for tourists in recent years.',
			},
		],
		places: [
			{
				id: "marrakech",
				name: "Marrakech",
				description:
					"The Red City. Djemaa el-Fna square, souks, Bahia Palace. Overwhelming but unmissable. Allow 2-3 days.",
				latitude: 31.6295,
				longitude: -7.9811,
				type: "city",
			},
			{
				id: "fes",
				name: "Fes",
				description:
					"The world's largest car-free urban area. Ancient medina, tanneries, spiritual heart of Morocco.",
				latitude: 34.0331,
				longitude: -5.0003,
				type: "city",
			},
			{
				id: "sahara",
				name: "Sahara Desert",
				description:
					"Iconic orange dunes at Merzouga or Zagora. Camel treks and overnight desert camps.",
				latitude: 31.149,
				longitude: -3.9921,
				type: "nature",
			},
			{
				id: "chefchaouen",
				name: "Chefchaouen",
				description:
					"The famous Blue City in the Rif Mountains. Instagram-perfect streets and relaxed atmosphere.",
				latitude: 35.1688,
				longitude: -5.2636,
				type: "city",
			},
		],
		faq: [
			{
				id: "faq-1",
				question: "Is Morocco safe for women travelers?",
				answer:
					"Yes, but expect attention from men. Dress modestly, ignore catcalls, and stay in well-lit areas at night. Many women travel solo successfully.",
			},
			{
				id: "faq-2",
				question: "Do I need a visa for Morocco?",
				answer:
					"Most nationalities get 90 days visa-free. Check requirements for your passport. Entry is straightforward.",
			},
			{
				id: "faq-3",
				question: "Should I haggle for everything?",
				answer:
					"Yes, in souks and with taxis. Start at 50% of asking price. Fixed prices in supermarkets and restaurants.",
			},
			{
				id: "faq-4",
				question: "How is the food in Morocco?",
				answer:
					"Delicious! Try tagine, couscous (Friday special), harira soup, and mint tea. Street food is safe and cheap.",
			},
		],
		seo: {
			metaTitle: "Morocco: Complete Travel Guide 2026 | Lowcost Traveling",
			metaDescription:
				"Complete Morocco travel guide. Marrakech, Fes, Sahara desert, and budget tips for 2026.",
			keywords: [
				"morocco",
				"marrakech",
				"sahara",
				"fes",
				"chefchaouen",
				"africa travel",
			],
			ogImage: {
				src: "/images/morocco-og.jpg",
				alt: "Chefchaouen blue streets",
			},
		},
		publishedAt: "2026-01-16",
		updatedAt: "2026-01-20",
	},
	{
		id: "bali-guide",
		slug: "bali",
		destinationId: "bali",
		articleType: "destination-guide",
		tags: ["asia", "beaches", "temples", "wellness"],
		coverImage: {
			src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80",
			alt: "Bali rice terraces",
		},
		title: "Bali: Complete Travel Guide 2026",
		intro:
			"Bali is Indonesia's most famous island and a paradise for travelers seeking beaches, spirituality, and adventure. From the rice terraces of Ubud to the surf breaks of Kuta, ancient temples to luxury wellness retreats, Bali offers something for every budget and interest.",
		sections: [
			{
				id: "getting-there",
				title: "Getting There",
				content:
					"Fly into Ngurah Rai International Airport (DPS) in Denpasar. Direct flights from Australia, Asia, and Middle East. From Europe/Americas, connect through Singapore, Kuala Lumpur, or Jakarta. Visa on arrival costs $35 for 30 days, extendable once.",
			},
			{
				id: "best-time-to-visit",
				title: "Best Time to Visit",
				content:
					"Dry season (April-October) is best, with July-August being peak season. Wet season (November-March) has afternoon showers but lower prices and fewer crowds. Rain usually doesn't last all day. Shoulder months (April, May, September) offer ideal conditions.",
			},
			{
				id: "where-to-stay",
				title: "Where to Stay",
				content:
					"Bali has every accommodation type. Budget hostels: $8-15/night. Guesthouses: $20-35/night. You can find private villas with pools for $50-100/night – exceptional value. Ubud for culture, Seminyak for nightlife, Canggu for surfers, Uluwatu for beaches.",
			},
			{
				id: "budget-tips",
				title: "Budget & Costs",
				content:
					"Bali can be cheap or expensive – your choice. Budget: $35-50/day, Mid-range: $60-100/day. Eat at local warungs (cafes) for $2-4 meals. Rent a scooter ($5/day) to save on transport. Avoid overpriced beach clubs and tourist restaurants.",
			},
			{
				id: "getting-around",
				title: "Getting Around",
				content:
					"Rent a scooter (international license or local permit required) for freedom and low cost. Otherwise use Grab/Gojek for taxis. Traffic can be brutal – plan accordingly. Private drivers for day trips cost $40-60. No public transport to speak of.",
			},
		],
		places: [
			{
				id: "ubud",
				name: "Ubud",
				description:
					"Cultural heart of Bali. Rice terraces, yoga studios, art galleries, and the famous Monkey Forest.",
				latitude: -8.5069,
				longitude: 115.2625,
				type: "city",
			},
			{
				id: "seminyak",
				name: "Seminyak",
				description:
					"Trendy beach area with boutique shopping, beach clubs, and vibrant nightlife.",
				latitude: -8.6901,
				longitude: 115.1686,
				type: "beach",
			},
			{
				id: "uluwatu",
				name: "Uluwatu",
				description:
					"Dramatic clifftop temple, world-class surfing, and stunning sunset views.",
				latitude: -8.8291,
				longitude: 115.0849,
				type: "landmark",
			},
			{
				id: "nusa-penida",
				name: "Nusa Penida",
				description:
					"Island paradise with dramatic cliffs, pristine beaches, and manta ray snorkeling.",
				latitude: -8.7275,
				longitude: 115.5444,
				type: "beach",
			},
		],
		faq: [
			{
				id: "faq-1",
				question: "Is Bali expensive?",
				answer:
					"Bali can be as cheap or expensive as you want. Local food and transport are very cheap. Tourist restaurants and activities can add up quickly.",
			},
			{
				id: "faq-2",
				question: "Do I need a visa for Bali?",
				answer:
					"Most nationalities need a Visa on Arrival ($35, 30 days, extendable once). Some can get visa-free entry for 30 days (not extendable).",
			},
			{
				id: "faq-3",
				question: "Should I rent a scooter in Bali?",
				answer:
					"If you're confident riding, yes – it's the best way to explore. Traffic is chaotic though. Get proper insurance and wear a helmet.",
			},
			{
				id: "faq-4",
				question: "What should I wear to temples?",
				answer:
					"Cover shoulders and knees. Sarongs are provided at major temples but bringing your own is respectful. No hats during ceremonies.",
			},
		],
		seo: {
			metaTitle: "Bali: Complete Travel Guide 2026 | Lowcost Traveling",
			metaDescription:
				"Complete Bali travel guide. Ubud, beaches, temples, and budget tips for Indonesia's paradise island in 2026.",
			keywords: [
				"bali",
				"indonesia",
				"ubud",
				"seminyak",
				"southeast asia",
				"budget travel",
			],
			ogImage: {
				src: "/images/bali-og.jpg",
				alt: "Bali rice terraces and temple",
			},
		},
		publishedAt: "2026-01-18",
		updatedAt: "2026-01-20",
	},
];
