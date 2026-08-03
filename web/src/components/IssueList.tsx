import type { A11yIssue } from "../types";
import { Issue } from "./Issue";

type IssueListProps = {
  issues: A11yIssue[];
};

export function IssueList({ issues }: IssueListProps) {
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
    <section className="space-y-4">
      {issues.map((issue) => (
        <Issue key={issue.id} issue={issue} />
      ))}
    </section>
  );
}