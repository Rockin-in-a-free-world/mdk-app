'use strict'

module.exports = {
  setup: async () => ({
    requests: {
      'fleet.set-power-mode': { params: { deviceId: 'smoke-0' }, body: { mode: 'eco' } },
      'fleet.telemetry': { params: { deviceId: 'smoke-0' } }
    }
  })
}
