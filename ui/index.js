import { useMdkApp as u, useQuery as c, toQueryView as d, defineMdkApp as g, MDK_APP_PANEL_SLOT as S } from "@tetherto/mdk-react-adapter";
import { jsx as r, jsxs as l } from "react/jsx-runtime";
import { SingleStatCard as i, EmptyState as C, ErrorCard as y, Loader as p, Typography as f } from "@tetherto/mdk-react-devkit";
import { mdkFetch as h } from "@tetherto/mdk-ui-foundation";
const v = ({ view: e }) => {
  switch (e.status) {
    case "loading":
      return /* @__PURE__ */ r(p, {});
    case "error":
      return /* @__PURE__ */ r(y, { title: "Could not load the summary", error: e.message });
    case "no-kernel":
      return /* @__PURE__ */ r(C, { description: "The backend is up, but not connected to a Kernel yet.", size: "sm" });
    case "ready":
      return /* @__PURE__ */ r("div", { className: "fleet-summary", children: e.stats.map((t) => /* @__PURE__ */ r(i, { name: t.label, value: t.value }, t.label)) });
  }
}, P = ({ deviceId: e, view: t }) => /* @__PURE__ */ l("div", { className: "fleet-device", children: [
  /* @__PURE__ */ l(f, { variant: "secondary", children: [
    e,
    t.status === "ready" && t.mode ? ` (${t.mode})` : ""
  ] }),
  t.status === "loading" && /* @__PURE__ */ r(p, {}),
  t.status === "error" && /* @__PURE__ */ r(y, { title: `Could not read ${e}`, error: t.message }),
  t.status === "ready" && /* @__PURE__ */ r("div", { className: "fleet-summary", children: t.numbers.map((a) => /* @__PURE__ */ r(i, { name: a.label, value: a.value }, a.label)) })
] }), T = (e) => ["fleet", "summary", e], q = (e) => h(e), b = () => {
  const { apiUrl: e } = u(), t = e("/api/fleet/summary"), a = c({
    queryKey: T(t),
    queryFn: () => q(t),
    retry: !1
  }), s = d(a, t, { unreachableHint: "Start the stack with `mdk run`." });
  return s.status !== "ready" ? s : s.data.kernelConnected ? {
    status: "ready",
    deviceIds: s.data.workers.flatMap((n) => n.deviceIds),
    stats: [
      { label: "Workers", value: s.data.workerCount },
      { label: "Devices", value: s.data.deviceCount }
    ]
  } : { status: "no-kernel" };
}, K = (e) => ["fleet", "telemetry", e], M = (e) => h(e), N = (e) => {
  const { apiUrl: t } = u(), a = t(`/api/fleet/devices/${e}/telemetry`), s = c({
    queryKey: K(a),
    queryFn: () => M(a),
    retry: !1,
    refetchInterval: 5e3
    // ponytail: fixed poll; use the Worker's telemetryPollIntervalMs if it matters
  }), n = d(s, a);
  if (n.status !== "ready") return n;
  const o = n.data.metrics.metrics;
  return {
    status: "ready",
    numbers: Object.entries(o).flatMap(([k, m]) => typeof m == "number" ? [{ label: k, value: m }] : []),
    mode: typeof o.power_mode == "string" ? o.power_mode : void 0
  };
}, w = ({ deviceId: e }) => /* @__PURE__ */ r(P, { deviceId: e, view: N(e) }), _ = () => {
  const e = b();
  return /* @__PURE__ */ l("section", { className: "fleet-page", children: [
    /* @__PURE__ */ r(f, { variant: "heading1", children: "fleet" }),
    /* @__PURE__ */ r(v, { view: e }),
    e.status === "ready" && e.deviceIds.map((t) => /* @__PURE__ */ r(w, { deviceId: t }, t))
  ] });
}, x = () => /* @__PURE__ */ r(v, { view: b() }), j = g({
  // Must equal `id` in mdk-app.yaml: the dashboard refuses a mismatch.
  id: "io.rockin-in-a-free-world.fleet",
  displayName: "fleet",
  routes: [{ path: "", component: _ }],
  panels: [{ id: "summary", slot: S.HOME, component: x }]
});
export {
  j as default
};
