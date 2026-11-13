'use strict'

// Read as the signed-in user: the Kernel routes the pull to the Worker that owns the device.
module.exports = async function telemetry (req) {
  const { deviceId } = req.params
  return { deviceId, metrics: await req.mdk.pullTelemetry(deviceId, 'metrics') }
}
