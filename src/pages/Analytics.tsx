
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { BarChart3, TrendingUp, Eye, Heart, MessageCircle, Share2, Users, Instagram, Youtube } from "lucide-react";

interface AnalyticsData {
  period: string;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  followers: number;
  engagement: number;
  topPosts: Array<{
    id: string;
    title: string;
    platform: 'instagram' | 'youtube';
    views: number;
    likes: number;
    comments: number;
  }>;
}

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    // Mock analytics data
    const mockData: AnalyticsData = {
      period: selectedPeriod,
      totalViews: 15420,
      totalLikes: 1285,
      totalComments: 247,
      totalShares: 158,
      followers: 3420,
      engagement: 8.3,
      topPosts: [
        {
          id: '1',
          title: 'Marketing Digital em 2024',
          platform: 'instagram',
          views: 5420,
          likes: 342,
          comments: 89
        },
        {
          id: '2',
          title: 'Tutorial IA para Conteúdo',
          platform: 'youtube',
          views: 8900,
          likes: 567,
          comments: 123
        },
        {
          id: '3',
          title: 'Produtividade no Trabalho',
          platform: 'instagram',
          views: 1100,
          likes: 376,
          comments: 35
        }
      ]
    };
    setAnalyticsData(mockData);
  }, [selectedPeriod]);

  const StatCard = ({ title, value, icon: Icon, change, color }: {
    title: string;
    value: string | number;
    icon: any;
    change?: string;
    color?: string;
  }) => (
    <Card className="hover-lift animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            {change && (
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">{change}</span>
              </div>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color || 'text-purple-500'}`} />
        </div>
      </CardContent>
    </Card>
  );

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analytics
            </h1>
            <p className="text-gray-600">
              Acompanhe o desempenho do seu conteúdo nas redes sociais
            </p>
          </div>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40 animate-fade-in">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Visualizações"
            value={analyticsData.totalViews}
            icon={Eye}
            change="+12.5%"
            color="text-blue-500"
          />
          <StatCard
            title="Curtidas"
            value={analyticsData.totalLikes}
            icon={Heart}
            change="+8.2%"
            color="text-red-500"
          />
          <StatCard
            title="Comentários"
            value={analyticsData.totalComments}
            icon={MessageCircle}
            change="+15.3%"
            color="text-green-500"
          />
          <StatCard
            title="Compartilhamentos"
            value={analyticsData.totalShares}
            icon={Share2}
            change="+6.7%"
            color="text-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Followers Card */}
          <Card className="hover-lift animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>Seguidores</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{analyticsData.followers.toLocaleString()}</div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+245 este mês</span>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Rate */}
          <Card className="hover-lift animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <span>Taxa de Engajamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{analyticsData.engagement}%</div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+0.8% vs período anterior</span>
              </div>
            </CardContent>
          </Card>

          {/* Best Time to Post */}
          <Card className="hover-lift animate-fade-in">
            <CardHeader>
              <CardTitle>Melhor Horário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Instagram</span>
                  <span className="text-sm font-medium">14:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">YouTube</span>
                  <span className="text-sm font-medium">19:00 - 21:00</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Baseado no engajamento médio
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Posts */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Top Posts</CardTitle>
            <CardDescription>
              Seus posts com melhor performance no período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topPosts.map((post, index) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-ai text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex items-center space-x-2">
                      {post.platform === 'instagram' ? (
                        <Instagram className="h-4 w-4 text-pink-600" />
                      ) : (
                        <Youtube className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">{post.title}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
