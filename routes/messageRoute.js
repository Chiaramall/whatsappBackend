const express=require('express')
const {protect}=require('../config/protect')
const router=express.Router()
const messageController=require('../controllers/messageController')
router.route('/').post( protect, messageController.sendMessage)
router.route('/:chatId').get(protect, messageController.allMessages)

module.exports=router