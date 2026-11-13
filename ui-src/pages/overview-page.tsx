// Page: thin glue — read the hook, hand its output to the component.
import { Typography } from '@tetherto/mdk-react-devkit'

import { SummaryPanel } from '../components/summary-panel'
import { TelemetryPanel } from '../components/telemetry-panel'
import { useSummary } from '../hooks/use-summary'
import { useTelemetry } from '../hooks/use-telemetry'

/** Live metrics for one device, polled by its hook. */
const DeviceTelemetry = ({ deviceId }: { deviceId: string }) => (
  <TelemetryPanel deviceId={deviceId} view={useTelemetry(deviceId)} />
)

export const OverviewPage = () => {
  const summary = useSummary()
  return (
    <section className="fleet-page">
      <Typography variant="heading1">fleet</Typography>
      <SummaryPanel view={summary} />
      {summary.status === 'ready' && summary.deviceIds.map((id) => <DeviceTelemetry key={id} deviceId={id} />)}
    </section>
  )
}

/** The same summary as a card on the dashboard's Home. */
export const SummaryHomePanel = () => <SummaryPanel view={useSummary()} />
