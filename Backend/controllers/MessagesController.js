import Messege from "../models/MessegeModel.js";
export const getMessages = async (req, res) => {
    try { 
        const user1  = req.userId;
        const user2 = req.body.id;        
        if(!user1 || !user2){
            return res.status(400).send({message: "Please provide both user ids"});
        }
        const messages = await Messege.find({ 
            $or: [
                {
                    sender: user1,
                    recipient: user2
                },
                {
                    sender: user2,
                    recipient: user1
                }
            ]
        }).sort({timestamp: 1});        
        return res.status(200).json({ messages });

    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}
