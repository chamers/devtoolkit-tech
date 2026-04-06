export default function Loading() {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <div className="flex flex-col p-4 lg:order-last lg:w-1/2 lg:items-center lg:justify-center">
        <div className="w-full max-w-md animate-pulse rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-4 h-6 w-2/3 rounded bg-muted" />
          <div className="mb-3 h-4 w-full rounded bg-muted" />
          <div className="mb-3 h-4 w-5/6 rounded bg-muted" />
          <div className="h-32 rounded bg-muted" />
        </div>
      </div>

      <div className="flex flex-col p-4 lg:order-first lg:w-1/2">
        <div className="mb-6 h-8 w-3/4 animate-pulse rounded bg-muted" />

        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="mb-2 h-4 w-24 rounded bg-muted" />
              <div className="h-10 w-full rounded-md bg-muted" />
            </div>
          ))}

          <div className="pt-4">
            <div className="h-10 w-40 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
