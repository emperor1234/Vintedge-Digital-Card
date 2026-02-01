import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🔎</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gold">Card Not Found</h2>
            <p className="text-muted-foreground mb-8 max-w-xs mx-auto leading-relaxed">
                This salesperson's card is not active or does not exist. Please check the link or contact Vintedge Digital.
            </p>
            <Link href="/" className="btn-gold px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs">
                Return Home
            </Link>
        </div>
    );
}
