import { handler } from "../index";
import { DynamoDB } from "aws-sdk";
import { TableNames } from "common/db";
import { HttpStatusCode } from "common/types";

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
      TableName: TableNames.groups,
      Item: {
        id: group_id,
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: TableNames.users,
      Item: {
        id: admin.id,
        group_id: admin.groupId,
        role: admin.role,
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: TableNames.users,
      Item: {
        id: guest.id,
        group_id: guest.groupId,
        role: guest.role,
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: TableNames.resources,
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

test("Disallowed: Unknown user cannot get resource", async () => {
  const { statusCode } = await handler({
    pathParameters: { userId: "123", resourceId: resource.id },
    httpMethod: "GET",
  });
  expect(statusCode).toBe(HttpStatusCode.FORBIDDEN);
});

test("Disallowed: Guest cannot patch", async () => {
  const { statusCode } = await handler({
    pathParameters: { userId: guest.id, resourceId: resource.id },
    httpMethod: "PATCH",
  });
  expect(statusCode).toBe(HttpStatusCode.FORBIDDEN);
});

test("Bad Request: Unsupported method", async () => {
  const { statusCode } = await handler({
    pathParameters: { userId: admin.id, resourceId: resource.id },
    httpMethod: "DELETE",
  });
  expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
});

test("Unknown: Resource does not exist", async () => {
  const { statusCode } = await handler({
    pathParameters: { userId: admin.id, resourceId: "2" },
    httpMethod: "GET",
  });
  expect(statusCode).toBe(HttpStatusCode.NOT_FOUND);
});

test("Allowed: Guest can get resource", async () => {
  const { statusCode, body } = await handler({
    pathParameters: { userId: guest.id, resourceId: resource.id },
    httpMethod: "GET",
  });
  expect(statusCode).toBe(HttpStatusCode.OK);
  expect(JSON.parse(body)).toStrictEqual({ value: 1 });
});

test("Allowed: Admin can patch value of existing resource", async () => {
  const { statusCode, body } = await handler({
    pathParameters: { userId: admin.id, resourceId: resource.id },
    httpMethod: "PATCH",
  });
  expect(statusCode).toBe(HttpStatusCode.OK);
  expect(JSON.parse(body)).toStrictEqual({ value: 2 });
});

test("Allowed: Admin can create new resource if one does not exist", async () => {
  const { statusCode, body } = await handler({
    pathParameters: { userId: admin.id, resourceId: "2" },
    httpMethod: "PATCH",
  });
  expect(statusCode).toBe(HttpStatusCode.OK);
  expect(JSON.parse(body)).toStrictEqual({ value: 0 });
});
