import { SERVER_BASE_URL, API_BASE_URL } from './config';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  message?: string;
  success?: boolean;
  [key: string]: any;
}

/**
 * Generic API request wrapper
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    // ambil raw text dulu
    const raw = await response.text();
    let data: any = null;

    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch {
        console.error('Invalid JSON response:', raw);
        throw new Error('Invalid JSON response');
      }
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, logout directly
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      const msg = data?.message || `API Error: ${response.status}`;
      throw new Error(msg);
    }

    return data as T;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Network error');
  }
}

export interface Achievement {
  id: number;
  title: string;
  imageUrl: string;
}

export const achievementsAPI = {
  /**
   * Fetch achievements from external API
   */
  fetchAchievements: async (): Promise<Achievement[]> => {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/achievements`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch achievements: ${response.status}`);
      }

      const data: Achievement[] = await response.json();
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  },
};

export const authAPI = {
  /**
   * Login API
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // ambil raw text dulu
      const raw = await response.text();
      let data: any = null;

      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch {
          console.error('Invalid JSON from login API:', raw);
          throw new Error('Invalid JSON from login API');
        }
      }

      if (!response.ok) {
        const msg = data?.message || `Login failed: ${response.status}`;
        throw new Error(msg);
      }

      return data as LoginResponse;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  },

  logout: async () => {
    return apiRequest('/auth/logout', { method: 'POST' });
  },
};

export interface Brand {
  id: number;
  name: string;
  logoUrl?: string;
}

export const brandsAPI = {
  /**
   * Delete a brand
   */
  deleteBrand: async (id: number): Promise<void> => {
    return apiRequest(`/brands/${id}`, { method: 'DELETE' });
  },
};
