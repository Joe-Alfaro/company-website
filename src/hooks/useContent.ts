import { useCallback, useEffect, useMemo, useState } from "react";

interface Options<T> {
  isLazy?: boolean;
  onSuccess?: (data: T) => void;
}

interface Error {
  message: string;
}

interface ReturnType<R> {
  data: R | null;
  isLoading: boolean;
  refetch: () => void;
  errors: Array<string>;
}

export default function useContent<T, R = T>(
  query: string,
  options?: Options<T> & { isLazy: true }
): [ReturnType<R>["refetch"], ReturnType<R>];
export default function useContent<T, R = T>(
  query: string,
  options?: Options<T> & { isLazy?: false }
): ReturnType<R>;
export default function useContent<T, R = T>(query: string): ReturnType<R>;
export default function useContent<T, R = T>(
  query: string,
  options?: Options<T> & { isLazy?: boolean }
): [ReturnType<R>["refetch"], ReturnType<R>] | ReturnType<R> {
  const [data, setData] = useState<R | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[]>([]);

  const isLazy = options?.isLazy ?? false;

  const onSuccess = useMemo(() => {
    if (options?.onSuccess) {
      const { onSuccess: callback } = options;
      return (data: T) => callback(data);
    }

    return null;
  }, []);

  const fetchData = useCallback(
    function () {
      setIsLoading(true);

      window
        .fetch(
          `https://graphql.contentful.com/content/v1/spaces/${
            import.meta.env.VITE_CONTENTFUL_SPACE_ID
          }/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                import.meta.env.VITE_CONTENTFUL_API_KEY
              }`,
            },
            body: JSON.stringify({ query }),
          }
        )
        .then((response) => response.json())
        .then((data) => {
          if ("errors" in data) {
            setErrors(data.errors.map((error: Error) => error.message));
          } else {
            setErrors([]);
          }

          if ("data" in data) {
            setData(onSuccess ? onSuccess(data.data) : data.data);
          } else {
            setData(null);
          }
        })
        .finally(() => setIsLoading(false));
    },
    [query]
  );

  useEffect(() => {
    isLazy ? null : fetchData();
  }, []);

  return isLazy
    ? [fetchData, { data, isLoading, errors, refetch: fetchData }]
    : { data, isLoading, errors, refetch: fetchData };
}
