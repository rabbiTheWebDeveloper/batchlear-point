"use server";

import { signIn } from "@/auth";
import { mealTrackerQuery } from "@/queries/mealTracker";
import {
  getAffiliationBySpecificStatusAndDate,
  getOnBoardingBySpecificStatusAndDate,
  saveOnBoardingQuery,
  updateOnBoarding,
  updateOnBoardingDetailsQuery,
} from "@/queries/onBoarding";
import { createProductDB, deleteProduct } from "@/queries/product";
// import { updateSetting } from "@/queries/setting";
import { passwordChange, updatePersonalInfo } from "@/queries/user";
import { revalidatePath } from "next/cache";

export async function login(formData) {
  try {
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    throw new Error(error);
  }
}

export async function userUpdatePassword(formData) {
  try {
    const response = await passwordChange(formData);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

// export async function userUpdateSetting(formData) {
//   try {
//     const response = await updatePersonalInfo(formData);
//     return response;
//   } catch (error) {
//     throw new Error(error);
//   }
// }

// export async function createProduct(formData) {
//   // const user = Object.fromEntries(formData);
//    await createProductDB(formData);
//   console.log("product carete action", created);
//   return created;
// }

export async function updateNote(formData) {
  try {
    console.log("formData", formData);
    const response = await updateOnBoarding(formData);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteproductByID() {
  // revalidatePath(`/details/${favoriteId}`);
  revalidatePath(`/dashboard/product`);
}

export default async function actionBanner() {
  revalidatePath(`/dashboard/banner`);
}

export async function updateOnBoardingDetailsAction(id, updateData) {
  console.log("updateData action", id, updateData);

  try {
    const response = await updateOnBoardingDetailsQuery(id, updateData);
    revalidatePath(`/dashboard/on-boarding-report`);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getOnBoardingBySpecificStatusAndDateAction(
  status,
  searchParam,
  creationDate
) {
  console.log("status action", status);

  try {
    const response = await getOnBoardingBySpecificStatusAndDate(
      status,
      searchParam,
      creationDate
    );
    revalidatePath(`/dashboard/on-boarding-report`);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAffiliationBySpecificStatusAndDateAction(
  status,
  searchParam,
  creationDate
) {
  console.log("status action", status);

  try {
    const response = await getAffiliationBySpecificStatusAndDate(
      status,
      searchParam,
      creationDate
    );
    revalidatePath(`/dashboard/on-boarding-report`);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}


export async function saveOnBoardingAction(
data
) {
  // console.log("status action", status);

  try {
    const response = await saveOnBoardingQuery(
      data
    );
    revalidatePath(`/dashboard/on-boarding-report`);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function mealTrackerInsertAction(
  data
  ) {
    try {
      const response = await mealTrackerQuery.insertIntoDB(
        data
      );
      revalidatePath(`/meal`);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }