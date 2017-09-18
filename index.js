'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const orderDb = [
  {
    orderId: 'OR100001',
    productList: [
      {
        productId: 'PR100001',
        quantity: '2'
      }
    ],
    orderPlacementDate: 'June 23, 2017',
    value: '20 £',
    status: 'closed'
  },
  {
    orderId: 'OR100002',
    productList: [
      {
        productId: 'PR100001',
        quantity: '2'
      },
      {
        productId: 'PR100004',
        quantity: '1'
      }
    ],
    orderPlacementDate: 'July 2, 2017',
    value: '35 £',
    status: 'closed'
  },
  {
    orderId: 'OR100003',
    productList: [
      {
        productId: 'PR100002',
        quantity: '3'
      }
    ],
    orderPlacementDate: 'August 15, 2017',
    value: '15 £',
    status: 'closed'
  },
  {
    orderId: 'OR100004',
    productList: [
      {
        productId: 'PR100001',
        quantity: '4'
      }
    ],
    orderPlacementDate: 'September 2, 2017',
    value: '40 £',
    status: 'closed'
  },
  {
    orderId: 'OR100005',
    productList: [
      {
        productId: 'PR100001',
        quantity: '2'
      },
      {
        productId: 'PR100002',
        quantity: '3'
      },
      {
        productId: 'PR100003',
        quantity: '5'
      }
    ],
    orderPlacementDate: 'September 12, 2017',
    value: '90 £',
    status: 'closed'
  }
]

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/enquireOrder', function(req, res) {
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.checkTest ? req.body.result.parameters.checkTest : "Seems like some problem.";
    //var tempData = req.query;
    return res.json({
        speech: speech,
        displayText: speech,
        source: 'webhook-orderApi-sample'
    });
});

app.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
