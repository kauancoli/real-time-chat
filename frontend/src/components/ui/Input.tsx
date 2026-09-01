import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string };

export function Input({ className = "", label, ...props }: InputProps) {
  return (
    <label className={label ? "app-input-field" : undefined}>
      {label && <span className="sr-only">{label}</span>}
      <input className={`app-input ${className}`} {...props} />
    </label>
  );
}
