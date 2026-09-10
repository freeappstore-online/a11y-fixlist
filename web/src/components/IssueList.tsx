import { useState } from "react";
import type { A11yIssue, Severity } from "../types";
import { FilterBar } from './FilterBar';
import { Issue } from "./Issue";

type IssueListProps = {
  issues: A11yIssue[];
};

export function IssueList({ issues }: IssueListProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<"all" | Severity>("all");
  const [selectedCategory, setSelectedCategory] = useState<"all" | A11yIssue["category"]>("all");

  const filteredIssues = issues.filter((issue) => {
    const matchesSeverity = selectedSeverity === "all" || issue.severity === selectedSeverity;
    const matchesCategory = selectedCategory === "all" || issue.category === selectedCategory;
    return matchesSeverity && matchesCategory;
  });

  if (issues.length === 0) {  //  No issues found
    return (
      <section className="text-center">
        <h2 className="font-bold">No issue found</h2>
        <p className="underline py-3">
          ***This does not mean the page is fully WCAG compliant***
        </p>
        <p>
          No issues were detected by the current implemented check.
        </p>
      </section>
    );
  }

  return (  //  Render the issues
    <>
      <FilterBar
          selectedSeverity={selectedSeverity}
          selectedCategory={selectedCategory}
          onSeverityChange={setSelectedSeverity}
          onCategoryChange={setSelectedCategory}
          onResetFilters={() => {
            setSelectedSeverity("all");
            setSelectedCategory("all");
          }}
      />
      <section className="space-y-4">
        {filteredIssues.map((filteredIssue) => (
          <Issue key={filteredIssue.id} issue={filteredIssue} />
        ))}
      </section>
    </>
  );
}