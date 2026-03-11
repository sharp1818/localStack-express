import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "../config/db.js";

export const getAllUsersService = async () => {
  const command = new ScanCommand({
    TableName: "Users",
    ProjectionExpression: "id, nombre, apellido, email, fechaNacimiento, createdAt"
  });

  const { Items } = await docClient.send(command);
  return Items;
};