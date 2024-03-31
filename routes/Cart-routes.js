const express = require("express");
const router = express.Router();
const { fetchUser } = require('../controllers/middleware');
const {AddtoCart,OrderAll,getCart,IncAndDec,buy,getOrder} = require( '../controllers/Cart');
const {getProducts} = require("../controllers/Product");



router.post("/add",fetchUser,AddtoCart);

router.post("/orderall",fetchUser,OrderAll);

router.get("/products",getProducts)

router.get("/getCart",fetchUser,getCart);

router.put("/getCart",fetchUser,IncAndDec);


router.post("/order",fetchUser,buy);


router.get("/getorder",fetchUser,getOrder)




module.exports = router;