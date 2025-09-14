export interface User {
  id: string;
  email: string;
  role: 'admin' | 'member';
  tenant: Tenant;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Tenant {
  slug: string;
  name: string;
  plan: 'free' | 'pro';
  noteCount: number;
  maxNotes: number;
}

export interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}