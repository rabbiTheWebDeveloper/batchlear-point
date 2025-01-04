import mongoose, { Schema } from "mongoose";

const bannerSchema = new Schema({
    name: {
        // required: true,

        type: String,
    },

    image: {
        // required: true,

        type: String,
    },
}, { timestamps: true,
    versionKey:false
   });

export const Banner =mongoose.models.Banner ?? mongoose.model("Banner", bannerSchema);
