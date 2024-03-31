const express = require('express');
const router = express.Router();

const {LoginUser,SignupUser , Forget} = require('../controllers/User')



//LOGIN USER
router.post('/login',LoginUser)


//SIGNUP USER
router.post('/signup',SignupUser)

//Forget password
router.post('/forget',Forget)

module.exports = router;
