import mongoose, { Schema } from "mongoose";
const depositSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    cost: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const OtherCostModel =
  mongoose.models.OtherCost ?? mongoose.model("OtherCost", depositSchema);
