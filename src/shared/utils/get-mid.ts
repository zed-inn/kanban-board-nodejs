export const getMid = (left: number | null, right: number | null) => {
  left = left ?? Number.MIN_SAFE_INTEGER;
  right = right ?? Number.MAX_SAFE_INTEGER;

  return (left + right) / 2;
};
