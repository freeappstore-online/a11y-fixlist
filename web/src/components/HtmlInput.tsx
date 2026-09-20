import { Button } from "./Button";

type HtmlInputProps = {
  htmlInput: string;
  onHtmlInputChange: (value: string) => void;
  onScan: () => void;
  onFillSample: () => void;
  onCopyReport: () => void;
};

export function HtmlInput({
  htmlInput,
  onHtmlInputChange,
  onScan,
  onFillSample,
  onCopyReport
}: HtmlInputProps) {
  return (
    <section>
      <h2>HTML input</h2>
      <p>Paste HTML below for scanning.</p>
      <textarea
        className="html-input"
        value={htmlInput}
        onChange={(event) => onHtmlInputChange(event.target.value)}
        rows={10}
        spellCheck={false}
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <Button onClick={onScan} mobileWidth="full">
          Scan pasted HTML
        </Button>
        <Button btnType="tertiary" mobileWidth="full" onClick={onFillSample}>
          Use sample HTML
        </Button>
        <Button className="copy-button" btnType="secondary" mobileWidth="full" onClick={onCopyReport}>
          Copy Markdown Report
        </Button>
      </div>
    </section>
  );
}