"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";

interface EmojiPreviewProps {
  imageUrl: string | null;
  isGenerating: boolean;
}

export function EmojiPreview({ imageUrl, isGenerating }: EmojiPreviewProps) {
  return (
    <div className="flex items-center justify-center w-full max-w-md aspect-square rounded-lg border border-dashed border-muted-foreground/50 overflow-hidden bg-muted/20">
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin mb-2" />
          <p>Gerando emoji...</p>
        </div>
      ) : typeof imageUrl === "string" && imageUrl.trim() !== "" ? (
        <Image
          src={imageUrl}
          alt="Emoji gerado"
          width={400}
          height={400}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <p className="text-center">
            Seu emoji aparecerá aqui
            <br />
            Digite um prompt e clique em gerar
          </p>
        </div>
      )}
    </div>
  );
}
