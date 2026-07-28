import type { AuthContextType } from "@/types/auth";
import type { User } from "@/types/user";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  loginApi,
  registerApi,
  logoutApi,
  getMeApi,
} from "@/services/authService";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await getMeApi();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginApi(email, password);
      setUser(data.user);
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Failed to sign in";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role?: string,
  ) => {
    try {
      setLoading(true);
      setError(null);
      await registerApi(name, email, password, role);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to register account";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutApi();
    } catch (err) {
      console.warn("Logout request failed, clearing user state anyway", err);
    } finally {
      setUser(null);
      setError(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
