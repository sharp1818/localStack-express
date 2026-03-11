import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "secret";

const users = [{ id: 1, email: "juan@mail.com", password: "1234" }];

export const authenticateUser = async (email, password) => {
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return null;

  return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });
};