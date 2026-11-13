// Data layer: the telemetry route's contract, typed from plugin/types.d.ts.
import { mdkFetch } from '@tetherto/mdk-ui-foundation'

import type { Telemetry } from '../../plugin/types'

export type { Telemetry }

export const telemetryQueryKey = (url: string) => ['fleet', 'telemetry', url] as const

export const fetchTelemetry = (url: string): Promise<Telemetry> => mdkFetch<Telemetry>(url)
