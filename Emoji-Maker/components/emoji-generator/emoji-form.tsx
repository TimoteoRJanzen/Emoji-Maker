"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface EmojiFormProps {
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
}

export function EmojiForm({ onGenerate, isGenerating }: EmojiFormProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    await onGenerate(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Gerador de Emoji</h2>
        <p className="text-sm text-muted-foreground">
          Digite um prompt para gerar um emoji personalizado
        </p>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Ex: Um gato com um Rayban"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
          className="flex-1"
        />
        <Button type="submit" disabled={isGenerating || !prompt.trim()}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            "Gerar"
          )}
        </Button>
      </div>
    </form>
  );
}
