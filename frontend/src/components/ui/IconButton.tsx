import { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  "aria-label": string;
};

export function IconButton({
  children,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button className={`icon-button ${className}`} {...props}>
      {children}
    </button>
  );
}
