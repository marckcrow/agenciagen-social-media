import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const QrCodeGenerator = () => {
  const [value, setValue] = useState("");

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(value)}`;
    link.download = "qr-code.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <h1 className="text-2xl font-bold">Gerador de QR Code</h1>
      <Input
        placeholder="Insira o texto ou URL"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(value)}`}
            alt="QR Code"
            className="bg-white p-2"
          />
          <Button onClick={handleDownload}>Download</Button>
        </>
      )}
    </div>
  );
};

export default QrCodeGenerator;
