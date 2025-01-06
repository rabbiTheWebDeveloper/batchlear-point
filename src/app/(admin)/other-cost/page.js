import React from 'react';
import { roommateQuery } from '@/queries/roommate';
import { bazerQuery } from '@/queries/bazer';
import dynamic from "next/dynamic";
import { otherCostQuery } from '@/queries/other-cost';
import OtherCost from './_component/OtherCost';

const page = async() => {
    let otherCost= [];
    try {
      otherCost = await otherCostQuery.getAllFromDB(); 

    } catch (error) {
      console.error("Error fetching data:", error);  // Add error logging for debugging
    }
    // console.log(otherCost)
  return (
    <>
      <OtherCost  initialBazaars={otherCost}  />
    </>
  );
};

export default page;