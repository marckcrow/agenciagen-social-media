
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Upload, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileImageUploadProps {
  currentImage?: string;
  userName: string;
  onImageUpdate: (imageUrl: string) => void;
}

const ProfileImageUpload = ({ currentImage, userName, onImageUpdate }: ProfileImageUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const defaultAvatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageUpdate(result);
        setIsOpen(false);
        toast({
          title: "Foto atualizada!",
          description: "Sua foto de perfil foi atualizada com sucesso.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    onImageUpdate(avatarUrl);
    setIsOpen(false);
    toast({
      title: "Avatar selecionado!",
      description: "Seu avatar foi atualizado com sucesso.",
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="w-24 h-24">
          <AvatarImage src={currentImage} alt={userName} />
          <AvatarFallback className="text-lg bg-gradient-ai text-white">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full p-2 bg-gradient-ai text-white hover:opacity-90"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Alterar Foto de Perfil</DialogTitle>
              <DialogDescription>
                Escolha uma nova foto ou selecione um avatar padrão
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload">
                  <Button variant="outline" className="w-full" asChild>
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Fazer Upload de Foto
                    </span>
                  </Button>
                </label>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Ou escolha um avatar:</h4>
                <div className="grid grid-cols-4 gap-3">
                  {defaultAvatars.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => handleAvatarSelect(avatar)}
                      className="relative group"
                    >
                      <Avatar className="w-12 h-12 hover:ring-2 hover:ring-purple-500 transition-all">
                        <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-sm text-gray-600">Clique no ícone da câmera para alterar</p>
    </div>
  );
};

export default ProfileImageUpload;
