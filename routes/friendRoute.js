const express=require('express')
const friendsController=require('../controllers/friendsController')
const {protect} = require("../config/protect");
const router=express.Router()

router.get('/',protect, friendsController.getFriendsList)
router.put('/add',protect, friendsController.acceptFriend)
router.post('/remove',protect,  friendsController.removeFriend)

module.exports=router