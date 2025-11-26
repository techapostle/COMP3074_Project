import { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

const AUTH_ENDPOINT = process.env.EXPO_PUBLIC_API_URL ? `${process.env.EXPO_PUBLIC_API_URL}/api` : '';
const TOKEN_KEY = 'auth_token';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (storedToken && AUTH_ENDPOINT) {
          const response = await fetch(`${AUTH_ENDPOINT}/user/profile`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          
          if (response.ok) {
            const profile = await response.json();
            setUser(profile);
            setToken(storedToken);
          } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
          }
        }
      } catch (e) {
        console.error("Failed to load auth state", e);
      } finally {
        setLoading(false);
      }
    }
    loadState();
  }, []);

  const signIn = async (email, password) => {
    try {
      if (!AUTH_ENDPOINT) {
        console.error("API URL not configured");
        return { loginError: { message: "API URL not configured" }};
      }
      const response = await fetch(`${AUTH_ENDPOINT}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        return { loginError: { message: data.message || 'Sign-in failed' } };
      }
      
      setToken(data.token);
      setUser(data.user);
      await SecureStore.setItemAsync(TOKEN_KEY, data.token);
      return { user: data.user };
    } catch (error) {
      return { loginError: { message: error.message || 'An error occurred' } };
    }
  };

  const signUp = async (email, password) => {
    try {
      if (!AUTH_ENDPOINT) {
        console.error("API URL not configured");
        return { signUpError: { message: "API URL not configured" }};
      }
      const response = await fetch(`${AUTH_ENDPOINT}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        return { signUpError: { message: data.message || 'Sign-up failed' } };
      }
      
      setToken(data.token);
      setUser(data.user);
      await SecureStore.setItemAsync(TOKEN_KEY, data.token);
      return { user: data.user };

    } catch (error) {
      return { signUpError: { message: error.message || 'An error occurred' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  };

  const value = {
    user,
    token,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
