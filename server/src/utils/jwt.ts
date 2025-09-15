import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ksndknasdn23123";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

export default generateToken;
