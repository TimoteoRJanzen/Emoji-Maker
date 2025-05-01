import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import Replicate from "replicate";

// Inicializa o cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Inicializar o cliente Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt é obrigatório" },
        { status: 400 }
      );
    }

    // Gerar o emoji usando o modelo do Replicate
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: prompt + `No estilo emoji, com background branco`,
          negative_prompt: "text, watermark, low quality, blurry, distorted, ugly, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, poorly drawn hands, missing limb, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, distorted, bad art, bad proportions, gross proportions",
          width: 1024,
          height: 1024,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 50,
          guidance_scale: 7.5,
          apply_watermark: false,
          high_noise_frac: 0.8,
          prompt_strength: 0.8,
        },
      }
    );

    if (!output || !Array.isArray(output) || output.length === 0) {
      throw new Error("Falha ao gerar imagem");
    }

    const imageUrl = output[0];

    // Baixar a imagem do Replicate
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error("Falha ao baixar imagem do Replicate");
    }
    const imageBuffer = await imageResponse.arrayBuffer();

    // Gerar nome do arquivo
    const fileName = `${Date.now()}-${prompt.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;

    // Upload para o Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('emojis')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Falha ao fazer upload para o Supabase: ${uploadError.message}`);
    }

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('emojis')
      .getPublicUrl(fileName);

    return NextResponse.json({ imageUrl: publicUrl });
  } catch (error) {
    console.error("Erro ao gerar emoji:", error);
    return NextResponse.json(
      { error: "Falha ao gerar emoji" },
      { status: 500 }
    );
  }
}
