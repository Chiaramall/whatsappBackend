const Chat=require('../models/ChatModel')
const User=require('../models/UserModel')

module.exports={
  accessChat: async (req, res) => {
        const { userId } = req.body;

        if (!userId) {
            return res.send("No User Exists!");
        }

        let chat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user.id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate("users", "-password")
            .populate("latestMessage");

        chat = await User.populate(chat, {
            path: "latestMessage.sender",
            select: "name pic email _id",
        });

        if (chat.length > 0) {
            res.send(chat[0]);
        } else {
            const createChat = await Chat.create({
                chatName: "sender",
                users: [req.user.id, userId],
            });

            const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
                "users",
                "-password"
            );

            res.status(201).json(fullChat);
        }
    },
    fetchChats: async (req, res) => {
        const chat = await Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
            .populate("users", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        const user = await User.populate(chat, {
            path: "latestMessage.sender",
            select: "name pic email  _id",
        });

        res.status(200).json(user);
    }



}
