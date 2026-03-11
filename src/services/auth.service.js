import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "../config/db.js";

const SECRET = process.env.JWT_SECRET || "secret";

export const createUserService = async (userData) => {
  const { email, nombre, apellido, password, fechaNacimiento } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const command = new PutCommand({
    TableName: "Users",
    Item: {
      id: uuidv4(),
      email: email.toLowerCase(),
      nombre,
      apellido,
      password: hashedPassword,
      fechaNacimiento,
      createdAt: new Date().toISOString()
    },
    ConditionExpression: "attribute_not_exists(email)" // Cambiado a email para evitar duplicados reales
  });

  return await docClient.send(command);
};

export const authenticateUserService = async (email, password) => {
  const command = new QueryCommand({
    TableName: "Users",
    IndexName: "EmailIndex",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: { ":email": email.toLowerCase() }
  });

  const { Items } = await docClient.send(command);
  const user = Items[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, nombre: user.nombre },
    SECRET,
    { expiresIn: "1h" }
  );

  return { token, user: { nombre: user.nombre, email: user.email } };
};