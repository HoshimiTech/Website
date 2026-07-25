const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// BOTの設定を読み込み
const projectConfig = require('./projectConfig.json');
// サイト設定の読み込み
const siteConfig = require('./siteConfig.json');
// サイトのベースURLを作成
const siteBaseUrl = `https://${projectConfig.landingPageDomain}`;

const viewsDirectory = 'views';
const buildDirectory = 'build';

const paths = {
	'/': 'Homepage',
	'/services': 'Services list',
	'/services/jinbe': 'description for Jinbe BOT',
	'/services/HoshimiTech-BOT': 'description for HoshimiTech-BOT',
	'/services/HoshimiTech-Music': 'description for HoshimiTech-Music',
	'/services/mcedu-portal':
		'description for Unofficial Minecraft Education Japanese Portal',
	'/plan': 'Pricing plan',
	'/faq': 'Frequently Asked Questions',
	'/about-project': 'About the Project',
	'/docs/commerce': 'Commerce Policy',
	'/docs/privacy-policy': 'Privacy Policy',
	'/docs/terms': 'Terms of Service',
};

async function build() {
	// 前回の生成物を残さず、出力先を必ず用意する。
	fs.rmSync(buildDirectory, { recursive: true, force: true });
	fs.mkdirSync(buildDirectory, { recursive: true });

	await renderViews(viewsDirectory);

	// static 配下の内容を build 配下へコピーする。
	fs.cpSync('static', buildDirectory, { recursive: true });
	fs.rmSync(path.join(buildDirectory, '画像の出典.md'), { force: true });
	fs.rmSync(path.join(buildDirectory, 'agent-tools.js'), { force: true });

	await writeSearchEngineFiles();

	await writeOpenAPIConfigFile();
}

async function renderViews(directory) {
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		if (entry.name === 'common_contents') continue;

		const inputPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			await renderViews(inputPath);
		} else if (entry.isFile() && entry.name.endsWith('.ejs')) {
			const relativePath = path.relative(viewsDirectory, inputPath);
			const outputPath = path.join(
				buildDirectory,
				relativePath.replace(/\.ejs$/, '.html'),
			);
			await renderEjsFile(inputPath, outputPath);
		}
	}
}

async function renderEjsFile(inputPath, outputPath) {
	const configKey = path
		.relative(viewsDirectory, inputPath)
		.replace(/\\/g, '/')
		.replace(/\.ejs$/, '');
	const pageSettings = siteConfig[configKey];

	if (!pageSettings) {
		throw new Error(`siteConfig.json にページ設定がありません: ${configKey}`);
	}

	const pageConfig = {
		siteBaseUrl,
		siteOgImage: `${siteBaseUrl}/image/logo.png`,
		...pageSettings,
		siteURL: pageSettings.siteURL?.replace('${siteUrl}', siteBaseUrl),
		projectConfig,
	};

	const html = await ejs.renderFile(inputPath, pageConfig);
	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, html, 'utf-8');
	console.log(`done: ${outputPath}`);
}

async function writeSearchEngineFiles() {
	// robots.txtを生成
	const robotsContent = [
		'User-agent: *',
		'Allow: /',
		`Sitemap: ${siteBaseUrl}/sitemap.xml`,
	].join('\n');
	fs.writeFileSync(
		path.join(buildDirectory, 'robots.txt'),
		robotsContent,
		'utf-8',
	);

	// sitemap.xmlを生成
	const urlset = Object.keys(paths)
		.map((pagePath) => `<url><loc>${siteBaseUrl}${pagePath}</loc></url>`)
		.join('');
	const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}</urlset>`;
	fs.writeFileSync(
		path.join(buildDirectory, 'sitemap.xml'),
		sitemapContent,
		'utf-8',
	);
}

async function writeOpenAPIConfigFile() {
	const openAPIConfig = {
		openapi: '3.1.0',
		info: {
			title: 'HoshimiTech API',
			version: '1.0.0',
			description: 'Agent discovery API for HoshimiTech services.',
		},
	};
	// pathの追加
	for (const [pagePath, description] of Object.entries(paths)) {
		openAPIConfig.paths = openAPIConfig.paths || {};
		openAPIConfig.paths[pagePath] = {
			get: {
				summary: description,
				responses: {
					200: {
						description: 'Successful response',
					},
				},
			},
		};
	}
	// openapi.jsonを生成
	fs.writeFileSync(
		path.join(buildDirectory, 'openapi.json'),
		JSON.stringify(openAPIConfig),
		'utf-8',
	);

	// healthzの生成
	const healthzContent = JSON.stringify({
		status: 'ok',
		service: 'HoshimiTech Homepage',
	});
	fs.writeFileSync(
		path.join(buildDirectory, 'healthz'),
		healthzContent,
		'utf-8',
	);

	// agent-toolsの生成
	fs.copyFileSync(
		path.join(__dirname, 'static', 'scripts', 'agent-tools.js'),
		path.join(buildDirectory, 'agent-tools.js'),
	);
}

build().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
