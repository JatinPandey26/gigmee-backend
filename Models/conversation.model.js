import mongoose from "mongoose";

const converstaionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    sellerId:{
        type: String,
        required: true
    },
    buyerId:{
        type: String,
        required: true
    },
    readBySeller:{
        type: Boolean,
        required: true
    },
    readByBuyer:{
        type: Boolean,
        required: true
    },
    lastMessage:{
        type: String,
        required: false
    },
  },

  {
    timestamps: true, // create timestamps by default
  }
);

export default mongoose.model("Conversation", converstaionSchema);
