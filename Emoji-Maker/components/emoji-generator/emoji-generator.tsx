"use client";

import { useState, useEffect } from "react";
import { EmojiForm } from "./emoji-form";
import { EmojiPreview } from "./emoji-preview";
import { EmojiGrid } from "./emoji-grid";
import { fetchEmojis, saveEmoji, toggleLikeEmoji, downloadImage, Emoji } from "@/lib/supabase";
import { toast } from "sonner";

export function EmojiGenerator() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar emojis ao iniciar
  useEffect(() => {
    async function loadEmojis() {
      try {
        const loadedEmojis = await fetchEmojis();
        setEmojis(loadedEmojis);
      } catch (error) {
        console.error("Erro ao carregar emojis:", error);
        toast.error("Não foi possível carregar os emojis");
      } finally {
        setIsLoading(false);
      }
    }

    loadEmojis();
  }, []);

  // Função para gerar um novo emoji
  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setCurrentImageUrl(null);

    try {
      // Chamar a API para gerar o emoji
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar emoji");
      }

      const data = await response.json();
      setCurrentImageUrl(data.imageUrl);

      // Salvar o emoji no Supabase
      const savedEmoji = await saveEmoji(prompt, data.imageUrl);
      if (savedEmoji) {
        setEmojis((prev) => [savedEmoji, ...prev]);
        toast.success("Emoji gerado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao gerar emoji:", error);
      toast.error("Não foi possível gerar o emoji");
    } finally {
      setIsGenerating(false);
    }
  };

  // Função para curtir um emoji
  const handleLike = async (id: string) => {
    const emoji = emojis.find((e) => e.id === id);
    if (!emoji) return;

    const newLikedState = !emoji.liked;
    
    // Atualizar o estado localmente primeiro para feedback imediato
    setEmojis((prev) =>
      prev.map((e) => (e.id === id ? { ...e, liked: newLikedState } : e))
    );

    // Atualizar no banco de dados
    const success = await toggleLikeEmoji(id, newLikedState);
    if (!success) {
      // Reverter se falhar
      setEmojis((prev) =>
        prev.map((e) => (e.id === id ? { ...e, liked: emoji.liked } : e))
      );
      toast.error("Não foi possível atualizar o emoji");
    }
  };

  // Função para baixar um emoji
  const handleDownload = (imageUrl: string, prompt: string) => {
    try {
      downloadImage(imageUrl, prompt);
      toast.success("Download iniciado!");
    } catch (error) {
      console.error("Erro ao baixar emoji:", error);
      toast.error("Não foi possível baixar o emoji");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto gap-10">
      <div className="flex flex-col md:flex-row items-center gap-8 w-full">
        <div className="flex-1 w-full md:w-auto">
          <EmojiPreview imageUrl={currentImageUrl} isGenerating={isGenerating} />
        </div>
        <div className="flex-1 w-full md:w-auto">
          <EmojiForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6">Emojis Gerados</h2>
        {isLoading ? (
          <div className="text-center py-10">Carregando emojis...</div>
        ) : (
          <EmojiGrid
            emojis={emojis}
            onLike={handleLike}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  );
}
