export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5025/api';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const text = await response.text();
      try {
        const errorData = JSON.parse(text);
        if (errorData.message) errorMessage = errorData.message;
        else if (errorData.title) errorMessage = errorData.title;
        else errorMessage = text;
      } catch {
        if (text) errorMessage = text;
      }
    } catch {}
    throw new Error(errorMessage);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}
