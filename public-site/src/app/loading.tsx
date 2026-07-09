export default function Loading() {
  return (
    <div className="min-h-screen">
      <section className="bg-mesh animate-gradient-pan pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-white/10 rounded-lg animate-pulse mb-4" />
          <div className="h-6 w-96 bg-white/10 rounded-lg animate-pulse" />
        </div>
      </section>
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-72 bg-surface-muted rounded-2xl animate-pulse mb-10" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-surface-soft rounded-xl p-6 border border-surface-muted animate-pulse space-y-3">
                <div className="h-12 w-12 bg-surface-muted rounded-xl" />
                <div className="h-4 w-3/4 bg-surface-muted rounded" />
                <div className="h-3 w-full bg-surface-muted rounded" />
                <div className="h-3 w-2/3 bg-surface-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
