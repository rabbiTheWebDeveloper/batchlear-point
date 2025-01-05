import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { MealTrackerModel } from "@/model/mealTracker-model";
import { dbConnect } from "@/service/mongo";

export async function getAllFromDB() {
  await dbConnect();
  const result = await MealTrackerModel.find({}).lean();
  return replaceMongoIdInArray(JSON.parse(JSON.stringify(result)));
}

export const insertIntoDB = async (data) => {
  await dbConnect();
    const newRecord = new MealTrackerModel(data,{strict: false});
    const result = await newRecord.save();
    return replaceMongoIdInObject(JSON.parse(JSON.stringify(result)));
};

export const updateOneInDB = async (filter, updateData) => {
  try {
    const result = await MealTrackerModel.updateOne(filter, updateData, {
      new: true, // Returns the updated document
    });
    return result;
  } catch (error) {
    console.error("Error updating record in DB:", error);
    throw error;
  }
};

export const mealTrackerQuery = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
};
