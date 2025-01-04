import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
    mobile: {
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    role: {
      required: true,
      type: String,
    },
    slag: {
      type: String,
    },
    permission: {
      type: [String],
      default: [],
    },
    visitorCount: {
      type: Number,
    }
  },
  { timestamps: true, versionKey: false }
);

export const userModel =
  mongoose.models.users ?? mongoose.model("users", userSchema);
