import { createFileRoute } from "@tanstack/react-router";
import { SITE_CONFIG } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";

const SITE_URL = SITE_CONFIG.url;

const TALKS_REFERENCE_EVENTS = [
	{
		date: "24 Mar 2025",
		title: "Nový Zéland, život v dodávce - cestovatelská beseda",
		place: "Informační středisko města Ústí nad Labem",
		url: "https://www.facebook.com/events/1356228828885707/",
	},
	{
		date: "28 Feb 2025",
		title: "Austrálie, po vlastní ose divokou přírodou - cestovatelská beseda",
		place: "Povrly",
		url: "https://www.facebook.com/events/1673004716584445/",
	},
	{
		date: "24 Jan 2025",
		title: "Austrálie, po vlastní ose divokou přírodou - cestovatelská beseda",
		place: "Dolní Habartice",
		url: "https://www.facebook.com/events/858409472940981/",
	},
	{
		date: "24 Oct 2024",
		title: "Nový Zéland, život v dodávce - cestovatelská beseda",
		place: "Povrly",
		url: "https://www.facebook.com/events/2000133807118716/",
	},
	{
		date: "18 Oct 2024",
		title: "Nový Zéland, život v dodávce - cestovatelská beseda",
		place: "Dolní Habartice",
		url: "https://www.facebook.com/events/1571191513470630/",
	},
	{
		date: "22 Jul 2022",
		title: "Ekvádor a Galapágy - cestovatelská beseda",
		place: "Dolní Habartice",
		url: "https://www.facebook.com/events/568010488114472/",
	},
	{
		date: "6 Mar 2020",
		title: "Přednáška o Vietnamu v KC Povrly",
		place: "Povrly",
		url: "https://www.facebook.com/events/234326800897358/",
	},
	{
		date: "31 Jan 2020",
		title: "Vietnam - cestovatelská přednáška s Káťou a Honzou",
		place: "Obecní úřad Dolní Habartice",
		url: "https://www.facebook.com/events/433382267544839/",
	},
] as const;

export const Route = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: "About Us | Lowcost Traveling" },
			{
				name: "description",
				content:
					"Learn about Lowcost Traveling and our mission to help budget travelers explore the world.",
			},
			{ property: "og:title", content: "About Us | Lowcost Traveling" },
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: `${SITE_URL}/about` },
		],
		links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
	}),
	component: AboutPage,
});

function AboutPage() {
	const { t, locale } = useTranslation();

	const upcomingMexicoTalks =
		locale === "en"
			? [
					{
						title: "Mexico: practical lowcost travel from Yucatan to Oaxaca",
						when: "Autumn 2026 (in preparation)",
						where: "Prague and Brno (TBA)",
					},
					{
						title: "Mexico: food, transport, safety, and real budget",
						when: "Winter 2026/2027 (in preparation)",
						where: "Northern Bohemia (TBA)",
					},
				]
			: [
					{
						title: "Mexiko: prakticky a lowcost od Yucatanu po Oaxacu",
						when: "podzim 2026 (příprava)",
						where: "Praha a Brno (upřesníme)",
					},
					{
						title: "Mexiko: jídlo, doprava, bezpečnost a reálný rozpočet",
						when: "zima 2026/2027 (příprava)",
						where: "Severní Čechy (upřesníme)",
					},
				];

	return (
		<div className="container-narrow py-8 md:py-12">
			<header className="mb-8 md:mb-12">
				<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">
					{t("about.title")}
				</h1>
				<p className="text-base sm:text-lg md:text-xl text-foreground-secondary">
					{t("about.subtitle")}
				</p>
			</header>

			<div className="prose prose-lg max-w-none">
				<section className="mb-12">
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						{t("about.missionTitle")}
					</h2>
					<p className="text-foreground-secondary leading-relaxed mb-4">
						{t("about.missionText1")}
					</p>
					<p className="text-foreground-secondary leading-relaxed">
						{t("about.missionText2")}
					</p>
				</section>

				<section className="mb-12">
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						{t("about.offerTitle")}
					</h2>
					<ul className="space-y-3 text-foreground-secondary">
						<li className="flex items-start gap-3">
							<span className="text-primary">✓</span>
							<span>{t("about.offer1")}</span>
						</li>
						<li className="flex items-start gap-3">
							<span className="text-primary">✓</span>
							<span>{t("about.offer2")}</span>
						</li>
						<li className="flex items-start gap-3">
							<span className="text-primary">✓</span>
							<span>{t("about.offer3")}</span>
						</li>
						<li className="flex items-start gap-3">
							<span className="text-primary">✓</span>
							<span>{t("about.offer4")}</span>
						</li>
					</ul>
				</section>

				<section className="mb-12">
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						{t("about.moneyTitle")}
					</h2>
					<p className="text-foreground-secondary leading-relaxed mb-4">
						{t("about.moneyText1")}
					</p>
					<p className="text-foreground-secondary leading-relaxed">
						{t("about.moneyText2")}
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						{t("about.contactTitle")}
					</h2>
					<p className="text-foreground-secondary leading-relaxed">
						{t("about.contactText")}{" "}
						<a
							href={`mailto:${SITE_CONFIG.email}`}
							className="text-primary hover:text-primary-hover"
						>
							{SITE_CONFIG.email}
						</a>
					</p>
				</section>

				<section className="mb-12 mt-12">
					<h2 className="text-2xl font-semibold text-foreground mb-4">
						🎤 {t("about.talksTitle")}
					</h2>
					<p className="text-foreground-secondary leading-relaxed mb-6">
						{t("about.talksIntro")}
					</p>

					<ul className="space-y-3 text-foreground-secondary mb-8">
						{(
							[
								"talksOffer1",
								"talksOffer2",
								"talksOffer3",
								"talksOffer4",
							] as const
						).map((key) => (
							<li key={key} className="flex items-start gap-3">
								<span className="text-primary">✓</span>
								<span>{t(`about.${key}`)}</span>
							</li>
						))}
					</ul>

					<div className="rounded-xl border border-border/60 bg-background-secondary/60 p-5 mb-8">
						<h3 className="text-base font-semibold text-foreground mb-3">
							{t("about.talksTopicsTitle")}
						</h3>
						<ul className="space-y-2 text-foreground-secondary">
							{(
								[
									"talksTopic1",
									"talksTopic2",
									"talksTopic3",
									"talksTopic4",
									"talksTopic5",
									"talksTopic6",
								] as const
							).map((key) => (
								<li key={key} className="flex items-start gap-2">
									<span className="mt-1 text-xs text-primary">●</span>
									<span>{t(`about.${key}`)}</span>
								</li>
							))}
						</ul>
					</div>

					<div className="grid gap-8 md:grid-cols-2">
						<div className="rounded-xl bg-background-secondary p-6">
							<h3 className="text-lg font-semibold text-foreground mb-4">
								📍 {t("about.talksPastTitle")}
							</h3>
							<div className="mt-6">
								<ul className="mt-5 space-y-3 text-sm text-foreground-secondary">
									{TALKS_REFERENCE_EVENTS.map((event) => (
										<li key={`${event.date}-${event.title}`}>
											<a
												href={event.url}
												target="_blank"
												rel="noopener noreferrer"
												className="block rounded-lg border border-border/50 bg-background px-3 py-2 hover:border-primary/50 hover:bg-background-secondary/70 transition-colors"
											>
												<p className="font-medium text-foreground">
													{event.title}
												</p>
												<p className="text-xs text-foreground-secondary mt-1">
													{event.date} • {event.place}
												</p>
											</a>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="rounded-xl bg-background-secondary p-6">
							<h3 className="text-lg font-semibold text-foreground mb-4">
								📅 {t("about.talksUpcomingTitle")}
							</h3>
							<ul className="space-y-3 text-foreground-secondary text-sm mb-4">
								{upcomingMexicoTalks.map((talk) => (
									<li
										key={talk.title}
										className="rounded-lg border border-border/50 bg-background px-3 py-2"
									>
										<p className="font-medium text-foreground">{talk.title}</p>
										<p className="mt-1 text-xs text-foreground-secondary">
											{talk.when} • {talk.where}
										</p>
									</li>
								))}
							</ul>
							<p className="text-foreground-secondary text-sm">
								{t("about.talksContact")}{" "}
								<a
									href={`mailto:${SITE_CONFIG.email}`}
									className="text-primary hover:text-primary-hover font-medium"
								>
									{SITE_CONFIG.email}
								</a>
							</p>
						</div>
					</div>

					<div className="mt-8 rounded-xl bg-background-secondary p-6">
						<h3 className="text-lg font-semibold text-foreground mb-4">
							{t("about.talksReferencesTitle")}
						</h3>
						<div className="flex justify-center">
							<iframe
								src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fusti.nad.labem.volny.cas%2Fposts%2Fpfbid04ncKMek4zGmLJYXZMuzzsFsLXXqRSQYUDgf7nccApXTxNfv3z2j8VnyqSVnxi7Zvl&show_text=true&width=500"
								width="500"
								height="784"
								className="w-full max-w-[500px]"
								style={{ border: "none", overflow: "hidden" }}
								scrolling="no"
								frameBorder="0"
								allowFullScreen
								allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
								loading="lazy"
								title="Facebook reference post"
							/>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
