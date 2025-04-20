import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    try {
      // Try to parse as JSON first
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || errorData.error || `${res.status}: ${res.statusText}`);
      } else {
        // If not JSON, get as text
        const text = await res.text();
        console.error('API Error (text):', text);
        throw new Error(`${res.status}: ${text || res.statusText}`);
      }
    } catch (parseError) {
      if (parseError instanceof Error && parseError.message !== `${res.status}: ${res.statusText}`) {
        console.error('Error parsing error response:', parseError);
      }
      throw new Error(`${res.status}: ${res.statusText}`);
    }
  }
}

// API base URL - adjust this to match your backend URL
// Use local server in development, deployed app in production
const API_BASE_URL = import.meta.env.DEV 
  ? '' // Empty string means use relative URLs (same origin)
  : 'https://campusconnect-3hmf.onrender.com'; // Render deployed app

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Make sure URL starts with the API base URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  console.log(`Making ${method} request to: ${fullUrl}`);
  
  const res = await fetch(fullUrl, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      // Add any other headers your API might need
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    mode: "cors",
  });

  // Log response status for debugging
  console.log(`Response status: ${res.status} ${res.statusText}`);
  
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    
    console.log(`Making GET request to: ${fullUrl}`);
    
    const res = await fetch(fullUrl, {
      credentials: "include",
      mode: "cors",
    });
    
    console.log(`Response status: ${res.status} ${res.statusText}`);

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    
    try {
      return await res.json();
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      console.log('Response text:', await res.clone().text());
      throw new Error('Invalid JSON response from server');
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: true,
      staleTime: 10 * 1000, // 10 seconds
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
