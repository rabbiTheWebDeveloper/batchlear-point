import React from "react";
import { getAllFromDB } from "@/queries/mealTracker";
import MealTracker from "./_component/MealTracker";
// import dynamic from 'next/dynamic';

// const MealTracker = dynamic(() => import("./_component/MealTracker"), { ssr: false });

const Page = async () => {
  let data = [];
  try {
    data = await getAllFromDB();  // Fetch data from DB
  } catch (error) {
    console.error("Error fetching data:", error);  // Add error logging for debugging
  }

  return (
    <>
      <MealTracker data={data} />
    </>
  );
};

export default Page;
