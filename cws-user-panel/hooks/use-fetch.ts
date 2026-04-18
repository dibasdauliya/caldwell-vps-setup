'use client'

import { useEffect, useState, useCallback } from 'react'

interface UseFetchOptions {
  immediate?: boolean
  onError?: (error: Error) => void
  onSuccess?: (data: unknown) => void
}

interface UseFetchResult<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useFetch<T = unknown>(
  url: string,
  options?: UseFetchOptions
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }
      const result = await response.json() as T
      setData(result)
      options?.onSuccess?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      setData(null)
      options?.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [url, options])

  useEffect(() => {
    if (options?.immediate === false) return
    if (!url) return
    
    fetchData()
  }, [url, options?.immediate, fetchData])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  }
}
