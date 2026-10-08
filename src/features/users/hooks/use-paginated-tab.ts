"use client";

import { useEffect, useState } from "react";
import type { PaginatedResponse, PaginationMeta } from "../types";

type Fetcher<T> = (
  id: string,
  params: { page: number; limit: number }
) => Promise<PaginatedResponse<T>>;

export function usePaginatedTab<T>(fetcher: Fetcher<T>, userId: string, limit = 10) {
  const [items, setItems] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetcher(userId, { page, limit });
        if (ignore) return;
        setItems(res.data);
        setMeta(res.meta);
      } catch {
        if (!ignore) setError(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [fetcher, userId, page, limit, nonce]);

  return {
    items,
    meta,
    loading,
    error,
    setPage,
    retry: () => setNonce((n) => n + 1),
  };
}