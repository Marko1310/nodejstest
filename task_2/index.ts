import type { APIGatewayEvent } from "aws-lambda";
import { authorized } from "./src/authorized";
import { updateResource, getResource } from "./src/manageResource";
import { validateEventParameters } from "validateEventParameters";
import { BaseError, HTTP403Error } from "common/errors";
import { HttpStatusCode } from "common/types";

export const handler = async function (event: Partial<APIGatewayEvent>) {
  try {
    const { userId, resourceId, action } = validateEventParameters(event);

    const isAuthorized = await authorized(userId, resourceId, action);
    if (!isAuthorized) throw new HTTP403Error("Forbidden");

    let resource;
    switch (action) {
      case "GET":
        resource = await getResource(resourceId);
        return { statusCode: HttpStatusCode.OK, body: JSON.stringify(resource) };

      case "PATCH":
        resource = await updateResource(resourceId, userId);
        return { statusCode: HttpStatusCode.OK, body: JSON.stringify(resource) };

      default:
        return {
          statusCode: HttpStatusCode.BAD_REQUEST,
          body: JSON.stringify({ message: "Unsupported method" }),
        };
    }
  } catch (error) {
    if (error instanceof BaseError) {
      return { statusCode: error.httpStatusCode, body: JSON.stringify({ error: error.message }) };
    }
    return { statusCode: HttpStatusCode.INTERNAL_SERVER, body: JSON.stringify({ error }) };
  }
};
