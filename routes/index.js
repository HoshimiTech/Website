const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('index', {
    pageTitle: 'ホーム｜Planet Bot Project',
  });
});

///////////////////////////////////////////////////////
// 各種サービスページの定義
router.get('/services', (req, res) => {
  res.render('services/service_list', {
    pageTitle: 'サービス｜Planet Bot Project',
  });
});

router.get('/services/jinbe', (req, res) => {
  res.render('services/jinbe', {
    pageTitle: 'JINBE | Planet Bot Project',
  });
});

router.get('/services/planet-bot', (req, res) => {
  res.render('services/planet-bot', {
    pageTitle: 'planet-bot | Planet Bot Project',
  });
});

router.get('/services/planet-music', (req, res) => {
  res.render('services/planet-music', {
    pageTitle: 'Planet music | Planet Bot Project',
  });
});
///////////////////////////////////////////////////////

router.get('/plan', (req, res) => {
  res.render('plan', {
    pageTitle: 'プラン｜Planet Bot Project',
  });
});

router.get('/faq', (req, res) => {
  res.render('faq', {
    pageTitle: 'よくある質問｜Planet Bot Project',
  });
});

router.get('/about-us', (req, res) => {
  res.render('about-us', {
    pageTitle: '私たちについて｜Planet Bot Project',
  });
});

///////////////////////////////////////////////////////
// ドキュメントページの定義
router.get('/docs/commerce', (req, res) => {
  res.render('documents/commerce', {
    pageTitle: '特定商取引法に関する表記｜Planet Bot Project',
  });
});

router.get('/docs/privacy-policy', (req, res) => {
  res.render('documents/privacy-policy', {
    pageTitle: 'プライバシーポリシー｜Planet Bot Project',
  });
});

router.get('/docs/terms', (req, res) => {
  res.render('documents/terms', {
    pageTitle: '利用規約｜Planet Bot Project',
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
    pageTitle: '教育版Minecraft非公式ポータル | Planet Bot Project',
  });
});

///////////////////////////////////////////////////////

module.exports = router;
