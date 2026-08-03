import type { A11yIssue } from "../types";

export const mockIssues: A11yIssue[] = [
  {
    id: "1",
    category: "images",
    severity: "medium",
    title: "Missing alternative text",
    message: "An image is missing an alt attribute.",
    selector: "img.banner",
    snippet: '<img class="banner" src="/banner.jpg">',
    suggestion: 'Add meaningful alternative text that describes the image, or use alt="" if the image is purely decorative.',
  },
  {
    id: "2",
    category: "forms",
    severity: "high",
    title: "Missing form label",
    message: "A form input does not appear to have an associated label.",
    selector: 'input[name="email"]',
    snippet: '<input type="email" name="email" placeholder="Email">',
    suggestion: 'Add a visible <label for="email">, wrap the input in a label, or provide aria-label / aria-labelledby where appropriate.',
  },
  {
    id: "3",
    category: "links",
    severity: "high",
    title: "Empty link",
    message: "A link does not appear to contain visible text or an accessible label.",
    selector: "a.contact-us",
    snippet: '<a class="contact-us" href="/contact"></a>',
    suggestion: "Add clear link text, aria-label, aria-labelledby, or meaningful image alt text inside the link.",
  },
  {
    id: "4",
    category: "contrast",
    severity: "high",
    title: "Very low contrast",
    message: "Text have very low contrast against its background.",
    selector: ".form-title",
    snippet: '<p class="form-title">Please enter your details below.</p>',
    suggestion: "Increase the contrast between the text colour and background colour.",
  }
];