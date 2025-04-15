import user from '../models/user.model.js';
import message from '../models/message.model.js';
import User from '../models/user.model.js';

export const getUserForSiderbar =async (req, res) => {
try{

    const loggedinUser= req.user._id;
    const filterduser= await User.findOne9({_id: {$ne: loggedinUser}}).select("-password");

    res.status(200).json(filterduser);


}catch(error){
   
console.error("Error in getUserForSiderbar",error.message);
res.status(500).json({ error: "Internal server error" });
}
};


export const getMessages = async (req, res) => {
  const {id : userToChat} = req.params;
  const myId = req.user._id;
  try {
    const messages = await message.find({
      $or: [
        { sender: myId, receiver: userToChat },
        { sender: userToChat, receiver: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages", error.message);
    res.status(500).json({ error: "Internal server error" });
  }

};

export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
    
        let imageUrl;
        if (image) {
          // Upload base64 image to cloudinary
          const uploadResponse = await cloudinary.uploader.upload(image);
          imageUrl = uploadResponse.secure_url;
        }
    
        const newMessage = new Message({
          senderId,
          receiverId,
          text,
          image: imageUrl,
        });
    
        await newMessage.save();
    
      // Update the last message in the chat list for both users
        }catch (error) {
            console.log("Error in sendMessage controller: ", error.message);
            res.status(500).json({ error: "Internal server error" });
          }
    

}



