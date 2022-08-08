import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IUser } from "../../../interfaces";
import { User } from "../../../models";
import { isValidObjectId } from "mongoose";
import { connect } from "../../../database/db";

type Data =
  | {
      message: string;
    }
  | IUser[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getUsers(req, res);
    case "PUT":
      return updateUser(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}
const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const users = await User.find().select("-password").lean();
  await db.disconnect();
  return res.status(200).json(users);
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId = "", role = "" } = req.body;
  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "El id no es valido" });
  }
  const validRotes = ["admin", "super-user", "SEO", "client"];
  if (!validRotes.includes(role)) {
    return res.status(400).json({ message: "El role no es valido" });
  }
  await db.connect();
  const user = await User.findById(userId);
  if (!user) {
    await db.disconnect();
    return res.status(404).json({ message: "No existe un usuario con ese id" });
  }
  user.role = role;
  await user.save();
  await db.disconnect();
  return res.status(200).json({ message: "Usuario actualizado" });
};
