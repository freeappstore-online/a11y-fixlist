import { describe, expect, it } from "vitest";
import { scanHtml } from "./scanner";

// jsdom may not provide CSS.escape in every version.
if (typeof globalThis.CSS === "undefined" || !globalThis.CSS.escape) {
	Object.defineProperty(globalThis, "CSS", {
		value: {
			escape: (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "\\$&"),
		},
		configurable: true,
	});
}

function hasRule(html: string, ruleId: string) {
	return scanHtml(html).some((issue) => issue.ruleId === ruleId);
}

describe("image rules", () => {
	it("detects a missing alt attribute", () => {
		expect(hasRule(`<img src="team.jpg">`, "IMG_MISSING_ALT")).toBe(true);
	});

	it("accepts decorative empty alt text", () => {
		const issues = scanHtml(`<img src="divider.png" alt="">`);

		expect(
			issues.some(
				(issue) =>
					issue.ruleId === "IMG_MISSING_ALT" ||
					issue.ruleId === "GENERIC_ALT_TEXT",
			),
		).toBe(false);
	});

	it("detects generic alt text", () => {
		expect(
			hasRule(`<img src="team.jpg" alt="image">`, "GENERIC_ALT_TEXT"),
		).toBe(true);
	});

	it("accepts meaningful alt text", () => {
		expect(
			hasRule(
				`<img src="team.jpg" alt="Customer support team">`,
				"GENERIC_ALT_TEXT",
			),
		).toBe(false);
	});
});

describe("link rules", () => {
	it("detects a link without accessible text", () => {
		expect(hasRule(`<a href="/about"></a>`, "LINK_EMPTY_NAME")).toBe(true);
	});

	it("accepts a link with visible text", () => {
		expect(hasRule(`<a href="/about">About us</a>`, "LINK_EMPTY_NAME")).toBe(
			false,
		);
	});

	it("accepts a link with aria-label", () => {
		expect(
			hasRule(`<a href="/search" aria-label="Search"></a>`, "LINK_EMPTY_NAME"),
		).toBe(false);
	});
});

describe("button rules", () => {
	it("detects a button without accessible text", () => {
		expect(hasRule(`<button></button>`, "BUTTON_MISSING_NAME")).toBe(true);
	});

	it("accepts a button with visible text", () => {
		expect(hasRule(`<button>Save</button>`, "BUTTON_MISSING_NAME")).toBe(false);
	});

	it("accepts a button with aria-label", () => {
		expect(
			hasRule(`<button aria-label="Close"></button>`, "BUTTON_MISSING_NAME"),
		).toBe(false);
	});
});

describe("form label rules", () => {
	it("detects a form field without a label", () => {
		expect(hasRule(`<input type="email">`, "FORM_FIELD_MISSING_LABEL")).toBe(
			true,
		);
	});

	it("reports placeholder-only label instead of missing label", () => {
		const issues = scanHtml(`<input type="email" placeholder="Email address">`);

		expect(
			issues.some((issue) => issue.ruleId === "PLACEHOLDER_ONLY_LABEL"),
		).toBe(true);

		expect(
			issues.some((issue) => issue.ruleId === "FORM_FIELD_MISSING_LABEL"),
		).toBe(false);
	});

	it("accepts an explicit label", () => {
		const issues = scanHtml(`
      <label for="email">Email</label>
      <input id="email" type="email">
    `);

		expect(
			issues.some((issue) => issue.ruleId === "FORM_FIELD_MISSING_LABEL"),
		).toBe(false);
	});

	it("accepts an implicit label", () => {
		const issues = scanHtml(`
      <label>
        Email
        <input type="email">
      </label>
    `);

		expect(
			issues.some((issue) => issue.ruleId === "FORM_FIELD_MISSING_LABEL"),
		).toBe(false);
	});
});

describe("label reference rules", () => {
	it("detects a broken label for reference", () => {
		const issues = scanHtml(`
      <label for="email">Email</label>
      <input id="user-email" type="email">
    `);

		expect(
			issues.some((issue) => issue.ruleId === "BROKEN_LABEL_REFERENCE"),
		).toBe(true);

		expect(
			issues.some((issue) => issue.ruleId === "FORM_FIELD_MISSING_LABEL"),
		).toBe(true);
	});

	it("detects broken aria-labelledby without duplicate missing-label issue", () => {
		const issues = scanHtml(`
      <input
        type="email"
        aria-labelledby="missing-label"
      >
    `);

		expect(
			issues.some((issue) => issue.ruleId === "BROKEN_LABEL_REFERENCE"),
		).toBe(true);

		expect(
			issues.some((issue) => issue.ruleId === "FORM_FIELD_MISSING_LABEL"),
		).toBe(false);
	});

	it("accepts a valid aria-labelledby reference", () => {
		const issues = scanHtml(`
      <span id="email-label">Email</span>
      <input
        type="email"
        aria-labelledby="email-label"
      >
    `);

		expect(
			issues.some(
				(issue) =>
					issue.ruleId === "BROKEN_LABEL_REFERENCE" ||
					issue.ruleId === "FORM_FIELD_MISSING_LABEL",
			),
		).toBe(false);
	});
});

describe("heading rules", () => {
	it("detects a skipped heading level", () => {
		expect(
			hasRule(`<h1>Title</h1><h3>Section</h3>`, "HEADING_SKIPPED_LEVEL"),
		).toBe(true);
	});

	it("accepts sequential heading levels", () => {
		expect(
			hasRule(`<h1>Title</h1><h2>Section</h2>`, "HEADING_SKIPPED_LEVEL"),
		).toBe(false);
	});
});

describe("duplicate id rules", () => {
	it("detects duplicate ids", () => {
		expect(
			hasRule(
				`
          <div id="content"></div>
          <section id="content"></section>
        `,
				"DUPLICATE_ID",
			),
		).toBe(true);
	});

	it("accepts unique ids", () => {
		expect(
			hasRule(
				`
          <div id="content"></div>
          <section id="footer"></section>
        `,
				"DUPLICATE_ID",
			),
		).toBe(false);
	});
});

describe("scanner", () => {
	it("sorts higher severity issues first", () => {
		const issues = scanHtml(`
      <button></button>
      <img src="photo.jpg">
      <h1>Title</h1>
      <h3>Section</h3>
    `);

		const rank = {
			high: 3,
			medium: 2,
			low: 1,
		};

		for (let index = 1; index < issues.length; index++) {
			expect(rank[issues[index - 1].severity]).toBeGreaterThanOrEqual(
				rank[issues[index].severity],
			);
		}
	});
});
