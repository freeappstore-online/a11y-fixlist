import type { A11yIssue, Severity } from "../types";
import {
  checkButtonNames,
  checkDuplicateIds,
  checkEmptyLinks,
  checkFormLabels,
  checkHeadingOrder,
  checkMissingImageAlt
} from "./rules";

const severityRank: Record<Severity, number> = {
  high: 3,
  medium: 2,
  low: 1
};

export function scanHtml(html: string): A11yIssue[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const issues: A11yIssue[] = [
    ...checkButtonNames(doc),
    ...checkDuplicateIds(doc),
    ...checkEmptyLinks(doc),
    ...checkFormLabels(doc),
    ...checkHeadingOrder(doc),
    ...checkMissingImageAlt(doc)
  ];

  return [...issues].sort(
    (a, b) => severityRank[b.severity] - severityRank[a.severity]
  );
}