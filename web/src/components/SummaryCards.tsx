import type { A11yIssue, Severity } from "../types";
import { countBySeverity } from "../services/report";

type SummaryCardsProps = {
  issues: A11yIssue[];
};

type SummaryItem = {
  label: string;
  value: number;
};

export function SummaryCards({ issues }: SummaryCardsProps) {
  const items: SummaryItem[] = [
    { label: "Total issues", value: issues.length },
    { label: "High", value: countBySeverity(issues, "high" as Severity) },
    { label: "Medium", value: countBySeverity(issues, "medium" as Severity) },
    { label: "Low", value: countBySeverity(issues, "low" as Severity) }
  ];

  return (
    <section className="mb-6 grid gap-4 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="card-background p-5">
          <p>{item.label}</p>
          <p className="bold">{item.value}</p>
        </div>
      ))}
    </section>
  );
}