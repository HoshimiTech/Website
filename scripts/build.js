const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// BOTの設定を読み込み
const projectConfig = require('../src/public/projectConfig.json');
// サイト設定の読み込み
const siteConfig = require('../src/public/siteConfig.json');
const pages = siteConfig.pages;
// サイトのベースURLを作成
const siteBaseUrl = `https://${projectConfig.landingPageDomain}`;

const viewsDirectory = 'src/views';
const buildDirectory = 'dist';

async function build() {
	// 前回の生成物を残さず、出力先を必ず用意する。
	fs.rmSync(buildDirectory, { recursive: true, force: true });
	fs.mkdirSync(buildDirectory, { recursive: true });

	await renderViews(viewsDirectory);

	// public 配下の内容を build 配下へコピーする。
	fs.cpSync('src/public', buildDirectory, { recursive: true });
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
	const pageSettings = pages.find((page) => page.name === configKey);

	if (!pageSettings) {
		throw new Error(`siteConfig.json にページ設定がありません: ${configKey}`);
	}

	const pageConfig = {
		siteBaseUrl,
		siteOgImage: `${siteBaseUrl}/images/logo.png`,
		...pageSettings,
		siteURL: siteBaseUrl + (pageSettings.siteURL || ''),
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
	const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((page) => (page.priority != 0 ? `<url><loc>${siteBaseUrl}${page.path}</loc><lastmod>${new Date().toISOString()}</lastmod><priority>${page.priority}</priority></url>` : '')).join('')}
</urlset>`;
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
	openAPIConfig.paths = Object.fromEntries(
		pages.map((page) => [
			page.path,
			{
				get: {
					summary: page.title,
					description: page.description,
					responses: { 200: { description: 'Successful response' } },
				},
			},
		]),
	);
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
		path.join(__dirname, '../src/public/scripts/agent-tools.js'),
		path.join(buildDirectory, 'agent-tools.js'),
	);
}

build().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
