const router = require('express').Router();
const projectConfig = require('./projectConfig.json');
const siteConfig = require('./siteConfig.json');
const siteBaseUrl = `https://${projectConfig.landingPageDomain}`;

function getPageConfig(pageName) {
	const pageConfig = {
		...siteConfig[pageName],
		siteURL: siteConfig[pageName].siteURL?.replace('${siteUrl}', siteBaseUrl),
	};
	return pageConfig;
}

module.exports = (app) => {
	router.get('/robots.txt', (req, res) => {
		res
			.type('text/plain')
			.send(
				[
					'User-agent: *',
					'Allow: /',
					`Sitemap: ${siteBaseUrl}/sitemap.xml`,
				].join('\n'),
			);
	});

	router.get('/sitemap.xml', (req, res) => {
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

		res
			.type('application/xml')
			.send(
				`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}</urlset>`,
			);
	});

	const indexConfig = getPageConfig('index');
	router.get('/', (req, res) => {
		res.render('index', indexConfig);
	});

	///////////////////////////////////////////////////////
	// 各種サービスページの定義
	const servicesConfig = getPageConfig('service_list');
	router.get('/services', (req, res) => {
		res.render('services/service_list', servicesConfig);
	});

	const jinbeConfig = getPageConfig('services/jinbe');
	router.get('/services/jinbe', (req, res) => {
		res.render('services/jinbe', jinbeConfig);
	});

	const hoshimiTechBotConfig = getPageConfig('services/HoshimiTech-BOT');
	router.get('/services/HoshimiTech-BOT', (req, res) => {
		res.render('services/HoshimiTech-BOT', hoshimiTechBotConfig);
	});

	const hoshimiTechMusicConfig = getPageConfig('services/HoshimiTech-Music');
	router.get('/services/HoshimiTech-Music', (req, res) => {
		res.render('services/HoshimiTech-Music', hoshimiTechMusicConfig);
	});
	///////////////////////////////////////////////////////

	const planConfig = getPageConfig('plan');
	router.get('/plan', (req, res) => {
		res.render('plan', planConfig);
	});

	const faqConfig = getPageConfig('faq');
	router.get('/faq', (req, res) => {
		res.render('faq', faqConfig);
	});

	const aboutProjectConfig = getPageConfig('about-project');
	router.get('/about-project', (req, res) => {
		res.render('about-project', aboutProjectConfig);
	});

	///////////////////////////////////////////////////////
	// ドキュメントページの定義
	const commerceConfig = getPageConfig('docs/commerce');
	router.get('/docs/commerce', (req, res) => {
		res.render('docs/commerce', commerceConfig);
	});

	const privacyPolicyConfig = getPageConfig('docs/privacy-policy');
	router.get('/docs/privacy-policy', (req, res) => {
		res.render('docs/privacy-policy', privacyPolicyConfig);
	});

	const termsConfig = getPageConfig('docs/terms');
	router.get('/docs/terms', (req, res) => {
		res.render('docs/terms', termsConfig);
	});
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 各種リダイレクト設定
	const mceduPortalConfig = getPageConfig('services/mcedu-portal');
	router.get('/services/mcedu-portal', (req, res) => {
		//一時的にページに飛ぶようにしているが、サイトが用意出来次第そっちへリダイレクト予定
		res.render('services/mcedu-portal', mceduPortalConfig);
	});

	///////////////////////////////////////////////////////

	// 定義したルートをアプリケーションに反映
	app.use('/', router);

	// 定義されていないルートへのアクセスは404にする
	app.use((req, res) => {
		const notFoundConfig = getPageConfig("404 notFound")
		res.status(404).render('error/404 notFound', notFoundConfig);
	});
};
