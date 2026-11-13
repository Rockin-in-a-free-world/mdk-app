'use strict'

const { test } = require('node:test')
const assert = require('node:assert')

// The app runtime provides the Kernel client; a stand-in lets the controller run without a stack.
const client = require.resolve('../plugin/lib/client')
let listWorkers
require.cache[client] = { id: client, filename: client, loaded: true, exports: { listWorkers: () => listWorkers() } }
const summary = require('../plugin/controllers/summary')

const req = { params: {}, query: {}, headers: {} }

test('summary counts the workers and their devices', async () => {
  listWorkers = async () => ({ workers: [{ workerId: 'w1', deviceIds: ['a', 'b'] }, { workerId: 'w2' }] })
  assert.deepStrictEqual(await summary(req), {
    ok: true,
    kernelConnected: true,
    workerCount: 2,
    deviceCount: 2,
    workers: [{ workerId: 'w1', devices: 2 }, { workerId: 'w2', devices: 0 }]
  })
})

test('summary stays callable while the Kernel is unreachable', async () => {
  listWorkers = async () => { throw Object.assign(new Error('unavailable'), { code: 'ERR_MDK_CLIENT_UNAVAILABLE' }) }
  assert.strictEqual((await summary(req)).kernelConnected, false)
})
