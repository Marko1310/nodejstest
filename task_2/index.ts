import { authorized } from "./src/authorized";
import { updateResource, getResource } from "./src/manageResource";
import type { APIGatewayEvent } from "aws-lambda";
import { validateEventParameters } from "validateEventParameters";
import { BaseError, HTTP403Error, HTTP404Error } from "common/errors";

export const handler = async function (event: Partial<APIGatewayEvent>) {
  try {
    // TODO: authorize user access to the resource
    // write it in file src/authorize.ts and import to use here

    // TODO: return value from resource or update it
    // write it in file src/manageResource.ts and import to use here

    const { userId, resourceId, action } = validateEventParameters(event);

    const isAuthorized = await authorized(userId, resourceId, action);
    if (!isAuthorized) throw new HTTP403Error("Forbidden");

    let value;
    switch (action) {
      case "GET":
        value = await getResource(resourceId);
        return { statusCode: 200, body: JSON.stringify({ value }) };

      case "PATCH":
        value = await updateResource(resourceId, userId);
        return { statusCode: 200, body: JSON.stringify({ value }) };

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Unsupported method" }),
        };
    }
  } catch (error) {
    if (error instanceof BaseError) {
      return { statusCode: error.httpStatusCode, body: JSON.stringify({ error: error.message }) };
    }
    return { statusCode: 500, body: JSON.stringify({ error }) };
  }
};
