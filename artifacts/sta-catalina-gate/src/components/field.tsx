export function Field({
  name,
  label,
  placeholder,
  required,
  type = "text",
  defaultValue,
  autoComplete,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  defaultValue?: string;
  autoComplete?: string;
}) {
  return (
    <label className="text-xs uppercase tracking-wider text-muted">
      {label}
      <input
        name={name}
        id={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        className="mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2"
      />
    </label>
  );
}
