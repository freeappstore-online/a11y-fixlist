import type { A11yIssue } from "../../types";
import * as helpers from "./helpers";

//  Check missing image alt
export function checkMissingImageAlt(doc: Document): A11yIssue[] {
	return Array.from(doc.querySelectorAll("img"))
		.filter((image) => !image.hasAttribute("alt"))
		.map((image, index) => ({
			id: `missing-image-alt-${index + 1}`,
			ruleId: "IMG_MISSING_ALT",
			category: "images",
			severity: image.closest("a, button") ? "high" : "medium",
			title: "Image missing alt attribute",
			message: "This image does not have an alt attribute.",
			selector: helpers.getSelector(image),
			snippet: helpers.getSnippet(image),
			suggestion:
				'Add meaningful alt text if the image communicates content, or use alt="" if the image is decorative.',
			wcagRef: "WCAG 1.1.1 Non-text Content",
		}));
}

//  Check generici image alt text
export function checkGenericAltText(doc: Document): A11yIssue[] {
	return Array.from(doc.querySelectorAll("img[alt]"))
		.filter((image) => {
			const alt = helpers.cleanText(image.getAttribute("alt"));
			if (!alt) {
				return false;
			}
			return helpers.isGenericAltText(alt);
		})
		.map((image, index) => ({
			id: `generic-alt-text-${index + 1}`,
			ruleId: "GENERIC_ALT_TEXT",
			category: "images",
			severity: "low",
			title: "Image alt text may be too generic",
			message: `This image uses generic alt text: "${helpers.cleanText(image.getAttribute("alt"))}".`,
			selector: helpers.getSelector(image),
			snippet: helpers.getSnippet(image),
			suggestion:
				'Replace generic alt text with a concise description of the image purpose or information. If the image is decorative, consider using alt="".',
			wcagRef: "WCAG 1.1.1 Non-text Content",
		}));
}
