import { handler } from "../index";
import { DynamoDB } from "aws-sdk";

const dbClient = new DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: "eu-west-1",
  ...(process.env.MOCK_DYNAMODB_ENDPOINT && {
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: "local",
  }),
});

const group_id = "1";
const admin = {
  id: "1",
  role: "admin",
  groupId: group_id,
};
const guest = {
  id: "2",
  role: "guest",
  groupId: group_id,
};

const resource = {
  id: "1",
  value: 1,
  groupId: group_id,
};

beforeEach(async () => {
  await dbClient
    .put({
      TableName: "groups",
      Item: {
        id: group_id,
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: "users",
      Item: {
        id: admin.id,
        group_id: admin.groupId,
        role: admin.role,
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: "users",
      Item: {
        id: guest.id,
        group_id: guest.groupId,
        role: guest.role,
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: "resources",
      Item: {
        id: resource.id,
        group_id: resource.groupId,
        value: resource.value,
      },
    })
    .promise();
});

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  jest.clearAllMocks();
});

test("Disallowed", async () => {
  const { statusCode } = await handler({
    pathParameters: { userId: "123", resourceId: "1" },
    httpMethod: "PATCH",
  });
  expect(statusCode).toBe(403);
});

test("Allowed", async () => {
  const { statusCode, body } = await handler({
    pathParameters: { userId: "1", resourceId: "1" },
    httpMethod: "GET",
  });
  expect(statusCode).toBe(200);
  expect(JSON.parse(body)).toStrictEqual({ value: 1 });
});

test("Allowed", async () => {
  // TODO: write test checking if correct value is returned after update
  const { statusCode, body } = await handler({
    pathParameters: { userId: "1", resourceId: "1" },
    httpMethod: "PATCH",
  });
  expect(statusCode).toBe(200);
  expect(JSON.parse(body)).toStrictEqual({ value: 2 });
});
