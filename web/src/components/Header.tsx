import { Button } from "./Button";

type HeaderProps = {
  onRunDemoScan: () => void;
  onCopyReport: () => void;
};

export function Header({ onRunDemoScan, onCopyReport }: HeaderProps) {
  return (
    <header className="py-6">
      <h1 className="bold">A11y FixList</h1>
      <p>
        A lightweight developer-friendly accessibility checklist that turns scanned page issues into a clear fix list.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={onRunDemoScan}>
          Run Demo Scan
        </Button>
        <Button btnType={"secondary"} onClick={onCopyReport}>
          Copy Markdown Report
        </Button>
      </div>
    </header>
  );
}