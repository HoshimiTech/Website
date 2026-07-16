const fs = require('fs');
const ejs = require('ejs');

// BOTの設定を読み込み
const projectConfig = require('./projectConfig.json');
// サイト設定の読み込み
const siteConfig = require('./siteConfig.json');
// サイトのベースURLを作成
const siteBaseUrl = `https://${projectConfig.landingPageDomain}`;

fs.readdirSync('views').forEach(async (file) => {
	if (file === 'common_contents') return;

	if (file.endsWith('.ejs')) {
		await renderEjsFile(
			`views/${file}`,
			`build/${file.replace('.ejs', '.html')}`,
		);
	} else {
		fs.readdirSync(`views/${file}`).forEach(async (subFile) => {
			if (subFile.endsWith('.ejs')) {
				await renderEjsFile(
					`views/${file}/${subFile}`,
					`build/${file}/${subFile.replace('.ejs', '.html')}`,
				);
			}
		});
	}
});

// アセット類のコピー
fs.cpSync('static', 'build', { recursive: true });
// 不要なファイルの削除
fs.rmSync('build/画像の出典.md', { force: true });
// robots.txtの生成
const robotsContent = [
	'User-agent: *',
	'Allow: /',
	`Sitemap: ${siteBaseUrl}/sitemap.xml`,
].join('\n');
fs.writeFileSync('build/robots.txt', robotsContent, 'utf-8');
// sitemap.xmlの生成
const paths = [
	'/',
	'/services',
	'/services/jinbe',
	'/services/HoshimiTech-BOT',
	'/services/HoshimiTech-Music',
	'/services/mcedu-portal',
	'/plan',
	'/faq',
	'/about-project',
	'/docs/commerce',
	'/docs/privacy-policy',
	'/docs/terms',
];
const urlset = paths
	.map((path) => `<url><loc>${siteBaseUrl}${path}</loc></url>`)
	.join('');
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}</urlset>`;
fs.writeFileSync('build/sitemap.xml', sitemapContent, 'utf-8');

async function renderEjsFile(inputPath, outputPath) {
	//pageConfigの作成
	const pageConfig = {
		siteBaseUrl: siteBaseUrl,
		siteOgImage: `${siteBaseUrl}/image/logo.png`,
		...siteConfig[inputPath.replace('views/', '').replace('.ejs', '')],
		siteURL: siteConfig[
			inputPath.replace('views/', '').replace('.ejs', '')
		].siteURL?.replace('${siteUrl}', siteBaseUrl),
		projectConfig: projectConfig,
	};

	// EJSファイルをレンダリング
	await ejs.renderFile(inputPath, pageConfig, (err, html) => {
		if (err) {
			console.error(err);
			return;
		}

		// レンダリング結果をファイルに書き出す
		fs.writeFileSync(outputPath, html, 'utf-8', (err) => {
			if (err) {
				console.log(err);
			} else {
				console.log(`done: ${outputPath}`);
			}
		});
	});
	return;
}
