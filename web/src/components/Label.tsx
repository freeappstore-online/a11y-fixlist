import type { ReactNode } from "react";
import type { Severity } from "../types";

type LabelType = "default" | "category" | Severity;

type LabelProps = {
  children: ReactNode;
  type?: LabelType;
};

export function Label({ children, type = "default" }: LabelProps) {
  return (
    <span className={`label label--${type}`}>
      {children}
    </span>
  );
}