const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Iyzipay = require('iyzipay');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// iyzico Sandbox (Test) Bilgilerin
const iyzipay = new Iyzipay({
  apiKey: 'sandbox-RF4srVABpmX4NAkT9L5LWNxTYAQYJ0rg',
  secretKey: 'sandbox-sBbS5KWuah5z7OrFrApeMk4IK4kFD2tu',
  uri: 'https://sandbox-api.iyzipay.com'
});

app.post('/payment-init', (req, res) => {
  const { cart, totalAmount } = req.body;

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: '123456789',
    price: totalAmount.toString(),
    paidPrice: totalAmount.toString(),
    currency: Iyzipay.CURRENCY.TL,
    basketId: 'B67832',
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: 'https://render.com', // Test için
    buyer: {
      id: 'BY789',
      name: 'Müşteri',
      surname: 'Müşteri',
      gsmNumber: '+905300000000',
      email: 'email@email.com',
      identityNumber: '11111111111',
      registrationAddress: 'Batıkent Mah. No:5A',
      ip: '85.97.85.97',
      city: 'Gaziantep',
      country: 'Turkey'
    },
    shippingAddress: { contactName: 'Vondel Coffee', city: 'Gaziantep', country: 'Turkey', address: 'Batıkent Mah.' },
    billingAddress: { contactName: 'Vondel Coffee', city: 'Gaziantep', country: 'Turkey', address: 'Batıkent Mah.' },
    basketItems: cart.map(item => ({
      id: item.id.toString(),
      name: item.name,
      category1: 'Kahve',
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (item.price * item.quantity).toString()
    }))
  };

  iyzipay.checkoutFormInitialize.create(request, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Sunucu calisiyor, port:', PORT));
