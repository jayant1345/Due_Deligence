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

  // Determines whether the Field Agent has completed the site visit for a case
  const VISIT_COMPLETED_STATUSES = new Set([
    "PENDING_CA_REVIEW",
    "APPROVED",
    "CERTIFIED",
    "FLAGGED",
    "REJECTED",
  ]);

  const HARDCODED_DEMO_CASE_IDS = new Set([
    "b901fc63-12a8-4e32-9c02-e20984cfb001",
    "c102ad74-23b9-4f43-ad13-f31095d0c002",
    "d203be85-34ca-4a54-be24-a42106e1d003",
    "e304cf96-45db-4b65-cf35-b53217f2e004",
    "f405da07-56ec-4c76-da46-c64328a3f005",
  ]);

  function hasFieldFormSubmissionOnCase(c) {
    if (!c) return false;
    if (c.stay_period && c.stay_period !== "Not yet verified on site") return true;
    if (c.person_met && c.person_met !== "Not yet visited") return true;
    if (c.field_form_data) {
      try {
        const ffd = typeof c.field_form_data === "string" ? JSON.parse(c.field_form_data) : c.field_form_data;
        if (ffd && typeof ffd === "object") {
          if (ffd.person_met || ffd.period_of_stay || ffd.ownership || ffd.neighbour_1 || (ffd.office_details && ffd.office_details.firm_name)) {
            return true;
          }
        }
      } catch (_) {}
    }
    return false;
  }

  function isFieldVisitCompleted(c) {
    if (!c) return false;
    const st = String(c.status || "").trim().toUpperCase();
    if (VISIT_COMPLETED_STATUSES.has(st)) return true;
    // Also treat as visit-completed if real GPS capture distance or field form submission is already on record
    if (typeof c.distance_m === "number" && !isNaN(c.distance_m)) return true;
    if (c.capture_lat && c.capture_lat !== "—" && c.capture_lon && c.capture_lon !== "—") return true;
    if (hasFieldFormSubmissionOnCase(c)) return true;
    return false;
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
      // Only trigger full network reload of case documents when the active case actually changed!
      // Previously, calling onCaseSelected(targetCaseId) unconditionally on every filter change
      // fired 4 heavy network requests (documents, separated-documents, auto-locate, geofence)
      // even when the same case remained selected, causing the 1–3 second delay on filter change.
      if (!options.skipCaseLoad && targetCaseId !== prevActiveId && typeof onCaseSelected === "function") {
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
              const isRowVisitCompleted =
                text.includes("pending ca review") ||
                text.includes("certified") ||
                text.includes("approved") ||
                text.includes("flagged") ||
                text.includes("rejected") ||
                text.includes("compliant") ||
                text.includes("breach");
              const isRowNotHandedOver =
                !isRowVisitCompleted &&
                (text.includes("not yet started") || text.includes("not yet allotted"));
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
