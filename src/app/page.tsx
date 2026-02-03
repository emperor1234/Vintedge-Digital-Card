import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-center relative overflow-hidden">
      {/* Background ambient effect */}
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent"></div>
      
      <div className="max-w-2xl glass p-12 rounded-[3.5rem] border-gold relative overflow-hidden animate-fade-in-up">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse"></div>
        
        <div className="mb-8">
          <div className="text-accent font-bold text-center tracking-tighter text-3xl mb-4 opacity-80">
            VINTEDGE<br />
            <span className="text-[12px] tracking-[0.4em] uppercase opacity-70 block -mt-1">Digital</span>
          </div>
        </div>

        <h1 className="text-7xl font-serif mb-8 text-gold leading-tight font-black">
          Automation House
        </h1>
        
        <p className="text-xl text-muted-foreground mb-12 font-light leading-relaxed max-w-lg mx-auto">
          Transform your professional presence with AI-powered digital business cards.
          The ultimate conversion tool for elite sales professionals.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-2xl font-black text-gold mb-1">AI-Powered</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Smart Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-gold mb-1">3x</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Conversion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-gold mb-1">Elite</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Design</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/get-started"
            className="btn-gold px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm text-center hover-lift"
          >
            Get Your Card
          </Link>
          <Link
            href="/sales/test-user"
            className="bg-transparent border-2 border-accent/30 text-accent px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-accent/10 hover:border-accent transition-all text-center hover-lift"
          >
            View Sample
          </Link>
        </div>
      </div>

      <footer className="mt-16 opacity-50 text-xs tracking-widest font-bold uppercase animate-fade-in-up">
        © 2026 Vintedge Digital | Premium Sales Technology
      </footer>
    </main>
  );
}
