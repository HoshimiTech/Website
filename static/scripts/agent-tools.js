(() => {
	const modelContext = navigator.modelContext;

	if (!modelContext || typeof modelContext.registerTool !== 'function') {
		return;
	}

	const controller = new AbortController();
	const tools = [
		{
			name: 'hoshimiTech.navigate',
			title: 'ページを開く',
			description: 'サイト内の主要ページへ移動します。',
			inputSchema: {
				type: 'object',
				properties: {
					target: {
						type: 'string',
						enum: [
							'home',
							'services',
							'plan',
							'faq',
							'about-project',
							'HoshimiTech-BOT',
							'HoshimiTech-Music',
							'JINBE',
							'mcedu-portal',
							'docs-commerce',
							'docs-privacy-policy',
							'docs-api',
						],
					},
				},
				required: ['target'],
				additionalProperties: false,
			},
			annotations: {
				readOnlyHint: false,
			},
			execute: async ({ target }) => {
				const destinations = {
					home: '/',
					services: '/services',
					plan: '/plan',
					faq: '/faq',
					'about-project': '/about-project',
					'HoshimiTech-BOT': '/services/HoshimiTech-BOT',
					'HoshimiTech-Music': '/services/HoshimiTech-Music',
					JINBE: '/services/jinbe',
					'mcedu-portal': '/services/mcedu-portal',
					'docs-commerce': '/docs/commerce',
					'docs-privacy-policy': '/docs/privacy-policy',
					'docs-api': '/docs/api',
				};

				const destination = destinations[target] || '/';
				window.location.assign(destination);
				return {
					status: 'navigating',
					destination,
				};
			},
		},
		{
			name: 'hoshimiTech.describe',
			title: 'ページ要約を返す',
			description: '現在のページの要点と主なリンクを返します。',
			inputSchema: {
				type: 'object',
				properties: {},
				additionalProperties: false,
			},
			annotations: {
				readOnlyHint: true,
			},
			execute: async () => {
				const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
					.slice(0, 6)
					.map((element) => element.textContent?.trim())
					.filter(Boolean);

				const links = Array.from(document.querySelectorAll('a[href]'))
					.slice(0, 10)
					.map((element) => ({
						label:
							element.textContent?.trim() ||
							element.getAttribute('aria-label') ||
							element.href,
						href: element.href,
					}));

				return {
					title: document.title,
					url: window.location.href,
					headings,
					links,
				};
			},
		},
	];

	window.addEventListener(
		'pagehide',
		() => {
			controller.abort();
		},
		{ once: true },
	);

	for (const tool of tools) {
		modelContext.registerTool(tool, { signal: controller.signal });
	}
})();
