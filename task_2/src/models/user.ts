import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { dbClient, TableNames } from "../common/db";
import { Role } from "./role";
import { UserAttributes } from "common/types";
import { HTTP404Error } from "common/errors";

type IDocumentClient<T> = Omit<DocumentClient.AttributeMap["GetItemOutput"], "Item"> & {
  Item?: T;
};

export class User {
  id;
  role;
  groupId;

  constructor(input: UserAttributes) {
    this.id = input.id;
    this.role = Role.from(input.role);
    this.groupId = input.group_id;
  }

  static async getById(id: string) {
    const { Item: user } = (await dbClient
      .get({ TableName: TableNames.users, Key: { id } })
      .promise()) as IDocumentClient<UserAttributes>;
    if (!user) throw new HTTP404Error("User does not exist");

    return new User(user);
  }

  static async userExist(userId: string): Promise<User | undefined> {
    try {
      return await this.getById(userId);
    } catch (error) {
      if (error instanceof HTTP404Error) return undefined;
    }
  }
}
