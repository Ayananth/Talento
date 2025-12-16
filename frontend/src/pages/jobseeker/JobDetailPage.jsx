export default function JobDetailPage() {
  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: JOB DETAIL */}
          <main className="lg:col-span-8 space-y-8">

            {/* JOB HEADER */}
            <div className="border border-slate-200 rounded-2xl p-6">
              {/* Title + Apply button */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="h-10 w-3/4 bg-slate-100 rounded" />
                <div className="h-10 w-32 bg-blue-100 rounded-lg" />
              </div>

              {/* Meta */}
              <div className="mt-4 h-4 w-48 bg-slate-100 rounded" />
            </div>

            {/* JOB IMAGE / BANNER */}
            <div className="h-64 bg-slate-100 rounded-2xl" />

            {/* OVERVIEW */}
            <div className="border border-slate-200 rounded-2xl p-6">
              <div className="h-6 w-32 bg-slate-100 rounded mb-6" />

              {/* Overview grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-5 bg-slate-100 rounded" />
                ))}
              </div>
            </div>

            {/* JOB DESCRIPTION */}
            <div className="border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="h-6 w-40 bg-slate-100 rounded" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-11/12" />
              <div className="h-4 bg-slate-100 rounded w-10/12" />
            </div>

          </main>

          {/* RIGHT: SIDEBAR */}
          <aside className="lg:col-span-4 space-y-8">

            {/* COMPANY CARD */}
            <div className="border border-slate-200 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl" />
                <div className="h-5 w-32 bg-slate-100 rounded" />
              </div>

              <div className="mt-6 h-40 bg-slate-100 rounded" />

              <div className="mt-6 space-y-3">
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
                <div className="h-4 bg-slate-100 rounded w-4/6" />
              </div>
            </div>

            {/* SIMILAR JOBS */}
            <div className="border border-slate-200 rounded-2xl p-6">
              <div className="h-6 w-32 bg-slate-100 rounded mb-6" />

              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-slate-100 rounded-xl"
                  />
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </section>
  );
}
