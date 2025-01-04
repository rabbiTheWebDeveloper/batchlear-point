import { auth } from "@/auth";
import { visitorCountModel } from "@/model/visitorCount-model";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

export const POST = async () => {
  await dbConnect();
  const today = new Date().toISOString().split("T")[0];
  try {
    let visitorData = await visitorCountModel.findOne({ date: today });

    if (!visitorData) {
      // If it doesn't exist, create a new document for today
      visitorData = new visitorCountModel({
        date: today,
        dailyCount: 0,
        totalCount: 0,
      });
    }

    // Increment today's visitor count
    visitorData.dailyCount += 1;
    visitorData.totalCount += 1;

    // Save the updated document
    await visitorData.save();

    // Update totalCount for all other days
    await visitorCountModel.updateMany(
      { date: { $ne: today } },
      { $inc: { totalCount: 1 } }
    );

    // return visitorData;
    return new NextResponse("Visitor has been created", {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};

export const GET = async (request) => {
  // const session = await auth();

  // if (!session?.user) {
  //   return new NextResponse(`You are not authenticated!`, {
  //     status: 401,
  //   });
  // }

  await dbConnect();

  try {
    const visitorCounts = await visitorCountModel
      .find({})
      .sort({ date: 1 })
      .lean();

    // Map data to desired format
    const dailyVisitors = visitorCounts.map((visitor) => ({
      date: new Date(visitor.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      visitors: visitor.dailyCount,
    }));

    return new NextResponse(JSON.stringify(dailyVisitors), {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};
