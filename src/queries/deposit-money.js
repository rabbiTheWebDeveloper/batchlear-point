import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/convertData";
import { DepositModel } from "@/model/deposit-money-model";

import { dbConnect } from "@/service/mongo";

async function getAllFromDB() {
  await dbConnect();
  const result = await DepositModel.find({}) .populate('Roommate', 'name') .lean();
  return replaceMongoIdInArray(JSON.parse(JSON.stringify(result)));
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
  console.log(updateData, mainId);
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
