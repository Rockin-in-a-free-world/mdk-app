'use strict'

const POWER_MODES = ['eco', 'normal', 'high']

module.exports = async function setPowerMode (req) {
  const { deviceId } = req.params
  const mode = req.body && req.body.mode
  if (!POWER_MODES.includes(mode)) throw new Error('ERR_INVALID_POWER_MODE')

  // Sent as the signed-in user: the Kernel checks their rules as well as the app's.
  const result = await req.mdk.sendCommand(deviceId, 'setPowerMode', { mode })

  // The Kernel answers a command it refuses with status REJECTED instead of throwing.
  if (result.status === 'REJECTED') {
    const code = String(result.error || 'ERR_COMMAND_REJECTED')
    throw Object.assign(new Error(code), { statusCode: code.startsWith('ERR_DEVICE_NOT_FOUND') ? 404 : 422 })
  }

  return { deviceId, mode, commandId: result.commandId, status: result.status }
}
