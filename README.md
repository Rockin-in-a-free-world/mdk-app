# Fleet

Fleet overview and power control for MDK sites, as an MDK app: a read route that lists the Workers the Kernel knows, a write route that sets one
device's power mode as the signed-in user, and an overview page with a Home panel for the MDK dashboard.

Install it into a stack from GitHub:

```bash
mdk add app github:Rockin-in-a-free-world/mdk-app#v0.1.0
```

The routes then answer under `/apps/<name>/`, where `<name>` is the instance name the operator chose (`fleet` by default), and the dashboard lists the
overview page under the app.

## Setup requirements

- Node.js `>=24` and npm 11 on the machine that runs the stack
- An MDK stack at 0.13.1 or later with sign-in enabled (`spec.rbac`), because no route is open
- A Worker whose devices accept a `setPowerMode` command with `{ mode }`, for the write route to reach

## Supported capabilities

| Route                 | Method | Path                                   | Does                                                                                  |
| --------------------- | ------ | -------------------------------------- | ------------------------------------------------------------------------------------- |
| `fleet.summary`       | GET    | `/api/fleet/summary`                   | Lists the Workers the Kernel knows with a device count each, and answers while the Kernel is down |
| `fleet.set-power-mode`| POST   | `/api/fleet/devices/{deviceId}/power-mode` | Sends `setPowerMode` with `{ "mode": "eco" \| "normal" \| "high" }` to one device as the signed-in user |

The write route answers the Kernel's acceptance (`QUEUED`), not the command's outcome. A refused command answers `404` for an unknown device and `422`
otherwise, with the Kernel's `ERR_*` code as the message.

## Configuration

The app takes no configuration. Leave `config: {}` on its `spec.apps` entry.

## Permissions

`mdk-app.yaml` requests this Kernel access for the app's service account, `app:<name>`, and `mdk add app` writes it as the role `app-<name>`:

| Resource  | Verbs   | Used by                                                   |
| --------- | ------- | --------------------------------------------------------- |
| `workers` | `list`  | `fleet.summary`                                           |
| `devices` | `write` | `fleet.set-power-mode`, which runs as the signed-in user |

The write route runs as the signed-in user as well as the app, so that user also needs a `spec.rbac` rule granting `devices: write` on the device.

## Release information

- `package.json` and `mdk-app.yaml` carry the same `version`, and each release is a `v<version>` tag on `main`
- A release that changes `permissions` says so in its release notes, because `mdk add app` stops for the operator on changed permissions
- 0.1.0 is the first release

## Develop

```bash
npm test                                     # controller unit tests
npm run lint                                 # oxlint over plugin/, test/ and ui-src/
npm run typecheck                            # controllers and UI against plugin/types.d.ts
npm run build:ui                             # rebuild ui/ after editing ui-src/, then commit ui/
mdk validate app --path . --smoke --strict   # the listing gate, with the samples in smoke.config.js
```
