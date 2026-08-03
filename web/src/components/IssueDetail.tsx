import type { ReactNode } from "react";

type IssueDetailType = "primary" | "secondary";

type IssueDetailBlockProps = {
  title: string;
  children: ReactNode;
  type?: IssueDetailType;
};

export function IssueDetail({ title, children, type = "primary" }: IssueDetailBlockProps) {
  return (
    <div className={`issue-detail issue-detail--${type}`}>
      <p className="issue-detail__title">{title}</p>
      <div className="issue-detailk__content">{children}</div>
    </div>
  );
}