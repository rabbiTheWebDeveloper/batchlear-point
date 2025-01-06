import React from "react";
import { getAllFromDB, mealTrackerQuery } from "@/queries/mealTracker";
import MealTracker from "./_component/MealTracker";
import { roommateQuery } from "@/queries/roommate";
// import dynamic from 'next/dynamic';

// const MealTracker = dynamic(() => import("./_component/MealTracker"), { ssr: false });

const Page = async () => {
  let data = [];
  let roommade = [];
  try {
    data = await mealTrackerQuery.getAllFromDB(); 
    roommade = await roommateQuery.getAllFromDB();  // Fetch data from DB
  } catch (error) {
    console.error("Error fetching data:", error);  // Add error logging for debugging
  }

  return (
    <>
      <MealTracker data={data} roommade={roommade} />
    </>
  );
};

export default Page;
