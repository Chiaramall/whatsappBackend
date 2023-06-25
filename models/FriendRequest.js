const mongoose=require('mongoose')

const FriendRequestSchema=mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})
module.exports=mongoose.model("FriendRequest", FriendRequestSchema)