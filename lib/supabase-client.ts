"use client";

import { createClient } from '@supabase/supabase-js';

// Cria o cliente do Supabase para uso no lado do cliente
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);
