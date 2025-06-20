
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const FormHeader = () => {
  return (
    <>
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center space-x-2 mb-6">
          <div className="bg-gradient-ai p-2 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Agencia Generativa
          </span>
        </Link>
      </div>

      <CardHeader>
        <CardTitle className="text-2xl text-center">Criar conta grátis</CardTitle>
        <CardDescription className="text-center">
          Comece grátis por 7 dias e transforme seu marketing com IA
        </CardDescription>
      </CardHeader>
    </>
  );
};

export default FormHeader;
