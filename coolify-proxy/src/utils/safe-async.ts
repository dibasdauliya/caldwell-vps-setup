export type SafeResult<T> =
  | { data: T; error: null }
  | { data: null; error: Error };

export const safeAsync = async <T>(
  asyncFn: () => Promise<T>,
): Promise<SafeResult<T>> => {
  try {
    const data = await asyncFn();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};
