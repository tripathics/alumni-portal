export interface UserType {
  id: string;
  email: string;
  role: "user" | "admin" | "alumni";
  title: "mr" | "mrs" | "miss" | "dr";
  first_name: string;
  last_name?: string | null;
  avatar: string;
  profile_locked: boolean;
}

export interface UserContextType {
  user: UserType | null;
  admin: boolean;
  loading: boolean;
  login: (user: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  fetchUser: () => Promise<void>;
}
