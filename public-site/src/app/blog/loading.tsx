export default function BlogLoading() {
  return (
    <>
      <section className="bg-mesh animate-gradient-pan pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-white/10 rounded-lg animate-pulse mb-4" />
          <div className="h-6 w-96 bg-white/10 rounded-lg animate-pulse" />
        </div>
      </section>

      <section className="bg-surface border-b border-surface-muted sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 mb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-surface-muted rounded-full animate-pulse" />
            ))}
          </div>
          <div className="h-4 w-32 bg-surface-muted rounded animate-pulse" />
        </div>
      </section>

      <section className="py-12 bg-surface-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-64 bg-surface rounded-2xl border border-surface-muted animate-pulse mb-10" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-xl overflow-hidden border border-surface-muted">
                <div className="h-44 bg-surface-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-32 bg-surface-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-surface-muted rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-surface-muted rounded animate-pulse" />
                  <div className="h-3 w-24 bg-surface-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
