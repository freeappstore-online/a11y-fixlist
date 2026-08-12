import type { ExtractedPageData } from "../types";

type ExtractedDataPanelProps = {
  data: ExtractedPageData | null;
};

export function ExtractedDataPanel({ data }: ExtractedDataPanelProps) {
  if (!data) {
    return (
      <section className="data-panel">
        <h2 className="bold">Extracted page data</h2>
        <p>
          Run the demo extraction to collect headings, images, links, buttons and form fields from sample HTML.
        </p>
      </section>
    );
  }

  return (
    <section className="data-panel">
      <h2 className="bold">Extracted page data</h2>

      <div className="mb-3 grid gap-3 md:grid-cols-5">
        <div>Headings: {data.headings.length}</div>
        <div>Images: {data.images.length}</div>
        <div>Links: {data.links.length}</div>
        <div>Buttons: {data.buttons.length}</div>
        <div>Fields: {data.formFields.length}</div>
      </div>

      <div className="my-3">
        <h3 className="bold">Headings</h3>
        <ul>
          {data.headings.map((heading, index) => (
            <li key={`${heading.level}-${index}`}>
              H{heading.level}: {heading.text || "(empty heading)"}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3">
        <h3 className="bold">Images</h3>
        <ul>
          {data.images.map((image, index) => (
            <li key={`${image.src}-${index}`}>
              src: {image.src || "(missing src)"} · alt: {image.alt ?? "(missing alt attribute)"}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}