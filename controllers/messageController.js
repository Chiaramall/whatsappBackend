const Message=require('../models/MessageModel')
const User=require('../models/UserModel')
const Chat=require('../models/ChatModel')


module.exports={
    sendMessage: async(req,res)=>{
        const {content, chatId}=req.body;

        if(!content || !chatId){
            return res.status(400).send("invalid data passed into request")
        }
        let newMessage={
            sender:req.user._id,
            content:content,
            chat:chatId
        }
        try{
            let message=await Message.create(newMessage);

            message=await message.populate("sender", "name pic");
            message=await message.populate("chat");
            message=await User.populate(message, {
                path:"chat.users",
                select:"name pic email"
            });
            await Chat.findByIdAndUpdate(req.body.chatId,{
                latestMessage:message
            } , { new: true });
            res.json(message);


        }catch(error){
            res.status(400).send(error)

        }

    },
    allMessages:async(req,res)=>{
        try{
            const messages=await Message.find({chat:req.params.chatId}).populate("sender", "name pic email")
                .populate("chat");
            res.json(messages)

        }catch (error){
            res.status(400).send(error)

        }
    }
}