import jwt from "jsonwebtoken";

export const signToken = (_id: string, email: string, name: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("No hay semilla del JWT - Revisar variables de entorno");
  }

  return jwt.sign({ _id, email, name }, process.env.JWT_SECRET_SEED, {
    expiresIn: "30d",
  });
};

export const isValidToken = (token: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_SEED || "", (error, payload) => {
        if (error) return reject("JWT no es valido");
        const { _id } = payload as { _id: string };
        resolve(_id);
      });
    } catch (error) {
      reject("JWT no es valido");
    }
  });
};
