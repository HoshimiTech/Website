const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config({ quiet: true });

let port = process.env.port;
app.set('port', port);

app.set('view engine', 'ejs');

app.use('/css', express.static(path.join(__dirname, 'static/css')));
app.use('/image', express.static(path.join(__dirname, 'static/image')));

require('./router')(app);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).render('error/500 serverError', {
		pageTitle: '500 INTERNAL SERVER ERROR｜Planet Bot Project',
	});
});

app.listen(port, () => console.info(`Listening on port ${port}`));
