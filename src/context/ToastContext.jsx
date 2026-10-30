import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext(null);

const STYLES = {
  success: { icon: FaCheckCircle, cls: 'border-secondary-500 text-secondary-800 dark:text-secondary-400' },
  error: { icon: FaExclamationCircle, cls: 'border-red-500 text-red-700 dark:text-red-400' },
  info: { icon: FaInfoCircle, cls: 'border-primary-500 text-primary-700 dark:text-primary-200' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => remove(id), 4500);
  }, [remove]);

  const api = useMemo(() => ({
    success: (m) => push('success', m),
    error: (m) => push('error', m),
    info: (m) => push('info', m),
  }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite" role="status">
        {toasts.map((t) => {
          const { icon: Icon, cls } = STYLES[t.type];
          return (
            <div key={t.id} className={`flex items-start gap-3 rounded-xl border-l-4 bg-white p-3 shadow-lg dark:bg-slate-800 ${cls}`}>
              <Icon className="mt-0.5 shrink-0" aria-hidden="true" />
              <p className="flex-1 text-sm text-slate-800 dark:text-slate-100">{t.message}</p>
              <button onClick={() => remove(t.id)} aria-label="Dismiss notification" className="text-slate-400 hover:text-slate-700">
                <FaTimes />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
