import { User } from "models/user";
import { Resource } from "models/resource";
import { Role } from "models/role";

export async function authorized(
  userId: string,
  resourceId: string,
  action: "GET" | "PATCH",
): Promise<boolean> {
  // TODO: write authorization logic here
  // user can GET the resource if they've got GUEST or ADMIN access to the group where resource belongs
  // user can PATCH the resource if they've got ADMIN access to the group where resource belongs

  const user = await User.getById(userId);
  const resource = await Resource.getById(resourceId);

  if (!user || !resource) {
    return false;
  }
  if (action === "GET") return user.groupId === resource.groupId;
  if (action === "PATCH") return user.role === Role.ADMIN && resource.groupId === user.groupId;
  return false;
}
