import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonType = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  btnType?: ButtonType;
};

export function Button({
  children,
  className = "",
  btnType = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`button button--${btnType} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}