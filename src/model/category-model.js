import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    name: {
        required: true,
        type: String,
    },
    thumbnail: {
        required: true,
        type: String,
    },
},  { timestamps: true,
    versionKey:false
   });

export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
