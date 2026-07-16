const express = require('express');
const compression = require('compression');
const app = express();
const path = require('path');
require('dotenv').config({ quiet: true });

// BOTの設定を読み込み
const projectConfig = require('./projectConfig.json');
// サイト設定の読み込み
const siteConfig = require('./siteConfig.json');

let port = process.env.port || 80;
app.set('port', port);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/css', express.static(path.join(__dirname, 'static/css')));
app.use('/image', express.static(path.join(__dirname, 'static/image')));

// Gzip圧縮を有効化
app.use(compression());

// サイトの標準URLを定義
const siteBaseUrl = `https://${projectConfig.landingPageDomain}`;

app.use((req, res, next) => {
	res.locals.siteURL = `${siteBaseUrl}${req.path}`;
	res.locals.siteOgImage = `${siteBaseUrl}/image/logo.png`;
	res.locals.robots = '';
	res.locals.projectConfig = projectConfig;

	next();
});

require('./router')(app);

app.use((err, req, res, next) => {
	console.error(err.stack);
	const serverErrorConfig = {
		...siteConfig['error/500 serverError'],
		siteURL: siteConfig['error/500 serverError'].siteURL?.replace(
			'${siteUrl}',
			siteBaseUrl,
		),
	};
	res.status(500).render('error/500 serverError', serverErrorConfig);
});

app.listen(port, () => console.info(`Listening on port ${port}`));
