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
  const scannedTime = new Date().toLocaleString();

  const lines = [
    "# A11y FixList Report",
    "",
    "## Scan information",
    "",
    `- Scanned: ${scannedTime}`,
    "",
    `- Total issues: ${issues.length}`,
    "",
    "## Summary",
    "",
    `- High: ${countBySeverity(issues, "high")}`,
    `- Medium: ${countBySeverity(issues, "medium")}`,
    `- Low: ${countBySeverity(issues, "low")}`,
    "",
    "## List of checks performed",
    "",
    "- Missing image alt attributes",
    "- Links without accessible text",
    "- Buttons without accessible text",
    "- Form fields without labels",
    "- Skipped heading levels",
    "- Duplicate IDs",
    "",
    "## Issues",
    ""
  ];

  issues.forEach((issue, index) => {
    lines.push(
      `### ${index + 1}. ${issue.title}`,
      "",
      `- Severity: ${getSeverityLabel(issue.severity)}`,
      `- Category: ${issue.category}`,
      `- Rule: ${issue.ruleId}`,
      issue.wcagRef ? `- WCAG: ${issue.wcagRef}` : "",
      `- Selector: ${issue.selector}`,
      "",
      "- Issue:",
      issue.message,
      "",
      "- Snippet:",
      "----- start of html snippet -----",
      issue.snippet,
      "------ end of html snippet ------",
      "",
      "- Suggested fix:",
      issue.suggestion,
      ""
    );
  });

  lines.push(
    "## Scope note",
    "",
    "A11y FixList provides automated first-pass accessibility checks only.",
    "",
    "A successful scan does not mean that a page is fully WCAG compliant. Manual accessibility review is still required."
  );

  return lines.filter(Boolean).join("\n");
}