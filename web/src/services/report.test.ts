import { describe, expect, it } from "vitest";
import type { A11yIssue } from "../types";
import {
	countBySeverity,
	createMarkdownReport,
	getSeverityLabel,
} from "./report";

const sampleIssue: A11yIssue = {
	id: "missing-alt-1",
	ruleId: "IMG_MISSING_ALT",
	category: "images",
	severity: "medium",
	title: "Image missing alt attribute",
	message: "This image does not have an alt attribute.",
	selector: "img",
	snippet: `<img src="team.jpg">`,
	suggestion: "Add meaningful alt text.",
	wcagRef: "WCAG 1.1.1 Non-text Content",
};

describe("report helpers", () => {
	it("counts issues by severity", () => {
		expect(countBySeverity([sampleIssue], "medium")).toBe(1);
		expect(countBySeverity([sampleIssue], "high")).toBe(0);
	});

	it("returns readable severity labels", () => {
		expect(getSeverityLabel("high")).toBe("High");
		expect(getSeverityLabel("medium")).toBe("Medium");
		expect(getSeverityLabel("low")).toBe("Low");
	});
});

describe("createMarkdownReport", () => {
	it("includes scan summary and issue details", () => {
		const report = createMarkdownReport([sampleIssue]);

		expect(report).toContain("# A11y FixList Report");
		expect(report).toContain("Total issues: 1");
		expect(report).toContain("Medium: 1");
		expect(report).toContain("IMG_MISSING_ALT");
		expect(report).toContain("WCAG 1.1.1 Non-text Content");
		expect(report).toContain(`<img src="team.jpg">`);
	});

	it("includes the scope warning", () => {
		const report = createMarkdownReport([]);
		expect(report).toContain("Manual accessibility review is still required.");
	});
});
