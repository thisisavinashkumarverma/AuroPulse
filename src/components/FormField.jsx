export function Field({ label, id, error, hint, children }) {
  return (
    <div>
      {label && <label htmlFor={id} className="label">{label}</label>}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

const aria = (id, error) => ({
  'aria-invalid': error ? 'true' : undefined,
  'aria-describedby': error ? `${id}-error` : undefined,
});

export function Input({ label, error, hint, id, ...props }) {
  const fid = id || props.name;
  return (
    <Field label={label} id={fid} error={error} hint={hint}>
      <input id={fid} className={`input ${error ? 'border-red-500' : ''}`} {...aria(fid, error)} {...props} />
    </Field>
  );
}

export function Select({ label, error, hint, id, options = [], placeholder, ...props }) {
  const fid = id || props.name;
  return (
    <Field label={label} id={fid} error={error} hint={hint}>
      <select id={fid} className={`input ${error ? 'border-red-500' : ''}`} {...aria(fid, error)} {...props}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const opt = typeof o === 'object' ? o : { value: o, label: o };
          return <option key={opt.value} value={opt.value}>{opt.label}</option>;
        })}
      </select>
    </Field>
  );
}

export function Textarea({ label, error, hint, id, ...props }) {
  const fid = id || props.name;
  return (
    <Field label={label} id={fid} error={error} hint={hint}>
      <textarea id={fid} rows={3} className={`input ${error ? 'border-red-500' : ''}`} {...aria(fid, error)} {...props} />
    </Field>
  );
}
