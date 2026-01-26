export const getMid = (left: number | null, right: number | null) => {
  left = left ?? Infinity;
  right = right ?? Infinity;

  return (left + right) / 2;
};
