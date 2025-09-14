import { Note, Tenant } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    console.log('[ApiClient] Setting token:', token ? '***hidden***' : 'null');
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    console.log(`[ApiClient] Request →`, { url, method: options.method || 'GET', body: options.body });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`[ApiClient] Response status:`, response.status);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // If JSON parsing fails, try to get text
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
      
      console.error(`[ApiClient] Request failed:`, errorMessage);
      
      // Create a custom error with the message for better error handling
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).isFreePlanLimit = errorMessage.includes('Free plan allows maximum') || errorMessage.includes('upgrade to Pro plan');
      
      throw error;
    }

    const result = await response.json();
    console.log(`[ApiClient] Response JSON:`, result);

    if (result.success && result.data !== undefined) {
      return result.data;
    }

    return result;
  }

  async login(email: string, password: string) {
    console.log('[ApiClient] login called with:', { email });
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getNotes() {
    console.log('[ApiClient] getNotes called');
    return this.request<Note[]>('/notes');
  }

  async getNote(id: string) {
    console.log('[ApiClient] getNote called with id:', id);
    return this.request<Note>(`/notes/${id}`);
  }

  async createNote(data: { title: string; content: string }) {
    console.log('[ApiClient] createNote called with:', data);
    return this.request<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNote(id: string, data: { title: string; content: string }) {
    console.log('[ApiClient] updateNote called with:', { id, ...data });
    return this.request<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteNote(id: string) {
    console.log('[ApiClient] deleteNote called with id:', id);
    return this.request<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  }

  async upgradeTenant(tenantSlug: string) {
    console.log('[ApiClient] upgradeTenant called with tenantSlug:', tenantSlug);
    return this.request<{ tenant: Tenant }>(`/tenants/${tenantSlug}/upgrade`, {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient();
