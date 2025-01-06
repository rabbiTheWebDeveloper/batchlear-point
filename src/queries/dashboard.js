

async function getAllFromDB() {
  await dbConnect();

  const startOfMonth = new Date();
  startOfMonth.setDate(1); // Set to the first day of the current month
  startOfMonth.setHours(0, 0, 0, 0); // Set to midnight

  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Go to the next month
  endOfMonth.setDate(0); // Set to the last day of the current month
  endOfMonth.setHours(23, 59, 59, 999); // Set to just before midnight

  const result = await DepositModel.find({
    createdAt: {
      $gte: startOfMonth, // Greater than or equal to the first day of this month
      $lt: endOfMonth,    // Less than the first day of the next month
    },
  })
    .populate({
      path: "personId", // Reference field in the schema
      select: "name phone", // Include these fields from the Person model
    })
    .lean();

  // Add a `person` field while keeping the `personId` as is
  const finalResult = result.map(deposit => ({
    ...deposit,
    person: deposit.personId, // Move populated data to a `person` field
    personId: deposit.personId?._id || deposit.personId, // Keep the original ID
  }));

  return replaceMongoIdInArray(JSON.parse(JSON.stringify(finalResult)));
}


