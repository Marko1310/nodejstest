import type { APIGatewayEvent } from "aws-lambda";
import { HTTP400Error } from "common/errors";

export const validateEventParameters = (event: Partial<APIGatewayEvent>) => {
  const { userId, resourceId } = event.pathParameters!;
  const action = event.httpMethod; // Assume the value is either GET or PATCH

  if (!userId || !resourceId || (action !== "GET" && action !== "PATCH"))
    throw new HTTP400Error("Bad request");

  return {
    userId,
    resourceId,
    action: <"GET" | "PATCH">action,
  };
};
