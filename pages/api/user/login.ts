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
    case "POST":
      return loginUser(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = "", password = "" } = req.body;
  await db.connect();
  const user = await User.findOne({ email }).lean();
  await db.disconnect();
  if (!user) {
    return res.status(404).json({ message: "No se ha registrado un usuario con ese email" });
  }
  if (!bcrypt.compareSync(password, user.password!)) {
    return res.status(404).json({ message: "Contraseña incorrecta" });
  }
  const { role, name, _id } = user;
  const token = await jwt.signToken(_id, email, name);

  return res.status(200).json({
    token,
    user: {
      role,
      name,
      email,
    },
  });
};
