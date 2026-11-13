'use strict'

const { test } = require('node:test')
const assert = require('node:assert')

const setPowerMode = require('../plugin/controllers/set-power-mode')

// `req.mdk` is the request's Kernel client, so the test passes its own.
const request = (body, sendCommand) => ({ params: { deviceId: 'rig-0' }, query: {}, headers: {}, body, mdk: { sendCommand } })

test('sends the mode to the device and returns the queued command', async () => {
  let sent
  const sendCommand = async (...args) => { sent = args; return { commandId: 'c1', status: 'QUEUED' } }
  const result = await setPowerMode(request({ mode: 'eco' }, sendCommand))
  assert.deepStrictEqual(sent, ['rig-0', 'setPowerMode', { mode: 'eco' }])
  assert.deepStrictEqual(result, { deviceId: 'rig-0', mode: 'eco', commandId: 'c1', status: 'QUEUED' })
})

test('refuses a mode outside the list before calling the Kernel', async () => {
  const sendCommand = async () => assert.fail('the Kernel must not be called')
  await assert.rejects(setPowerMode(request({ mode: 'turbo' }, sendCommand)), /ERR_INVALID_POWER_MODE/)
})

test('raises a rejected command with the status the caller should see', async () => {
  const sendCommand = async () => ({ status: 'REJECTED', error: 'ERR_DEVICE_NOT_FOUND' })
  await assert.rejects(
    setPowerMode(request({ mode: 'eco' }, sendCommand)),
    (err) => err.message === 'ERR_DEVICE_NOT_FOUND' && err.statusCode === 404
  )
})
