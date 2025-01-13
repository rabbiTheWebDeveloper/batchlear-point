"use server";
import { bazerQuery } from "@/queries/bazer";
import { dashboardQuery } from "@/queries/dashboard";
import { depositQuery } from "@/queries/deposit-money";
import { mealTrackerQuery } from "@/queries/mealTracker";
import { otherCostQuery } from "@/queries/other-cost";
import { roommateQuery } from "@/queries/roommate";
import { revalidatePath } from "next/cache";

export async function mealTrackerInsertAction(data) {
  try {
    const response = await mealTrackerQuery.insertIntoDB(data);
    revalidatePath("/(admin)/meal", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}


export async function mealTrackerGetListAction(month , year) {
  try {
    const response = await mealTrackerQuery.getAllFromDB(month, year);
    revalidatePath("/(admin)/meal", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function mealTrackerUpdateAction(mainId, mealId, count, details) {
  try {
    const response = await mealTrackerQuery.updateOneInDB(
      mainId,
      mealId,
      count,
      details
    );

    revalidatePath("/(admin)/meal", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function roommateInsertAction(data) {
  // console.log("data", data);
  try {
    const response = await roommateQuery.insertIntoDB(data);
    revalidatePath("/(admin)/roommate", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function roommateUpdateAction(id, data) {
  // console.log("data", data);
  try {
    const response = await roommateQuery.updateOneInDB(id, data);
    revalidatePath("/(admin)/roommate", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function roommateDeleteAction(id) {
  // console.log("data", data);
  try {
    const response = await roommateQuery.deleteByIdFromDB(id);
    revalidatePath("/(admin)/roommate", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function depositInsertAction(data) {
  try {
    const response = await depositQuery.insertIntoDB(data);
    revalidatePath("/(admin)/deposit-money", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function depositGetListAction(month, year) {
  try {
    const response = await depositQuery.getAllFromDB(month, year);
    revalidatePath("/(admin)/deposit-money", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function depositUpdateAction(id, data) {
  // console.log("data", data);
  try {
    const response = await depositQuery.updateOneInDB(id, data);
    revalidatePath("/(admin)/deposit-money", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function depositDeleteAction(id) {
  // console.log("data", data);
  try {
    const response = await depositQuery.deleteByIdFromDB(id);
    revalidatePath("/(admin)/deposit-money", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function bazerInsertAction(data) {
  try {
    const response = await bazerQuery.insertIntoDB(data);
    revalidatePath("/(admin)/bazer", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function bazerGetListAction(month, year) {
  try {
    const response = await bazerQuery.getAllFromDB(month, year);
    revalidatePath("/(admin)/bazer", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
export async function bazerUpdateAction(id, data) {
  // console.log("data", data);
  try {
    const response = await bazerQuery.updateOneInDB(id, data);
    revalidatePath("/(admin)/bazer", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function bazerDeleteAction(id) {
  // console.log("data", data);
  try {
    const response = await bazerQuery.deleteByIdFromDB(id);
    revalidatePath("/(admin)/bazer", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function otherCostInsertAction(data) {
  try {
    const response = await otherCostQuery.insertIntoDB(data);
    revalidatePath("/(admin)/other-cost", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}


export async function otherCostGetListAction(month, year) {
  try {
    const response = await otherCostQuery.getAllFromDB(month ,year);
    revalidatePath("/(admin)/other-cost", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function otherCostUpdateAction(id, data) {
  // console.log("data", data);
  try {
    const response = await otherCostQuery.updateOneInDB(id, data);
    revalidatePath("/(admin)/other-cost", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function otherCostDeleteAction(id) {
  // console.log("data", data);
  try {
    const response = await otherCostQuery.deleteByIdFromDB(id);
    revalidatePath("/(admin)/other-cost", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}


export async function dashboardGetListAction(month, year) {
  try {
    const response = await dashboardQuery.getAllFromDB(month, year);
    revalidatePath("/(admin)/dasboard", "page");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}