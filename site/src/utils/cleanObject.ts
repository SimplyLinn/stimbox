export default function cleanObject<T>(obj: T): T {
  const entries = Object.entries(obj);
  entries.forEach(([key, val]) => {
    if (typeof val === 'undefined') {
      // eslint-disable-next-line no-param-reassign
      delete obj[key as keyof T];
    }
  });
  return obj;
}
