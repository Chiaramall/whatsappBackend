const express=require('express')
const dotenv=require('dotenv')
const app=express();
const mongoose=require('mongoose')
const cors=require('cors')
const userRoute=require('./routes/userRoute')
const chatRoute=require('./routes/chatRoute')
const friendRoute=require('./routes/friendRoute')
const messageRoute=require('./routes/messageRoute')
const protect=require('./config/protect')
const {join, resolve} = require("path");

dotenv.config();
app.use(express.json())
app.use(cors({
    origin:"http://localhost:3000"
}))
const PORT=process.env.PORT || 8080
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,

    }
    )
const db = mongoose.connection;

db.once("open", () => { console.log("Successfully connected to MongoDB ")})
app.use('/api/user', userRoute)
app.use('/api/chat', chatRoute)
app.use('/api/friends', friendRoute)
app.use('/api/message', messageRoute)

//deployment
const __dirname1=resolve();
if(process.env.NODE_ENV==='production'){
    app.use(express.static(join(__dirname1,'../frontend/build')));
    app.get('*', (req,res)=>{
        res.sendFile(resolve(__dirname1, '../frontend', 'build', 'index.html'))
    })
}else{
    app.get('/', (req,res)=>{
        res.send("api is running successfully")
    })
}
//deployment

 const server= app.listen(PORT, ()=>console.log(`server in ascolto su porta ${PORT}`))
const io=require('socket.io')(server, {
    pingTimeout: 60000,

    cors: {
        origin: ["http://localhost:3000", "https://mern-chat-app.onrender.com"]

    }
});
io.on("connection", (socket) => {
        console.log('connected to socket.io');

        socket.on('setup', (userData) => {
            socket.join(userData._id);
            socket.emit('connected');
        });

    socket.on('join chat', (room) => {
            socket.join(room);
            console.log('user joined room:' + room);
        });
    socket.on('typing', (room)=>socket.in(room).emit("typing"))

    socket.on('stop typing', (room)=>socket.in(room).emit("stop typing"))


     socket.on('new message', (newMessageRecieved) => {
            let chat = newMessageRecieved.chat;
            if (!chat.users) return console.log('chat.users not defined');

            chat.users.forEach(user => {
                if (user._id == newMessageRecieved.sender._id) return;
                socket.in(user._id).emit('message recieved', newMessageRecieved);
            });
        });
    });
