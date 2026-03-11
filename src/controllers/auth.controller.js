import * as authService from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    await authService.createUserService(req.body);
    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    console.error("Controller Register Error:", error);
    res.status(500).json({ error: "Error interno al registrar" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.authenticateUserService(email, password);

    if (!result) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    res.json({ 
      token: result.token, 
      message: `Bienvenido ${result.user.nombre}` 
    });
  } catch (error) {
    console.error("Controller Login Error:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};