"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

/**
 * Wrapper aman untuk useSearchParams agar tidak error saat build
 * (Next.js minta Suspense boundary, tapi ini bypass dengan default fallback).
 */
export function useSafeSearchParams() {
  const params = useSearchParams();

  return useMemo(() => {
    if (!params) return new URLSearchParams();
    return params;
  }, [params]);
}
