import { authenticateUser } from "../services/auth.service.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  const token = await authenticateUser(email, password);
  if (!token) return res.status(401).json({ error: "Credenciales inválidas" });

  res.json({ token });
};