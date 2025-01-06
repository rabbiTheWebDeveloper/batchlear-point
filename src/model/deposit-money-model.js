import mongoose, { Schema } from "mongoose";
const depositSchema = new mongoose.Schema({
  personId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Roommate",
  },
  amount: {
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

export const DepositModel =
  mongoose.models.Deposit ?? mongoose.model("Deposit", depositSchema);