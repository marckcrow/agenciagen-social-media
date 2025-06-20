
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  role: 'user' | 'admin';
  trialEndsAt?: string;
  profileImage?: string;
  phone?: string;
  cpfCnpj?: string;
  instagramLink?: string;
  businessSegment?: string;
  usage: {
    postsGenerated: number;
    postsScheduled: number;
    maxPosts: number;
    socialAccountsConnected: number;
    maxSocialAccounts: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, additionalData?: any) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  updateUserUsage: (usage: Partial<User['usage']>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular verificação de usuário logado
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Garantir que todos os campos necessários existam
      const completeUser = {
        ...userData,
        usage: userData.usage || {
          postsGenerated: 0,
          postsScheduled: 0,
          maxPosts: userData.plan === 'free' ? 5 : userData.plan === 'pro' ? 100 : Infinity,
          socialAccountsConnected: 0,
          maxSocialAccounts: userData.plan === 'free' ? 2 : userData.plan === 'pro' ? 5 : Infinity
        }
      };
      setUser(completeUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simular login
    const mockUser: User = {
      id: '1',
      name: 'João Silva',
      email,
      plan: 'free',
      role: 'user',
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      usage: {
        postsGenerated: 0,
        postsScheduled: 0,
        maxPosts: 5,
        socialAccountsConnected: 0,
        maxSocialAccounts: 2
      }
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const register = async (email: string, password: string, name: string, additionalData?: any) => {
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      plan: 'free',
      role: 'user',
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      phone: additionalData?.phone,
      instagramLink: additionalData?.instagramLink,
      businessSegment: additionalData?.businessSegment,
      usage: {
        postsGenerated: 0,
        postsScheduled: 0,
        maxPosts: 5,
        socialAccountsConnected: 0,
        maxSocialAccounts: 2
      }
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUser,
      updateUserUsage,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
