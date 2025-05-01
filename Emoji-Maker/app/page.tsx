import { EmojiGenerator } from "@/components/emoji-generator/emoji-generator";

export default function Home() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Gerador de Emoji</h1>
        <p className="text-muted-foreground">
          Crie emojis personalizados com inteligência artificial
        </p>
      </header>
      
      <main>
        <EmojiGenerator />
      </main>
      
      <footer className="mt-20 text-center text-sm text-muted-foreground">
        <p>© 2025 Gerador de Emoji - Criado com Next.js, Shadcn e Replicate</p>
      </footer>
    </div>
  );
}
