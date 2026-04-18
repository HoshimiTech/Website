const router = require('express').Router();

router.get('/', (req, res) => {
	res.render('index', {
		pageTitle: 'ホーム｜HoshimiTech',
	});
});

///////////////////////////////////////////////////////
// 各種サービスページの定義
router.get('/services', (req, res) => {
	res.render('services/service_list', {
		pageTitle: 'サービス｜HoshimiTech',
	});
});

router.get('/services/jinbe', (req, res) => {
	res.render('services/jinbe', {
		pageTitle: 'JINBE | HoshimiTech',
	});
});

router.get('/services/HoshimiTech-BOT', (req, res) => {
	res.render('services/HoshimiTech-BOT', {
		pageTitle: 'HoshimiTech-BOT | HoshimiTech',
	});
});

router.get('/services/HoshimiTech-Music', (req, res) => {
	res.render('services/HoshimiTech-Music', {
		pageTitle: 'HoshimiTech-Music | HoshimiTech',
	});
});
///////////////////////////////////////////////////////

router.get('/plan', (req, res) => {
	res.render('plan', {
		pageTitle: 'プラン｜HoshimiTech',
	});
});

router.get('/faq', (req, res) => {
	res.render('faq', {
		pageTitle: 'よくある質問｜HoshimiTech',
	});
});

router.get('/about-us', (req, res) => {
	res.render('about-us', {
		pageTitle: '私たちについて｜HoshimiTech',
	});
});

///////////////////////////////////////////////////////
// ドキュメントページの定義
router.get('/docs/commerce', (req, res) => {
	res.render('documents/commerce', {
		pageTitle: '特定商取引法に関する表記｜HoshimiTech',
	});
});

router.get('/docs/privacy-policy', (req, res) => {
	res.render('documents/privacy-policy', {
		pageTitle: 'プライバシーポリシー｜HoshimiTech',
	});
});

router.get('/docs/terms', (req, res) => {
	res.render('documents/terms', {
		pageTitle: '利用規約｜HoshimiTech',
	});
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
// 各種リダイレクト設定
router.get('/support-server', (req, res) => {
	res.redirect('https://discord.gg/uYYaVRuUuJ');
});

router.get('/services/mcedu-portal', (req, res) => {
	//一時的にページに飛ぶようにしているが、サイトが用意出来次第そっちへリダイレクト予定
	res.render('services/mcedu-portal', {
		pageTitle: '教育版Minecraft非公式ポータル | HoshimiTech',
	});
});

///////////////////////////////////////////////////////

module.exports = router;
