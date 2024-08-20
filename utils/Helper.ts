export const filterObj = <T extends object, K extends keyof T>(
  obj: T,
  ...allowedFields: K[]
): Partial<T> => {
  const newObj: Partial<T> = {};

  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key as K)) {
      newObj[key as K] = obj[key as K];
    }
  });

  return newObj;
};
