import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/convertData";
import { DepositModel } from "@/model/deposit-money-model";

import { dbConnect } from "@/service/mongo";

async function getAllFromDB(month = new Date().getMonth() + 1, year = new Date().getFullYear()) {
  await dbConnect();
// Start of the month
const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);

// End of the month
const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const result = await DepositModel.find({    createdAt: {
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
  const newRecord = new DepositModel(data, { strict: false });
  const result = await newRecord.save();
  return replaceMongoIdInObject(JSON.parse(JSON.stringify(result)));
};

// Function to update a specific meal in the database
const updateOneInDB = async (mainId, updateData) => {
  await dbConnect();
  // console.log(updateData, mainId);
  const result = await DepositModel.findOneAndUpdate(
    { _id: mainId },
    updateData
  );
  return replaceMongoIdInObject(JSON.parse(JSON.stringify(result)));
};

const deleteByIdFromDB = async (mainId) => {
  await dbConnect();
  const result = await DepositModel.deleteOne({ _id: mainId });

  return result;
};

export const depositQuery = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
