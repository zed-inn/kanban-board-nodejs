export const createOffsetFn = (perPage: number) => (page: number) =>
  (page - 1) * perPage;
