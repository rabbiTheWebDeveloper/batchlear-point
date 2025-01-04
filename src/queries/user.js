import { userModel } from "@/model/user-model";
import { dbConnect } from "@/service/mongo";
import bcrypt from "bcryptjs";
export async function passwordChange(credentials) {
  if (credentials == null) return null;
  await dbConnect();
  try {
    const user = await userModel.findOne({ email: credentials.email });

    if (user) {
      const isMatch = await bcrypt.compare(
        credentials.currentPassword,
        user.password
      );
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(credentials.newPassword, 5);
        const updateUser = await userModel.findOneAndUpdate(
          { email: credentials.email },
          { password: hashedPassword }
        );
        // console.log(updateUser);
        return JSON.parse(JSON.stringify(updateUser));
      } else {
        throw new Error("Email or password mismatch");
      }
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function updatePersonalInfo(data) {
  await dbConnect();
  try {
    const user = await userModel.findOne({ email: data.email });
    if (user) {
      const updateUser = await userModel.findOneAndUpdate(
        { email: data.email },
        data
      );
      return JSON.parse(JSON.stringify(updateUser));
    }
  } catch (error) {
    throw new Error(error);
  }
}

// export async function updatePersonalInfo(data) {
//   await dbConnect();
//   try {} catch (error) {
//     throw new Error(error);
//   }

export async function getUsers(email) {
  await dbConnect();
  try {
    const user = await userModel.findOne({ email: email });
    return user ? JSON.parse(JSON.stringify(user)) : null; // Replace with your desired format (e.g., ;
  } catch (error) {
    throw new Error(error);
  }
}


export async function signup (data) {
  await dbConnect();
  try {
      const newUser = new userModel(data);
      await newUser.save(); 
      return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    throw new Error(error);
  }
}