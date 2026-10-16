import type { A11yIssue } from "../../types";
import * as helpers from "./helpers";

//  Check empty links
export function checkEmptyLinks(doc: Document): A11yIssue[] {
	return Array.from(doc.querySelectorAll("a[href]"))
		.filter((link) => !helpers.getAccessibleText(link))
		.map((link, index) => ({
			id: `empty-link-${index + 1}`,
			ruleId: "LINK_EMPTY_NAME",
			category: "links",
			severity: "high",
			title: "Link without accessible text",
			message: "This link does not have visible text or an accessible label.",
			selector: helpers.getSelector(link),
			snippet: helpers.getSnippet(link),
			suggestion:
				"Add clear link text, or provide an accessible name using aria-label or aria-labelledby.",
			wcagRef: "WCAG 2.4.4 Link Purpose",
		}));
}

//  Check button names
export function checkButtonNames(doc: Document): A11yIssue[] {
	return Array.from(
		doc.querySelectorAll(
			"button, [role='button'], input[type='button'], input[type='submit'], input[type='reset']",
		),
	)
		.filter((button) => !helpers.getAccessibleText(button))
		.map((button, index) => ({
			id: `button-missing-name-${index + 1}`,
			ruleId: "BUTTON_MISSING_NAME",
			category: "buttons",
			severity: "high",
			title: "Button without accessible text",
			message: "This button does not have visible text or an accessible label.",
			selector: helpers.getSelector(button),
			snippet: helpers.getSnippet(button),
			suggestion:
				"Add visible button text, or provide an accessible name using aria-label or aria-labelledby.",
			wcagRef: "WCAG 4.1.2 Name, Role, Value",
		}));
}
