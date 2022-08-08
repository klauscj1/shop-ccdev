import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { jwt } from "../../../utils";

type Data =
  | {
      message: string;
    }
  | {
      token: string;
      user: {
        role: string;
        name: string;
        email: string;
      };
    };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return checkJWT(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = "" } = req.cookies as { token: string };

  let userId = "";
  try {
    userId = await jwt.isValidToken(token);
  } catch (error) {
    return res.status(401).json({ message: "Token invalido" });
  }

  await db.connect();

  const user = await User.findOne({ _id: userId }).lean();
  await db.disconnect();
  if (!user) {
    return res.status(404).json({ message: "No existe el usuario con ese id" });
  }

  const { role, name, _id, email } = user;
  const newToken = await jwt.signToken(_id, email, name);
  return res.status(200).json({
    token: newToken,
    user: {
      role,
      name,
      email,
    },
  });
};
