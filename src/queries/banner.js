import { replaceMongoIdInArray } from "@/lib/convertData";
import { Banner } from "@/model/banner-model";
import { dbConnect } from "@/service/mongo";

export async function getBanner() {
  await dbConnect();
  const categories = await Banner.find({}).lean();
  return replaceMongoIdInArray(categories);
}