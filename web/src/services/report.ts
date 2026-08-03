import type { A11yIssue, Severity } from "../types";

export function countBySeverity(issues: A11yIssue[], severity: Severity) {
  return issues.filter((issue) => issue.severity === severity).length;
}

export function getSeverityLabel(severity: Severity) {
  if (severity === "high") return "High";
  if (severity === "medium") return "Medium";
  return "Low";
}