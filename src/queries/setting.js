import { replaceMongoIdInObject } from "@/lib/convertData";
import { SettingsModel } from "@/model/shopInfo-model";
import { dbConnect } from "@/service/mongo";
import cloudinary from "@/utlis/cloudinary";
import upload from "@/utlis/imageUpload";

export async function getSetting() {
  await dbConnect();
  const categories = await SettingsModel.findById(
    "666ebddff209767f563e46a6"
  ).lean();
  return replaceMongoIdInObject(categories);
}

// export async function createSetting(setting) {
//   await dbConnect();
//   const newSetting = await SettingsModel.create(setting);
//   return newSetting;
//   // return replaceMongoIdInArray(categories);
// }



export async function updateSetting(data) {
  // await dbConnect();
  // console.log("quary data",data.favIcon);
  // console.log("quary data logo",data.logo);

  // try {
  //   // Check if favIcon exists and upload it
  //   if (data.favIcon) {
  //     const favIconUpload = await new Promise((resolve, reject) => {
  //       upload.single('favIcon')(data.req, {}, (err) => {
  //         if (err) reject(err);
  //         resolve();
  //       });
  //     });

  //     const favIconResult = await cloudinary.uploader.upload(data.favIcon.path);
  //     data.favIcon = favIconResult.secure_url;

  //     // Clean up temp file after upload
  //     fs.unlinkSync(data.favIcon.path);
  //   }

  //   // Check if logo exists and upload it
  //   if (data.logo) {
  //     const logoResult = await cloudinary.uploader.upload(data.logo.path);
  //     data.logo = logoResult.secure_url;

  //     // Clean up temp file after upload
  //     fs.unlinkSync(data.logo.path);
  //   }

    // Update settings in the database (example)
    const updatedSetting = await SettingsModel.findByIdAndUpdate(
      "666da70020eb0d19c9a2c760", // The specific _id to update
      data,
      { new: true } // Option to return the updated document
    ).lean();

    return updatedSetting;
  // } catch (error) {
  //   console.error('Error uploading images:', error);
  //   throw error; // Handle or propagate the error as needed
  // }
}
