import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      trim: true,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
    },
    anonymousUserId:{
      type:String,
      unqiue:true,
      required:true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const urlModel = mongoose.model("url", urlSchema);

export default urlModel;
