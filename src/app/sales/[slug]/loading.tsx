export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-accent uppercase tracking-widest text-[10px] font-bold">
                Loading Professional Profile...
            </p>
        </div>
    );
}
