import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    // Check for existing user and determine if they're admin
    const checkUser = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        
        // Check if user has admin role in database
        try {
          const { data: userRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userData.id)
            .eq('role', 'admin')
            .single();
          
          if (userRole) {
            userData.role = 'admin';
          }
        } catch (error) {
          // User doesn't have admin role, keep as regular user
          console.log('User is not admin');
        }
        
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
    };
    
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    // Simular login
    const mockUser: User = {
      id: '1',
      name: 'João Silva',
      email,
      plan: 'free',
      role: email === 'admin@agenciagen.com' ? 'admin' : 'user',
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      usage: {
        postsGenerated: 0,
        postsScheduled: 0,
        maxPosts: 5,
        socialAccountsConnected: 0,
        maxSocialAccounts: 2
      }
    };
    
    // If admin, insert admin role in database
    if (mockUser.role === 'admin') {
      try {
        await supabase
          .from('user_roles')
          .upsert({ user_id: mockUser.id, role: 'admin' });
      } catch (error) {
        console.error('Error setting admin role:', error);
      }
    }
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));

    // Send webhook event for user signup
    try {
      await fetch('/api/webhook/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-token': 'demo-webhook-token'
        },
        body: JSON.stringify({
          event_type: 'user.signup',
          user_id: mockUser.id,
          data: {
            email: mockUser.email,
            plan: mockUser.plan,
            signup_date: new Date().toISOString()
          }
        })
      });
    } catch (error) {
      console.error('Error sending webhook:', error);
    }
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

      // Send webhook for plan upgrade
      if (data.plan && data.plan !== user.plan) {
        try {
          fetch('/api/webhook/event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-webhook-token': 'demo-webhook-token'
            },
            body: JSON.stringify({
              event_type: 'plan.upgrade',
              user_id: user.id,
              data: {
                old_plan: user.plan,
                new_plan: data.plan,
                upgrade_date: new Date().toISOString()
              }
            })
          });
        } catch (error) {
          console.error('Error sending webhook:', error);
        }
      }
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

      // Send webhook for content generation
      if (usage.postsGenerated) {
        try {
          fetch('/api/webhook/event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-webhook-token': 'demo-webhook-token'
            },
            body: JSON.stringify({
              event_type: 'content.generated',
              user_id: user.id,
              data: {
                posts_generated: usage.postsGenerated,
                generation_date: new Date().toISOString()
              }
            })
          });
        } catch (error) {
          console.error('Error sending webhook:', error);
        }
      }
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
