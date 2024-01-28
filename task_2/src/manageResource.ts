import { Resource } from "models/resource";
import { User } from "models/user";

type ResourceData = {
  resourceId: string;
  value: number;
};

export async function getResource(resourceId: string): Promise<ResourceData> {
  const resource = await Resource.getById(resourceId);
  return { resourceId: resource.id, value: resource.value };
}

export async function updateResource(resourceId: string, userId: string): Promise<ResourceData> {
  const resource = await Resource.resourceExist(resourceId);
  if (resource) {
    resource.value += 1;
    await Resource.update(resourceId, resource.value);
    return { resourceId: resource.id, value: resource.value };
  } else {
    const { groupId } = await User.getById(userId);
    const newResource = await Resource.create({ id: resourceId, value: 0, group_id: groupId });
    return { resourceId: newResource.id, value: newResource.value };
  }
}
