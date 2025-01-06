import React from 'react';
import { otherCostQuery } from '@/queries/other-cost';
import OtherCost from './_component/OtherCost';
export const dynamic = 'force-dynamic'
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