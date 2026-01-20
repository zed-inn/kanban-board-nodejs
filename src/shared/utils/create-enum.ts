export const createEnum = <T extends readonly string[]>(list: T) => {
  const json: any = {};

  for (const key of list) {
    json[key] = key;
  }

  json._ = list;

  return json as { [K in T[number]]: K } & { _: T };
};
