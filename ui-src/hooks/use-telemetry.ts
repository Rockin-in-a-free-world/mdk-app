// Hook layer: polls one device's live metrics and shapes them for the panel.
import { toQueryView, useMdkApp, useQuery } from '@tetherto/mdk-react-adapter'

import { fetchTelemetry, telemetryQueryKey } from '../data/telemetry'

export type TelemetryView =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; numbers: Array<{ label: string; value: number }>; mode?: string }

export const useTelemetry = (deviceId: string): TelemetryView => {
  const { apiUrl } = useMdkApp()
  const url = apiUrl(`/api/fleet/devices/${deviceId}/telemetry`)
  const query = useQuery({
    queryKey: telemetryQueryKey(url),
    queryFn: () => fetchTelemetry(url),
    retry: false,
    refetchInterval: 5000, // ponytail: fixed poll; use the Worker's telemetryPollIntervalMs if it matters
  })
  const view = toQueryView(query, url)
  if (view.status !== 'ready') return view
  const metrics = view.data.metrics.metrics
  return {
    status: 'ready',
    numbers: Object.entries(metrics).flatMap(([label, value]) => (typeof value === 'number' ? [{ label, value }] : [])),
    mode: typeof metrics.power_mode === 'string' ? metrics.power_mode : undefined,
  }
}
