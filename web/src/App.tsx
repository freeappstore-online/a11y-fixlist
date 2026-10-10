import { initApp } from '@freeappstore/sdk'
import { Shell, BuildInfo } from '@freeappstore/sdk/ui'
import { ExtractedDataPanel, Header, SummaryCards, IssueList, HtmlInput } from './components';
import { createMarkdownReport, extractPageDataFromHtml, sampleHtml, scanHtml } from "./services";
import { useState, useRef } from "react";
import type { A11yIssue, ExtractedPageData } from './types';

const fas = initApp({ appId: 'a11y-fixlist' })

export default function App() {
  const [extractedData, setExtractedData] = useState<ExtractedPageData | null>(null);
  const [issues, setIssues] = useState<A11yIssue[]>([]);
  const [htmlInput, setHtmlInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function findSnippetPosition(html: string, snippet: string): { start: number; end: number } | null {
    const pattern = snippet.trim().split(/\s+/).map(escapeRegExp).join("\\s+");
    const match = new RegExp(pattern, "i").exec(html);
    if (!match) {
      return null;
    }

    return {
      start: match.index,
      end: match.index + match[0].length
    };
  }

  function jumpToIssue(issue: A11yIssue) {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    //  Find and select the element
    const position = findSnippetPosition(htmlInput, issue.snippet);
    if (!position) {
      return;
    }
    textarea.setSelectionRange(position.start,position.end);

    //  Scroll the textarea to the element
    textarea.scrollTop = (position.start / htmlInput.length) * (textarea.scrollHeight - textarea.clientHeight);

    //  Scroll page to textarea
    textarea.scrollIntoView({behavior: "smooth", block: "center"});
    textarea.focus();
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
          textareaRef={textareaRef}
        />
        <ExtractedDataPanel data={extractedData} />
        <SummaryCards issues={issues} />
        <IssueList issues={issues} jumpToIssue={jumpToIssue}/>
      </div>
      <BuildInfo />
    </Shell>
  )
}
