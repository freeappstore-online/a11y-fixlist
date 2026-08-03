export type Severity = "high" | "medium" | "low";

export type A11yIssue = {
  id: string;
  category: "images" | "links" | "buttons" | "forms" | "headings" | "structure" | "contrast";
  severity: Severity;
  title: string;
  message: string;
  selector: string;
  snippet: string;
  suggestion: string;
};