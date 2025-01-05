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

// Function to update a specific meal in the database
export const updateOneInDB = async (mainId, mealId, count, details) => {
  try {
    console.log('Updating ' + mainId + ' ' + mealId + ' ' + count + ' ' + details);
    // Prepare the filter to find the meal by `mainId` (user) and `mealId` (specific meal day)
    const filter = { _id: mainId, 'meals._id': mealId };

    // Prepare the update data to change `count` and `details` for the specific meal
    const updateData = {
      $set: {
        'meals.$.count': count,    // Update meal count
        'meals.$.details': details, // Update meal details
      },
    };

    // Update the document in the DB
    const result = await MealTrackerModel.updateOne(filter, updateData);

    // Return the result after the update
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
