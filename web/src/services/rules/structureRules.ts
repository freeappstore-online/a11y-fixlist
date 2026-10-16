import type { A11yIssue } from "../../types";
import * as helpers from "./helpers";

//  Check headning order
export function checkHeadingOrder(doc: Document): A11yIssue[] {
	const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"));
	const issues: A11yIssue[] = [];
	let previousLevel: number | null = null;

	headings.forEach((heading, index) => {
		const currentLevel = Number(heading.tagName.substring(1));
		if (previousLevel !== null && currentLevel > previousLevel + 1) {
			issues.push({
				id: `heading-skipped-level-${index + 1}`,
				ruleId: "HEADING_SKIPPED_LEVEL",
				category: "headings",
				severity: "low",
				title: "Skipped heading level",
				message: `This heading jumps from h${previousLevel} to h${currentLevel}.`,
				selector: helpers.getSelector(heading),
				snippet: helpers.getSnippet(heading),
				suggestion:
					"Review the heading structure and use heading levels in a logical order unless the structure is intentional.",
				wcagRef:
					"WCAG 1.3.1 Info and Relationships; WCAG 2.4.6 Headings and Labels",
			});
		}
		previousLevel = currentLevel;
	});

	return issues;
}

//  Check duplicate ids
export function checkDuplicateIds(doc: Document): A11yIssue[] {
	const idElements = Array.from(doc.querySelectorAll("[id]"));
	const idMap = new Map<string, Element[]>();
	const issues: A11yIssue[] = [];

	idElements.forEach((element) => {
		const id = helpers.cleanText(element.getAttribute("id"));
		if (!id) {
			//  Empty id
			return;
		}

		const existingElements = idMap.get(id) || [];
		existingElements.push(element);
		idMap.set(id, existingElements);
	});

	Array.from(idMap.entries()).forEach(([id, elements], index) => {
		if (elements.length <= 1) {
			//  id only exists once, no duplication
			return;
		}

		const firstExistence = elements[0];
		issues.push({
			id: `duplicate-id-${index + 1}`,
			ruleId: "DUPLICATE_ID",
			category: "structure",
			severity: "medium",
			title: "Duplicate ID found",
			message: `The id "${id}" is used by ${elements.length} elements on the page.`,
			selector: `#${id}`,
			snippet: helpers.getSnippet(firstExistence),
			suggestion:
				"Update the duplicated id values so each id is unique. Duplicate ids can break label relationships, aria-labelledby references, fragment links and scripted behaviour.",
			wcagRef:
				"HTML validation / WCAG Technique H93; related to WCAG 4.1.2 Name, Role, Value and WCAG 1.3.1 Info and Relationships when ID references affect labels or ARIA relationships",
		});
	});

	return issues;
}
