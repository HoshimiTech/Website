const express = require('express');
const compression = require('compression');
const app = express();
const path = require('path');
require('dotenv').config({ quiet: true });

// BOTの設定を読み込み
const projectConfig = require('./projectConfig.json');

let port = process.env.port || 80;
app.set('port', port);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/css', express.static(path.join(__dirname, 'static/css')));
app.use('/image', express.static(path.join(__dirname, 'static/image')));

// Gzip圧縮を有効化
app.use(compression());

app.use((req, res, next) => {
	const siteUrl = (
		`${req.protocol}://${projectConfig.landingPageDomain}` ||
		`${req.protocol}://${req.get('host')}`
	).replace(/\/$/, '');

	res.locals.siteURL = `${siteUrl}${req.path}`;
	res.locals.siteOgImage = `${siteUrl}/image/logo.png`;
	res.locals.robots = '';
	res.locals.projectConfig = projectConfig;

	next();
});

require('./router')(app);

app.use((err, req, res, next) => {
	const siteUrl = (
		`${req.protocol}://${projectConfig.landingPageDomain}` ||
		`${req.protocol}://${req.get('host')}`
	).replace(/\/$/, '');

	console.error(err.stack);
	res.status(500).render('error/500 serverError', {
		pageTitle: '500 INTERNAL SERVER ERROR｜HoshimiTech',
		pageDescription:
			'サーバー内部でエラーが発生しました。しばらくしてから再度アクセスしてください。',
		robots: 'noindex,nofollow',
		siteURL: `${siteUrl}/500`,
	});
});

app.listen(port, () => console.info(`Listening on port ${port}`));
