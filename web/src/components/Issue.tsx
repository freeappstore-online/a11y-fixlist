import type { A11yIssue } from "../types";
import { getSeverityLabel } from "../services/report";
import { Button } from "./Button";
import { Label } from "./Label";
import { IssueDetail } from "./IssueDetail";

type IssueProps = {
  issue: A11yIssue;
  jumpToIssue: (issue: A11yIssue) => void;
};

export function Issue({ issue, jumpToIssue }: IssueProps) {
  return (
    <article className="card-background p-5">
      <div className="mb-3 flex items-center gap-2">
        <Label type={issue.severity}>
          {getSeverityLabel(issue.severity)}
        </Label>
        <Label type={"category"}>
          {issue.category}
        </Label>
      </div>
      <h2 className="bold">{issue.title}</h2>
      <p>{issue.message}</p>
      <IssueDetail title="Element" type={"secondary"}>
        <p>{issue.selector}</p>
        <pre className="issue-snippet">
          <code>{issue.snippet}</code>
        </pre>
      </IssueDetail>
      <IssueDetail title="Suggested fix">
        <p>{issue.suggestion}</p>
      </IssueDetail>
      <Button btnType="tertiary" onClick={() => jumpToIssue(issue)}>
        View in HTML
      </Button>
    </article>
  );
}