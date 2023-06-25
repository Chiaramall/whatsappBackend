
const mongoose=require('mongoose')
const User=require('../models/UserModel')

const token=require('../config/Token')
const Chat = require("../models/ChatModel");
module.exports={
        getFriendsList: async (req, res) => {
            try {
                const userId = req.user._id;

                // Trova l'utente dal database con la lista degli amici popolata
                const user = await User.findById(userId).populate('friends', '_id name email pic');

                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                const friends = user.friends;

                res.status(200).json({ friends });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        },


    acceptFriend: async (req, res) => {
        const {_id } = req.user;
          const {friendId}=req.body;
        try {
            const user= await User.findById(_id)
            const alredyAdded=user.friends.find((id)=>id.toString()===friendId);
            if(alredyAdded){
                res.status(400).json("utente gia inserito")
            } else{
            let  updatedUser = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { friends: friendId },
                },
                { new: true }
            )

            if (!updatedUser) {
                return res.status(404).json({ message: 'Utente non trovato' });
            }

            res.status(200).json(updatedUser);}
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Si è verificato un errore durante l\'aggiunta dell\'amico' });
        }
    },



    removeFriend: async(req,res)=>{
        const { userId, friendId } = req.body;

        try {
            // Trova l'utente che sta rimuovendo l'amico
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'Utente non trovato' });
            }

            // Verifica se l'amico è presente nella lista degli amici dell'utente
            const friendIndex = user.friends.findIndex((friend) => friend.toString() === friendId);



            // Rimuovi l'amico dalla lista degli amici dell'utente
            user.friends.splice(friendIndex, 1);

            // Salva le modifiche
            await user.save();

            res.status(200).json({ message: 'Amico rimosso con successo' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Si è verificato un errore durante la rimozione dell\'amico' });
        }
    }

}