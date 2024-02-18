export interface UserType {
  id: string;
  email: string;
  role: "user" | "admin" | "alumni";
  title: "mr" | "mrs" | "miss" | "dr";
  firstName: string;
  lastName?: string | null;
  avatar: string;
  profileLocked: boolean;
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
