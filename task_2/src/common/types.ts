export type UserAttributes = {
  id: string;
  role: string;
  group_id: string;
};

export type ResourceAttributes = {
  id: string;
  value: number;
  group_id: string;
};

export const HttpStatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
} as const;
export type HttpStatusCodeType = (typeof HttpStatusCode)[keyof typeof HttpStatusCode];
