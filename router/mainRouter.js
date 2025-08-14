const express =require('express');
const { Insert, View,Dateinsert, InsertEvent, GetAllEvents, UpdateEvent } = require('../controller/dateController');
const { CheckoutInsert, CheckoutView, CheckoutUpdate, CheckoutDelete, Payment } = require('../controller/checkoutController');
const Razorpay = require('../model/Razorpay');
const { Keyinsert, KeyView, KeyUpdate } = require('../controller/razorpayController');
const { CheckoutSubmitInsert, CheckoutSubmitView } = require('../controller/checkoutSubmit');
const { priceInsert, priceView, priceUpdate, priceRangeDelete } = require('../controller/priceController');

const router=express.Router();


router.post('/insert',Insert);
router.get('/view',View);
router.post('/dateInsert',Dateinsert)
router.post('/cal',InsertEvent);
router.get('/views', GetAllEvents);         
router.put('/update/:id', UpdateEvent);       




// checkout page
router.post('/checkout',CheckoutInsert);
router.get('/chekoutview',CheckoutView);
router.put('/chekoutupdate/:id',CheckoutUpdate);
router.delete('/checkoutdelete/:id', CheckoutDelete);
router.post('/payment',Payment)



// Razorpay
router.post('/key',Keyinsert);
router.get('/keyview',KeyView);
router.put('/keyupdate/:id',KeyUpdate);


// checkout submit data
router.post('/checkoutSubmit',CheckoutSubmitInsert);
router.get('/chekoutSubmitview',CheckoutSubmitView);

// room price
router.post('/priceInsert',priceInsert)
router.get('/priceView/:id',priceView)
router.put('/priceUpadte',priceUpdate);
router.delete('/priceDelete', priceRangeDelete);






// router.post('/create-payment-intent', paymentController.createPaymentIntent);
module.exports=router;