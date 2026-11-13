import { useMdkApp as l, useQuery as i, toQueryView as m, defineMdkApp as c, MDK_APP_PANEL_SLOT as d } from "@tetherto/mdk-react-adapter";
import { jsx as r, jsxs as y } from "react/jsx-runtime";
import { SingleStatCard as p, EmptyState as f, ErrorCard as h, Loader as k, Typography as n } from "@tetherto/mdk-react-devkit";
import { mdkFetch as v } from "@tetherto/mdk-ui-foundation";
const s = ({ view: e }) => {
  switch (e.status) {
    case "loading":
      return /* @__PURE__ */ r(k, {});
    case "error":
      return /* @__PURE__ */ r(h, { title: "Could not load the summary", error: e.message });
    case "no-kernel":
      return /* @__PURE__ */ r(f, { description: "The backend is up, but not connected to a Kernel yet.", size: "sm" });
    case "ready":
      return /* @__PURE__ */ r("div", { className: "fleet-summary", children: e.stats.map((t) => /* @__PURE__ */ r(p, { name: t.label, value: t.value }, t.label)) });
  }
}, b = (e) => ["fleet", "summary", e], S = (e) => v(e), o = () => {
  const { apiUrl: e } = l(), t = e("/api/fleet/summary"), u = i({
    queryKey: b(t),
    queryFn: () => S(t),
    retry: !1
  }), a = m(u, t, { unreachableHint: "Start the stack with `mdk run`." });
  return a.status !== "ready" ? a : a.data.kernelConnected ? {
    status: "ready",
    stats: [
      { label: "Workers", value: a.data.workerCount },
      { label: "Devices", value: a.data.deviceCount }
    ]
  } : { status: "no-kernel" };
}, g = () => /* @__PURE__ */ y("section", { className: "fleet-page", children: [
  /* @__PURE__ */ r(n, { variant: "heading1", children: "fleet" }),
  /* @__PURE__ */ r(n, { variant: "secondary", children: "Your app's starter page. Edit ui-src/ and rebuild with npm run build:ui." }),
  /* @__PURE__ */ r(s, { view: o() })
] }), w = () => /* @__PURE__ */ r(s, { view: o() }), A = c({
  // Must equal `id` in mdk-app.yaml: the dashboard refuses a mismatch.
  id: "io.rockin-in-a-free-world.fleet",
  displayName: "fleet",
  routes: [{ path: "", component: g }],
  panels: [{ id: "summary", slot: d.HOME, component: w }]
});
export {
  A as default
};
