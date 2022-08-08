import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { jwt, validations } from "../../../utils";

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
      return registerUser(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const {
      email = "",
      password = "",
      name = "",
    } = req.body as { email: string; password: string; name: string };

    await db.connect();
    const user = await User.findOne({ email }).lean();

    if (user) {
      await db.disconnect();
      return res.status(404).json({ message: "Ya se ha registrado un usuario con ese email" });
    }

    if (!validations.isValidEmail(email)) {
      return res.status(400).json({ message: "Correo incorrecto" });
    }

    const encryptedPassword = bcrypt.hashSync(password);
    const newUser = new User({
      email: email.toLocaleLowerCase(),
      password: encryptedPassword,
      name,
      role: "client",
    });

    try {
      await newUser.save();
    } catch (error) {
      console.log(error);
    }
    await db.disconnect();

    const token = await jwt.signToken(newUser._id, email, name);
    return res.status(200).json({
      token,
      user: {
        role: newUser.role,
        name,
        email,
      },
    });
  } catch (error) {
    console.log("Errorrorr ", error);
  }
};
