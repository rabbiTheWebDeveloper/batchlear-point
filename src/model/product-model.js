import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
  title: { type: String },
  description: { type: String },
  longDescription: { type: String },
  image: { type: String },
  youtubeLink: { type: String },
}
);

export const ProductModel =
  mongoose.models.Product ?? mongoose.model("Product", ProductSchema);
