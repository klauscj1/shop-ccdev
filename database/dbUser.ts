import { db } from ".";
import { User } from "../models";
import bcrypt from "bcryptjs";

export const checkUserEmailPassword = async (email: string, password: string) => {
  await db.connect();
  const user = await User.findOne({ email });
  await db.disconnect();
  if (!user) {
    return null;
  }
  if (!bcrypt.compareSync(password, user.password!)) {
    return null;
  }
  const { role, name, _id } = user;
  return {
    _id,
    email: email.toLocaleLowerCase(),
    role,
    name,
  };
};
//crear o verificar el usaurio de OAuth
export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
  await db.connect();
  const user = await User.findOne({ email: oAuthEmail });
  if (user) {
    await db.disconnect();
    const { _id, name, role, email } = user;
    return {
      _id,
      email: email.toLocaleLowerCase(),
      role,
      name,
    };
  }
  const newUser = new User({
    email: oAuthEmail,
    password: "@",
    name: oAuthName,
    role: "client",
  });
  await newUser.save();
  await db.disconnect();
  const { _id, name, role, email } = newUser;
  return {
    _id,
    email: email.toLocaleLowerCase(),
    role,
    name,
  };
};
