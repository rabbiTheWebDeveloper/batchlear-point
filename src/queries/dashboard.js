import { replaceMongoIdInObject } from "@/lib/convertData";
import { BazertModel } from "@/model/bazer-model";
import { DepositModel } from "@/model/deposit-money-model";
import { MealTrackerModel } from "@/model/mealTracker-model";
import { OtherCostModel } from "@/model/other-cost-model";
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

export const dashboardQuery = {
  getAllFromDB,
};
