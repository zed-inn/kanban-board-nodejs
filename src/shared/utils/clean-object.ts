export const removeUndefined = (obj: Record<string, unknown>) => {
  const newObj: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj))
    if (value !== undefined) newObj[key] = value;

  return newObj;
};
