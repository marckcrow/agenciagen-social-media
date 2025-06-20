
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Instagram } from "lucide-react";

interface ContactInfoSectionProps {
  phone: string;
  instagramLink: string;
  onPhoneChange: (value: string) => void;
  onInstagramLinkChange: (value: string) => void;
}

const ContactInfoSection = ({
  phone,
  instagramLink,
  onPhoneChange,
  onInstagramLinkChange
}: ContactInfoSectionProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone *</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagramLink">Link do Instagram</Label>
        <div className="relative">
          <Instagram className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="instagramLink"
            type="url"
            placeholder="https://instagram.com/seuperfil"
            value={instagramLink}
            onChange={(e) => onInstagramLinkChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </>
  );
};

export default ContactInfoSection;
