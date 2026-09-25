import { initApp } from '@freeappstore/sdk'
import { Shell, BuildInfo } from '@freeappstore/sdk/ui'
import { ExtractedDataPanel, Header, SummaryCards, IssueList, HtmlInput } from './components';
import { createMarkdownReport, extractPageDataFromHtml, sampleHtml, scanHtml } from "./services";
import { useState } from "react";
import type { A11yIssue, ExtractedPageData } from './types';

const fas = initApp({ appId: 'a11y-fixlist' })

export default function App() {
  const [extractedData, setExtractedData] = useState<ExtractedPageData | null>(null);
  const [issues, setIssues] = useState<A11yIssue[]>([]);
  const [htmlInput, setHtmlInput] = useState("");

  function doHtmlScan() {
    if (!htmlInput.trim()) {
      alert("Please paste HTML.");
      return;
    }

    const data = extractPageDataFromHtml(htmlInput);
    const scanResults = scanHtml(htmlInput);

    setExtractedData(data);
    setIssues(scanResults);
  }

  function doFillSample() {
    setHtmlInput(sampleHtml);
    setExtractedData(null);
    setIssues([]);
  }

  async function doCopyReport() {
    if (issues.length === 0) {
      alert("No data found. Please run the demo scan.");
      return;
    }

    const report = createMarkdownReport(issues);
    await navigator.clipboard.writeText(report);
    alert("Markdown report copied!");
  }

  function downloadReport() {
    const report = createMarkdownReport(issues);
    const blob = new Blob([report], {
      type: "text/markdown;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "a11y-fixlist-report.md";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Shell app={fas} appName="a11y-fixlist">
      <div className="max-w-4xl app-container">
        <Header />
        <HtmlInput
          htmlInput={htmlInput}
          onHtmlInputChange={setHtmlInput}
          onScan={doHtmlScan}
          onFillSample={doFillSample}
          onCopyReport={doCopyReport}
          onDownloadReport={downloadReport}
        />
        <ExtractedDataPanel data={extractedData} />
        <SummaryCards issues={issues} />
        <IssueList issues={issues} />
      </div>
      <BuildInfo />
    </Shell>
  )
}
