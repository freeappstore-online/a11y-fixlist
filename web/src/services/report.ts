import type { A11yIssue, Severity } from "../types";

export function countBySeverity(issues: A11yIssue[], severity: Severity) {
  return issues.filter((issue) => issue.severity === severity).length;
}

export function getSeverityLabel(severity: Severity) {
  if (severity === "high") return "High";
  if (severity === "medium") return "Medium";
  return "Low";
}

export function createMarkdownReport(issues: A11yIssue[]) {
  const lines = [
    "# A11y FixList Report",
    "",
    `Total issues: ${issues.length}`,
    "",
    "## Summary",
    "",
    `- High: ${countBySeverity(issues, "high")}`,
    `- Medium: ${countBySeverity(issues, "medium")}`,
    `- Low: ${countBySeverity(issues, "low")}`,
    "",
    "## Issues",
    ""
  ];

  issues.forEach((issue, index) => {
    lines.push(
      `### ${index + 1}. ${issue.title}`,
      "",
      `Severity: ${getSeverityLabel(issue.severity)}`,
      `Category: ${issue.category}`,
      `Selector: ${issue.selector}`,
      "",
      "Issue:",
      issue.message,
      "",
      "Snippet:",
      "----- start of html snippet -----",
      issue.snippet,
      "------ end of html snippet ------",
      "",
      "Suggested fix:",
      issue.suggestion,
      ""
    );
  });

  return lines.join("\n");
}