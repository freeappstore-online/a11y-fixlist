import { initApp } from '@freeappstore/sdk'
import { Shell, BuildInfo } from '@freeappstore/sdk/ui'
import { ExtractedDataPanel, Header, SummaryCards, IssueList } from './components';
import { createMarkdownReport, extractPageDataFromHtml, sampleHtml, scanHtml } from "./services";
import { useState } from "react";
import type { A11yIssue, ExtractedPageData } from './types';

const fas = initApp({ appId: 'a11y-fixlist' })

export default function App() {
  const [extractedData, setExtractedData] = useState<ExtractedPageData | null>(null);
  const [issues, setIssues] = useState<A11yIssue[]>([]);

  function doDemoScan() {
    const data = extractPageDataFromHtml(sampleHtml);
    const scanResults = scanHtml(sampleHtml);

    setExtractedData(data);
    setIssues(scanResults);
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

  return (
    <Shell app={fas} appName="a11y-fixlist">
      <div className="mx-auto max-w-4xl px-5">
        <Header onRunDemoScan={doDemoScan} onCopyReport={doCopyReport}/>
        <ExtractedDataPanel data={extractedData} />
        <SummaryCards issues={issues} />
        <IssueList issues={issues} />
      </div>
      <BuildInfo />
    </Shell>
  )
}
