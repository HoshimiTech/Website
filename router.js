module.exports = (app) => {
  // '/'
  app.use('/', require('./routes/index'));

  // '/stripe'
  app.use('/stripe', require('./routes/stripe'));

  // 定義されていないルートへのアクセスは404にする
  app.use((req, res) => {
    res.status(404).render('error/404 notFound', {
      pageTitle: '404 NOT FOUND｜Planet Bot Project',
    });
  });
};
