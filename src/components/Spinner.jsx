export function Spinner({ size = 'h-8 w-8' }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`${size} animate-spin rounded-full border-4 border-primary-200 border-t-primary-600`}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner />
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="card mx-auto max-w-md p-6 text-center">
      <p className="font-semibold text-red-600">Unable to load data</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{message}</p>
      {onRetry && <button onClick={onRetry} className="btn-primary mt-4">Try again</button>}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="card p-8 text-center">
      <p className="font-semibold text-slate-800 dark:text-slate-100">{title}</p>
      {message && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
