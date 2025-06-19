
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  role: 'user' | 'admin';
  createdAt: string;
  usage: {
    postsGenerated: number;
    postsScheduled: number;
    maxPosts: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUserUsage: (usage: Partial<User['usage']>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (email && password) {
        const isAdmin = email.includes('admin');
        const mockUser: User = {
          id: isAdmin ? 'admin-1' : Date.now().toString(),
          email: email,
          name: email.split('@')[0],
          plan: isAdmin ? 'enterprise' : 'free',
          role: isAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
          usage: {
            postsGenerated: isAdmin ? 0 : Math.floor(Math.random() * 5),
            postsScheduled: isAdmin ? 0 : Math.floor(Math.random() * 3),
            maxPosts: isAdmin ? Infinity : 10
          }
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const mockUser: User = {
        id: Date.now().toString(),
        email: email,
        name: name,
        plan: 'free',
        role: 'user',
        createdAt: new Date().toISOString(),
        usage: {
          postsGenerated: 0,
          postsScheduled: 0,
          maxPosts: 10
        }
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUserUsage = (usage: Partial<User['usage']>) => {
    if (user) {
      const updatedUser = {
        ...user,
        usage: { ...user.usage, ...usage }
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateUserUsage }}>
      {children}
    </AuthContext.Provider>
  );
};
