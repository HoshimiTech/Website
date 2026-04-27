const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config({ quiet: true });

let port = process.env.port || 80;
app.set('port', port);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/css', express.static(path.join(__dirname, 'static/css')));
app.use('/image', express.static(path.join(__dirname, 'static/image')));

app.use((req, res, next) => {
	const siteUrl = (
		process.env.SITE_URL || `${req.protocol}://${req.get('host')}`
	).replace(/\/$/, '');

	res.locals.siteURL = `${siteUrl}${req.path}`;
	res.locals.siteOgImage = `${siteUrl}/image/logo.png`;
	res.locals.robots = '';
	res.locals.dashboardURL = process.env.DASHBOARD_URL;

	next();
});

require('./router')(app);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).render('error/500 serverError', {
		pageTitle: '500 INTERNAL SERVER ERROR｜HoshimiTech',
		pageDescription:
			'サーバー内部でエラーが発生しました。しばらくしてから再度アクセスしてください。',
		robots: 'noindex,nofollow',
		siteURL: `${process.env.SITE_URL}/500`,
	});
});

app.listen(port, () => console.info(`Listening on port ${port}`));
