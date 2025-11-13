export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-accent">LUMEN</h1>
          <p className="text-text-secondary">Personal Operating System Enforcer</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Production-ready architecture initialized successfully
          </p>
          <div className="rounded-lg border border-border bg-bg-surface p-6 text-left">
            <h2 className="mb-4 text-lg font-semibold">System Status</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Next.js 15 Frontend</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>TypeScript Strict Mode</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Tailwind CSS Configured</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-warning">○</span>
                <span>Go Backend (Pending)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-warning">○</span>
                <span>Supabase Integration (Pending)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
