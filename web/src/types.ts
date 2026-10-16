export type Severity = "high" | "medium" | "low";

export type A11yIssue = {
	id: string;
	ruleId: string;
	category:
		| "images"
		| "links"
		| "buttons"
		| "forms"
		| "headings"
		| "structure"
		| "contrast";
	severity: Severity;
	title: string;
	message: string;
	selector: string;
	snippet: string;
	suggestion: string;
	wcagRef?: string;
};

export type ExtractedHeading = {
	id: string;
	level: number;
	text: string;
};

export type ExtractedImage = {
	id: string;
	src: string | null;
	alt: string | null;
};

export type ExtractedLink = {
	href: string | null;
	text: string;
};

export type ExtractedButton = {
	text: string;
	ariaLabel: string | null;
	snippet: string;
};

export type ExtractedFormField = {
	tag: string;
	type: string | null;
	id: string | null;
	name: string | null;
};

export type ExtractedPageData = {
	title: string;
	headings: ExtractedHeading[];
	images: ExtractedImage[];
	links: ExtractedLink[];
	buttons: ExtractedButton[];
	formFields: ExtractedFormField[];
};
