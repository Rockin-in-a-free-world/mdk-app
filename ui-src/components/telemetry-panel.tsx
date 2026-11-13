// Component layer: renders one device's live metrics. No fetching.
import { ErrorCard, Loader, SingleStatCard, Typography } from '@tetherto/mdk-react-devkit'

import type { TelemetryView } from '../hooks/use-telemetry'

export const TelemetryPanel = ({ deviceId, view }: { deviceId: string; view: TelemetryView }) => (
  <div className="fleet-device">
    <Typography variant="secondary">
      {deviceId}
      {view.status === 'ready' && view.mode ? ` (${view.mode})` : ''}
    </Typography>
    {view.status === 'loading' && <Loader />}
    {view.status === 'error' && <ErrorCard title={`Could not read ${deviceId}`} error={view.message} />}
    {view.status === 'ready' && (
      <div className="fleet-summary">
        {view.numbers.map((n) => (
          <SingleStatCard key={n.label} name={n.label} value={n.value} />
        ))}
      </div>
    )}
  </div>
)
