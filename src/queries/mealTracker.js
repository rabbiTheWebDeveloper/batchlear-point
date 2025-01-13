import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { MealTrackerModel } from "@/model/mealTracker-model";
import { dbConnect } from "@/service/mongo";

export async function getAllFromDB(month = new Date().getMonth() + 1, year = new Date().getFullYear()) {
  await dbConnect();

// Start of the month
const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);

// End of the month
const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const result = await MealTrackerModel.find({    createdAt: {
    $gte: startOfMonth, // Greater than or equal to the first day of this month
    $lt: endOfMonth,    // Less than the first day of the next month
  },})    .populate({
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


export const insertIntoDB = async (data) => {
  await dbConnect();
    const newRecord = new MealTrackerModel(data,{strict: false});
    const result = await newRecord.save();
    return replaceMongoIdInObject(JSON.parse(JSON.stringify(result)));
};

// Function to update a specific meal in the database
export const updateOneInDB = async (mainId, mealId, count, details) => {
  try {
    // Ensure input parameters are valid
    if (!mainId || !mealId || count == null || details == null) {
      throw new Error("Invalid input parameters");
    }

    // Construct filter and update in a streamlined manner
    const filter = { _id: mainId, "meals._id": mealId };
    const updateData = {
      $set: {
        "meals.$.count": count,       // Update meal count
        "meals.$.details": details,  // Update meal details
      },
    };

    // Use lean query if only update status is required
    const options = { new: true }; // Option for MongoDB to return the updated document

    // Perform the update
    const result = await MealTrackerModel.updateOne(filter, updateData, options);

    if (result.matchedCount === 0) {
      throw new Error("No matching record found to update");
    }

    return { success: true, updated: result.modifiedCount > 0 };
  } catch (error) {
    console.error("Error updating record in DB:", error.message);
    throw new Error("Database update failed. Please try again.");
  }
};



export const mealTrackerQuery = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
};
