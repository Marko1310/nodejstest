import { Resource } from "models/resource";
import { User } from "models/user";

export async function getResource(resourceId: string): Promise<number> {
  const resource = await Resource.getById(resourceId);
  return resource.value;
}

export async function updateResource(resourceId: string, userId: string): Promise<unknown> {
  // TODO: write update logic here
  // resource is {resourceId: string; value: number}
  // to update the resource, increase its value by 1
  // if the resource does not exist yet, create it with 0 value in the user's group

  const resource = await Resource.resourceExist(resourceId);
  if (resource) {
    resource.value += 1;
    await Resource.update(resourceId, resource.value);
    return resource.value;
  } else {
    const { groupId } = await User.getById(userId);
    const newResource = await Resource.create({ id: resourceId, value: 0, group_id: groupId });
    return newResource.value;
  }
}
