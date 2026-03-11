import * as userService from "../services/user.service.js";

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsersService();
    res.json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};