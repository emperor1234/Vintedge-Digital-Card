import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-center">
      <div className="max-w-2xl glass p-12 rounded-[3.5rem] border border-accent/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
        <h1 className="text-6xl font-serif mb-6 text-gold leading-tight">
          Automation House
        </h1>
        <p className="text-lg text-muted-foreground mb-12 font-light leading-relaxed max-w-lg mx-auto">
          Elevate your professional presence with AI-powered digital business cards.
          The ultimate conversion tool for elite sales teams.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/get-started"
            className="btn-gold px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm text-center"
          >
            Get Your Card
          </Link>
          <Link
            href="/sales/test-user"
            className="bg-transparent border border-accent/30 text-accent px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-accent/10 transition-all text-center"
          >
            View Sample
          </Link>
        </div>
      </div>

      <footer className="mt-12 opacity-50 text-xs tracking-widest font-bold uppercase">
        © 2026 Vintedge Digital
      </footer>
    </main>
  );
}
