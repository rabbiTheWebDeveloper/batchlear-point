import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { ProductModel } from "@/model/product-model";
import { dbConnect } from "@/service/mongo";


export async function createProductDB(data) {
  await dbConnect();
  const newSetting = await ProductModel.create(data);
  return newSetting;
  // return replaceMongoIdInArray(categories);
}

export async function getProducts() {
  await dbConnect();
  const products = await ProductModel.find({}).lean();
  return replaceMongoIdInArray(products);
}

export async function getProductById(titleSlug) {
  await dbConnect();
  const product = await ProductModel.findOne({ titleSlug }).lean();
  return replaceMongoIdInObject(product);
}

export async function updateProduct(id, data) {
  await dbConnect();
  const product = await ProductModel.findByIdAndUpdate(id, data, { new: true }).lean();
  return replaceMongoIdInObject(product);
}

export async function deleteProduct(id) {
  await dbConnect();
  const product = await ProductModel.findByIdAndDelete(id).lean();
  return replaceMongoIdInObject(product);
}