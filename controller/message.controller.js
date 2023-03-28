import Message from "../Models/message.model.js";
import Conversation from "../Models/conversation.model.js";
export const createMessage = async (req, res, next) => {
  try {
    const newMessage = await Message.create({
      conversationId: req.body.conversationId,
      userId: req.userId,
      description: req.body.description,
    });

    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          lastMessage: req.body.description,
        },
      }, 
      {
        new: true,
      }
    ); 

    res.status(201).send(newMessage);
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id });

    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};
