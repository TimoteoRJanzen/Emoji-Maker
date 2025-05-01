"use client";

import Image from "next/image";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Download, Heart } from "lucide-react";

interface Emoji {
  id: string;
  imageUrl: string;
  prompt: string;
  liked: boolean;
}

interface EmojiGridProps {
  emojis: Emoji[];
  onLike: (id: string) => void;
  onDownload: (imageUrl: string, prompt: string) => void;
}

export function EmojiGrid({ emojis, onLike, onDownload }: EmojiGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (emojis.length === 0) {
    return (
      <div className="w-full text-center py-10 text-muted-foreground">
        <p>Nenhum emoji gerado ainda</p>
      </div>
    );
  }

  // Filtra emojis com imageUrl válido
  const validEmojis = emojis.filter(
    (emoji) => typeof emoji.imageUrl === "string" && emoji.imageUrl.trim() !== ""
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {validEmojis.length === 0 ? (
        <div className="w-full text-center py-10 text-muted-foreground col-span-full">
          <p>Nenhum emoji válido para exibir</p>
        </div>
      ) : (
        validEmojis.map((emoji) => (
          <Card
            key={emoji.id}
            className="relative overflow-hidden p-0 aspect-square"
            onMouseEnter={() => setHoveredId(emoji.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Image
              src={emoji.imageUrl}
              alt={emoji.prompt}
              fill
              className="object-cover"
            />

            {hoveredId === emoji.id && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4">
                <button
                  onClick={() => onLike(emoji.id)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label="Curtir"
                >
                  <Heart
                    className={`h-5 w-5 ${emoji.liked ? 'fill-red-500 text-red-500' : 'text-white'}`}
                  />
                </button>
                <button
                  onClick={() => onDownload(emoji.imageUrl, emoji.prompt)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label="Baixar"
                >
                  <Download className="h-5 w-5 text-white" />
                </button>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
