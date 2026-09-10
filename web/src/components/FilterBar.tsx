import type { A11yIssue, Severity } from "../types";
import { Button } from "./Button";

type SeverityFilter = "all" | Severity;
type CategoryFilter = "all" | A11yIssue["category"];

type FilterBarProps = {
  selectedSeverity: SeverityFilter;
  selectedCategory: CategoryFilter;
  onSeverityChange: (severity: SeverityFilter) => void;
  onCategoryChange: (category: CategoryFilter) => void;
  onResetFilters: () => void;
};

const severityOptions: SeverityFilter[] = ["all", "high", "medium", "low"];

const categoryOptions: CategoryFilter[] = [
  "all",
  "images",
  "links",
  "buttons",
  "forms",
  "headings",
  "structure"
];

export function FilterBar({
  selectedSeverity,
  selectedCategory,
  onSeverityChange,
  onCategoryChange,
  onResetFilters
}: FilterBarProps) {
  return (
    <section>
      <div className="flex justify-between">
        <h2 className="bold">Filter issues by severity or category</h2>
        <Button btnType="secondary" onClick={onResetFilters}>Reset filters</Button>
      </div>

      <div className="my-5">
        <p className="mb-2 bold">Severity</p>
        <div className="flex flex-wrap gap-2">
          {severityOptions.map((severity) => (
            <Button
              key={severity}
              btnType={selectedSeverity === severity ? "primary" : "secondary"}
              onClick={() => onSeverityChange(severity)}
            >
              {severity === "all" ? "All" : severity}
            </Button>
          ))}
        </div>
      </div>

      <div className="my-5">
        <p className="mb-2 bold">Category</p>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((category) => (
            <Button
              key={category}
              btnType={selectedCategory === category ? "primary" : "secondary"}
              onClick={() => onCategoryChange(category)}
            >
              {category === "all" ? "All" : category}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}