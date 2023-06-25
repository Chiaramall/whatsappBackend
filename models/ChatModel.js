
const mongoose=require('mongoose')

const ChatSchema=mongoose.Schema({
    chatName:{
        type:String,
        trim:true
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"

    }
},
    {
        timestamp:true
    })

module.exports=mongoose.model("Chat", ChatSchema)