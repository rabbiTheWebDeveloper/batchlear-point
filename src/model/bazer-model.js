import mongoose, { Schema } from "mongoose";
const depositSchema = new mongoose.Schema({
  personId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Roommate",
  },
  cost: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative'],
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
}, { timestamps: true  ,versionKey:false});

export const BazertModel =
  mongoose.models.bazer ?? mongoose.model("bazer", depositSchema);