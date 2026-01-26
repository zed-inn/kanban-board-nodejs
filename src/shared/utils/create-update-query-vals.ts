export const createUpdateQueryAndValues = (data: Record<string, unknown>) => {
  const values: unknown[] = [];
  const updateValQueries: string[] = [];

  let i = 1;
  for (const [key, value] of Object.entries(data))
    if (value !== undefined) {
      updateValQueries.push(`${key} = $${i++}`);
      values.push(value);
    }

  const next = () => i++;

  return { updateQuery: updateValQueries.join(","), values, next };
};
