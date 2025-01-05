import React from "react";
import MealTracker from "./_component/MealTracker";
import { getAllFromDB } from "@/queries/mealTracker";

const page =async () => {

  const data =await getAllFromDB();
  console.log("data", data);
  return (
    <>
      <MealTracker />
    </>
  );
};

export default page;
