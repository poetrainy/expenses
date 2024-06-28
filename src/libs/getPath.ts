export const getPath = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return `/expenses/${year}/${month}`;
};
