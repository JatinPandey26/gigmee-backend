import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true, 
    },
    description: {
      type: String,
      required: true,
    }, 
  },
 
  {
    timestamps: true, // create timestamps by default
  }
);

export default mongoose.model("Message", messageSchema);
