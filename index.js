'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

function getOrderTime(diff){
  var currentDate = new Date()
  currentDate.setTime(currentDate.getTime() + (diff*60000));
  return currentDate;
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
    status: 'open',
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
            speech = 'You have one open order only. It will be delivered to you in '
                      + Math.ceil(deliveryTimeRem) + '. Would you like me to help you with anything else?'
          }
        })
      }
      else{
        speech = 'You have ' + openCounter + ' open orders.'
        var tempCount = 1;
        orderDb.forEach(function(element){
          if(element.status === 'open'){
            speech = speech + ' Order ' + tempCount + ' is for ' + element.value 
                     + ' and it was placed on ' + element.orderPlacementDate + '.'                      
            tempCount++;
          }
        })
        speech = speech + ' Which one do you want?'
      }
    }
    else if(intent === 'orderNo-status'){
      var orderNo = req.body.result.parameters.orderN ? parseInt(req.body.result.parameters.orderN) : 'noOrderNumber'
      if(orderNo === 'noOrderNumber'){
        speech = 'Sorry! Not able to help you this time. Do you want me to help you with anythng else?'
      }
      else{
        var orderCounter = 0;
        orderDb.forEach(function(element){
          if(element.status === 'open'){
            orderCounter++;
            if(orderCounter == orderNo){
              var deliveryTimeRem = (element.deliveryTime - new Date())/60000;
              speech = 'This order will be delivered to you in '
                        + Math.ceil(deliveryTimeRem) + ' minutes . Would you like me to help you with anything else?'
            }
          }
        })
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
