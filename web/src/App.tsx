import { initApp } from '@freeappstore/sdk'
import { Shell, BuildInfo } from '@freeappstore/sdk/ui'
import { ExtractedDataPanel, Header, SummaryCards, IssueList } from './components';
import { createMarkdownReport, extractPageDataFromHtml, mockIssues, sampleHtml } from "./services";
import { useState } from "react";
import type { ExtractedPageData } from './types';

const fas = initApp({ appId: 'a11y-fixlist' })

export default function App() {
  const [extractedData, setExtractedData ] = useState<ExtractedPageData | null>(null);

  function doDemoScan() {
    const data = extractPageDataFromHtml(sampleHtml);
    setExtractedData(data);
  }

  async function doCopyReport() {
    const report = createMarkdownReport(mockIssues);
    await navigator.clipboard.writeText(report);
    alert("Markdown report copied!");
  }

  return (
    <Shell app={fas} appName="a11y-fixlist">
      <div className="mx-auto max-w-4xl">
        <Header onRunDemoScan={doDemoScan} onCopyReport={doCopyReport}/>
        <ExtractedDataPanel data={extractedData} />
        <SummaryCards issues={mockIssues} />
        <IssueList issues={mockIssues} />
      </div>
      <BuildInfo />
    </Shell>
  )
}
