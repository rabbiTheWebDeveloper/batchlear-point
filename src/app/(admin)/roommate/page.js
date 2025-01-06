import React from 'react';
import Roommate from './_component/Roommate';
import { roommateQuery } from '@/queries/roommate';
export const dynamic = 'force-dynamic'

const page =async () => {
  let data = [];
  try {
    data = await roommateQuery.getAllFromDB();  // Fetch data from DB
  } catch (error) {
    console.error("Error fetching data:", error);  // Add error logging for debugging
  }


  return (
    <>
      <Roommate roommates={data} />
    </>
  );
};

export default page;