const express=require('express')
const userController=require('../controllers/userControllers')
const {protect} = require("../config/protect");
const router=express.Router()
router.post('/', userController.register)
router.get('/', protect, userController.allUsers)
router.post('/login', userController.login)


module.exports=router