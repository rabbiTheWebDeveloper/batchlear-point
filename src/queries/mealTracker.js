import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { MealTrackerModel } from "@/model/mealTracker-model";
import { dbConnect } from "@/service/mongo";

export async function getAllFromDB() {
  await dbConnect();
  const result = await MealTrackerModel.find({})    .populate({
    path: "personId", // Reference field in the schema
    select: "name phone", // Include these fields from the Roommate model
  }).lean();
  const finalResult = result.map(deposit => ({
    ...deposit,
    person: deposit.personId, // Move populated data to a `person` field
    personId: deposit.personId?._id || deposit.personId, // Keep the original ID
  }));
  return replaceMongoIdInArray(JSON.parse(JSON.stringify(finalResult)));
}

// async function getAllFromDB() {
//   await dbConnect();

//   const result = await BazertModel.find({})
//     .populate({
//       path: "personId", // Reference field in the schema
//       select: "name phone", // Include these fields from the Roommate model
//     })
//     .lean();

//   // Add a `person` field while keeping the `personId` as is
//   const finalResult = result.map(deposit => ({
//     ...deposit,
//     person: deposit.personId, // Move populated data to a `person` field
//     personId: deposit.personId?._id || deposit.personId, // Keep the original ID
//   }));
//   return replaceMongoIdInArray(JSON.parse(JSON.stringify(finalResult)));
// }


export const insertIntoDB = async (data) => {
  await dbConnect();
    const newRecord = new MealTrackerModel(data,{strict: false});
    const result = await newRecord.save();
    return replaceMongoIdInObject(JSON.parse(JSON.stringify(result)));
};

// Function to update a specific meal in the database
export const updateOneInDB = async (mainId, mealId, count, details) => {
  try {
    const filter = { _id: mainId, 'meals._id': mealId };
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
