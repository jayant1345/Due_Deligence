(function () {
  const _caSessionId = (() => {
    try {
      let sid = sessionStorage.getItem("ca_live_session_id");
      if (!sid) {
        sid = "dash-" + Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);
        sessionStorage.setItem("ca_live_session_id", sid);
      }
      if (!sessionStorage.getItem("ca_live_session_started")) {
        sessionStorage.setItem("ca_live_session_started", new Date().toISOString());
      }
      return sid;
    } catch (_) {
      return "dash-fallback";
    }
  })();

  function _getAuthHeaders(extra) {
    try {
      if (typeof authHeaders === "function") return authHeaders(extra);
    } catch (_) {}
    const h = Object.assign({}, extra || {});
    const tok = localStorage.getItem("ca_token");
    if (tok && tok !== "demo-ca-token") h["Authorization"] = `Bearer ${tok}`;
    return h;
  }

  async function sendDashboardSessionHeartbeat() {
    try {
      const userEl = document.getElementById("caUserFullName");
      const userName = (userEl && userEl.textContent.trim()) || "CA Pranav N. Shah (Sr. Partner)";
      const curCase =
        typeof caseRegistry !== "undefined" && typeof activeCaseId !== "undefined" && activeCaseId && caseRegistry[activeCaseId]
          ? caseRegistry[activeCaseId].case_no
          : null;
      const startedIso = sessionStorage.getItem("ca_live_session_started") || null;
      const res = await fetch("/api/v1/activity-log/heartbeat", {
        method: "POST",
        headers: _getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          session_id: _caSessionId,
          surface: "DASHBOARD",
          user_name: userName,
          role: "SUPER_ADMIN",
          active_case_no: curCase,
          started_at_iso: startedIso,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.active_count === "number") {
          const txt = `${data.active_count} active`;
          const navBadge = document.getElementById("navActiveSessionsBadge");
          const sliderBadge = document.getElementById("drawerSliderCountBadge");
          if (navBadge) navBadge.textContent = txt;
          if (sliderBadge) sliderBadge.textContent = txt;
        }
      }
    } catch (_) {}
  }

  function toggleActiveSessionsPanel(show) {
    const body = document.getElementById("activeSessionsCollapsibleBody");
    const knob = document.getElementById("activeSessionsToggleKnob");
    const lbl = document.getElementById("activeSessionsToggleLabel");
    const chk = document.getElementById("activeSessionsToggleInput");
    const isVisible = typeof show === "boolean" ? show : body && body.style.display === "none";
    if (chk && chk.checked !== isVisible) chk.checked = isVisible;
    if (body) body.style.display = isVisible ? "block" : "none";
    if (knob) knob.style.left = isVisible ? "18px" : "2px";
    if (lbl) lbl.textContent = isVisible ? "Hide" : "Show";
    if (isVisible) loadActiveSessionsTable();
  }

  function toggleLiveSessionsDrawer(forceState) {
    const panel = document.getElementById("liveSessionsDrawerPanel");
    const icon = document.getElementById("liveSessionsSliderIcon");
    if (!panel) return;
    const isOpen = typeof forceState === "boolean" ? forceState : panel.style.display === "none";
    panel.style.display = isOpen ? "block" : "none";
    if (icon) icon.textContent = isOpen ? "chevron_right" : "chevron_left";
    if (isOpen) loadActiveSessionsTable();
  }

  async function loadActiveSessionsTable() {
    const tbody = document.getElementById("activeSessionsTableBody");
    const drawerTbody = document.getElementById("drawerActiveSessionsTableBody");
    const countPill = document.getElementById("activeSessionsCountPill");
    const drawerCountPill = document.getElementById("drawerActiveSessionsCountPill");
    const navBadge = document.getElementById("navActiveSessionsBadge");
    const sliderBadge = document.getElementById("drawerSliderCountBadge");
    const breakdownEl = document.getElementById("activeSessionsBreakdown");
    const drawerBreakdownEl = document.getElementById("drawerActiveSessionsBreakdown");
    try {
      await sendDashboardSessionHeartbeat();
      const res = await fetch(`/api/v1/activity-log/active-sessions?session_id=${encodeURIComponent(_caSessionId)}`, {
        headers: _getAuthHeaders(),
      });
      if (!res.ok) return;
      const data = await res.json();
      const total = data.total_active || 1;
      const pillText = `${total} active`;
      const bText = `(${data.dashboard_active || 0} Dashboard • ${data.pwa_active || 0} Mobile PWA)`;
      if (countPill) countPill.textContent = pillText;
      if (drawerCountPill) drawerCountPill.textContent = pillText;
      if (navBadge) navBadge.textContent = pillText;
      if (sliderBadge) sliderBadge.textContent = pillText;
      if (breakdownEl) breakdownEl.textContent = bText;
      if (drawerBreakdownEl) drawerBreakdownEl.textContent = bText;
      const rows = data.sessions || [];
      const emptyHtml = `<tr><td colspan="5" class="py-3 px-3 text-center text-xs text-slate-500 font-mono">No active sessions</td></tr>`;
      if (!rows.length) {
        if (tbody) tbody.innerHTML = emptyHtml;
        if (drawerTbody) drawerTbody.innerHTML = emptyHtml;
        return;
      }
      const esc = (s) => String(s || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const rowsHtml = rows
        .map((s) => {
          const isYou = Boolean(s.is_you);
          const rowBg = isYou ? "background-color: #fef3c7;" : "";
          const youBadge = isYou
            ? `<span style="background-color: #f59e0b; color: #111827;" class="ml-1.5 px-1.5 py-0.5 rounded font-headline font-bold text-[10px]">You</span>`
            : "";
          const isPwa = s.surface === "PWA";
          const surfBadge = isPwa
            ? `<span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono font-bold text-[10px]">📱 Mobile PWA</span>`
            : `<span class="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-mono font-bold text-[10px]">💻 CA Dashboard</span>`;
          const caseTag = s.active_case_no
            ? `<span class="ml-1 font-mono text-[10px] text-slate-500">• ${esc(s.active_case_no)}</span>`
            : "";
          return `
            <tr style="${rowBg}" class="border-b border-slate-200/70">
              <td class="py-2.5 px-3 font-mono text-xs text-slate-800">${s.index}</td>
              <td class="py-2.5 px-3 font-mono text-xs whitespace-nowrap">
                <span style="color: #be185d;">${esc(s.ip_address)}</span>${youBadge}
              </td>
              <td class="py-2.5 px-3 text-xs text-slate-800 whitespace-nowrap">
                ${surfBadge} <span class="ml-1 font-semibold">${esc(s.user_name)}</span>${caseTag}
              </td>
              <td class="py-2.5 px-3 text-xs text-slate-800 whitespace-nowrap">${esc(s.logged_in_at)}</td>
              <td class="py-2.5 px-3 text-xs text-slate-800 whitespace-nowrap">${esc(s.last_active)}</td>
            </tr>`;
        })
        .join("");
      if (tbody) tbody.innerHTML = rowsHtml;
      if (drawerTbody) drawerTbody.innerHTML = rowsHtml;
    } catch (_) {}
  }

  window.toggleActiveSessionsPanel = toggleActiveSessionsPanel;
  window.toggleLiveSessionsDrawer = toggleLiveSessionsDrawer;
  window.loadActiveSessionsTable = loadActiveSessionsTable;

  setTimeout(() => {
    sendDashboardSessionHeartbeat();
    loadActiveSessionsTable();
  }, 1000);
  setInterval(() => {
    sendDashboardSessionHeartbeat();
    const modal = document.getElementById("modalActivityLog");
    const drawer = document.getElementById("liveSessionsDrawerPanel");
    if ((modal && modal.style.display === "flex") || (drawer && drawer.style.display === "block")) {
      loadActiveSessionsTable();
    }
  }, 25000);
})();
