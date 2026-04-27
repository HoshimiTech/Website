const router = require('express').Router();
const botConfig = require('./botConfig.json');

module.exports = (app) => {
	router.get('/robots.txt', (req, res) => {
		const baseUrl = (
			process.env.SITE_URL || `${req.protocol}://${req.get('host')}`
		).replace(/\/$/, '');

		res
			.type('text/plain')
			.send(
				[
					'User-agent: *',
					'Allow: /',
					`Sitemap: ${baseUrl}/sitemap.xml`,
				].join('\n'),
			);
	});

	router.get('/sitemap.xml', (req, res) => {
		const baseUrl = (
			process.env.SITE_URL || `${req.protocol}://${req.get('host')}`
		).replace(/\/$/, '');
		const paths = [
			'/',
			'/services',
			'/services/jinbe',
			'/services/HoshimiTech-BOT',
			'/services/HoshimiTech-Music',
			'/services/mcedu-portal',
			'/plan',
			'/faq',
			'/about-us',
			'/docs/commerce',
			'/docs/privacy-policy',
			'/docs/terms',
		];

		const urlset = paths
			.map((path) => `<url><loc>${baseUrl}${path}</loc></url>`)
			.join('');

		res
			.type('application/xml')
			.send(
				`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}</urlset>`,
			);
	});

	router.get('/', (req, res) => {
		res.render('index', {
			pageTitle: 'ホーム｜HoshimiTech',
			pageDescription:
				'Discord BOT開発や教育版Minecraft関連情報を発信するHoshimiTech公式サイトです。',
		});
	});

	///////////////////////////////////////////////////////
	// 各種サービスページの定義
	router.get('/services', (req, res) => {
		res.render('services/service_list', {
			pageTitle: 'サービス｜HoshimiTech',
			pageDescription: 'HoshimiTechが提供する各種サービスの一覧ページです。',
		});
	});

	router.get('/services/jinbe', (req, res) => {
		res.render('services/jinbe', {
			pageTitle: 'JINBE | HoshimiTech',
			pageDescription:
				'JINBEは、HoshimiTechが提供するDiscord BOTです。おみくじやじゃんけんなどの楽しい機能を備えています。',
		});
	});

	router.get('/services/HoshimiTech-BOT', (req, res) => {
		res.render('services/HoshimiTech-BOT', {
			pageTitle: 'HoshimiTech-BOT | HoshimiTech',
			pageDescription:
				'HoshimiTech-BOTは、HoshimiTechが提供するDiscord BOTです。教育機関向けの機能を備えています。',
		});
	});

	router.get('/services/HoshimiTech-Music', (req, res) => {
		res.render('services/HoshimiTech-Music', {
			pageTitle: 'HoshimiTech-Music | HoshimiTech',
			pageDescription:
				'HoshimiTech-Musicは、HoshimiTechが提供する音楽再生機能を備えたDiscord BOTです。',
		});
	});
	///////////////////////////////////////////////////////

	router.get('/plan', (req, res) => {
		res.render('plan', {
			pageTitle: 'プラン｜HoshimiTech',
			pageDescription:
				'HoshimiTechのサブスクリプションプランの詳細と価格を掲載しています。月額250円からご利用いただけます。',
		});
	});

	router.get('/faq', (req, res) => {
		res.render('faq', {
			pageTitle: 'よくある質問｜HoshimiTech',
			pageDescription:
				'HoshimiTechに関するよくある質問とその回答を掲載しています。',
		});
	});

	router.get('/about-us', (req, res) => {
		res.render('about-us', {
			pageTitle: '私たちについて｜HoshimiTech',
			pageDescription:
				'HoshimiTechは、Discord BOT開発や教育版Minecraft関連情報を発信する公式サイトです。',
		});
	});

	///////////////////////////////////////////////////////
	// ドキュメントページの定義
	router.get('/docs/commerce', (req, res) => {
		res.render('documents/commerce', {
			pageTitle: '特定商取引法に関する表記｜HoshimiTech',
			pageDescription:
				'HoshimiTechの特定商取引法に関する表記を掲載しています。',
		});
	});

	router.get('/docs/privacy-policy', (req, res) => {
		res.render('documents/privacy-policy', {
			pageTitle: 'プライバシーポリシー｜HoshimiTech',
			pageDescription: 'HoshimiTechのプライバシーポリシーを掲載しています。',
		});
	});

	router.get('/docs/terms', (req, res) => {
		res.render('documents/terms', {
			pageTitle: '利用規約｜HoshimiTech',
			pageDescription: 'HoshimiTechの利用規約を掲載しています。',
		});
	});
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 各種リダイレクト設定
	router.get('/support-server', (req, res) => {
		res.redirect(botConfig.supportServerInviteURL);
	});

	router.get('/services/mcedu-portal', (req, res) => {
		//一時的にページに飛ぶようにしているが、サイトが用意出来次第そっちへリダイレクト予定
		res.render('services/mcedu-portal', {
			pageTitle: '教育版Minecraft非公式ポータル | HoshimiTech',
			pageDescription:
				'教育版Minecraft非公式ポータルは、教育版Minecraftに関する情報をまとめたサイトです。',
		});
	});

	///////////////////////////////////////////////////////

	// 定義したルートをアプリケーションに反映
	app.use('/', router);

	// 定義されていないルートへのアクセスは404にする
	app.use((req, res) => {
		res.status(404).render('error/404 notFound', {
			pageTitle: '404 NOT FOUND｜HoshimiTech',
			pageDescription:
				'お探しのページは見つかりませんでした。URLが正しいか確認してください。',
			robots: 'noindex,nofollow',
			siteURL: `${process.env.SITE_URL}/404`,
		});
	});
};
