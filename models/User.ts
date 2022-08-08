import mongoose, { Schema, model, Model } from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: {
      type: String,
      enum: {
        values: ["admin", "client", "super-user", "SEO"],
        message: "{VALUE} no es un rol valido",
        defect: "client",
        required: true,
      },
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || model("User", userSchema);

export default User;
