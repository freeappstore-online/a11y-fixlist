import type { A11yIssue } from "../types";

function getSnippet(element: Element) {
  return element.outerHTML.replace(/\s+/g, " ").slice(0, 180);
}

function getSelector(element: Element) {
  if (element.id) return `#${element.id}`;
  const tag = element.tagName.toLowerCase();
  const className = Array.from(element.classList).slice(0, 2).join(".");

  return className ? `${tag}.${className}` : tag;
}

function cleanText(value: string | null | undefined) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function getImageAltText(element: Element) {
  return cleanText(Array.from(element.querySelectorAll("img"))
      .map((image) => cleanText(image.getAttribute("alt"))).filter(Boolean).join(" "));
}

function getLabelledByText(element: Element) {
  const labelledBy = element.getAttribute("aria-labelledby");
  if (!labelledBy) {  //  Empty aria-labelledby
    return "";
  }

  return cleanText(labelledBy.split(/\s+/)
    .map((id) => {
      const labelElement = element.ownerDocument.getElementById(id);
      return cleanText(labelElement?.textContent);
    }).filter(Boolean).join(" "));
}

function getAccessibleText(element: Element) {
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

function hasFormLabel(element: Element) {
  const id = element.getAttribute("id");
  const hasExplicitLabel = id
    ? Boolean(element.ownerDocument.querySelector(`label[for="${CSS.escape(id)}"]`))
    : false;
  const hasAriaLabel = Boolean(cleanText(element.getAttribute("aria-label")));
  const hasLabelledBy = Boolean(getLabelledByText(element));
  const hasTitle = Boolean(cleanText(element.getAttribute("title")));

  return (
    hasExplicitLabel ||
    hasAriaLabel ||
    hasLabelledBy ||
    hasTitle
  );
}

export function checkButtonNames(doc: Document): A11yIssue[] {
  return Array.from(
      doc.querySelectorAll("button, [role='button'], input[type='button'], input[type='submit'], input[type='reset']")
    ).filter((button) => !getAccessibleText(button))
    .map((button, index) => ({
      id: `button-missing-name-${index + 1}`,
      ruleId: "BUTTON_MISSING_NAME",
      category: "buttons",
      severity: "high",
      title: "Button without accessible text",
      message: "This button does not have visible text or an accessible label.",
      selector: getSelector(button),
      snippet: getSnippet(button),
      suggestion:
        "Add visible button text, or provide an accessible name using aria-label or aria-labelledby.",
      wcagRef: "WCAG 4.1.2 Name, Role, Value"
    }));
}

export function checkDuplicateIds(doc: Document): A11yIssue[] {
  const idElements = Array.from(doc.querySelectorAll("[id]"));
  const idMap = new Map<string, Element[]>();
  const issues: A11yIssue[] = [];

  idElements.forEach((element) => {
    const id = cleanText(element.getAttribute("id"));
    if (!id) {  //  Empty id
      return;
    }

    const existingElements = idMap.get(id) || [];
    existingElements.push(element);
    idMap.set(id, existingElements);
  });

  Array.from(idMap.entries()).forEach(([id, elements], index) => {
    if (elements.length <= 1) { //  id only exists once, no duplication
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
      snippet: getSnippet(firstExistence),
      suggestion:
        "Update the duplicated id values so each id is unique. Duplicate ids can break label relationships, aria-labelledby references, fragment links and scripted behaviour.",
      wcagRef:
        "HTML validation / WCAG Technique H93; related to WCAG 4.1.2 Name, Role, Value and WCAG 1.3.1 Info and Relationships when ID references affect labels or ARIA relationships"
    });
  });

  return issues;
}

export function checkEmptyLinks(doc: Document): A11yIssue[] {
  return Array.from(doc.querySelectorAll("a[href]"))
    .filter((link) => !getAccessibleText(link))
    .map((link, index) => ({
      id: `empty-link-${index + 1}`,
      ruleId: "LINK_EMPTY_NAME",
      category: "links",
      severity: "high",
      title: "Link without accessible text",
      message: "This link does not have visible text or an accessible label.",
      selector: getSelector(link),
      snippet: getSnippet(link),
      suggestion:
        "Add clear link text, or provide an accessible name using aria-label or aria-labelledby.",
      wcagRef: "WCAG 2.4.4 Link Purpose"
    }));
}

export function checkFormLabels(doc: Document): A11yIssue[] {
  return Array.from(doc.querySelectorAll("form input"))
    .filter((input) => !hasFormLabel(input))
    .map((input, index) => ({
      id: `form-field-missing-label-${index + 1}`,
      ruleId: "FORM_FIELD_MISSING_LABEL",
      category: "forms",
      severity: "high",
      title: "Form field missing label",
      message: "This form field does not have a visible label or accessible name.",
      selector: getSelector(input),
      snippet: getSnippet(input),
      suggestion:
        'Add a visible label connected with a matching for/id pair, wrap the field inside a label element, or provide an accessible name using aria-label or aria-labelledby.',
      wcagRef: "WCAG 3.3.2 Labels or Instructions; WCAG 4.1.2 Name, Role, Value; WCAG 1.3.1 Info and Relationships"
    }));
}

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
        selector: getSelector(heading),
        snippet: getSnippet(heading),
        suggestion:
          "Review the heading structure and use heading levels in a logical order unless the structure is intentional.",
        wcagRef:
          "WCAG 1.3.1 Info and Relationships; WCAG 2.4.6 Headings and Labels"
      });
    }
    previousLevel = currentLevel;
  });

  return issues;
}

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
      selector: getSelector(image),
      snippet: getSnippet(image),
      suggestion:
        'Add meaningful alt text if the image communicates content, or use alt="" if the image is decorative.',
      wcagRef: "WCAG 1.1.1 Non-text Content"
    }));
}