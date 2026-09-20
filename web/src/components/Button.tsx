import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonType = "primary" | "secondary" | "tertiary";
type mobileWidthType = "full" | "half";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  btnType?: ButtonType;
  mobileWidth?: mobileWidthType;
};

export function Button({
  children,
  className = "",
  btnType = "primary",
  mobileWidth = "half",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`button button--${btnType}${className ? ` ${className}` : " "}${mobileWidth === "full" ? " mobile-full-width" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}