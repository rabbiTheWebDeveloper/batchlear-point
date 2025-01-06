import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/convertData";
import { BazertModel } from "@/model/bazer-model";
import { DepositModel } from "@/model/deposit-money-model";

import { dbConnect } from "@/service/mongo";

async function getAllFromDB() {
  await dbConnect();
  const startOfMonth = new Date();
  startOfMonth.setDate(1); // Set to the first day of the current month
  startOfMonth.setHours(0, 0, 0, 0); // Set to midnight

  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Go to the next month
  endOfMonth.setDate(0); // Set to the last day of the current month
  endOfMonth.setHours(23, 59, 59, 999); // Set to just before midnight

  const result = await BazertModel.find({    createdAt: {
    $gte: startOfMonth, // Greater than or equal to the first day of this month
    $lt: endOfMonth,    // Less than the first day of the next month
  },})
    .populate({
      path: "personId", // Reference field in the schema
      select: "name phone", // Include these fields from the Roommate model
    })
    .lean();

  // Add a `person` field while keeping the `personId` as is
  const finalResult = result.map(deposit => ({
    ...deposit,
    person: deposit.personId, // Move populated data to a `person` field
    personId: deposit.personId?._id || deposit.personId, // Keep the original ID
  }));
  return replaceMongoIdInArray(JSON.parse(JSON.stringify(finalResult)));
}


const insertIntoDB = async (data) => {
  await dbConnect();
  const newRecord = new BazertModel(data, { strict: false });
  const result = await newRecord.save();
  return replaceMongoIdInObject(JSON.parse(JSON.stringify(result)));
};

// Function to update a specific meal in the database
const updateOneInDB = async (mainId, updateData) => {
  await dbConnect();
  // console.log(updateData, mainId);
  const result = await BazertModel.findOneAndUpdate(
    { _id: mainId },
    updateData
  );
  return replaceMongoIdInObject(JSON.parse(JSON.stringify(result)));
};

const deleteByIdFromDB = async (mainId) => {
  await dbConnect();
  const result = await BazertModel.deleteOne({ _id: mainId });

  return result;
};

export const bazerQuery = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
