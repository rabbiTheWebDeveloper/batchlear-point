import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/convertData";
import { BazertModel } from "@/model/bazer-model";
import { DepositModel } from "@/model/deposit-money-model";
import { OtherCostModel } from "@/model/other-cost-model";

import { dbConnect } from "@/service/mongo";

async function getAllFromDB(month = new Date().getMonth() + 1, year = new Date().getFullYear()) {
  const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
  await dbConnect();
  const result = await OtherCostModel.find({ createdAt: {
    $gte: startOfMonth, 
    $lt: endOfMonth,    
  }}).lean();
  return replaceMongoIdInArray(JSON.parse(JSON.stringify(result)));
}

const insertIntoDB = async (data) => {
  await dbConnect();
  const newRecord = new OtherCostModel(data, { strict: false });
  const result = await newRecord.save();
  return replaceMongoIdInObject(JSON.parse(JSON.stringify(result)));
};

// Function to update a specific meal in the database
const updateOneInDB = async (mainId, updateData) => {
  await dbConnect();
  // console.log(updateData, mainId);
  const result = await OtherCostModel.findOneAndUpdate(
    { _id: mainId },
    updateData
  );
  return replaceMongoIdInObject(JSON.parse(JSON.stringify(result)));
};

const deleteByIdFromDB = async (mainId) => {
  await dbConnect();
  const result = await OtherCostModel.deleteOne({ _id: mainId });

  return result;
};

export const otherCostQuery = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
