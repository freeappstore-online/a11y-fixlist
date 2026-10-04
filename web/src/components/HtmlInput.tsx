import { Button } from "./Button";

type HtmlInputProps = {
  htmlInput: string;
  onHtmlInputChange: (value: string) => void;
  onScan: () => void;
  onFillSample: () => void;
  onCopyReport: () => void;
  onDownloadReport: () => void;
};

export function HtmlInput({
  htmlInput,
  onHtmlInputChange,
  onScan,
  onFillSample,
  onCopyReport,
  onDownloadReport
}: HtmlInputProps) {
  return (
    <section>
      <h2>HTML input</h2>
      <p>Paste HTML below for scanning.</p>
      <textarea
        id="html-input"
        value={htmlInput}
        onChange={(event) => onHtmlInputChange(event.target.value)}
        rows={10}
        spellCheck={false}
      />
      <div className="mb-4 flex gap-2 flex-wrap">
        <Button onClick={onScan} mobileWidth="full">
          Scan pasted HTML
        </Button>
        <Button btnType="tertiary" mobileWidth="full" onClick={onFillSample}>
          Use sample HTML
        </Button>
      </div>
      <div className="my-2 flex gap-2 flex-wrap">
        <h2>Scan result</h2>
        <Button className="copy-button ml-auto" mobileWidth="full" onClick={onCopyReport}>
          Copy Markdown Report
        </Button>
        <Button className="copy-button" btnType="secondary" mobileWidth="full" onClick={onDownloadReport}>
          Download Markdown Report
        </Button>
      </div>
    </section>
  );
}