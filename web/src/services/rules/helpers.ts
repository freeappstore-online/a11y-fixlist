export function getSnippet(element: Element) {
	return element.outerHTML.replace(/\s+/g, " ").slice(0, 180);
}

export function getSelector(element: Element) {
	if (element.id) return `#${element.id}`;
	const tag = element.tagName.toLowerCase();
	const className = Array.from(element.classList).slice(0, 2).join(".");

	return className ? `${tag}.${className}` : tag;
}

export function cleanText(value: string | null | undefined) {
	return (value || "").replace(/\s+/g, " ").trim();
}

export function getImageAltText(element: Element) {
	return cleanText(
		Array.from(element.querySelectorAll("img"))
			.map((image) => cleanText(image.getAttribute("alt")))
			.filter(Boolean)
			.join(" "),
	);
}

export function getLabelledByText(element: Element) {
	const labelledBy = element.getAttribute("aria-labelledby");
	if (!labelledBy) {
		//  Empty aria-labelledby
		return "";
	}

	return cleanText(
		labelledBy
			.split(/\s+/)
			.map((id) => {
				const labelElement = element.ownerDocument.getElementById(id);
				return cleanText(labelElement?.textContent);
			})
			.filter(Boolean)
			.join(" "),
	);
}

export function getAccessibleText(element: Element) {
	const ariaLabel = cleanText(element.getAttribute("aria-label"));
	if (ariaLabel) return ariaLabel;

	const labelledByText = getLabelledByText(element);
	if (labelledByText) return labelledByText;

	const title = cleanText(element.getAttribute("title"));
	if (title) return title;

	const value = cleanText(element.getAttribute("value"));
	if (value) return value;

	const text = cleanText(element.textContent);
	if (text) return text;

	const imageAltText = getImageAltText(element);
	if (imageAltText) return imageAltText;

	return "";
}

export function hasFormLabel(element: Element) {
	const id = element.getAttribute("id");
	const hasExplicitLabel = id
		? Boolean(
				element.ownerDocument.querySelector(`label[for="${CSS.escape(id)}"]`),
			)
		: false;
	const hasAriaLabel = Boolean(cleanText(element.getAttribute("aria-label")));
	const hasLabelledBy = Boolean(getLabelledByText(element));
	const hasTitle = Boolean(cleanText(element.getAttribute("title")));

	return (
		hasExplicitLabel ||
		hasImplicitLabel(element) ||
		hasAriaLabel ||
		hasLabelledBy ||
		hasTitle
	);
}

export function hasImplicitLabel(element: Element) {
	const label = element.closest("label");
	if (!(label instanceof HTMLLabelElement)) {
		return false;
	}
	return label.control === element;
}

const genericAltTexts = new Set([
	"img",
	"image",
	"photo",
	"picture",
	"graphic",
]);

export function isGenericAltText(alt: string) {
	const normalizedAlt = cleanText(alt)
		.toLowerCase()
		.replace(/[.,!?;:]+$/, "");
	return genericAltTexts.has(normalizedAlt);
}
