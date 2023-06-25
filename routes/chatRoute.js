const express=require('express')
const {protect} = require("../config/protect");
const router=express.Router()
const chatControllers=require('../controllers/chatControllers')

router.route('/').post(protect, chatControllers.accessChat).get(protect, chatControllers.fetchChats)





module.exports=router