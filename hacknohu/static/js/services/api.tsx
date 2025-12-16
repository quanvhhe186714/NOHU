// Simple API client layer used by the React components (Dashboard, GameDetail, Admin, Auth)
// It talks to the Node.js + MongoDB backend we created in /backend.

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export interface User {
  id: number | string;
  username: string;
  phone: string;
  balance: number;
  role: string;
  createdAt: string;
}

export interface Lobby {
  id: number | string;
  name: string;
  image_url: string;
}

export interface Game {
  id: number | string;
  name: string;
  vietnamese_name?: string;
  image_url: string;
  label?: string;
  label_color?: string;
  win_rate?: number;
  lobby: string;
}

// Base URL cho backend API.
// Với Vite, ta đọc từ import.meta.env.VITE_API_BASE_URL, fallback localhost:9999.
const BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:9999/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
}

async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const json = await res.json();
  if (!res.ok) {
    // Ensure a consistent shape for error responses
    return {
      success: false,
      message: json.message || "Request failed",
      data: json.data,
    } as ApiResponse<T>;
  }
  return json as ApiResponse<T>;
}

export const authApi = {
  async register(username: string, phone: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, phone, password }),
    });
    return handleResponse<{ user: User }>(res);
  },

  async login(identifier: string, password: string) {
    // Frontend có thể gửi username hoặc phone, ta cho phép cả hai
    const isPhone = /^(\+84|0)\d{8,10}$/.test(identifier);
    const payload = isPhone
      ? { phone: identifier, password }
      : { username: identifier, password };

    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse<{ token: string; user: User }>(res);
  },

  async getProfile() {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse<{ user: User }>(res);
  },

  async playGame() {
    const res = await fetch(`${BASE_URL}/auth/play-game`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return handleResponse<{ balance: number }>(res);
  },
};

export const dashboardApi = {
  async getDashboardData() {
    const res = await fetch(`${BASE_URL}/dashboard`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse<Lobby[]>(res);
  },

  async getGamesByLobby(lobbyId: number | string) {
    const res = await fetch(`${BASE_URL}/dashboard/lobbies/${lobbyId}/games`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse<Game[]>(res);
  },
};

export const adminApi = {
  async getAllUsers(search: string, page: number, limit: number) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    params.set("limit", String(limit));

    const res = await fetch(`${BASE_URL}/admin/users?${params.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return handleResponse<{
      users: User[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    }>(res);
  },

  async addBalance(userId: number | string, amount: number) {
    const res = await fetch(`${BASE_URL}/admin/users/${userId}/balance`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount }),
    });
    return handleResponse<{ balance: number }>(res);
  },

  async updateUserPassword(userId: number | string, newPassword: string) {
    const res = await fetch(`${BASE_URL}/admin/users/${userId}/password`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ newPassword }),
    });
    return handleResponse<unknown>(res);
  },
};


