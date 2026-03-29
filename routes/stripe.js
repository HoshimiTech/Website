const router = require('express').Router();
require('dotenv').config({ quiet: true });

const stripeToken = process.env.stripeToken;
const stripeEndpointSecret = process.env.stripeEndpointSecret;
const redirect_uri = `${process.env.redirectUri}:${process.env.port}`;

const stripe = require('stripe')(stripeToken);
const express = require('express');

router.get('/checkout', async (req, res, next) => {
  try {
    const plan = req.query.plan;

    const prices = await stripe.prices.list({});
    let price;
    if (plan === 'monthly') {
      price = prices.data.find((price) => price.unit_amount === 250);
    } else if (plan === 'yearly') {
      price = prices.data.find((price) => price.unit_amount === 2750);
    } else {
      return res.status(400).render('error/400 badRequest', {
        pageTitle: '400 BAD REQUEST｜Planet Bot Project',
      });
    }

    if (!price) {
      return res.status(500).render('error/500 serverError', {
        pageTitle: '500 INTERNAL SERVER ERROR｜Planet Bot Project',
      });
    }

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${redirect_uri}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${redirect_uri}/plan`,
    });

    res.redirect(303, session.url);
  } catch (err) {
    next(err); // エラーを次のミドルウェアに渡す
  }
});

router.post(
  '/webhook',
  express.raw({
    type: 'application/json',
    limit: '1mb', // ペイロードサイズ制限
  }),
  (req, res) => {
    let event;

    // Content-Typeの追加チェック
    const contentType = req.headers['content-type'] || '';
    if (!contentType.startsWith('application/json')) {
      return res.status(400).send('Invalid content type');
    }

    if (!stripeEndpointSecret) {
      console.error('stripeEndpointSecret is not configured.');
      return res.status(500).send('Webhook endpoint is not configured.');
    }

    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return res.status(400).send('Missing Stripe signature');
    }

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        stripeEndpointSecret,
      );
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    let subscription;
    let status;
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.trial_will_end':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription trial ending.
        // handleSubscriptionTrialEnding(subscription);
        break;
      case 'customer.subscription.deleted':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription deleted.
        // handleSubscriptionDeleted(subscriptionDeleted);
        break;
      case 'customer.subscription.created':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription created.
        // handleSubscriptionCreated(subscription);
        break;
      case 'customer.subscription.updated':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription update.
        // handleSubscriptionUpdated(subscription);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 response to acknowledge receipt of the event
    res.send();
  },
);

router.get('/success', async (req, res) => {
  try {
    // session_idパラメータが存在するかチェック
    if (!req.query.session_id) {
      return res.status(400).render('error/400 badRequest', {
        pageTitle: '400 BAD REQUEST｜Planet Bot Project',
      });
    }

    const stripesession = await stripe.checkout.sessions.retrieve(
      req.query.session_id,
    );
    const customer = await stripe.customers.retrieve(stripesession.customer);
    console.log(customer);

    res.render('success', {
      pageTitle: '成功！！',
    });
  } catch (error) {
    console.error('Stripe session retrieval error:', error);
    res.status(500).render('error/500 serverError', {
      pageTitle: '500 INTERNAL SERVER ERROR｜Planet Bot Project',
    });
  }
});

module.exports = router;
