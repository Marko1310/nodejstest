import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { dbClient, TableNames } from "../common/db";
import { ResourceAttributes } from "common/types";
import { HTTP404Error } from "common/errors";

type IDocumentClient<T> = Omit<DocumentClient.AttributeMap["GetItemOutput"], "Item"> & {
  Item?: T;
};

export class Resource {
  id;
  value;
  groupId;

  constructor(input: ResourceAttributes) {
    this.id = input.id;
    this.value = input.value;
    this.groupId = input.group_id;
  }

  static async getById(id: string) {
    const { Item: resource } = (await dbClient
      .get({ TableName: TableNames.resources, Key: { id } })
      .promise()) as IDocumentClient<ResourceAttributes>;
    if (!resource) throw new HTTP404Error("Resource does not exist");

    return new Resource(resource);
  }

  static async resourceExist(resourceId: string): Promise<Resource | undefined> {
    try {
      return await this.getById(resourceId);
    } catch (error) {
      if (error instanceof HTTP404Error) return undefined;
    }
  }

  static async create(attributes: ResourceAttributes) {
    try {
      await dbClient.put({ TableName: TableNames.resources, Item: attributes }).promise();
      return new Resource(attributes);
    } catch (error) {
      console.error("Create resource error:", error);
      throw new Error("Create resource error");
    }
  }

  static async update(id: string, value: number) {
    try {
      await dbClient
        .update({
          TableName: TableNames.resources,
          Key: { id },
          UpdateExpression: "set #value = :value",
          ExpressionAttributeNames: { "#value": "value" },
          ExpressionAttributeValues: {
            ":value": value,
          },
        })
        .promise();
    } catch (error) {
      console.error("Update resource error:", error);
      throw new Error("Update resource error");
    }
  }
}
