import { initApp } from '@freeappstore/sdk'
import { Shell, BuildInfo } from '@freeappstore/sdk/ui'
import { Header, SummaryCards, IssueList } from './components';
import { mockIssues } from "./services";

const fas = initApp({ appId: 'a11y-fixlist' })

export default function App() {
  return (
    <Shell app={fas} appName="a11y-fixlist">
      <div className="mx-auto max-w-4xl">
        <Header />
        <SummaryCards issues={mockIssues} />
        <IssueList issues={mockIssues} />
      </div>
      <BuildInfo />
    </Shell>
  )
}
