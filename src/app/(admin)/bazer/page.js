import React from 'react';
import Bazer from './_component/Bazer';
import { roommateQuery } from '@/queries/roommate';
import { bazerQuery } from '@/queries/bazer';

const page = async() => {

    let data = [];
    let bazer= [];
    try {
      data = await roommateQuery.getAllFromDB();  // Fetch data from DB
      bazer = await bazerQuery.getAllFromDB(); 

    } catch (error) {
      console.error("Error fetching data:", error);  // Add error logging for debugging
    }
    console.log(bazer)
  return (
    <>
      <Bazer people={data} initialBazaars={bazer}  />
    </>
  );
};

export default page;