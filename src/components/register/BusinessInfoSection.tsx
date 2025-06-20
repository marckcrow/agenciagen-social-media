
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BusinessInfoSectionProps {
  businessSegment: string;
  onBusinessSegmentChange: (value: string) => void;
}

const businessSegments = [
  "E-commerce",
  "Restaurante/Alimentação",
  "Beleza/Estética",
  "Fitness/Academia",
  "Educação",
  "Saúde/Bem-estar",
  "Tecnologia",
  "Consultoria",
  "Imobiliário",
  "Moda",
  "Outro"
];

const BusinessInfoSection = ({
  businessSegment,
  onBusinessSegmentChange
}: BusinessInfoSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="businessSegment">Segmento de Atuação *</Label>
      <Select value={businessSegment} onValueChange={onBusinessSegmentChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione seu segmento" />
        </SelectTrigger>
        <SelectContent>
          {businessSegments.map((segment) => (
            <SelectItem key={segment} value={segment}>
              {segment}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BusinessInfoSection;
