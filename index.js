'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

function getOrderTime(diff){
  var currentDate = new Date()
  currentDate.setTime(currentDate.getTime() + (diff*60000));
  return currentDate;
  // console.log('newDate : ', oldDate.toLocaleString());
  // var currentDate = new Date();
  // console.log('Current Date : ', currentDate);
  // var TimeDiff = oldDate - currentDate;
  // console.log('TimeDifference : ', TimeDiff);
}


const orderDb = [
  {
    orderId: 'OR100001',
    productList: [
      {
        productId: 'PR100001',
        productName: 'product1',
        quantity: '2'
      }
    ],
    orderPlacementDate: 'June 23, 2017',
    value: '20 £',
    status: 'closed',
    deliveryTime: getOrderTime(30)
  },
  {
    orderId: 'OR100002',
    productList: [
      {
        productId: 'PR100001',
        productName: 'product1',
        quantity: '2'
      },
      {
        productId: 'PR100004',
        productName: 'product4',
        quantity: '1'
      }
    ],
    orderPlacementDate: 'July 2, 2017',
    value: '35 £',
    status: 'closed',
    deliveryTime: getOrderTime(40)
  },
  {
    orderId: 'OR100003',
    productList: [
      {
        productId: 'PR100002',
        productName: 'product2',
        quantity: '3'
      }
    ],
    orderPlacementDate: 'August 15, 2017',
    value: '15 £',
    status: 'closed',
    deliveryTime: getOrderTime(25)
  },
  {
    orderId: 'OR100004',
    productList: [
      {
        productId: 'PR100001',
        productName: 'product1',
        quantity: '4'
      }
    ],
    orderPlacementDate: 'September 2, 2017',
    value: '40 £',
    status: 'closed',
    deliveryTime: getOrderTime(30)
  },
  {
    orderId: 'OR100005',
    productList: [
      {
        productId: 'PR100001',
        productName: 'product1',
        quantity: '2'
      },
      {
        productId: 'PR100002',
        productName: 'product2',
        quantity: '3'
      },
      {
        productId: 'PR100003',
        productName: 'product3',
        quantity: '5'
      }
    ],
    orderPlacementDate: 'September 12, 2017',
    value: '90 £',
    status: 'open',
    deliveryTime: getOrderTime(50)
  }
]

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/enquireOrder', function(req, res) {
    var speech
      , openCounter = 0
      , intent = req.body.result && req.body.result.metadata.intentName ? req.body.result.metadata.intentName : "noIntent";
    if(intent === 'checkOrderStatus'){
      orderDb.forEach(function(element){
        if(element.status === 'open'){
          openCounter ++;
        }
      })
      if(openCounter == 0){
        speech = 'You have no open orders. Anything else I can help you with?'
      }
      else if(openCounter == 1){
        orderDb.forEach(function(element){
          if(element.status === 'open'){
            var deliveryTimeRem = (element.deliveryTime - new Date())/60000;
            speech = 'You have one open order only. It will be delivered to you in '+ Math.ceil(deliveryTimeRem) + ' minutes and will cost you ' + element.value
          }
        })
      }
      else{
        speech = openCounter + ' Open Orders!!'
      }
    }
    else{
      speech = 'Sorry! Unable to Understand'
    }
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
