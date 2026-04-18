export const getEnvThrows = (key: string) => {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Key: ${key} is not set.`);
  }
  return value;
};
