
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

interface TermsSectionProps {
  termsAccepted: boolean;
  onTermsAcceptedChange: (accepted: boolean) => void;
}

const TermsSection = ({
  termsAccepted,
  onTermsAcceptedChange
}: TermsSectionProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="terms" 
        checked={termsAccepted}
        onCheckedChange={(checked) => onTermsAcceptedChange(checked === true)}
      />
      <Label htmlFor="terms" className="text-sm">
        Aceito os{" "}
        <Link to="/terms" className="text-purple-600 hover:underline">
          Termos e Condições
        </Link>{" "}
        e{" "}
        <Link to="/privacy" className="text-purple-600 hover:underline">
          Política de Privacidade
        </Link>
      </Label>
    </div>
  );
};

export default TermsSection;
