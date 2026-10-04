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
    hasImplicitLabel(element) ||
    hasAriaLabel ||
    hasLabelledBy ||
    hasTitle
  );
}

function hasImplicitLabel(element: Element) {
  const label = element.closest("label");
  if (!(label instanceof HTMLLabelElement)) {
    return false;
  }
  return label.control === element;
}

const genericAltTexts = new Set(["img", "image", "photo", "picture", "graphic"]);

function isGenericAltText(alt: string) {
  const normalizedAlt = cleanText(alt).toLowerCase().replace(/[.,!?;:]+$/, "");
  return genericAltTexts.has(normalizedAlt);
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
  const fields = Array.from(doc.querySelectorAll(`input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="reset"]), textarea, select`));

  return fields.flatMap<A11yIssue>((field, index) => {
    const ariaLabelledBy = cleanText(field.getAttribute("aria-labelledby"));
    if (hasFormLabel(field) || ariaLabelledBy) {
      return [];
    }

    const placeholder = cleanText(field.getAttribute("placeholder"));
    //  Has placeholder
    if (placeholder) {
      return [
        {
          id: `placeholder-only-label-${index + 1}`,
          ruleId: "PLACEHOLDER_ONLY_LABEL",
          category: "forms",
          severity: "medium",
          title: "Form field uses placeholder as its only label",
          message: "This form field uses placeholder text but does not have a visible label or accessible name.",
          selector: getSelector(field),
          snippet: getSnippet(field),
          suggestion:
            "Add a persistent visible label associated with the form field. Keep the placeholder only as optional hint or example text rather than using it as the field label.",
          wcagRef:
            "WCAG 3.3.2 Labels or Instructions; related to WCAG 1.3.1 Info and Relationships and WCAG 4.1.2 Name, Role, Value"
        }
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
        message: "This form field does not have a visible label or accessible name.",
        selector: getSelector(field),
        snippet: getSnippet(field),
        suggestion:
          "Add a visible label connected with a matching for/id pair, wrap the field inside a label element, or provide an accessible name using aria-label or aria-labelledby.",
        wcagRef:
          "WCAG 3.3.2 Labels or Instructions; WCAG 4.1.2 Name, Role, Value; WCAG 1.3.1 Info and Relationships"
      }
    ];
  });
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

export function checkBrokenLabelReferences(doc: Document): A11yIssue[] {
  const issues: A11yIssue[] = [];

  //  Check "label for=" items
  const labels = Array.from(doc.querySelectorAll("label[for]"));
  labels.forEach((label, index) => {
    const targetId = cleanText(label.getAttribute("for"));
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
        selector: getSelector(label),
        snippet: getSnippet(label),
        suggestion:
          "Update the label for attribute so it matches the id of an existing form control.",
        wcagRef:
          "WCAG 1.3.1 Info and Relationships; WCAG 4.1.2 Name, Role, Value"
      });
    }
  });

  //  Check "aria-labelledby" items
  const labelledElements = Array.from(
    doc.querySelectorAll("[aria-labelledby]")
  );

  labelledElements.forEach((element, index) => {
    const labelledBy = cleanText(
      element.getAttribute("aria-labelledby")
    );
    const ids = labelledBy.split(/\s+/);
    const missingIds = ids.filter(
      (id) => !doc.getElementById(id)
    );

    if (missingIds.length > 0) {
      const formatter = new Intl.ListFormat("en", {
        style: "long",
        type: "conjunction"
      });

      const missingIdText = formatter.format(
        missingIds.map((id) => `"${id}"`)
      );
      
      issues.push({
        id: `broken-aria-reference-${index + 1}`,
        ruleId: "BROKEN_LABEL_REFERENCE",
        category: "forms",
        severity: "medium",
        title: "Broken label reference",
        message: `The aria-labelledby references ${missingIdText}, but the element(s) could not be found.`,
        selector: getSelector(element),
        snippet: getSnippet(element),
        suggestion:
          "Update the aria-labelledby value so every referenced id matches an existing element on the page.",
        wcagRef:
          "WCAG 1.3.1 Info and Relationships; WCAG 4.1.2 Name, Role, Value"
      });
    }
  });

  return issues;
}

export function checkGenericAltText(doc: Document): A11yIssue[] {
  return Array.from(doc.querySelectorAll("img[alt]"))
    .filter((image) => {
      const alt = cleanText(image.getAttribute("alt"));
      if (!alt) {
        return false;
      }
      return isGenericAltText(alt);
    }).map((image, index) => ({
      id: `generic-alt-text-${index + 1}`,
      ruleId: "GENERIC_ALT_TEXT",
      category: "images",
      severity: "low",
      title: "Image alt text may be too generic",
      message: `This image uses generic alt text: "${cleanText(image.getAttribute("alt"))}".`,
      selector: getSelector(image),
      snippet: getSnippet(image),
      suggestion:
        'Replace generic alt text with a concise description of the image purpose or information. If the image is decorative, consider using alt="".',
      wcagRef: "WCAG 1.1.1 Non-text Content"
    }));
}