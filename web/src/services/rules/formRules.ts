import type { A11yIssue } from "../../types";
import * as helpers from "./helpers";

//  Check form labels
export function checkFormLabels(doc: Document): A11yIssue[] {
	const fields = Array.from(
		doc.querySelectorAll(
			`input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="reset"]), textarea, select`,
		),
	);

	return fields.flatMap<A11yIssue>((field, index) => {
		const ariaLabelledBy = helpers.cleanText(
			field.getAttribute("aria-labelledby"),
		);
		if (helpers.hasFormLabel(field) || ariaLabelledBy) {
			return [];
		}

		const placeholder = helpers.cleanText(field.getAttribute("placeholder"));
		//  Has placeholder
		if (placeholder) {
			return [
				{
					id: `placeholder-only-label-${index + 1}`,
					ruleId: "PLACEHOLDER_ONLY_LABEL",
					category: "forms",
					severity: "medium",
					title: "Form field uses placeholder as its only label",
					message:
						"This form field uses placeholder text but does not have a visible label or accessible name.",
					selector: helpers.getSelector(field),
					snippet: helpers.getSnippet(field),
					suggestion:
						"Add a persistent visible label associated with the form field. Keep the placeholder only as optional hint or example text rather than using it as the field label.",
					wcagRef:
						"WCAG 3.3.2 Labels or Instructions; related to WCAG 1.3.1 Info and Relationships and WCAG 4.1.2 Name, Role, Value",
				},
			];
		}

		//  No placeholder
		return [
			{
				id: `form-field-missing-label-${index + 1}`,
				ruleId: "FORM_FIELD_MISSING_LABEL",
				category: "forms",
				severity: "high",
				title: "Form field missing label",
				message:
					"This form field does not have a visible label or accessible name.",
				selector: helpers.getSelector(field),
				snippet: helpers.getSnippet(field),
				suggestion:
					"Add a visible label connected with a matching for/id pair, wrap the field inside a label element, or provide an accessible name using aria-label or aria-labelledby.",
				wcagRef:
					"WCAG 3.3.2 Labels or Instructions; WCAG 4.1.2 Name, Role, Value; WCAG 1.3.1 Info and Relationships",
			},
		];
	});
}

//  Check broken label references
export function checkBrokenLabelReferences(doc: Document): A11yIssue[] {
	const issues: A11yIssue[] = [];

	//  Check "label for=" items
	const labels = Array.from(doc.querySelectorAll("label[for]"));
	labels.forEach((label, index) => {
		const targetId = helpers.cleanText(label.getAttribute("for"));
		if (!targetId) {
			return;
		}

		const target = doc.getElementById(targetId);
		if (!target) {
			issues.push({
				id: `broken-label-reference-${index + 1}`,
				ruleId: "BROKEN_LABEL_REFERENCE",
				category: "forms",
				severity: "medium",
				title: "Broken label reference",
				message: `This label references "${targetId}", but no element with that id was found.`,
				selector: helpers.getSelector(label),
				snippet: helpers.getSnippet(label),
				suggestion:
					"Update the label for attribute so it matches the id of an existing form control.",
				wcagRef:
					"WCAG 1.3.1 Info and Relationships; WCAG 4.1.2 Name, Role, Value",
			});
		}
	});

	//  Check "aria-labelledby" items
	const labelledElements = Array.from(
		doc.querySelectorAll("[aria-labelledby]"),
	);

	labelledElements.forEach((element, index) => {
		const labelledBy = helpers.cleanText(
			element.getAttribute("aria-labelledby"),
		);
		const ids = labelledBy.split(/\s+/);
		const missingIds = ids.filter((id) => !doc.getElementById(id));

		if (missingIds.length > 0) {
			const formatter = new Intl.ListFormat("en", {
				style: "long",
				type: "conjunction",
			});

			const missingIdText = formatter.format(missingIds.map((id) => `"${id}"`));

			issues.push({
				id: `broken-aria-reference-${index + 1}`,
				ruleId: "BROKEN_LABEL_REFERENCE",
				category: "forms",
				severity: "medium",
				title: "Broken label reference",
				message: `The aria-labelledby references ${missingIdText}, but the element(s) could not be found.`,
				selector: helpers.getSelector(element),
				snippet: helpers.getSnippet(element),
				suggestion:
					"Update the aria-labelledby value so every referenced id matches an existing element on the page.",
				wcagRef:
					"WCAG 1.3.1 Info and Relationships; WCAG 4.1.2 Name, Role, Value",
			});
		}
	});

	return issues;
}
