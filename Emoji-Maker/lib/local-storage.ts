"use client";

// Tipo para os emojis na aplicação
export interface Emoji {
  id: string;
  imageUrl: string;
  prompt: string;
  liked: boolean;
  createdAt: Date;
}

// Chave para armazenar os emojis no localStorage
const EMOJIS_STORAGE_KEY = 'emoji-generator-emojis';

// Função para gerar um ID único
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Função para salvar um emoji no localStorage
export async function saveEmoji(prompt: string, imageUrl: string): Promise<Emoji | null> {
  try {
    // Criar o novo emoji
    const newEmoji: Emoji = {
      id: generateId(),
      imageUrl,
      prompt,
      liked: false,
      createdAt: new Date(),
    };

    // Obter emojis existentes
    const existingEmojis = await fetchEmojis();
    
    // Adicionar o novo emoji
    const updatedEmojis = [newEmoji, ...existingEmojis];
    
    // Salvar no localStorage
    localStorage.setItem(EMOJIS_STORAGE_KEY, JSON.stringify(updatedEmojis.map(serializeEmoji)));
    
    return newEmoji;
  } catch (error) {
    console.error('Erro ao salvar emoji:', error);
    return null;
  }
}

// Função para buscar todos os emojis
export async function fetchEmojis(): Promise<Emoji[]> {
  try {
    const emojisJson = localStorage.getItem(EMOJIS_STORAGE_KEY);
    
    if (!emojisJson) {
      return [];
    }
    
    const emojis = JSON.parse(emojisJson);
    return emojis.map(deserializeEmoji);
  } catch (error) {
    console.error('Erro ao buscar emojis:', error);
    return [];
  }
}

// Função para atualizar o status de curtida de um emoji
export async function toggleLikeEmoji(id: string, liked: boolean): Promise<boolean> {
  try {
    const emojis = await fetchEmojis();
    const updatedEmojis = emojis.map(emoji => 
      emoji.id === id ? { ...emoji, liked } : emoji
    );
    
    localStorage.setItem(EMOJIS_STORAGE_KEY, JSON.stringify(updatedEmojis.map(serializeEmoji)));
    return true;
  } catch (error) {
    console.error('Erro ao atualizar emoji:', error);
    return false;
  }
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

// Funções auxiliares para serializar/deserializar datas
function serializeEmoji(emoji: Emoji): any {
  return {
    ...emoji,
    createdAt: emoji.createdAt.toISOString(),
  };
}

function deserializeEmoji(data: any): Emoji {
  return {
    ...data,
    createdAt: new Date(data.createdAt),
  };
}
