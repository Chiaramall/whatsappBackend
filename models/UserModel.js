
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true,
    },

    pic:{
        type:String,
       default:"https://img.freepik.com/free-icon/user_318-804790.jpg"
    },
        friends:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }]
},
    {timestamps:true
    })
UserSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
UserSchema.pre('save',async function(next){
    if(!this.isModified){
        next()
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
})

module.exports=mongoose.model("User", UserSchema)
