export interface ComonkUser {
  name: string;
  email: string;
  is_verified: number;
  target_role?: string;
  contacts_used?: number;
}

const TOKEN_KEY = "comonk_token";
const USER_KEY = "comonk_user";

export const Auth = {
  save(token: string, user: ComonkUser) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  token(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  user(): ComonkUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ComonkUser;
    } catch {
      return null;
    }
  },
  isLoggedIn(): boolean {
    return !!this.token();
  },
};
