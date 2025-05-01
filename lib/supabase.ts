"use client";

import { supabaseClient } from './supabase-client';

// Tipos para os emojis no banco de dados
export interface EmojiDB {
  id: string;
  created_at: string;
  prompt: string;
  image_url: string;
  liked: boolean;
}

// Tipo para os emojis na aplicação
export interface Emoji {
  id: string;
  imageUrl: string;
  prompt: string;
  liked: boolean;
  createdAt: Date;
}

// Função para converter um emoji do banco de dados para o formato da aplicação
export function mapEmojiFromDB(emoji: EmojiDB): Emoji {
  return {
    id: emoji.id,
    imageUrl: emoji.image_url,
    prompt: emoji.prompt,
    liked: emoji.liked,
    createdAt: new Date(emoji.created_at),
  };
}

// Função para salvar um emoji no banco de dados
export async function saveEmoji(prompt: string, imageUrl: string): Promise<Emoji | null> {
  const { data, error } = await supabaseClient
    .from('emojis')
    .insert([
      {
        prompt,
        image_url: imageUrl,
        liked: false,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Erro ao salvar emoji:', error);
    return null;
  }

  return mapEmojiFromDB(data as EmojiDB);
}

// Função para buscar todos os emojis
export async function fetchEmojis(): Promise<Emoji[]> {
  try {
    const { data, error } = await supabaseClient
      .from('emojis')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar emojis:', error);
      throw error;
    }

    if (!data) {
      console.log('Nenhum emoji encontrado');
      return [];
    }

    return (data as EmojiDB[]).map(mapEmojiFromDB);
  } catch (error) {
    console.error('Erro ao buscar emojis:', error);
    throw error;
  }
}

// Função para atualizar o status de curtida de um emoji
export async function toggleLikeEmoji(id: string, liked: boolean): Promise<boolean> {
  const { error } = await supabaseClient
    .from('emojis')
    .update({ liked })
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar emoji:', error);
    return false;
  }

  return true;
}

// Função para baixar uma imagem
export function downloadImage(imageUrl: string, prompt: string): void {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = `emoji-${prompt.replace(/\s+/g, '-').toLowerCase()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
