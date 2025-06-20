
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { User, LogOut, Settings, Calendar, BarChart3, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src="https://agenciagenerativa.com.br/wp-content/uploads/elementor/thumbs/cropped-Screenshot_2-r63103j2lkhbyfz01ttdltnps9yydj60pb3eq4bitc.png"
              alt="Agência Generativa"
              className="h-10 w-auto group-hover:scale-110 transition-transform duration-200"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Agência Generativa
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-1">
                  <Link to="/dashboard">
                    <Button 
                      variant={isActive('/dashboard') ? 'default' : 'ghost'} 
                      size="sm"
                      className="hover-lift"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/schedule">
                    <Button 
                      variant={isActive('/schedule') ? 'default' : 'ghost'} 
                      size="sm"
                      className="hover-lift"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Agendamentos
                    </Button>
                  </Link>
                  <Link to="/analytics">
                    <Button 
                      variant={isActive('/analytics') ? 'default' : 'ghost'} 
                      size="sm"
                      className="hover-lift"
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                  </Link>
                  <Link to="/social-connections">
                    <Button 
                      variant={isActive('/social-connections') ? 'default' : 'ghost'} 
                      size="sm"
                      className="hover-lift"
                    >
                      Redes Sociais
                    </Button>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin">
                      <Button 
                        variant={isActive('/admin') ? 'default' : 'ghost'} 
                        size="sm"
                        className="hover-lift text-orange-600"
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Admin
                      </Button>
                    </Link>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant={user.plan === 'free' ? 'secondary' : user.plan === 'pro' ? 'default' : 'outline'} className="animate-fade-in">
                    {user.plan === 'free' ? 'Gratuito' : user.plan === 'pro' ? 'Pro' : 'Enterprise'}
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover-lift">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.profileImage} alt={user.name} />
                          <AvatarFallback className="bg-gradient-ai text-white text-sm">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden md:block">{user.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 animate-scale-in">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Configurações
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="hover-lift">Entrar</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-ai text-white hover:opacity-90 hover-lift">
                    Começar Grátis
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
