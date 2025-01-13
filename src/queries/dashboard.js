import { replaceMongoIdInObject } from "@/lib/convertData";
import { BazertModel } from "@/model/bazer-model";
import { DepositModel } from "@/model/deposit-money-model";
import { MealTrackerModel } from "@/model/mealTracker-model";
import { OtherCostModel } from "@/model/other-cost-model";
import RoommateModel from "@/model/roommate-model";
import { dbConnect } from "@/service/mongo";

async function getAllFromDB(month = new Date().getMonth() + 1, year = new Date().getFullYear()) {
  await dbConnect();

  const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);

  // End of the month
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const mealsResult = await MealTrackerModel.find({
    createdAt: {
      $gte: startOfMonth, // Greater than or equal to the first day of this month
      $lt: endOfMonth, // Less than the first day of the next month
    },
  }).lean();

  const bazerResult = await BazertModel.find({
    createdAt: {
      $gte: startOfMonth, // Greater than or equal to the first day of this month
      $lt: endOfMonth, // Less than the first day of the next month
    },
  }).lean();

  const depositResult = await DepositModel.find({
    createdAt: {
      $gte: startOfMonth, // Greater than or equal to the first day of this month
      $lt: endOfMonth, // Less than the first day of the next month
    },
  }).lean();

  const otherResult = await OtherCostModel.find({}).lean();

  // Summing the total deposit
  const totalDeposit = depositResult.reduce(
    (total, result) => total + result.amount,
    0
  );

  // Summing the total cost from bazer result
  const totalOtherCost = otherResult.reduce(
    (total, result) => total + result.cost,
    0
  );

  const totalBazer = bazerResult.reduce(
    (total, result) => total + result.cost,
    0
  );
  // Summing meal counts
  const totalMeals = mealsResult.reduce((total, deposit) => {
    const totalMealsCount = deposit.meals.reduce(
      (mealTotal, meal) => mealTotal + meal.count,
      0
    );
    return total + totalMealsCount; // Accumulate total meal counts
  }, 0);
  const mealCharge = totalBazer / totalMeals;
  const totallCost = totalBazer + totalOtherCost;

  // Return the final result
  return JSON.parse(
    JSON.stringify({ totalMeals,totallCost, totalDeposit, totalBazer, mealCharge })
  );
}


async function getAllReportFromDB() {
  await dbConnect();
  const startOfMonth = new Date();
  startOfMonth.setDate(1); // Start of the month
  startOfMonth.setMonth(startOfMonth.getMonth() - 1); // Move to the previous month
  startOfMonth.setHours(0, 0, 0, 0); // Start of the day

  const endOfMonth = new Date();
  endOfMonth.setDate(0); // Last day of the previous month
  endOfMonth.setHours(23, 59, 59, 999); // End of the day
  // Fetch data
  const roommates = await RoommateModel.find({}).lean();
  const mealsResult = await MealTrackerModel.find({
    createdAt: { $gte: startOfMonth, $lt: endOfMonth },
  }).lean();
  const bazerResult = await BazertModel.find({
    createdAt: { $gte: startOfMonth, $lt: endOfMonth },
  }).lean();
  const depositResult = await DepositModel.find({
    createdAt: { $gte: startOfMonth, $lt: endOfMonth },
  }).lean();
  const otherResult = await OtherCostModel.find({
    createdAt: { $gte: startOfMonth, $lt: endOfMonth },
  }).lean();


  const totalBazer = bazerResult.reduce(
    (total, result) => total + result.cost,
    0
  );
  // Summing meal counts
  const totalMeals = mealsResult.reduce((total, deposit) => {
    const totalMealsCount = deposit.meals.reduce(
      (mealTotal, meal) => mealTotal + meal.count,
      0
    );
    return total + totalMealsCount; // Accumulate total meal counts
  }, 0);
  const mealCharge = totalBazer / totalMeals;

  // Total other costs and shared cost per roommate
  const totalOtherCost = otherResult.reduce((total, item) => total + item.cost, 0);
  const sharedCostPerRoommate = totalOtherCost / roommates.length;

  // Generate report for each roommate
  const reports = roommates.map((roommate) => {
    // Calculate meals
    const meals = mealsResult.find((meal) => meal.personId.toString() === roommate._id.toString());
    // console.log(mealsResult);
    const totalMeals = meals?.meals.reduce((sum, day) => sum + day.count, 0) || 0;

    // Calculate bazar contribution
    const totalBazar = bazerResult
      .filter((bazer) => bazer.personId.toString() === roommate._id.toString())
      .reduce((sum, bazer) => sum + bazer.cost, 0);

    // Calculate deposits
    const totalDeposit = depositResult
      .filter((deposit) => deposit.personId.toString() === roommate._id.toString())
      .reduce((sum, deposit) => sum + deposit.amount, 0);

    // Calculate balance
    const mealRate =Math.round(mealCharge); // Example meal rate
    const mealCost =Math.ceil(totalMeals * mealRate );
    const balance = totalDeposit - (mealCost + sharedCostPerRoommate);

    return {
      name: roommate.name,
      phone: roommate.phone,
      totalMeals,
      mealRate,
      mealCost,
      totalBazar,
      totalDeposit,
      sharedCostPerRoommate,
      balance,
    };
  });

  // Return final report
  return reports;
}

export const dashboardQuery = {
  getAllFromDB,
  getAllReportFromDB
};


