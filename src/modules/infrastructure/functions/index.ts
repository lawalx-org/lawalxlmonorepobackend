import { InfrastructureNode, Prisma } from 'generated/prisma';
import slug from 'slugify';

export const slugify = (textContent: string, replacement: '-' | '_' = '-') =>
  slug(textContent, {
    trim: true,
    lower: true,
    strict: true,
    replacement,
    // remove all spacial characters except for replacement character
    remove: /[^\w\s-]|_/g,
  });

export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
  ) as Omit<T, K>;
};

export const buildNodeTree = (nodes: InfrastructureNode[], parentId?: string) =>
  nodes
    .filter((n) => n.parentId === parentId)
    .map((n) => ({
      ...n,
      children: buildNodeTree(nodes, n.id),
    }));
