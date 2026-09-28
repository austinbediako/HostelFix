import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "@/types/api";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------- silent token refresh on 401 ----------
let refreshPromise: Promise<void> | null = null;

async function silentRefresh(): Promise<void> {
  await api.post("/auth/refresh", null, {
    // tag so the error interceptor skips retry for this request
    headers: { "X-No-Retry": "true" },
  });
}

function shouldRetry(config: InternalAxiosRequestConfig): boolean {
  // Don't retry auth endpoints – they handle 401 on their own
  const url = config.url ?? "";
  if (config.headers?.["X-No-Retry"]) return false;
  if (/\/auth\/(refresh|login|logout|me)/.test(url)) return false;
  return true;
}

function normalizeIds(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeIds);
  }

  if (value && typeof value === "object" && !(value instanceof Date)) {
    const obj = { ...value } as Record<string, unknown>;
    if ("_id" in obj) {
      obj.id = obj._id;
      delete obj._id;
    }
    for (const key of Object.keys(obj)) {
      obj[key] = normalizeIds(obj[key]);
    }
    return obj;
  }

  return value;
}

function unwrapResponseData(value: unknown): unknown {
  if (
    value &&
    typeof value === "object" &&
    "success" in (value as Record<string, unknown>) &&
    "data" in (value as Record<string, unknown>)
  ) {
    const { data } = value as { data: unknown };
    return normalizeIds(data);
  }
  return normalizeIds(value);
}

api.interceptors.response.use(
  (response) => {
    response.data = unwrapResponseData(response.data);
    return response;
  },
  async (error: AxiosError) => {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as ApiError | undefined;
      // 401s are expected (e.g. the session check before sign-in) and handled below.
      if (data?.error?.requestId && error.response.status !== 401) {
        console.error("Request ID:", data.error.requestId);
      }

      // Attempt silent refresh when access token expires
      const originalRequest = error.config;
      if (
        error.response.status === 401 &&
        originalRequest &&
        shouldRetry(originalRequest)
      ) {
        try {
          // Coalesce concurrent refresh calls into one request
          if (!refreshPromise) {
            refreshPromise = silentRefresh();
          }
          await refreshPromise;
          refreshPromise = null;
          // Retry the original request with the new cookies
          return api(originalRequest);
        } catch {
          refreshPromise = null;
          // Refresh itself failed – user session is truly expired
        }
      }
    }
    return Promise.reject(error);
  },
);
