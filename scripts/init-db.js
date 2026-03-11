import { DynamoDBClient, CreateTableCommand, DeleteTableCommand, DescribeTableCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
});

const params = {
  TableName: "Users",
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" },
    { AttributeName: "email", AttributeType: "S" },
  ],
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "EmailIndex",
      KeySchema: [
        { AttributeName: "email", KeyType: "HASH" }
      ],
      Projection: {
        ProjectionType: "ALL",
      },
    },
  ],
  BillingMode: "PAY_PER_REQUEST",
};

const run = async () => {
  try {
    console.log("Revisando si la tabla existe...");
    await client.send(new DeleteTableCommand({ TableName: "Users" }));
    console.log("Tabla antigua borrada para limpiar datos.");
  } catch (e) {
    // Si no existe, simplemente ignoramos el error y seguimos
  }

  try {
    await client.send(new CreateTableCommand(params));
    console.log("Tabla 'Users' creada con éxito.");
    console.log("El EmailIndex está listo para procesar logins.");
  } catch (err) {
    console.error("Error fatal al crear la tabla:", err.message);
  }
};

run();