import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    user: { type: String },
    websiteName: { type: String },
    metaLink: { type: String },
    logo: { type: String },
    favIcon: { type: String },
    phoneNumber: { type: String },
    whatsappNumber: { type: String },
    facebookLink: { type: String },
    instagramLink: { type: String },
    youtubeLink: { type: String },
    twitterLink: { type: String },
    sectionName: { type: String },
    sectionDes: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const SettingsModel =
  mongoose.models.Settings ?? mongoose.model("Settings", SettingsSchema);
