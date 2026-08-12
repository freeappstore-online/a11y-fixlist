import type { ExtractedPageData } from "../types";

function cleanText(value: string | null | undefined) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function getSnippet(element: Element) {
  return element.outerHTML.replace(/\s+/g, " ").slice(0, 180);
}

export function extractPageDataFromHtml(html: string): ExtractedPageData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  return {
    title: doc.title || "Sample HTML",

    headings: Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((heading) => ({
      level: Number(heading.tagName.substring(1)),
      text: cleanText(heading.textContent)
    })),

    images: Array.from(doc.querySelectorAll("img")).map((image) => ({
      src: image.getAttribute("src"),
      alt: image.getAttribute("alt")
    })),

    links: Array.from(doc.querySelectorAll("a[href]")).map((link) => ({
      href: link.getAttribute("href"),
      text: cleanText(link.textContent)
    })),

    buttons: Array.from(doc.querySelectorAll("button, [role='button']")).map((button) => ({
      text: cleanText(button.textContent),
      ariaLabel: button.getAttribute("aria-label"),
      snippet: getSnippet(button)
    })),

    formFields: Array.from(doc.querySelectorAll("input, select, textarea")).map((field) => ({
      tag: field.tagName.toLowerCase(),
      type: field.getAttribute("type"),
      id: field.getAttribute("id"),
      name: field.getAttribute("name")
    }))
  };
}