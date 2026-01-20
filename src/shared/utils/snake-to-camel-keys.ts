export const convertSnakeToCamel = (snakeCasedObj: Record<string, unknown>) => {
  const camelCasedObj: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(snakeCasedObj)) {
    const keyWords = key.split("_");
    const newKey = keyWords
      .map((w, i) =>
        i === 0 || w.length < 1 ? w : `${w.at(0)?.toUpperCase()}${w.slice(1)}`,
      )
      .join("");
    camelCasedObj[newKey] = value;
  }

  return camelCasedObj;
};
