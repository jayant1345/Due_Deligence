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

  // ==========================================
  // PURELY ADDITIVE: DATE-WISE CASE ENTRY & KPI DETAILS REPORT CONTROLLER
  // ==========================================
  let _dwCachedCases = [];
  let _dwCurrentTitle = "Date-wise Case Entry Report";

  function _formatDateChipLabel(isoStr) {
    if (!isoStr || isoStr === "Unknown") return isoStr || "—";
    try {
      const [y, m, d] = isoStr.split("-").map(Number);
      const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
      return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
    } catch (_) {
      return isoStr;
    }
  }

  function _formatInrLakhs(amountVal) {
    const n = Number(amountVal);
    if (!Number.isFinite(n) || n <= 0) return "—";
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} Lacs`;
    return `₹${n.toLocaleString("en-IN")}`;
  }

  function _renderStatusPill(statusStr) {
    const s = String(statusStr || "DRAFT").toUpperCase();
    if (s === "CERTIFIED") {
      return `<span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">CERTIFIED (UDIN)</span>`;
    }
    if (s === "PENDING_CA_REVIEW") {
      return `<span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-blue-50 text-primary-container border border-blue-200">PENDING CA REVIEW</span>`;
    }
    if (s === "ASSIGNED" || s === "ASSIGNED_TO_FIELD") {
      return `<span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">ASSIGNED</span>`;
    }
    if (s === "IN_PROGRESS") {
      return `<span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">IN PROGRESS</span>`;
    }
    if (s === "APPROVED") {
      return `<span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">APPROVED</span>`;
    }
    return `<span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">${s}</span>`;
  }

  function renderDateWiseModalRows(rows) {
    const tbody = document.getElementById("dwReportTableBody");
    const countBadge = document.getElementById("dwReportCountBadge");
    if (countBadge) countBadge.textContent = `${rows.length} Case${rows.length === 1 ? "" : "s"}`;
    if (!tbody) return;
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="9" class="py-8 text-center font-mono text-xs text-outline">No cases found for the selected date / filter.</td></tr>`;
      return;
    }
    const esc = (s) => String(s || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    tbody.innerHTML = rows
      .map((c, idx) => {
        const coLine = c.co_applicant_name
          ? `<div class="text-[10px] font-mono text-purple-700 mt-0.5">Co-App: ${esc(c.co_applicant_name)}</div>`
          : "";
        const phLine = c.applicant_phone
          ? `<div class="text-[10px] font-mono text-outline">${esc(c.applicant_phone)}</div>`
          : "";
        return `
          <tr class="hover:bg-surface-container-low/70 transition-colors">
            <td class="py-2.5 px-3 font-mono text-xs text-outline">${idx + 1}</td>
            <td class="py-2.5 px-3 font-mono text-xs whitespace-nowrap">
              <div class="font-bold text-on-surface">${esc(c.date_label)}</div>
              <div class="text-[10px] text-outline">${esc(c.time_label)}</div>
            </td>
            <td class="py-2.5 px-3 font-mono text-xs font-bold text-primary-container whitespace-nowrap">${esc(c.case_no)}</td>
            <td class="py-2.5 px-3">
              <div class="font-bold text-on-surface">${esc(c.applicant_name)}</div>
              ${coLine}
              ${phLine}
            </td>
            <td class="py-2.5 px-3">
              <div class="font-bold text-on-surface">${esc(c.bank_name)}</div>
              <div class="text-[11px] text-on-surface-variant font-medium">${esc(c.branch)}</div>
            </td>
            <td class="py-2.5 px-3">
              <div class="font-semibold text-on-surface">${esc(c.loan_type)}</div>
              <div class="font-mono text-[10px] font-bold text-secondary">${_formatInrLakhs(c.loan_amount)}</div>
            </td>
            <td class="py-2.5 px-3 text-xs font-medium text-on-surface">${esc(c.executive)}</td>
            <td class="py-2.5 px-3 whitespace-nowrap">${_renderStatusPill(c.status)}</td>
            <td class="py-2.5 px-3 text-right whitespace-nowrap">
              <button type="button" onclick="openCaseFromDateWiseReport('${esc(c.id)}')" class="px-2.5 py-1 rounded bg-primary-container hover:bg-primary text-white font-mono text-[11px] font-bold cursor-pointer">Open Case</button>
            </td>
          </tr>`;
      })
      .join("");
  }

  function filterDateWiseModalRows() {
    const q = (document.getElementById("dwSearchInput")?.value || "").toLowerCase().trim();
    if (!q) {
      renderDateWiseModalRows(_dwCachedCases);
      return;
    }
    const filtered = _dwCachedCases.filter(
      (c) =>
        (c.case_no || "").toLowerCase().includes(q) ||
        (c.applicant_name || "").toLowerCase().includes(q) ||
        (c.co_applicant_name || "").toLowerCase().includes(q) ||
        (c.bank_name || "").toLowerCase().includes(q) ||
        (c.branch || "").toLowerCase().includes(q) ||
        (c.loan_type || "").toLowerCase().includes(q) ||
        (c.executive || "").toLowerCase().includes(q) ||
        (c.date_label || "").toLowerCase().includes(q)
    );
    renderDateWiseModalRows(filtered);
  }

  async function openDateWiseCaseReport(opts) {
    const options = opts || {};
    const modal = document.getElementById("modalDateWiseCaseReport");
    const titleEl = document.getElementById("dwReportTitle");
    const tbody = document.getElementById("dwReportTableBody");
    const chipsBox = document.getElementById("dwDateChipsContainer");
    const modalDateInp = document.getElementById("dwModalDateInput");
    const bannerDateInp = document.getElementById("mgmtDailyReportDateInput");
    const searchInp = document.getElementById("dwSearchInput");

    if (searchInp) searchInp.value = "";
    if (modal) modal.style.display = "flex";
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="9" class="py-8 text-center font-mono text-xs text-outline">Loading case entry details...</td></tr>`;
    }

    const params = new URLSearchParams();
    if (options.date) {
      params.set("date", options.date);
      if (modalDateInp) modalDateInp.value = options.date;
      if (bannerDateInp) bannerDateInp.value = options.date;
    } else if (options.category) {
      params.set("category", options.category);
    } else {
      params.set("category", "actual_all");
    }

    try {
      const res = await fetch(`/api/v1/cases/date-wise-report?${params.toString()}`, {
        headers: _getAuthHeaders(),
      });
      if (!res.ok) {
        if (tbody) {
          tbody.innerHTML = `<tr><td colspan="9" class="py-8 text-center font-mono text-xs text-rose-700">Could not load case report (HTTP ${res.status}).</td></tr>`;
        }
        return;
      }
      const data = await res.json();
      _dwCachedCases = Array.isArray(data.cases) ? data.cases : [];
      _dwCurrentTitle = data.title || "Date-wise Case Entry Report";
      if (titleEl) titleEl.textContent = _dwCurrentTitle;
      if (options.category === "today" && data.today_ist) {
        if (modalDateInp) modalDateInp.value = data.today_ist;
        if (bannerDateInp) bannerDateInp.value = data.today_ist;
      } else if (!options.date && modalDateInp) {
        modalDateInp.value = data.today_ist || "";
      }

      if (chipsBox && Array.isArray(data.date_wise_counts)) {
        const selectedDate = options.date || (options.category === "today" ? data.today_ist : "");
        chipsBox.innerHTML = data.date_wise_counts
          .slice(0, 14)
          .map((d) => {
            const isSel = d.date_iso === selectedDate;
            const cls = isSel
              ? "px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-mono text-[11px] font-bold shadow-xs cursor-pointer"
              : "px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-mono text-[11px] font-semibold cursor-pointer transition-colors";
            return `<button type="button" onclick="openDateWiseCaseReport({ date: '${d.date_iso}' })" class="${cls}">${_formatDateChipLabel(d.date_iso)}: <strong>${d.count}</strong></button>`;
          })
          .join("");
      }

      renderDateWiseModalRows(_dwCachedCases);
    } catch (err) {
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="9" class="py-8 text-center font-mono text-xs text-rose-700">Network error while loading date-wise report.</td></tr>`;
      }
    }
  }

  function closeDateWiseCaseReport() {
    const modal = document.getElementById("modalDateWiseCaseReport");
    if (modal) modal.style.display = "none";
  }

  function openCaseFromDateWiseReport(caseId) {
    closeDateWiseCaseReport();
    if (!caseId) return;
    try {
      if (typeof activeCaseId !== "undefined") activeCaseId = caseId;
      if (typeof onCaseSelected === "function") onCaseSelected(caseId);
      if (typeof switchMainPortalView === "function") switchMainPortalView("scrutiny");
    } catch (_) {}
  }

  function exportDateWiseReportCsv() {
    if (!_dwCachedCases || !_dwCachedCases.length) {
      alert("No case rows to export.");
      return;
    }
    const headers = ["Sr No", "Entered Date", "Entered Time", "Case Reference", "Applicant Name", "Co-Applicant Name", "Phone", "Bank Name", "Branch", "Loan Type", "Loan Amount", "Executive / Staff", "Status", "Address"];
    const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [
      headers.join(","),
      ..._dwCachedCases.map((c, idx) =>
        [
          idx + 1,
          q(c.date_label),
          q(c.time_label),
          q(c.case_no),
          q(c.applicant_name),
          q(c.co_applicant_name),
          q(c.applicant_phone),
          q(c.bank_name),
          q(c.branch),
          q(c.loan_type),
          q(c.loan_amount || ""),
          q(c.executive),
          q(c.status),
          q(c.target_address),
        ].join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CA_DateWise_Case_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  window.openDateWiseCaseReport = openDateWiseCaseReport;
  window.closeDateWiseCaseReport = closeDateWiseCaseReport;
  window.filterDateWiseModalRows = filterDateWiseModalRows;
  window.openCaseFromDateWiseReport = openCaseFromDateWiseReport;
  window.exportDateWiseReportCsv = exportDateWiseReportCsv;

  // ==========================================
  // STRICT TWO EMPANELLED BANKS & DEDUPLICATED MULTI-FILTER (Bank + Branch + Type of Loan)
  // ==========================================
  const EMPANELLED_BANKS_ONLY = ["Union Bank of India", "Bank of Baroda"];

  const CANONICAL_LOAN_TYPES = [
    "Vehicle Loan",
    "Home Loan",
    "Education Loan",
    "Personal Loan",
    "Business Takeover",
    "Quotation Verification",
    "Pension Loan",
    "BT TOP UP",
    "Machinery Loan",
    "Builder Tie Up",
    "MSME Loan",
    "Cash Credit Loan",
    "Mudra Loan",
    "Others",
  ];

  // Normalize a case's loan_type or case_no prefix into one of the canonical loan types
  function resolveCaseLoanType(c) {
    if (!c) return "";
    const rawLt = String(c.loan_type || c.loan_facility || "").trim();
    const rawCaseNo = String(c.case_no || "").trim().toUpperCase();
    const low = rawLt.toLowerCase();
    if (low.includes("vehicle") || /\bVL\b/.test(rawLt.toUpperCase()) || /-VL[-_\d]/.test(rawCaseNo)) return "Vehicle Loan";
    if (low.includes("home") || low.includes("housing") || /\bHL\b/.test(rawLt.toUpperCase()) || /-HL[-_\d]/.test(rawCaseNo)) return "Home Loan";
    if (low.includes("education") || /\bEL\b/.test(rawLt.toUpperCase()) || /-EL[-_\d]/.test(rawCaseNo)) return "Education Loan";
    if (low.includes("personal") || /\bPL\b/.test(rawLt.toUpperCase()) || /-PL[-_\d]/.test(rawCaseNo)) return "Personal Loan";
    if (low.includes("takeover")) return "Business Takeover";
    if (low.includes("quotation")) return "Quotation Verification";
    if (low.includes("pension")) return "Pension Loan";
    if (low.includes("bt top") || low.includes("top up") || low.includes("top-up")) return "BT TOP UP";
    if (low.includes("machinery")) return "Machinery Loan";
    if (low.includes("builder")) return "Builder Tie Up";
    if (low.includes("msme")) return "MSME Loan";
    if (low.includes("cash credit") || /\bCC\b/.test(rawLt.toUpperCase())) return "Cash Credit Loan";
    if (low.includes("mudra")) return "Mudra Loan";
    for (const t of CANONICAL_LOAN_TYPES) {
      if (t.toLowerCase() === low) return t;
    }
    return rawLt && rawLt.toLowerCase() !== "loan" ? rawLt : "Others";
  }

  function caseMatchesLoanTypeFilter(c, loanTypeFilter) {
    if (!loanTypeFilter || loanTypeFilter === "ALL") return true;
    const normFilter = String(loanTypeFilter).trim().toLowerCase();
    const resolved = resolveCaseLoanType(c).toLowerCase();
    if (resolved === normFilter) return true;
    const rawLt = String((c && (c.loan_type || c.loan_facility)) || "").toLowerCase();
    return rawLt.includes(normFilter);
  }

  const HARDCODED_DEMO_CASE_IDS = new Set([
    "b901fc63-12a8-4e32-9c02-e20984cfb001",
    "c102ad74-23b9-4f43-ad13-f31095d0c002",
    "d203be85-34ca-4a54-be24-a42106e1d003",
    "e304cf96-45db-4b65-cf35-b53217f2e004",
    "f405da07-56ec-4c76-da46-c64328a3f005",
  ]);

  // Authoritative server-side visit telemetry map keyed by canonical UUID and uppercase case_no.
  // Populated synchronously whenever /api/v1/cases or /api/v1/cases/{id}/documents responds.
  const SERVER_CASE_VISIT_TELEMETRY = new Map();

  function recordServerCaseTelemetry(dc) {
    if (!dc || typeof dc !== "object") return;
    const idStr = dc.id ? String(dc.id).trim() : "";
    const cNoStr = dc.case_no ? String(dc.case_no).trim().toUpperCase() : "";
    if (!idStr && !cNoStr) return;
    const info = {
      site_photos_count: typeof dc.site_photos_count === "number" ? dc.site_photos_count : 0,
      has_agent_selfie: Boolean(dc.has_agent_selfie),
      status: dc.status ? String(dc.status).trim().toUpperCase() : null,
      capture_lat: dc.capture_lat != null ? dc.capture_lat : null,
      capture_lon: dc.capture_lon != null ? dc.capture_lon : null,
      distance_m: dc.distance_m != null ? dc.distance_m : null,
    };
    if (idStr) SERVER_CASE_VISIT_TELEMETRY.set(idStr, info);
    if (cNoStr) SERVER_CASE_VISIT_TELEMETRY.set(cNoStr, info);
  }

  // Hook window.fetch so every /api/v1/cases response records site_photos_count & has_agent_selfie
  // before loadDbCasesIntoRegistry() or buildMgmtEntriesFromApi() processes the returned JSON.
  if (typeof window.fetch === "function" && !window.fetch._visitTelemetryHooked) {
    const origFetch = window.fetch;
    const NON_SITE_PHOTO_DOC_TYPES = new Set([
      "AGENT_SELFIE",
      "AADHAAR_CARD",
      "PAN_CARD",
      "PAN_VERIFICATION_REPORT",
      "UTILITY_BILL",
      "SALARY_SLIP",
      "FORM_16",
      "ITR_ACKNOWLEDGEMENT",
      "COMPUTATION_OF_INCOME",
      "PROFIT_LOSS_BALANCE_SHEET",
      "PROPERTY_TITLE_DEED",
      "BANK_STATEMENT",
      "OTHER",
    ]);
    const hookedFetch = async function (input, init) {
      const res = await origFetch.apply(this, arguments);
      try {
        const urlStr = typeof input === "string" ? input : (input && input.url) || "";
        if (urlStr.includes("/api/v1/cases") && res && res.ok) {
          const origJson = res.json.bind(res);
          res.json = async function () {
            const data = await origJson();
            try {
              if (Array.isArray(data)) {
                // Check if this is /api/v1/cases/{id}/documents or /api/v1/cases list
                const docMatch = urlStr.match(/\/api\/v1\/cases\/([^/?#]+)\/documents/);
                if (docMatch) {
                  const cid = decodeURIComponent(docMatch[1]);
                  let livePhotos = 0;
                  let hasSelfie = false;
                  for (const d of data) {
                    if (!d || typeof d !== "object") continue;
                    const dt = String(d.doc_type || "").toUpperCase();
                    if (dt === "AGENT_SELFIE") {
                      hasSelfie = true;
                    } else if (
                      !(d.ocr_data && d.ocr_data.source === "pdf_ingest") &&
                      String(d.folder || "").toLowerCase() !== "kyc" &&
                      !NON_SITE_PHOTO_DOC_TYPES.has(dt)
                    ) {
                      livePhotos++;
                    }
                  }
                  const existingInfo = SERVER_CASE_VISIT_TELEMETRY.get(cid) || {};
                  const updatedInfo = Object.assign({}, existingInfo, {
                    site_photos_count: livePhotos,
                    has_agent_selfie: hasSelfie,
                  });
                  SERVER_CASE_VISIT_TELEMETRY.set(cid, updatedInfo);
                  if (typeof caseRegistry !== "undefined" && caseRegistry && caseRegistry[cid]) {
                    const cObj = caseRegistry[cid];
                    cObj.site_photos_count = livePhotos;
                    cObj.has_agent_selfie = hasSelfie;
                    if (cObj.case_no) {
                      SERVER_CASE_VISIT_TELEMETRY.set(String(cObj.case_no).trim().toUpperCase(), updatedInfo);
                    }
                    syncTelemetryOntoCaseEntry(cObj);
                  }
                } else {
                  data.forEach(recordServerCaseTelemetry);
                }
              } else if (data && typeof data === "object" && data.id && data.case_no) {
                recordServerCaseTelemetry(data);
              }
            } catch (_) {}
            return data;
          };
        }
      } catch (_) {}
      return res;
    };
    hookedFetch._visitTelemetryHooked = true;
    window.fetch = hookedFetch;
  }

  function syncTelemetryOntoCaseEntry(c) {
    if (!c || typeof c !== "object") return;
    const idKey = String(c.db_id || c.server_id || c.id || "").trim();
    const cNoKey = String(c.case_no || "").trim().toUpperCase();
    const info =
      (idKey && SERVER_CASE_VISIT_TELEMETRY.get(idKey)) ||
      (cNoKey && SERVER_CASE_VISIT_TELEMETRY.get(cNoKey)) ||
      null;
    if (info) {
      if (typeof info.site_photos_count === "number") {
        c.site_photos_count = info.site_photos_count;
      }
      if (typeof info.has_agent_selfie === "boolean") {
        c.has_agent_selfie = info.has_agent_selfie;
      }
      if (info.status) {
        c.status = info.status;
      }
      if (c.site_photos_count === 0 && !c.has_agent_selfie) {
        c.distance_m = null;
        c.capture_lat = "—";
        c.capture_lon = "—";
        const st = String(c.status || "").trim().toUpperCase();
        if (st === "IN_PROGRESS" || st === "PENDING_CA_REVIEW") {
          const agentStr = String(c.agent || "").trim().toLowerCase();
          const hasAgent =
            Boolean(c.assigned_agent_id) ||
            Boolean(agentStr && agentStr !== "not yet allotted" && agentStr !== "unassigned" && agentStr !== "—");
          c.status = hasAgent ? "ASSIGNED" : "DRAFT";
        }
      } else if (c.site_photos_count === 0 && c.has_agent_selfie) {
        const st = String(c.status || "").trim().toUpperCase();
        if (st === "PENDING_CA_REVIEW") {
          c.status = "IN_PROGRESS";
        }
      }
    }
  }

  function getCaseSitePhotosCount(c) {
    if (!c || typeof c !== "object") return 0;
    syncTelemetryOntoCaseEntry(c);
    const countLive = (arr) =>
      (arr || []).filter(
        (item) =>
          item &&
          item.is_live &&
          item.src &&
          !String(item.src).includes("photo_pending.svg") &&
          !String(item.src).includes("doc_pending.svg")
      ).length;
    const inMemoryLive =
      countLive(c.residence_photos) +
      countLive(c.work_photos) +
      countLive(c.co_work_photos) +
      (Array.isArray(c.residence_photos_extra) ? c.residence_photos_extra.length : 0) +
      (Array.isArray(c.work_photos_extra) ? c.work_photos_extra.length : 0) +
      (Array.isArray(c.co_work_photos_extra) ? c.co_work_photos_extra.length : 0);
    if (inMemoryLive > 0) return inMemoryLive;
    if (typeof c.site_photos_count === "number" && !isNaN(c.site_photos_count)) {
      return c.site_photos_count;
    }
    return 0;
  }

  function isFieldVisitCompleted(c) {
    if (!c) return false;
    syncTelemetryOntoCaseEntry(c);
    const st = String(c.status || "").trim().toUpperCase();
    // Already certified report with UDIN
    if (st === "CERTIFIED") return true;
    // For any non-certified case, the field visit is ONLY completed and ready for CA review
    // when actual site/office visit photographs have been uploaded (site_photos_count > 0).
    // Any case where photos are NOT uploaded (0 site photos) must NEVER come under
    // "Visit Done — Pending CA Review".
    return getCaseSitePhotosCount(c) > 0;
  }

  function isCaseNotHandedOverToAgent(c) {
    if (!c) return false;
    if (isFieldVisitCompleted(c)) return false;
    const st = String(c.status || "").trim().toUpperCase();
    const agentStr = String(c.agent || "").trim().toLowerCase();
    const hasNoAssignedAgent =
      !c.assigned_agent_id &&
      (!agentStr || agentStr === "not yet allotted" || agentStr === "unassigned" || agentStr === "—");
    return st === "DRAFT" || hasNoAssignedAgent;
  }

  function caseMatchesVisitStatusFilter(c, visitFilter) {
    if (!visitFilter || visitFilter === "ALL") return true;
    const st = String((c && c.status) || "").trim().toUpperCase();
    const done = isFieldVisitCompleted(c);
    const notHandedOver = isCaseNotHandedOverToAgent(c);
    if (visitFilter === "NOT_HANDED_OVER") return notHandedOver;
    if (visitFilter === "VISIT_COMPLETED") return done;
    if (visitFilter === "VISIT_NOT_COMPLETED") return !done && !notHandedOver;
    if (visitFilter === "READY_FOR_SCRUTINY") return done && st !== "CERTIFIED";
    if (visitFilter === "CERTIFIED_ONLY") return st === "CERTIFIED";
    return true;
  }

  // Update the options inside #filterVisitStatusSelect with live counts for the current Bank/Branch/LoanType
  function updateVisitStatusOptionCounts(entries, bankName, branchName, loanType) {
    const visitSel = document.getElementById("filterVisitStatusSelect");
    if (!visitSel) return;
    const normBank = (bankName || "ALL").trim().toLowerCase();
    const normBranch = (branchName || "ALL").trim().toLowerCase();
    let total = 0;
    let notHandedOverCount = 0;
    let visitPendingCount = 0;
    let readyForScrutiny = 0;
    let certified = 0;

    for (const [, c] of entries) {
      if (bankName !== "ALL" && (c.bank || "").trim().toLowerCase() !== normBank) continue;
      if (branchName !== "ALL" && (c.branch || "").trim().toLowerCase() !== normBranch) continue;
      if (!caseMatchesLoanTypeFilter(c, loanType)) continue;
      total++;
      const done = isFieldVisitCompleted(c);
      const st = String(c.status || "").trim().toUpperCase();
      if (done) {
        if (st === "CERTIFIED") certified++;
        else readyForScrutiny++;
      } else if (isCaseNotHandedOverToAgent(c)) {
        notHandedOverCount++;
      } else {
        visitPendingCount++;
      }
    }

    const labels = {
      ALL: `All Cases (${total})`,
      NOT_HANDED_OVER: `📋 Cases Not Handover to Agent (${notHandedOverCount})`,
      VISIT_NOT_COMPLETED: `⏳ Visit Not Completed — Pending Visit (${visitPendingCount})`,
      READY_FOR_SCRUTINY: `🔍 Visit Done — Pending CA Review (${readyForScrutiny})`,
      CERTIFIED_ONLY: `🏅 Report Certified — UDIN (${certified})`,
    };
    Array.from(visitSel.options).forEach((opt) => {
      if (labels[opt.value]) {
        opt.textContent = labels[opt.value];
      }
    });
  }

  // Returns each unique case once (keyed by canonical UUID db_id/id, NEVER both UUID and case_no alias).
  // Also strips out the 5 hardcoded demo seed cases once real database cases have loaded so fake
  // Mumbai/SBI/HDFC/ICICI demo cases never pollute real CA office filters.
  function getDeduplicatedRegistryEntries() {
    if (typeof caseRegistry === "undefined" || !caseRegistry) return [];
    const deletedSet = typeof getDeletedCasesSet === "function" ? getDeletedCasesSet() : new Set();
    const allEntries = Object.entries(caseRegistry);
    const hasRealDbCases = allEntries.some(([, c]) => c && c.db_id && !HARDCODED_DEMO_CASE_IDS.has(String(c.db_id)));

    const seenObjects = new Set();
    const seenCaseIds = new Set();
    const seenCaseNos = new Set();
    const result = [];

    for (const [key, c] of allEntries) {
      if (!c || typeof c !== "object") continue;
      const canonicalId = String(c.db_id || c.server_id || c.id || key).trim();
      if (hasRealDbCases && HARDCODED_DEMO_CASE_IDS.has(canonicalId) && !c.server_id && !c.db_id) {
        continue;
      }
      const cNo = String(c.case_no || "").trim().toUpperCase();
      if (
        deletedSet.has(canonicalId.toUpperCase()) ||
        deletedSet.has(String(key).toUpperCase()) ||
        (c.db_id && deletedSet.has(String(c.db_id).toUpperCase()))
      ) {
        continue;
      }
      // Skip alias key when key === c.case_no and canonical db_id key also exists in caseRegistry
      if (c.db_id && key !== c.db_id && caseRegistry[c.db_id]) {
        continue;
      }
      if (seenObjects.has(c) || seenCaseIds.has(canonicalId.toUpperCase()) || (cNo && seenCaseNos.has(cNo))) {
        continue;
      }
      seenObjects.add(c);
      seenCaseIds.add(canonicalId.toUpperCase());
      if (cNo) seenCaseNos.add(cNo);
      result.push([c.db_id || key, c]);
    }
    return result;
  }

  // Rebuild Branch dropdown options dynamically scoped to the currently selected Bank (or all banks if ALL)
  function updateBranchDropdownForSelectedBank(selectedBank) {
    const bankVal = selectedBank || (document.getElementById("filterBankSelect")?.value) || "ALL";
    const branchSel = document.getElementById("filterBranchSelect");
    if (!branchSel) return;
    const prevBranch = branchSel.value || "ALL";
    const seen = new Set();
    const branches = [];
    getDeduplicatedRegistryEntries().forEach(([, c]) => {
      if (bankVal !== "ALL" && (c.bank || "").trim().toLowerCase() !== bankVal.trim().toLowerCase()) {
        return;
      }
      const b = (c.branch || "").trim();
      if (b && !seen.has(b.toLowerCase())) {
        seen.add(b.toLowerCase());
        branches.push(b);
      }
    });
    branches.sort((a, b) => a.localeCompare(b));
    branchSel.innerHTML = "";
    const allOpt = document.createElement("option");
    allOpt.value = "ALL";
    allOpt.textContent = bankVal === "ALL" ? `All Branches (${branches.length})` : `All ${bankVal.includes("Union") ? "UBI" : "BOB"} Branches (${branches.length})`;
    branchSel.appendChild(allOpt);
    branches.forEach((b) => {
      const opt = document.createElement("option");
      opt.value = b;
      opt.textContent = b;
      branchSel.appendChild(opt);
    });
    const matchExisting = branches.find((b) => b.toLowerCase() === prevBranch.trim().toLowerCase());
    branchSel.value = matchExisting || "ALL";
  }

  // Unified combined filter for Scrutiny Desk top ribbon: Bank + Branch + Type of Loan + Visit Status (instant & deduplicated!)
  function applyScrutinyTopFilters(triggerSource, opts) {
    const options = opts || {};
    const bankName = document.getElementById("filterBankSelect")?.value || "ALL";
    if (triggerSource === "bank" || triggerSource === "dbRefresh" || triggerSource === "init") {
      updateBranchDropdownForSelectedBank(bankName);
    }
    const branchName = document.getElementById("filterBranchSelect")?.value || "ALL";
    const loanType = document.getElementById("filterLoanTypeSelect")?.value || "ALL";
    const visitStatus = document.getElementById("filterVisitStatusSelect")?.value || "ALL";

    const caseSelect = document.getElementById("caseSelectorSelect");
    if (!caseSelect) return;
    const prevActiveId = typeof activeCaseId !== "undefined" ? activeCaseId : caseSelect.value;

    const entries = getDeduplicatedRegistryEntries();
    // Update live counts inside the Visit Status dropdown options
    updateVisitStatusOptionCounts(entries, bankName, branchName, loanType);

    // Sort newest first so latest cases appear at the top of the dropdown
    entries.sort(([, a], [, b]) => {
      const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tB - tA;
    });

    const normBank = bankName.trim().toLowerCase();
    const normBranch = branchName.trim().toLowerCase();
    let count = 0;
    let firstMatch = null;
    let stillHasPrev = false;

    const frag = document.createDocumentFragment();
    for (const [id, c] of entries) {
      if (bankName !== "ALL" && (c.bank || "").trim().toLowerCase() !== normBank) continue;
      if (branchName !== "ALL" && (c.branch || "").trim().toLowerCase() !== normBranch) continue;
      if (!caseMatchesLoanTypeFilter(c, loanType)) continue;
      if (!caseMatchesVisitStatusFilter(c, visitStatus)) continue;

      const opt = document.createElement("option");
      opt.value = id;
      const dateStr = c.created_at && typeof fmtCaseOptDate === "function" ? ` (${fmtCaseOptDate(c.created_at)})` : "";
      const ltLabel = resolveCaseLoanType(c);
      const ltShort = ltLabel && ltLabel !== "Others" ? ` • ${ltLabel}` : "";
      const visitTag = isFieldVisitCompleted(c)
        ? (String(c.status || "").toUpperCase() === "CERTIFIED" ? " [🏅 Certified]" : " [✓ Visit Done]")
        : (isCaseNotHandedOverToAgent(c) ? " [📋 Not Handover]" : " [⏳ Visit Pending]");
      opt.textContent = `[${c.case_no}] - ${c.applicant_name}${dateStr} | ${c.bank} (${c.branch})${ltShort}${visitTag}`;
      frag.appendChild(opt);
      if (!firstMatch) firstMatch = id;
      if (prevActiveId && id === prevActiveId) stillHasPrev = true;
      count++;
    }

    caseSelect.innerHTML = "";
    caseSelect.appendChild(frag);

    const totalEl = document.getElementById("totalCaseCount");
    if (totalEl) totalEl.textContent = count;

    const targetCaseId = stillHasPrev ? prevActiveId : firstMatch;
    if (targetCaseId) {
      caseSelect.value = targetCaseId;
      // Keep the displayed status badge on the Scrutiny Desk in sync if the open case's status was healed
      if (typeof caseRegistry !== "undefined" && caseRegistry && caseRegistry[targetCaseId]) {
        syncTelemetryOntoCaseEntry(caseRegistry[targetCaseId]);
        if (targetCaseId === prevActiveId) {
          const statusEl = document.getElementById("dispCaseStatus");
          if (statusEl && caseRegistry[targetCaseId].status) {
            statusEl.textContent = caseRegistry[targetCaseId].status;
          }
        }
      }
      // Whenever the active case actually changes (e.g. the previous case does not match the active filter),
      // load the newly selected firstMatch case onto the Scrutiny Desk so the desk always matches the dropdown!
      // When targetCaseId === prevActiveId (same case stays open), skip onCaseSelected so filtering is instant.
      if (targetCaseId !== prevActiveId && typeof onCaseSelected === "function") {
        onCaseSelected(targetCaseId);
      }
    } else {
      const emptyOpt = document.createElement("option");
      emptyOpt.value = "";
      emptyOpt.textContent = "— No cases match the selected Bank / Branch / Loan Type / Visit filter —";
      caseSelect.appendChild(emptyOpt);
    }
  }

  function enforceTwoEmpanelledBanks() {
    window.getDistinctCaseBanks = function () {
      return EMPANELLED_BANKS_ONLY.slice();
    };
    window.rebuildBankFilterOptions = function () {
      const banks = EMPANELLED_BANKS_ONLY.slice();
      if (typeof fillBranchSelect === "function") {
        fillBranchSelect("filterBankSelect", `All Empanelled Banks (${banks.length})`, banks);
        fillBranchSelect("mgmtFilterBank", "All Empanelled Banks (બધી બેંક)", banks);
      }
      // Every time loadDbCasesIntoRegistry() finishes (on initial load and every 45s poll),
      // it calls rebuildBankFilterOptions(). Re-apply the Scrutiny Desk top filters here
      // (with skipCaseLoad=true so the open case isn't interrupted) so any active Visit Status /
      // Bank / Branch / Loan Type filter stays 100% enforced and never gets wiped by newly arrived DB cases!
      applyScrutinyTopFilters("dbRefresh", { skipCaseLoad: true });
    };
    window.onBankFilterChanged = function () {
      applyScrutinyTopFilters("bank");
    };
    window.onBranchFilterChanged = function () {
      applyScrutinyTopFilters("branch");
    };
    window.onLoanTypeFilterChanged = function () {
      applyScrutinyTopFilters("loanType");
    };
    window.onVisitStatusFilterChanged = function () {
      applyScrutinyTopFilters("visitStatus");
    };

    // Directly bind native 'change' event listeners on all 4 Scrutiny Desk filter <select> elements
    // as a rock-solid guarantee that selecting any filter fires immediately with zero delay.
    [
      ["filterBankSelect", "bank"],
      ["filterBranchSelect", "branch"],
      ["filterLoanTypeSelect", "loanType"],
      ["filterVisitStatusSelect", "visitStatus"],
    ].forEach(([elId, src]) => {
      const el = document.getElementById(elId);
      if (el && !el._scrutinyFilterBound) {
        el._scrutinyFilterBound = true;
        el.onchange = function () {
          applyScrutinyTopFilters(src);
        };
      }
    });

    // Also enhance Management Portal filter & reset to support #mgmtFilterLoanType and NOT_HANDED_OVER / VISIT_NOT_COMPLETED
    if (typeof window.applyManagementFilters === "function" && !window.applyManagementFilters._loanTypeEnhanced) {
      const origApplyMgmt = window.applyManagementFilters;
      const wrappedApplyMgmt = function () {
        const statusSel = document.getElementById("mgmtFilterStatus");
        const specialVisitFilter =
          statusSel &&
          (statusSel.value === "NOT_HANDED_OVER" ||
            statusSel.value === "VISIT_COMPLETED" ||
            statusSel.value === "VISIT_NOT_COMPLETED")
            ? statusSel.value
            : null;
        if (specialVisitFilter && statusSel) {
          // Temporarily set to ALL so origApplyMgmt renders all rows matching Month/Bank/Branch/Staff/Search,
          // then filter rows by Handover / Visit Completed vs Not Completed + Loan Type below.
          statusSel.value = "ALL";
        }
        try {
          origApplyMgmt.apply(this, arguments);
        } finally {
          if (specialVisitFilter && statusSel) {
            statusSel.value = specialVisitFilter;
          }
        }
        try {
          const ltFilter = document.getElementById("mgmtFilterLoanType")?.value || "ALL";
          if (ltFilter === "ALL" && !specialVisitFilter) return;
          const tbody = document.getElementById("mgmtTableBody");
          if (!tbody) return;
          const rows = Array.from(tbody.querySelectorAll("tr"));
          let visibleCount = 0;
          rows.forEach((tr) => {
            const text = (tr.textContent || "").toLowerCase();
            if (text.includes("no case records match")) return;
            let matchesLt = true;
            if (ltFilter !== "ALL") {
              const normLt = ltFilter.trim().toLowerCase();
              const shortCode =
                normLt === "vehicle loan" ? "-vl-" :
                normLt === "home loan" ? "-hl-" :
                normLt === "education loan" ? "-el-" :
                normLt === "personal loan" ? "-pl-" : "";
              matchesLt = text.includes(normLt) || Boolean(shortCode && text.includes(shortCode));
            }
            let matchesVisit = true;
            if (specialVisitFilter) {
              const rowCaseNo = (tr.querySelector("td div")?.textContent || "").trim();
              const rowCaseObj =
                rowCaseNo && typeof caseRegistry !== "undefined" && caseRegistry
                  ? caseRegistry[rowCaseNo]
                  : null;
              let isRowVisitCompleted = false;
              let isRowNotHandedOver = false;
              if (rowCaseObj) {
                isRowVisitCompleted = isFieldVisitCompleted(rowCaseObj);
                isRowNotHandedOver = isCaseNotHandedOverToAgent(rowCaseObj);
              } else {
                isRowVisitCompleted = text.includes("certified (udin)");
                isRowNotHandedOver =
                  !isRowVisitCompleted &&
                  (text.includes("not yet started") || text.includes("not yet allotted"));
              }
              if (specialVisitFilter === "NOT_HANDED_OVER") {
                matchesVisit = isRowNotHandedOver;
              } else if (specialVisitFilter === "VISIT_NOT_COMPLETED") {
                matchesVisit = !isRowVisitCompleted && !isRowNotHandedOver;
              } else {
                matchesVisit = isRowVisitCompleted;
              }
            }
            const show = matchesLt && matchesVisit;
            tr.style.display = show ? "" : "none";
            if (show) visibleCount++;
          });
          const countBadge = document.getElementById("mgmtFilteredCount");
          if (countBadge) countBadge.textContent = `${visibleCount} Cases Found`;
        } catch (_) {}
      };
      wrappedApplyMgmt._loanTypeEnhanced = true;
      window.applyManagementFilters = wrappedApplyMgmt;
    }

    if (typeof window.resetManagementFilters === "function" && !window.resetManagementFilters._loanTypeEnhanced) {
      const origResetMgmt = window.resetManagementFilters;
      const wrappedResetMgmt = function () {
        const ltEl = document.getElementById("mgmtFilterLoanType");
        if (ltEl) ltEl.value = "ALL";
        return origResetMgmt.apply(this, arguments);
      };
      wrappedResetMgmt._loanTypeEnhanced = true;
      window.resetManagementFilters = wrappedResetMgmt;
    }

    if (typeof window.rebuildBankFilterOptions === "function") {
      window.rebuildBankFilterOptions();
    }
    applyScrutinyTopFilters("init");
  }
  enforceTwoEmpanelledBanks();

  // ==========================================
  // WHATSAPP HANDOVER MESSAGE WITH APPLICANT/CO-APPLICANT MOBILES & CO-APPLICANT OFFICE ADDRESS
  // ==========================================
  window.generateHandoverMessage = function () {
    const c =
      typeof caseRegistry !== "undefined" &&
      typeof activeCaseId !== "undefined" &&
      caseRegistry[activeCaseId]
        ? caseRegistry[activeCaseId]
        : {};
    const caseNo = c.case_no || "CASE-2026-001";
    const applicant = c.applicant_name || "Applicant";
    const bank = c.bank || "Empanelled Bank";
    const branch = c.branch || "";
    const address = c.address || "";
    const officeAddress = c.office_address || "";
    const coApplicantAddress = c.co_applicant_address || "";
    let ffdObj = {};
    try {
      ffdObj =
        typeof c.field_form_data === "string"
          ? JSON.parse(c.field_form_data || "{}")
          : c.field_form_data || {};
    } catch (_) {
      ffdObj = {};
    }
    const offCoObj =
      ffdObj && typeof ffdObj.office_details_co === "object" && ffdObj.office_details_co
        ? ffdObj.office_details_co
        : {};
    const applicantPhone = String(
      c.phone || c.applicant_phone || ffdObj.contact_number || ""
    ).trim();
    const coApplicantPhone = String(
      c.co_applicant_phone || ffdObj.co_applicant_contact || offCoObj.contact_number || ""
    ).trim();
    const coApplicantOfficeAddress = String(
      c.co_applicant_office_address || offCoObj.address || offCoObj.firm_name || ""
    ).trim();
    const isMultiApplicant = Boolean(
      String(c.co_applicant_name || "").trim() || coApplicantAddress || coApplicantOfficeAddress
    );

    const user = document.getElementById("hoCredUser")
      ? document.getElementById("hoCredUser").textContent
      : "agent1";
    const pass = document.getElementById("hoCredPass")
      ? document.getElementById("hoCredPass").textContent
      : "agent1@123";
    const pwaLink = `${window.location.origin}/pwa?case=${encodeURIComponent(caseNo)}`;

    const applicantPhoneLine = applicantPhone
      ? `📞 *Applicant Mobile:* ${applicantPhone}\n`
      : "";
    const coLine = c.co_applicant_name
      ? `👥 *Co-Applicant:* ${c.co_applicant_name} (separate office verification required)\n`
      : "";
    const coPhoneLine =
      isMultiApplicant && coApplicantPhone
        ? `📞 *Co-Applicant Mobile:* ${coApplicantPhone}\n`
        : "";

    let extraCoApplicantsLines = "";
    [3, 4, 5].forEach((slotNum) => {
      const sName = String(c[`applicant_${slotNum}_name`] || "").trim();
      const sPhone = String(c[`applicant_${slotNum}_phone`] || "").trim();
      const sAddr = String(c[`applicant_${slotNum}_address`] || "").trim();
      if (sName) {
        extraCoApplicantsLines += `👥 *Co-Applicant ${slotNum - 1}:* ${sName}\n`;
        if (sPhone) {
          extraCoApplicantsLines += `📞 *Co-Applicant ${slotNum - 1} Mobile:* ${sPhone}\n`;
        }
        if (sAddr) {
          extraCoApplicantsLines += `🏠 *Co-Applicant ${slotNum - 1} Residence Address:* ${sAddr}\n`;
        }
      }
    });

    const officeLine = officeAddress ? `🏢 *Office / Workplace Address:* ${officeAddress}\n` : "";
    const coResidenceLine = coApplicantAddress
      ? `🏠 *Co-Applicant Residence Address (separate from applicant):* ${coApplicantAddress}\n`
      : "";
    const coOfficeLine =
      isMultiApplicant && coApplicantOfficeAddress
        ? `🏢 *Co-Applicant Office / Workplace Address:* ${coApplicantOfficeAddress}\n`
        : "";

    return (
      `🏛️ *NAIMISH N. SHAH & CO. CHARTERED ACCOUNTANTS*\n*Contact Point Verification (CPV) Order*\n\n` +
      `📋 *Case No:* ${caseNo}\n` +
      `👤 *Borrower:* ${applicant}\n` +
      applicantPhoneLine +
      coLine +
      coPhoneLine +
      extraCoApplicantsLines +
      `🏦 *Bank:* ${bank} (${branch})\n` +
      `🏠 *Residence Address:* ${address}\n` +
      officeLine +
      coResidenceLine +
      coOfficeLine +
      `\n` +
      `📲 *Open Field Agent Mobile PWA Link:*\n${pwaLink}\n\n` +
      `🔑 *Agent Login Credentials:*\n` +
      `• *Username:* ${user}\n` +
      `• *Password:* ${pass}`
    );
  };

  // ==========================================
  // UNLOCK GENDER IN EDIT CASE MODAL & AUTO-SYNC WITH MR. / MRS. / MISS. SALUTATION
  // ==========================================
  function inferGenderFromApplicantName(nameStr, fallbackGender) {
    const clean = String(nameStr || "").trim();
    if (/^(?:mrs\.?|miss\.?|ms\.?|smt\.?|kum\.?|kumari\.?)\s+/i.test(clean)) {
      return "Female";
    }
    if (/^(?:mr\.?|shri\.?)\s+/i.test(clean)) {
      return "Male";
    }
    if (fallbackGender && /^(?:male|female)$/i.test(String(fallbackGender).trim())) {
      return String(fallbackGender).trim().toLowerCase() === "female" ? "Female" : "Male";
    }
    return "Male";
  }

  function installEditModalGenderEnhancements() {
    const origOpenEditCaseModal = window.openEditCaseModal;
    if (typeof origOpenEditCaseModal === "function" && !origOpenEditCaseModal._genderEnhanced) {
      const wrappedOpen = async function (caseId) {
        const res = await origOpenEditCaseModal.apply(this, arguments);
        try {
          const cId = caseId || (typeof activeCaseId !== "undefined" ? activeCaseId : null);
          const c = (typeof caseRegistry !== "undefined" && cId && caseRegistry[cId]) ? caseRegistry[cId] : {};
          let ffObj = {};
          try {
            ffObj = typeof c.field_form_data === "string" ? JSON.parse(c.field_form_data || "{}") : (c.field_form_data || {});
          } catch (_) {
            ffObj = {};
          }
          const genderEl = document.getElementById("ecGender");
          const nameEl = document.getElementById("ecApplicantName");
          if (genderEl) {
            genderEl.disabled = false;
            const savedGender = c.gender || ffObj.gender || ffObj.applicant_gender || null;
            const currentName = (nameEl && nameEl.value) || c.applicant_name || "";
            genderEl.value = inferGenderFromApplicantName(currentName, savedGender);
          }
          ["ecPan", "ecAadhaar", "ecDob"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.readOnly = false;
          });
        } catch (_) {}
        return res;
      };
      wrappedOpen._genderEnhanced = true;
      window.openEditCaseModal = wrappedOpen;
    }

    const origSetSalutation = window.setEditNameSalutation;
    if (typeof origSetSalutation === "function" && !origSetSalutation._genderEnhanced) {
      const wrappedSalutation = function (inputId, salutation) {
        const res = origSetSalutation.apply(this, arguments);
        try {
          if (inputId === "ecApplicantName") {
            const genderEl = document.getElementById("ecGender");
            if (genderEl) {
              genderEl.disabled = false;
              const sal = String(salutation || "").toLowerCase();
              if (sal.startsWith("mr.") || sal === "mr") {
                genderEl.value = "Male";
              } else if (sal.startsWith("mrs") || sal.startsWith("miss") || sal.startsWith("ms")) {
                genderEl.value = "Female";
              }
            }
          }
        } catch (_) {}
        return res;
      };
      wrappedSalutation._genderEnhanced = true;
      window.setEditNameSalutation = wrappedSalutation;
    }

    const origHandleSaveCaseEdit = window.handleSaveCaseEdit;
    if (typeof origHandleSaveCaseEdit === "function" && !origHandleSaveCaseEdit._genderEnhanced) {
      const wrappedSave = async function (e) {
        const cId = document.getElementById("ecCaseId") ? document.getElementById("ecCaseId").value : null;
        const genderEl = document.getElementById("ecGender");
        const chosenGender = genderEl ? genderEl.value : null;
        const panEl = document.getElementById("ecPan");
        const aadhaarEl = document.getElementById("ecAadhaar");
        const dobEl = document.getElementById("ecDob");
        const chosenPan = panEl ? panEl.value.trim() : "";
        const chosenAadhaar = aadhaarEl ? aadhaarEl.value.trim() : "";
        const chosenDob = dobEl ? dobEl.value.trim() : "";

        const res = await origHandleSaveCaseEdit.apply(this, arguments);
        try {
          const c = (typeof caseRegistry !== "undefined" && cId && caseRegistry[cId]) ? caseRegistry[cId] : null;
          if (c) {
            if (chosenGender) c.gender = chosenGender;
            if (chosenPan) c.pan = chosenPan;
            if (chosenAadhaar) c.aadhaar_masked = chosenAadhaar;
            if (chosenDob) c.dob = chosenDob;
            const serverId = (typeof gfServerId === "function" && gfServerId(c)) || c.db_id || cId;
            if (serverId && chosenGender && typeof authHeaders === "function") {
              fetch(`/api/v1/cases/${encodeURIComponent(serverId)}/report-fields`, {
                method: "PATCH",
                headers: authHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({ gender: chosenGender, applicant_gender: chosenGender }),
              }).catch(() => {});
            }
            if (typeof activeCaseId !== "undefined" && cId === activeCaseId && typeof onCaseSelected === "function") {
              onCaseSelected(cId);
            }
          }
        } catch (_) {}
        return res;
      };
      wrappedSave._genderEnhanced = true;
      window.handleSaveCaseEdit = wrappedSave;
    }

    const nameInput = document.getElementById("ecApplicantName");
    if (nameInput && !nameInput._genderSyncBound) {
      nameInput._genderSyncBound = true;
      nameInput.addEventListener("input", () => {
        const genderEl = document.getElementById("ecGender");
        if (!genderEl) return;
        const val = nameInput.value.trim();
        if (/^(?:mrs\.?|miss\.?|ms\.?|smt\.?|kum\.?|kumari\.?)\s+/i.test(val)) {
          genderEl.value = "Female";
        } else if (/^(?:mr\.?|shri\.?)\s+/i.test(val)) {
          genderEl.value = "Male";
        }
      });
    }
  }
  installEditModalGenderEnhancements();

  // ==========================================
  // PURELY ADDITIVE: FIELD AGENT-WISE ACTIVITY, CASE, FORM & PHOTO TRACE
  // ==========================================
  let _agentTraceData = null; // { agents: [], cases_trace: [], agent_events: [] }
  let _alViewMode = "timeline"; // "timeline" | "agent_trace"
  let _rawTimelineEntries = [];

  const _escHtml = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  function switchActivityLogViewMode(mode) {
    _alViewMode = mode === "agent_trace" ? "agent_trace" : "timeline";
    const timelineWrap = document.getElementById("alTimelineViewWrap");
    const traceWrap = document.getElementById("alAgentTraceViewWrap");
    const btnTimeline = document.getElementById("alViewBtnTimeline");
    const btnTrace = document.getElementById("alViewBtnAgentTrace");
    const actionFilter = document.getElementById("alActionFilter");

    if (timelineWrap) timelineWrap.style.display = _alViewMode === "timeline" ? "block" : "none";
    if (traceWrap) traceWrap.style.display = _alViewMode === "agent_trace" ? "block" : "none";
    if (actionFilter) actionFilter.style.display = _alViewMode === "timeline" ? "" : "none";

    if (btnTimeline) {
      btnTimeline.className =
        _alViewMode === "timeline"
          ? "px-2.5 py-1 rounded-md font-bold bg-primary-container text-white shadow-2xs transition-all cursor-pointer"
          : "px-2.5 py-1 rounded-md font-semibold text-on-surface-variant hover:text-on-surface transition-all cursor-pointer";
    }
    if (btnTrace) {
      btnTrace.className =
        _alViewMode === "agent_trace"
          ? "px-2.5 py-1 rounded-md font-bold bg-primary-container text-white shadow-2xs transition-all cursor-pointer"
          : "px-2.5 py-1 rounded-md font-semibold text-on-surface-variant hover:text-on-surface transition-all cursor-pointer";
    }

    if (_alViewMode === "agent_trace") {
      if (!_agentTraceData) {
        loadAgentWiseActivityTrace();
      } else {
        renderAlAgentTraceTable();
      }
    } else {
      renderFilteredTimelineRows();
    }
  }

  function selectFieldAgentInActivityLog(agentId) {
    const sel = document.getElementById("alAgentFilter");
    if (sel) {
      // Toggle back to ALL if clicking the already-selected agent card while in agent_trace mode
      if (sel.value === agentId && _alViewMode === "agent_trace") {
        sel.value = "ALL";
      } else {
        sel.value = agentId || "ALL";
      }
    }
    switchActivityLogViewMode("agent_trace");
    renderAgentSummaryCardsStrip();
    renderAlAgentTraceTable();
  }

  function selectFieldAgentInAalModal(agentId) {
    const sel = document.getElementById("aalAgentFilter");
    if (sel) {
      sel.value = sel.value === agentId ? "ALL" : (agentId || "ALL");
    }
    renderAalAgentCards();
    renderEnhancedAgentTraceInAal();
  }

  function openCaseFromActivityTrace(caseId) {
    if (!caseId) return;
    if (typeof closeActivityLog === "function") closeActivityLog();
    if (typeof closeAgentActivityLog === "function") closeAgentActivityLog();
    try {
      if (typeof activeCaseId !== "undefined") activeCaseId = caseId;
      if (typeof onCaseSelected === "function") onCaseSelected(caseId);
      if (typeof switchMainPortalView === "function") switchMainPortalView("scrutiny");
    } catch (_) {}
  }

  function _buildAgentCardHtml(ag, selectedAgentId, clickFnName) {
    const isSel = selectedAgentId && String(selectedAgentId) === String(ag.agent_id);
    const borderCls = isSel
      ? "border-2 border-primary-container bg-blue-50/90 ring-2 ring-primary-container/20 shadow-sm"
      : "border border-outline-variant bg-white hover:border-primary-container/60 hover:bg-surface-container-low/60 shadow-2xs";
    const onlineBadge = ag.is_online_now
      ? `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-[9px] font-bold"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>Online</span>`
      : `<span class="font-mono text-[9px] text-outline">${_escHtml(ag.username)}</span>`;
    return `
      <div onclick="${clickFnName}('${_escHtml(ag.agent_id)}')" class="p-2.5 rounded-xl ${borderCls} cursor-pointer transition-all space-y-1.5">
        <div class="flex items-center justify-between gap-1">
          <div class="font-headline font-bold text-xs text-on-surface truncate">👤 ${_escHtml(ag.agent_name)}</div>
          ${onlineBadge}
        </div>
        <div class="grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
          <div class="p-1 rounded bg-slate-100 border border-slate-200">
            <div class="font-bold text-slate-900 text-xs">${ag.total_cases_taken || 0}</div>
            <div class="text-[8px] text-slate-600 uppercase">Cases Taken</div>
          </div>
          <div class="p-1 rounded bg-emerald-50 border border-emerald-200">
            <div class="font-bold text-emerald-800 text-xs">${ag.visits_completed || 0}</div>
            <div class="text-[8px] text-emerald-700 uppercase">Visit Done</div>
          </div>
          <div class="p-1 rounded bg-amber-50 border border-amber-200">
            <div class="font-bold text-amber-800 text-xs">${ag.visits_pending || 0}</div>
            <div class="text-[8px] text-amber-700 uppercase">Pending</div>
          </div>
        </div>
        <div class="flex items-center justify-between text-[10px] font-mono pt-0.5 border-t border-slate-200/80 text-slate-700">
          <span>📝 Forms: <strong>${ag.forms_submitted || 0}</strong></span>
          <span>📸 Photos: <strong>${ag.total_photos_uploaded || 0}</strong></span>
          <span>🤳 Selfies: <strong>${ag.total_selfies_uploaded || 0}</strong></span>
        </div>
        <div class="text-[9px] font-mono text-outline truncate">
          Last: <span class="text-on-surface font-semibold">${_escHtml(ag.last_active_ist)}</span>${ag.latest_case_no && ag.latest_case_no !== "—" ? ` • <span class="text-primary-container font-bold">${_escHtml(ag.latest_case_no)}</span>` : ""}
        </div>
      </div>`;
  }

  function renderAgentSummaryCardsStrip() {
    const strip = document.getElementById("alAgentCardsStrip");
    const totalsBadge = document.getElementById("alAgentSummaryTotalsBadge");
    const sel = document.getElementById("alAgentFilter");
    if (!strip || !_agentTraceData) return;
    const agents = _agentTraceData.agents || [];
    const selectedId = sel ? sel.value : "ALL";

    const totCases = agents.reduce((s, a) => s + (a.total_cases_taken || 0), 0);
    const totDone = agents.reduce((s, a) => s + (a.visits_completed || 0), 0);
    const totForms = agents.reduce((s, a) => s + (a.forms_submitted || 0), 0);
    const totPhotos = agents.reduce((s, a) => s + (a.total_photos_uploaded || 0), 0);
    if (totalsBadge) {
      totalsBadge.textContent = `${agents.length} Field Agents • ${totCases} Cases Allotted • ${totDone} Visits Done • ${totForms} Forms • ${totPhotos} Photos Uploaded`;
    }

    if (!agents.length) {
      strip.innerHTML = `<div class="col-span-4 text-center py-3 text-xs font-mono text-outline">No field agents registered.</div>`;
      return;
    }
    strip.innerHTML = agents.map((ag) => _buildAgentCardHtml(ag, selectedId, "selectFieldAgentInActivityLog")).join("");
  }

  function renderAalAgentCards() {
    const box = document.getElementById("aalAgentCardsContainer");
    const sel = document.getElementById("aalAgentFilter");
    if (!box || !_agentTraceData) return;
    const agents = _agentTraceData.agents || [];
    const selectedId = sel ? sel.value : "ALL";
    box.innerHTML = agents.map((ag) => _buildAgentCardHtml(ag, selectedId, "selectFieldAgentInAalModal")).join("");
  }

  function populateAlAgentFilterOptions() {
    if (!_agentTraceData) return;
    const agents = _agentTraceData.agents || [];
    const alSel = document.getElementById("alAgentFilter");
    if (alSel) {
      const prev = alSel.value || "ALL";
      alSel.innerHTML =
        `<option value="ALL">👤 All Users &amp; Field Agents</option>` +
        `<option value="ONLY_AGENTS">⚡ All Field Agents (PWA Activity)</option>` +
        agents
          .map(
            (a) =>
              `<option value="${_escHtml(a.agent_id)}">👤 ${_escHtml(a.agent_name)} (${a.total_cases_taken || 0} Cases • ${a.total_photos_uploaded || 0} Photos)</option>`
          )
          .join("");
      if (Array.from(alSel.options).some((o) => o.value === prev)) {
        alSel.value = prev;
      }
    }

    const aalSel = document.getElementById("aalAgentFilter");
    if (aalSel) {
      const prevAal = aalSel.value || "ALL";
      aalSel.innerHTML =
        `<option value="ALL">All Field Agents (${agents.length})</option>` +
        agents
          .map(
            (a) =>
              `<option value="${_escHtml(a.agent_id)}">👤 ${_escHtml(a.agent_name)} (${a.total_cases_taken || 0} Cases • ${a.visits_completed || 0} Done)</option>`
          )
          .join("") +
        `<option value="UNASSIGNED">📋 Cases Not Handover to Agent</option>`;
      if (Array.from(aalSel.options).some((o) => o.value === prevAal)) {
        aalSel.value = prevAal;
      }
    }
  }

  function _renderTraceTableRowsHtml(casesList) {
    if (!casesList || !casesList.length) {
      return `<tr><td colspan="7" class="py-8 text-center font-mono text-xs text-outline">No matching cases found for the selected Field Agent / filter.</td></tr>`;
    }
    return casesList
      .map((c) => {
        const selfie = c.selfie || {};
        const photos = c.photos || {};
        const form = c.form || {};

        // 1. Selfie Column HTML
        let selfieHtml = "";
        if (selfie.uploaded) {
          const distBadge =
            typeof selfie.distance_m === "number"
              ? `<div class="text-[10px] font-mono ${selfie.distance_m <= 150 ? "text-emerald-700" : "text-rose-700"} font-bold">● ${selfie.distance_m}m (${selfie.distance_m <= 150 ? "COMPLIANT" : "BREACH"})</div>`
              : "";
          selfieHtml = `
            <div class="flex items-start gap-2">
              <img src="${_escHtml(selfie.thumb_url || selfie.url)}" onclick="window.open('${_escHtml(selfie.url)}', '_blank')" class="w-10 h-10 rounded-lg object-cover border border-emerald-400 cursor-pointer shrink-0 shadow-2xs" title="Click to inspect full Attendance Selfie"/>
              <div class="min-w-0">
                <span class="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-[9px] font-bold">✓ SELFIE UPLOADED</span>
                <div class="font-mono text-[10px] text-outline mt-0.5">${_escHtml(selfie.captured_at_ist || "")}</div>
                ${distBadge}
              </div>
            </div>`;
        } else {
          selfieHtml = `
            <span class="inline-block px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-mono text-[9px] font-bold">⏳ NO SELFIE YET</span>
            <div class="font-mono text-[10px] text-outline mt-0.5">Not yet captured</div>`;
        }

        // 2. Photos Uploaded Column HTML
        const totPhotos = photos.total_site_photos || 0;
        const resSlots = photos.residence_slots || [];
        const workSlots = photos.work_slots || [];
        const coWorkSlots = photos.co_work_slots || [];
        const allSlots = [...resSlots, ...workSlots, ...coWorkSlots];

        let photosHtml = "";
        if (totPhotos > 0) {
          const resPills = [1, 2, 3, 4]
            .map((s) => {
              const found = resSlots.find((x) => x.slot === s);
              return found
                ? `<a href="${_escHtml(found.url)}" target="_blank" class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-[9px] font-bold hover:bg-emerald-200" title="Residence Slot ${s}: ${_escHtml(found.filename)} (${_escHtml(found.captured_at_ist)})">H${s}✓</a>`
                : `<span class="px-1 py-0.5 rounded bg-slate-100 text-slate-400 font-mono text-[9px]">H${s}</span>`;
            })
            .join(" ");
          const workPills =
            workSlots.length > 0
              ? `<div class="flex items-center gap-1 flex-wrap mt-1"><span class="font-mono text-[9px] text-outline">Office (${workSlots.length}/4):</span>` +
                [1, 2, 3, 4]
                  .map((s) => {
                    const found = workSlots.find((x) => x.slot === s);
                    return found
                      ? `<a href="${_escHtml(found.url)}" target="_blank" class="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-mono text-[9px] font-bold hover:bg-blue-200" title="Office Slot ${s}: ${_escHtml(found.filename)} (${_escHtml(found.captured_at_ist)})">W${s}✓</a>`
                      : `<span class="px-1 py-0.5 rounded bg-slate-100 text-slate-400 font-mono text-[9px]">W${s}</span>`;
                  })
                  .join(" ") +
                `</div>`
              : "";
          const thumbsRow = allSlots
            .slice(0, 6)
            .map(
              (sl) =>
                `<img src="${_escHtml(sl.thumb_url || sl.url)}" onclick="window.open('${_escHtml(sl.url)}', '_blank')" class="w-8 h-8 rounded object-cover border border-outline-variant cursor-pointer hover:scale-105 transition-transform" title="${_escHtml(sl.folder)} Slot ${sl.slot} • ${_escHtml(sl.filename)} • ${_escHtml(sl.captured_at_ist)}"/>`
            )
            .join("");

          photosHtml = `
            <div class="space-y-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-mono text-[9px] font-bold">📸 ${totPhotos} Photo${totPhotos === 1 ? "" : "s"} Uploaded</span>
                <span class="font-mono text-[9px] text-outline">Home: <b>${resSlots.length}/4</b>${workSlots.length ? ` • Office: <b>${workSlots.length}/4</b>` : ""}${coWorkSlots.length ? ` • Co-Off: <b>${coWorkSlots.length}/4</b>` : ""}</span>
              </div>
              <div class="flex items-center gap-1 flex-wrap"><span class="font-mono text-[9px] text-outline">Home:</span> ${resPills}</div>
              ${workPills}
              <div class="flex items-center gap-1 pt-0.5">${thumbsRow}</div>
              ${photos.latest_photo_at_ist ? `<div class="font-mono text-[9px] text-outline">Uploaded: ${_escHtml(photos.latest_photo_at_ist)}</div>` : ""}
            </div>`;
        } else {
          photosHtml = `
            <span class="inline-block px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-mono text-[9px] font-bold">❌ 0 Photos Uploaded</span>
            <div class="font-mono text-[10px] text-outline mt-0.5">Home: 0/4 • Office: 0/4</div>`;
        }

        // 3. Form Submitted Column HTML
        let formHtml = "";
        if (form.submitted) {
          const stayOwn = [
            form.period_of_stay ? `${form.period_of_stay} stay` : "",
            form.ownership || "",
            form.building_type ? `(${form.building_type})` : "",
          ]
            .filter(Boolean)
            .join(" • ");
          const workInfo = [form.occupation, form.firm_name, form.designation].filter(Boolean).join(" — ");
          formHtml = `
            <div class="space-y-0.5 max-w-[250px]">
              <div class="flex items-center gap-1 flex-wrap">
                <span class="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-mono text-[9px] font-bold">✓ FORM SUBMITTED</span>
                <span class="font-mono text-[9px] text-outline">${_escHtml(form.source || "PWA")}</span>
              </div>
              ${form.person_met ? `<div class="text-[11px] text-on-surface truncate" title="Person Met: ${_escHtml(form.person_met)}"><b>Met:</b> ${_escHtml(form.person_met)}</div>` : ""}
              ${stayOwn ? `<div class="text-[10px] font-mono text-on-surface-variant truncate" title="${_escHtml(stayOwn)}">${_escHtml(stayOwn)}</div>` : ""}
              ${form.neighbours ? `<div class="text-[10px] font-mono text-emerald-800 truncate" title="Neighbours: ${_escHtml(form.neighbours)}"><b>Neigh:</b> ${_escHtml(form.neighbours)}</div>` : ""}
              ${workInfo ? `<div class="text-[10px] font-mono text-indigo-800 truncate" title="Work: ${_escHtml(workInfo)}"><b>Work:</b> ${_escHtml(workInfo)}</div>` : ""}
              ${form.submitted_at_ist ? `<div class="font-mono text-[9px] text-outline">${_escHtml(form.submitted_at_ist)}</div>` : ""}
              <div class="pt-1 flex items-center gap-1">
                <button type="button" onclick="downloadCaseFieldFormPdf('${_escHtml(c.case_id)}', 1)" class="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[9px] font-bold cursor-pointer shadow-2xs" title="Download PDF of the PWA Questionnaire Form filled by the Field Agent (Proof of Entry)">📥 Form PDF (Proof)</button>
                <button type="button" onclick="downloadCaseFieldFormPdf('${_escHtml(c.case_id)}', 0)" class="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 font-mono text-[9px] font-bold cursor-pointer" title="View Filled Form PDF in new tab">👁️ View</button>
              </div>
            </div>`;
        } else {
          formHtml = `
            <span class="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-300 font-mono text-[9px] font-bold">⏳ FORM NOT SUBMITTED</span>
            <div class="font-mono text-[10px] text-outline mt-0.5">Awaiting questionnaire</div>`;
        }

        const coLine = c.co_applicant_name
          ? `<div class="text-[10px] font-mono text-purple-700">Co-App: ${_escHtml(c.co_applicant_name)}</div>`
          : "";
        const visitStatusPill =
          c.status === "CERTIFIED"
            ? `<span class="px-2 py-0.5 rounded-full font-mono text-[9px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">🏅 CERTIFIED (UDIN)</span>`
            : totPhotos > 0
              ? `<span class="px-2 py-0.5 rounded-full font-mono text-[9px] font-bold bg-blue-100 text-primary-container border border-blue-300">✓ VISIT DONE (${totPhotos} PHOTOS)</span>`
              : !c.agent_id
                ? `<span class="px-2 py-0.5 rounded-full font-mono text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-300">📋 NOT HANDOVER</span>`
                : `<span class="px-2 py-0.5 rounded-full font-mono text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-300">⏳ VISIT PENDING</span>`;

        return `
          <tr class="hover:bg-surface-container-low/60 transition-colors align-top">
            <td class="py-2.5 px-3 whitespace-nowrap">
              <div class="font-headline font-bold text-xs text-on-surface">👤 ${_escHtml(c.agent_name)}</div>
              <div class="font-mono text-[10px] text-outline mt-0.5">Allotted: ${_escHtml(c.assigned_at_ist)}</div>
              <div class="font-mono text-[10px] text-primary-container font-semibold">Last Act: ${_escHtml(c.last_activity_ist)}</div>
            </td>
            <td class="py-2.5 px-3">
              <button type="button" onclick="openCaseFromActivityTrace('${_escHtml(c.case_id)}')" class="font-mono text-xs font-bold text-primary-container hover:underline cursor-pointer">${_escHtml(c.case_no)}</button>
              <div class="font-bold text-on-surface text-xs mt-0.5">${_escHtml(c.applicant_name)}</div>
              ${coLine}
              <div class="text-[10px] text-on-surface-variant font-medium mt-0.5">${_escHtml(c.bank_name)}${c.branch ? ` (${_escHtml(c.branch)})` : ""} • ${_escHtml(c.loan_type)}</div>
            </td>
            <td class="py-2.5 px-3">${selfieHtml}</td>
            <td class="py-2.5 px-3">${photosHtml}</td>
            <td class="py-2.5 px-3">${formHtml}</td>
            <td class="py-2.5 px-3 whitespace-nowrap">
              ${visitStatusPill}
              <div class="mt-1">${_renderStatusPill(c.status)}</div>
            </td>
            <td class="py-2.5 px-3 text-right whitespace-nowrap">
              <button type="button" onclick="openCaseFromActivityTrace('${_escHtml(c.case_id)}')" class="px-2.5 py-1 rounded-lg bg-primary-container hover:bg-primary text-white font-mono text-[10px] font-bold cursor-pointer shadow-2xs">Open Case</button>
            </td>
          </tr>`;
      })
      .join("");
  }

  function renderAlAgentTraceTable() {
    const tbody = document.getElementById("alAgentTraceTableBody");
    const banner = document.getElementById("alAgentTraceBannerText");
    if (!tbody || !_agentTraceData) return;

    const agentSel = document.getElementById("alAgentFilter")?.value || "ALL";
    const statusSel = document.getElementById("alTraceStatusFilter")?.value || "ALL";
    const q = (document.getElementById("alSearchInput")?.value || "").toLowerCase().trim();

    let rows = (_agentTraceData.cases_trace || []).slice();
    if (agentSel === "ONLY_AGENTS") {
      rows = rows.filter((c) => Boolean(c.agent_id));
    } else if (agentSel !== "ALL") {
      rows = rows.filter((c) => String(c.agent_id) === String(agentSel));
    } else {
      // Default to showing agent-allotted cases first
      rows = rows.filter((c) => Boolean(c.agent_id) || (c.photos && c.photos.total_site_photos > 0) || (c.form && c.form.submitted));
    }

    if (statusSel === "PHOTOS_UPLOADED") {
      rows = rows.filter((c) => (c.photos && c.photos.total_site_photos > 0) || c.status === "CERTIFIED");
    } else if (statusSel === "FORM_SUBMITTED") {
      rows = rows.filter((c) => c.form && c.form.submitted);
    } else if (statusSel === "PENDING_PHOTOS") {
      rows = rows.filter((c) => (!c.photos || c.photos.total_site_photos === 0) && c.status !== "CERTIFIED");
    }

    if (q) {
      rows = rows.filter(
        (c) =>
          (c.case_no || "").toLowerCase().includes(q) ||
          (c.applicant_name || "").toLowerCase().includes(q) ||
          (c.co_applicant_name || "").toLowerCase().includes(q) ||
          (c.bank_name || "").toLowerCase().includes(q) ||
          (c.branch || "").toLowerCase().includes(q) ||
          (c.agent_name || "").toLowerCase().includes(q) ||
          (c.form && c.form.person_met || "").toLowerCase().includes(q) ||
          (c.form && c.form.firm_name || "").toLowerCase().includes(q)
      );
    }

    const doneCnt = rows.filter((c) => c.photos && c.photos.total_site_photos > 0).length;
    const formCnt = rows.filter((c) => c.form && c.form.submitted).length;
    const photoSum = rows.reduce((s, c) => s + ((c.photos && c.photos.total_site_photos) || 0), 0);
    const agObj = (_agentTraceData.agents || []).find((a) => String(a.agent_id) === String(agentSel));
    if (banner) {
      const whoText = agObj ? `Field Agent: ${agObj.agent_name}` : "All Field Agents";
      banner.innerHTML = `${_escHtml(whoText)} — <span class="text-primary-container">${rows.length} Case(s)</span> • <span class="text-emerald-700">${doneCnt} with Photos Uploaded (${photoSum} Photos)</span> • <span class="text-blue-800">${formCnt} Form(s) Submitted</span>`;
    }

    tbody.innerHTML = _renderTraceTableRowsHtml(rows);
  }

  function renderEnhancedAgentTraceInAal() {
    const tbody = document.getElementById("aalTableBody");
    const summary = document.getElementById("aalSummaryBar");
    if (!tbody || !_agentTraceData) return;

    const agentSel = document.getElementById("aalAgentFilter")?.value || "ALL";
    const visitSel = document.getElementById("aalVisitFilter")?.value || "ALL";
    const q = (document.getElementById("aalSearchInput")?.value || "").toLowerCase().trim();

    let rows = (_agentTraceData.cases_trace || []).slice();
    if (agentSel === "UNASSIGNED") {
      rows = rows.filter((c) => !c.agent_id);
    } else if (agentSel !== "ALL") {
      rows = rows.filter((c) => String(c.agent_id) === String(agentSel));
    }

    if (visitSel === "PHOTOS_UPLOADED") {
      rows = rows.filter((c) => (c.photos && c.photos.total_site_photos > 0) || c.status === "CERTIFIED");
    } else if (visitSel === "FORM_SUBMITTED") {
      rows = rows.filter((c) => c.form && c.form.submitted);
    } else if (visitSel === "PENDING_PHOTOS") {
      rows = rows.filter((c) => (!c.photos || c.photos.total_site_photos === 0) && c.status !== "CERTIFIED");
    }

    if (q) {
      rows = rows.filter(
        (c) =>
          (c.case_no || "").toLowerCase().includes(q) ||
          (c.applicant_name || "").toLowerCase().includes(q) ||
          (c.co_applicant_name || "").toLowerCase().includes(q) ||
          (c.bank_name || "").toLowerCase().includes(q) ||
          (c.branch || "").toLowerCase().includes(q) ||
          (c.agent_name || "").toLowerCase().includes(q)
      );
    }

    const doneCnt = rows.filter((c) => (c.photos && c.photos.total_site_photos > 0) || c.status === "CERTIFIED").length;
    const formCnt = rows.filter((c) => c.form && c.form.submitted).length;
    const photoSum = rows.reduce((s, c) => s + ((c.photos && c.photos.total_site_photos) || 0), 0);
    if (summary) {
      summary.classList.remove("hidden");
      summary.innerHTML = `<strong>${rows.length}</strong> case(s) shown · <strong class="text-emerald-700">${doneCnt}</strong> visits completed (<strong>${photoSum}</strong> photos uploaded) · <strong class="text-blue-800">${formCnt}</strong> forms submitted`;
    }

    tbody.innerHTML = _renderTraceTableRowsHtml(rows);
  }

  // Enhance the chronological timeline table (#alTableBody) so it can be filtered by Field Agent & Search
  // and resolves raw agent_id UUIDs to human-readable Field Agent names
  function renderFilteredTimelineRows() {
    const tbody = document.getElementById("alTableBody");
    if (!tbody || !_rawTimelineEntries.length) return;
    const agentSel = document.getElementById("alAgentFilter")?.value || "ALL";
    const q = (document.getElementById("alSearchInput")?.value || "").toLowerCase().trim();

    const agentMapById = new Map();
    const agentMapByAlias = new Map();
    if (_agentTraceData && Array.isArray(_agentTraceData.agents)) {
      _agentTraceData.agents.forEach((a) => {
        agentMapById.set(String(a.agent_id), a.agent_name);
        if (a.username) agentMapByAlias.set(String(a.username).toLowerCase(), a);
        if (a.agent_name) {
          agentMapByAlias.set(String(a.agent_name).toLowerCase(), a);
          agentMapByAlias.set(String(a.agent_name).split(/\s+/)[0].toLowerCase(), a);
        }
      });
    }
    const caseAgentMap = new Map();
    if (_agentTraceData && Array.isArray(_agentTraceData.cases_trace)) {
      _agentTraceData.cases_trace.forEach((ct) => {
        if (ct.case_no && ct.agent_id) {
          caseAgentMap.set(String(ct.case_no).toUpperCase(), {
            agent_id: String(ct.agent_id),
            agent_name: ct.agent_name,
            applicant_name: ct.applicant_name,
          });
        }
      });
    }

    const PWA_AGENT_ACTIONS = new Set([
      "CASE_ASSIGNED",
      "DOCUMENT_UPLOADED",
      "FIELD_FORM_SUBMITTED",
      "AGENT_CHECK_IN",
      "AGENT_CHECK_OUT",
    ]);

    const filtered = _rawTimelineEntries.filter((e) => {
      const m = e.extra_metadata || {};
      const cInfo = e.case_no ? caseAgentMap.get(String(e.case_no).toUpperCase()) : null;
      const metaAgentId = m.agent_id ? String(m.agent_id) : null;
      const metaAgentAlias = String(m.agent || m.agent_name || "").toLowerCase();
      const matchedAliasAg = metaAgentAlias ? agentMapByAlias.get(metaAgentAlias) : null;
      const resolvedAgId =
        (agentMapById.has(String(e.user_id)) ? String(e.user_id) : null) ||
        (metaAgentId && agentMapById.has(metaAgentId) ? metaAgentId : null) ||
        (matchedAliasAg ? String(matchedAliasAg.agent_id) : null) ||
        (cInfo ? cInfo.agent_id : null);

      if (agentSel === "ONLY_AGENTS") {
        if (!resolvedAgId && !PWA_AGENT_ACTIONS.has(e.action)) return false;
      } else if (agentSel !== "ALL") {
        if (String(resolvedAgId) !== String(agentSel)) return false;
      }

      if (q) {
        const hay = `${e.action || ""} ${e.user_name || ""} ${e.case_no || ""} ${cInfo ? cInfo.applicant_name : ""} ${JSON.stringify(m)}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-on-surface-variant font-mono text-xs">No activity entries match the selected Field Agent / search filter.</td></tr>`;
      return;
    }

    const ACTION_LABELS =
      typeof ACTIVITY_ACTION_LABELS !== "undefined"
        ? ACTIVITY_ACTION_LABELS
        : {
            USER_LOGIN: "Logged in",
            CASE_CREATED: "Created case",
            CASE_UPDATED: "Edited case details",
            CASE_DELETED: "Deleted case",
            CASE_ASSIGNED: "Assigned case to agent",
            DOCUMENT_UPLOADED: "Uploaded a document (PWA)",
            FIELD_FORM_SUBMITTED: "Submitted field form (PWA)",
            AGENT_CHECK_IN: "Checked in on-site (PWA)",
            AGENT_CHECK_OUT: "Checked out on-site (PWA)",
          };

    tbody.innerHTML = filtered
      .map((e) => {
        const when = new Date(e.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
        const label = ACTION_LABELS[e.action] || e.action;
        const who = _escHtml(e.user_name || "Unknown user");
        const cInfo = e.case_no ? caseAgentMap.get(String(e.case_no).toUpperCase()) : null;
        const caseCell = e.case_no
          ? `<button type="button" onclick="openCaseFromActivityTrace('${_escHtml(e.case_id || e.case_no)}')" class="font-mono text-[11px] font-bold text-primary-container hover:underline cursor-pointer">${_escHtml(e.case_no)}</button>${cInfo && cInfo.applicant_name ? `<div class="text-[10px] text-outline truncate max-w-[160px]">${_escHtml(cInfo.applicant_name)}</div>` : ""}`
          : "—";

        const m = e.extra_metadata || {};
        let detailsHtml = "";
        if (e.action === "CASE_ASSIGNED") {
          const aid = m.agent_id ? String(m.agent_id) : "";
          const agFull =
            (aid && agentMapById.get(aid)) ||
            (m.agent && agentMapByAlias.get(String(m.agent).toLowerCase())?.agent_name) ||
            m.agent ||
            "Field Agent";
          detailsHtml = `<span class="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-900 border border-indigo-200 font-mono text-[10px] font-bold">👉 Allotted to Field Agent: ${_escHtml(agFull)}</span>`;
        } else if (e.action === "DOCUMENT_UPLOADED") {
          const fname = m.filename || "photo.jpg";
          const gps =
            m.lat != null && m.lon != null
              ? ` • GPS: ${Number(m.lat).toFixed(4)}°N, ${Number(m.lon).toFixed(4)}°E`
              : "";
          const dist = m.distance_m != null ? ` (${Math.round(Number(m.distance_m))}m)` : "";
          detailsHtml = `<span class="text-emerald-800 font-semibold">📸 Uploaded Photo:</span> <code class="bg-slate-100 px-1 rounded">${_escHtml(fname)}</code><span class="font-mono text-[10px] text-outline">${_escHtml(gps + dist)}</span>`;
        } else if (e.action === "FIELD_FORM_SUBMITTED" || e.action === "FIELD_FORM_PDF_INGESTED") {
          const agName = m.agent_name || e.user_name || "Field Agent";
          const targetId = e.case_id || e.case_no || "";
          const dlBtns = targetId
            ? ` <button type="button" onclick="downloadCaseFieldFormPdf('${_escHtml(targetId)}', 1)" class="ml-1.5 px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[9px] font-bold cursor-pointer">📥 Form PDF (Proof)</button>`
            : "";
          detailsHtml = `<span class="text-blue-800 font-semibold">📝 Due Diligence Form Submitted</span> by <b>${_escHtml(agName)}</b>${dlBtns}`;
        } else {
          const rawSum =
            typeof activityLogMetaSummary === "function"
              ? activityLogMetaSummary(e.action, m)
              : Object.keys(m)
                  .slice(0, 3)
                  .map((k) => `${k}: ${m[k]}`)
                  .join(" • ");
          detailsHtml = _escHtml(rawSum);
        }

        const isDelete = (e.action || "").includes("DELETED");
        return `
          <tr class="border-b border-outline-variant/50 hover:bg-surface-container-low/50 ${isDelete ? "bg-rose-50/50" : ""}">
            <td class="py-2 pr-3 font-mono text-[11px] whitespace-nowrap">${_escHtml(when)}</td>
            <td class="py-2 pr-3 font-semibold ${isDelete ? "text-rose-700" : "text-on-surface"}">${_escHtml(label)}</td>
            <td class="py-2 pr-3 font-medium">${who}</td>
            <td class="py-2 pr-3">${caseCell}</td>
            <td class="py-2 pr-3 text-on-surface-variant text-[11px]">${detailsHtml}</td>
          </tr>`;
      })
      .join("");
  }

  function buildFallbackAgentTraceFromRegistry() {
    const entries = getDeduplicatedRegistryEntries();
    const agentsList = Array.isArray(window.allAgents) ? window.allAgents : [];
    const agentStats = new Map();
    agentsList.forEach((a) => {
      if (!a || !a.id) return;
      agentStats.set(String(a.id), {
        agent_id: String(a.id),
        agent_name: a.full_name || "Field Agent",
        username: (a.email || "").split("@")[0] || "",
        designation: a.designation || "Field Verification Officer",
        is_online_now: false,
        total_cases_taken: 0,
        visits_completed: 0,
        visits_pending: 0,
        forms_submitted: 0,
        total_photos_uploaded: 0,
        total_selfies_uploaded: 0,
        last_active_ist: "—",
        latest_case_no: "—",
      });
    });

    const casesTrace = [];
    for (const [id, c] of entries) {
      if (!c) continue;
      const photosCount = getCaseSitePhotosCount(c);
      const hasSelfie = Boolean(c.has_agent_selfie || c.selfie_verified);
      let ff = {};
      try {
        ff = typeof c.field_form_data === "string" ? JSON.parse(c.field_form_data || "{}") : (c.field_form_data || {});
      } catch (_) {}
      const off = (ff && ff.office_details) || {};
      const hasForm = Boolean(
        (ff && (ff.person_met || ff.period_of_stay || ff.neighbour_1 || off.firm_name)) ||
        (c.person_met && c.person_met !== "Not yet visited")
      );
      const agId = c.assigned_agent_id ? String(c.assigned_agent_id) : null;
      const agObj = agId ? agentStats.get(agId) : null;
      const isDone = isFieldVisitCompleted(c);
      if (agObj) {
        agObj.total_cases_taken++;
        if (isDone) agObj.visits_completed++;
        else agObj.visits_pending++;
        if (hasForm) agObj.forms_submitted++;
        agObj.total_photos_uploaded += photosCount;
        if (hasSelfie) agObj.total_selfies_uploaded++;
        if (agObj.latest_case_no === "—") agObj.latest_case_no = c.case_no || "—";
      }
      const fmtDt = c.created_at && typeof fmtAalDate === "function" ? fmtAalDate(c.created_at) : "—";
      casesTrace.push({
        case_id: String(c.db_id || id),
        case_no: c.case_no || "—",
        applicant_name: c.applicant_name || "—",
        co_applicant_name: c.co_applicant_name || "",
        bank_name: c.bank || "—",
        branch: c.branch || "",
        loan_type: c.loan_type || "Loan",
        loan_amount: c.loan_amount,
        target_address: c.address || "",
        status: c.status || "DRAFT",
        is_visit_done: isDone,
        agent_id: agId,
        agent_name: agObj ? agObj.agent_name : (c.agent || "Not Yet Allotted"),
        assigned_at_ist: agId ? fmtDt : "Not Allotted",
        last_activity_ist: fmtDt,
        selfie: {
          uploaded: hasSelfie,
          url: c.agent_selfie || "/static/placeholders/photo_pending.svg",
          thumb_url: c.agent_selfie || "/static/placeholders/photo_pending.svg",
          captured_at_ist: c.visit_date && c.visit_date !== "Not yet visited" ? c.visit_date : null,
          distance_m: c.distance_m,
        },
        photos: {
          total_site_photos: photosCount,
          residence_count: photosCount,
          work_count: 0,
          co_work_count: 0,
          residence_slots: [],
          work_slots: [],
          co_work_slots: [],
          latest_photo_at_ist: null,
        },
        form: {
          submitted: hasForm,
          submitted_at_ist: null,
          source: "PWA Field Form",
          person_met: (ff && ff.person_met) || c.person_met || "",
          period_of_stay: (ff && ff.period_of_stay) || c.stay_period || "",
          ownership: (ff && ff.ownership) || c.ownership || "",
          building_type: (ff && ff.building_type) || "",
          neighbours: [ff && ff.neighbour_1, ff && ff.neighbour_2].filter(Boolean).join(" • "),
          occupation: (ff && ff.occupation) || off.occupation || "",
          firm_name: off.firm_name || "",
          designation: off.position || off.designation || "",
        },
        recent_events: [],
      });
    }
    return {
      agents: Array.from(agentStats.values()),
      cases_trace: casesTrace,
      agent_events: [],
    };
  }

  async function loadAgentWiseActivityTrace() {
    if (!_agentTraceData) {
      _agentTraceData = buildFallbackAgentTraceFromRegistry();
      populateAlAgentFilterOptions();
      renderAgentSummaryCardsStrip();
      renderAlAgentTraceTable();
      renderAalAgentCards();
      renderEnhancedAgentTraceInAal();
    }
    try {
      const res = await fetch("/api/v1/activity-log/agent-wise-trace", {
        headers: _getAuthHeaders(),
      });
      if (!res.ok) return;
      _agentTraceData = await res.json();
      populateAlAgentFilterOptions();
      renderAgentSummaryCardsStrip();
      renderAlAgentTraceTable();
      renderAalAgentCards();
      renderEnhancedAgentTraceInAal();
      if (_rawTimelineEntries.length > 0 && _alViewMode === "timeline") {
        renderFilteredTimelineRows();
      }
    } catch (_) {}
  }

  function onActivityLogAgentOrSearchChanged() {
    renderAgentSummaryCardsStrip();
    if (_alViewMode === "agent_trace") {
      renderAlAgentTraceTable();
    } else {
      renderFilteredTimelineRows();
    }
  }

  async function refreshActivityLogAndAgentTrace() {
    await Promise.all([
      typeof window.loadActivityLog === "function" ? window.loadActivityLog() : Promise.resolve(),
      loadAgentWiseActivityTrace(),
    ]);
  }

  // Wrap loadActivityLog & openAgentActivityLog additively without modifying ca-portal.js
  if (typeof window.loadActivityLog === "function" && !window.loadActivityLog._agentTraceWrapped) {
    const origLoadAl = window.loadActivityLog;
    const wrappedLoadAl = async function () {
      const actionFilter = document.getElementById("alActionFilter");
      const qs = new URLSearchParams({ limit: "300" });
      if (actionFilter && actionFilter.value) qs.set("action", actionFilter.value);
      try {
        const loading = document.getElementById("alLoadingState");
        if (loading) loading.style.display = "flex";
        const [logRes] = await Promise.all([
          fetch(`/api/v1/activity-log?${qs.toString()}`, { headers: _getAuthHeaders() }),
          loadAgentWiseActivityTrace(),
        ]);
        if (loading) loading.style.display = "none";
        if (logRes && logRes.ok) {
          _rawTimelineEntries = await logRes.json();
          renderFilteredTimelineRows();
          return;
        }
      } catch (_) {}
      return origLoadAl.apply(this, arguments);
    };
    wrappedLoadAl._agentTraceWrapped = true;
    window.loadActivityLog = wrappedLoadAl;
  }

  if (typeof window.openActivityLog === "function" && !window.openActivityLog._agentTraceWrapped) {
    const origOpenAl = window.openActivityLog;
    const wrappedOpenAl = function () {
      const r = origOpenAl.apply(this, arguments);
      loadAgentWiseActivityTrace();
      return r;
    };
    wrappedOpenAl._agentTraceWrapped = true;
    window.openActivityLog = wrappedOpenAl;
  }

  if (typeof window.openAgentActivityLog === "function" && !window.openAgentActivityLog._agentTraceWrapped) {
    const origOpenAal = window.openAgentActivityLog;
    const wrappedOpenAal = async function () {
      const modal = document.getElementById("modalAgentActivityLog");
      const loading = document.getElementById("aalLoadingState");
      if (modal) modal.style.display = "flex";
      if (loading) loading.style.display = "flex";
      await loadAgentWiseActivityTrace();
      if (loading) loading.style.display = "none";
    };
    wrappedOpenAal._agentTraceWrapped = true;
    window.openAgentActivityLog = wrappedOpenAal;
  }

  if (typeof window.renderAgentActivityLog === "function" && !window.renderAgentActivityLog._agentTraceWrapped) {
    const wrappedRenderAal = function () {
      renderAalAgentCards();
      renderEnhancedAgentTraceInAal();
    };
    wrappedRenderAal._agentTraceWrapped = true;
    window.renderAgentActivityLog = wrappedRenderAal;
  }

  function downloadCaseFieldFormPdf(caseIdOrNo, downloadFlag = 1) {
    const target = String(caseIdOrNo || "").trim();
    if (!target) {
      alert("Please select a case first.");
      return;
    }
    const dl = Number(downloadFlag) === 0 ? 0 : 1;
    const url = `/api/v1/cases/${encodeURIComponent(target)}/field-form-pdf?download=${dl}&t=${Date.now()}`;
    window.open(url, "_blank", "noopener");
  }

  function downloadActiveCaseFieldFormPdf(downloadFlag = 1) {
    const cid =
      (typeof window.activeCaseId !== "undefined" && window.activeCaseId) ||
      document.getElementById("caseSelectorSelect")?.value ||
      "";
    let resolvedId = cid;
    if (typeof window.caseRegistry !== "undefined" && window.caseRegistry && cid && window.caseRegistry[cid]) {
      resolvedId = window.caseRegistry[cid].db_id || cid;
    }
    downloadCaseFieldFormPdf(resolvedId, downloadFlag);
  }

  window.downloadCaseFieldFormPdf = downloadCaseFieldFormPdf;
  window.downloadActiveCaseFieldFormPdf = downloadActiveCaseFieldFormPdf;
  window.switchActivityLogViewMode = switchActivityLogViewMode;
  window.selectFieldAgentInActivityLog = selectFieldAgentInActivityLog;
  window.selectFieldAgentInAalModal = selectFieldAgentInAalModal;
  window.openCaseFromActivityTrace = openCaseFromActivityTrace;
  window.renderAlAgentTraceTable = renderAlAgentTraceTable;
  window.renderEnhancedAgentTraceInAal = renderEnhancedAgentTraceInAal;
  window.onActivityLogAgentOrSearchChanged = onActivityLogAgentOrSearchChanged;
  window.refreshActivityLogAndAgentTrace = refreshActivityLogAndAgentTrace;

  setTimeout(() => {
    enforceTwoEmpanelledBanks();
    const bannerDateInp = document.getElementById("mgmtDailyReportDateInput");
    if (bannerDateInp && !bannerDateInp.value) {
      try {
        const istNow = new Date(Date.now() + 5.5 * 3600 * 1000);
        bannerDateInp.value = istNow.toISOString().slice(0, 10);
      } catch (_) {}
    }
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
