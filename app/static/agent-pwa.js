      // Register PWA Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js?v=19", { updateViaCache: "none" }).then((reg) => {
        try { reg.update(); } catch (_) {}
        console.log("CPV Service Worker Registered");
      }).catch(err => console.log("SW error:", err));
    }

    // Multi-case Registry for Field PWA with CA Office Verified Dossiers
    const caseRegistryPwa = {
      "UBI-HL-2026-531": {
        id: "b8df82fd-e33a-493e-8d4b-a802861cf294",
        case_no: "UBI-HL-2026-531",
        applicant: "Mrs. Bhavnaben Balvantbhai Pargi",
        phone: "+91 99099 18965",
        amount: "₹15.00 Lakhs",
        loan_type: "PERSONAL LOAN CPV",
        branch: "Bagodara Branch",
        bank: "Union Bank of India",
        address: "3, Vajinath Society, Opp. Dev Vihar, Kalikund Saroda Road, Dholka, Ahmedabad-382225",
        pin: "382225",
        ward: "Dholka Municipality",
        lat: 23.2156,
        lon: 72.6369,
        dev_lat: 23.2154,
        dev_lon: 72.6367,
        occupation: "Job",
        firm_name: "District Panchayat Education Committee",
        position: "Primary Teacher (સરકારી શિક્ષક)",
        designation: "Primary Teacher (સરકારી શિક્ષક)",
        office_address: "District Panchayat Education Committee, Dholka, Gujarat-382260",
        aadhaar_no: "XXXX - XXXX - 4402",
        dob: "12/04/1982 | Female",
        pan_no: "AQWPP7814M",
        utility_provider: "UGVCL Electricity Bill",
        utility_no: "Consumer # 08912/44102/7",
        meter_name: "Meter: Balvantbhai Pargi",
        age: "42 years",
        marital: "Married (પરિણિત)",
        qualification: "B.Ed, Primary School Teacher",
        ownership: "Owned",
        building_type: "Tenement / Row House",
        bhk: "2 BHK",
        stay_period: "14 years",
        owner_name: "( Balvantbhai Pargi ) Husband",
        person_met: "Mrs. Bhavnaben Pargi (Self / Applicant)",
        neighbors: ["1 - Shaileshbhai Parmar - Neighbour", "2 - Jayantibhai Rathod - Neighbour"],
        family_members: [
          { name: "Bhavnaben Pargi", relation: "Self / Applicant", age: "42", occupation: "Primary Teacher", earning: "Yes" },
          { name: "Balvantbhai Pargi", relation: "Husband", age: "45", occupation: "Govt Employee", earning: "Yes" }
        ],
        aadhaar_front_img: "/static/placeholders/doc_pending.svg",
        aadhaar_back_img: "/static/placeholders/doc_pending.svg",
        pan_front_img: "/static/placeholders/doc_pending.svg",
        pan_back_img: "/static/placeholders/doc_pending.svg",
        utility_front_img: "/static/placeholders/doc_pending.svg",
        form16_img: "/static/placeholders/doc_pending.svg",
        payslip_img: "/static/placeholders/doc_pending.svg",
        sale_deed_img: "/static/placeholders/doc_pending.svg",
        index2_img: "/static/placeholders/doc_pending.svg"
      },
      "UBI-HL-2026-20L": {
        id: "b901fc63-12a8-4e32-9c02-e20984cfb001",
        case_no: "UBI-HL-2026-20L",
        applicant: "Mrs. Rajkunvarba Pradeepsinh Vaghela",
        phone: "8160166900",
        amount: "₹20.00 Lakhs",
        loan_type: "HOUSING LOAN CPV",
        address: "31, Siddhi Vinayak Bunglows, Near Gayatri Temple, Pethapur, Gandhinagar 382610",
        pin: "382610",
        ward: "Gandhinagar Municipal Corp",
        lat: 23.2536,
        lon: 72.6322,
        dev_lat: 23.2534,
        dev_lon: 72.6324,
        aadhaar_no: "XXXX - XXXX - 7689",
        dob: "30/05/1997 | Female",
        pan_no: "BYMPG8996E",
        utility_provider: "UGVCL Electricity Bill",
        utility_no: "Consumer # 04128/99102/3",
        meter_name: "Meter: Pradeepsinh Vaghela",
        age: "29 years",
        marital: "Married (પરિણિત)",
        qualification: "Graduate",
        ownership: "Owned",
        building_type: "Bungalow",
        bhk: "3 BHK",
        stay_period: "9 years",
        owner_name: "( Ranjanba Vaghela ) Mother in law",
        person_met: "Pradeepsinh Vaghela - 8160166900 (Husband)",
        neighbors: ["1 - Narendrasinh Devda - Neighbour", "2 - Bhagvatsinh Rathod - Neighbour"],
        family_members: [
          { name: "Rajkunvarba Vaghela", relation: "Self / Applicant", age: "29", occupation: "Housewife", earning: "No" },
          { name: "Pradeepsinh Vaghela", relation: "Husband", age: "32", occupation: "Business / Job", earning: "Yes" },
          { name: "Ranjanba Vaghela", relation: "Mother-in-law", age: "58", occupation: "Senior Citizen", earning: "No" },
          { name: "Takshdevsinh", relation: "Son", age: "5", occupation: "Student", earning: "No" }
        ],
        aadhaar_front_img: "/static/placeholders/doc_pending.svg",
        aadhaar_back_img: "/static/placeholders/doc_pending.svg",
        pan_front_img: "/static/placeholders/doc_pending.svg",
        pan_back_img: "/static/placeholders/doc_pending.svg",
        utility_front_img: "/static/placeholders/doc_pending.svg",
        form16_img: "/static/placeholders/doc_pending.svg",
        payslip_img: "/static/placeholders/doc_pending.svg",
        sale_deed_img: "/static/placeholders/doc_pending.svg",
        index2_img: "/static/placeholders/doc_pending.svg"
      },
      "SBI-HL-2026-45L": {
        id: "c102ad74-23b9-4f43-ad13-f31095d0c002",
        case_no: "SBI-HL-2026-45L",
        applicant: "Mr. Vikramaditya Sengupta",
        amount: "₹45.00 Lakhs",
        loan_type: "RESIDENTIAL PROPERTY CPV",
        address: "Flat 402, 4th Floor, Imperial Heights, Plot 12B, Bandra West, Mumbai 400050",
        pin: "400050",
        ward: "Ward H/West (MCGM)",
        lat: 19.0596,
        lon: 72.8295,
        dev_lat: 19.0592,
        dev_lon: 72.8298,
        aadhaar_no: "XXXX - XXXX - 4102",
        dob: "14/08/1988 | Male",
        pan_no: "AJVPS8831K",
        utility_provider: "MSEDCL Mumbai Bill",
        utility_no: "Consumer # 90021/88319/1",
        meter_name: "Meter: Vikramaditya Sengupta"
      },
      "HDFC-LAP-2026-60L": {
        id: "d203be85-34ca-4a54-be24-a42106e1d003",
        case_no: "HDFC-LAP-2026-60L",
        applicant: "Mr. Jayeshbhai K. Patel",
        amount: "₹60.00 Lakhs",
        loan_type: "LOAN AGAINST PROPERTY",
        address: "14, Shanti Kunj, Near Commerce Six Roads, Navrangpura, Ahmedabad 380009",
        pin: "380009",
        ward: "West Zone (AMC)",
        lat: 23.0372,
        lon: 72.5621,
        dev_lat: 23.0370,
        dev_lon: 72.5623,
        aadhaar_no: "XXXX - XXXX - 9812",
        dob: "22/11/1976 | Male",
        pan_no: "BKRPP4920M",
        utility_provider: "Torrent Power Ltd.",
        utility_no: "Consumer # 10092/44120/8",
        meter_name: "Meter: Jayeshbhai K. Patel"
      },
      "ICICI-PL-2026-15L": {
        id: "e304cf96-45db-4b65-cf35-b53217f2e004",
        case_no: "ICICI-PL-2026-15L",
        applicant: "Dr. Ananya Sharma",
        amount: "₹15.00 Lakhs",
        loan_type: "PROFESSIONAL LOAN",
        address: "C-12, Riverview Towers, Opp Gandhi Ashram, Ashram Road, Ahmedabad 380027",
        pin: "380027",
        ward: "Central Zone (AMC)",
        lat: 23.0305,
        lon: 72.5735,
        dev_lat: 23.0303,
        dev_lon: 72.5738,
        aadhaar_no: "XXXX - XXXX - 3390",
        dob: "05/03/1992 | Female",
        pan_no: "DFMPS1092Q",
        utility_provider: "Torrent Power Ltd.",
        utility_no: "Consumer # 08912/77321/4",
        meter_name: "Meter: Dr. Ananya Sharma"
      },
      "BOB-HL-2026-30L": {
        id: "f405da07-56ec-4c76-da46-c64328a3f005",
        case_no: "BOB-HL-2026-30L",
        applicant: "Mr. Mahendrasinh Solanki",
        amount: "₹30.00 Lakhs",
        loan_type: "HOUSING PURCHASE LOAN",
        address: "Plot 452/2, Sector 11, Gandhinagar Capital Complex, Gandhinagar 382011",
        pin: "382011",
        ward: "Sector 11 (GMC)",
        lat: 23.2156,
        lon: 72.6369,
        dev_lat: 23.2154,
        dev_lon: 72.6367,
        aadhaar_no: "XXXX - XXXX - 6721",
        dob: "19/07/1983 | Male",
        pan_no: "CRVMS7710R",
        utility_provider: "UGVCL Electricity Bill",
        utility_no: "Consumer # 05510/33918/9",
        meter_name: "Meter: Mahendrasinh Solanki"
      }
    };
    caseRegistryPwa["b8df82fd-e33a-493e-8d4b-a802861cf294"] = caseRegistryPwa["UBI-HL-2026-531"];

    const _urlParamsInit = new URLSearchParams(window.location.search);
    const _paramCaseInit = _urlParamsInit.get("case") || _urlParamsInit.get("case_id");
    const _savedCaseKey = localStorage.getItem("pwa_active_case_key");
    const _savedCaseId = localStorage.getItem("pwa_active_case_id");

    let activeCaseKey = _paramCaseInit || _savedCaseKey || "UBI-HL-2026-531";
    // Only reuse _savedCaseId if the URL's ?case= matches _savedCaseKey (or no ?case= was passed);
    // if the agent opened a NEW WhatsApp link (?case=Case2) while _savedCaseKey was Case1, never
    // initialize sampleCaseId with Case1's UUID!
    let sampleCaseId = (!_paramCaseInit || _paramCaseInit === _savedCaseKey)
      ? (_savedCaseId || (caseRegistryPwa[activeCaseKey] ? caseRegistryPwa[activeCaseKey].id : "b8df82fd-e33a-493e-8d4b-a802861cf294"))
      : (caseRegistryPwa[activeCaseKey] ? caseRegistryPwa[activeCaseKey].id : undefined);
    let TARGET_LAT = (caseRegistryPwa[activeCaseKey] || {}).lat || 23.2156;
    let TARGET_LON = (caseRegistryPwa[activeCaseKey] || {}).lon || 72.6369;
    let currentDeviceLat = (caseRegistryPwa[activeCaseKey] || {}).dev_lat || 23.2154;
    let currentDeviceLon = (caseRegistryPwa[activeCaseKey] || {}).dev_lon || 72.6367;

    // Dedicated Evidence Slots State (Triple Folder Support: Residence, Office, and -
    // for dual-applicant cases only - the co-applicant's own separate Office folder,
    // since the co-applicant frequently works at a different premises while sharing
    // one residence with the primary applicant.)
    let currentPwaFolder = "residence"; // 'residence', 'office', or 'co_office'
    let activeUploadSlot = 1;
    let activeDocType = "PROPERTY_EXTERIOR";
    const uploadedResidenceSlots = { 1: false, 2: false, 3: false, 4: false };
    const uploadedOfficeSlots = { 1: false, 2: false, 3: false, 4: false };
    const uploadedCoOfficeSlots = { 1: false, 2: false, 3: false, 4: false };
    const uploadedCoResidenceSlots = { 1: false, 2: false, 3: false, 4: false };
    const uploadedHome3Slots = { 1: false, 2: false, 3: false, 4: false };
    const uploadedHome4Slots = { 1: false, 2: false, 3: false, 4: false };
    const uploadedHome5Slots = { 1: false, 2: false, 3: false, 4: false };
    const uploadedSlots = uploadedResidenceSlots; // backward compatibility

    // Additional (unbounded) photos beyond the 4 mandatory named slots per section - tracked
    // by slot number > 4 so they reuse the exact same capture/review/upload pipeline as the
    // mandatory slots (geotagging, server watermarking, offline queueing) without being counted
    // toward the "X of 4 complete" mandatory checklist.
    const extraPhotoNextSlot = { residence: 4, office: 4, co_office: 4, co_residence: 4, home_3: 4, home_4: 4, home_5: 4 };

    // Single lookup table for everything that varies per folder, so handlePhotoUpload/
    // finalizePhotoCapture/discardAndRetakePhoto/updateEvidenceProgress each branch on
    // this instead of re-deriving folder-specific IDs/keys/params in several places.
    // home_3/4/5 are applicants 3-5's home-visit-only slots (per bank rule, no office visit for
    // these) - same 4-slot structure as co_residence, just one static folder per extra slot.
    const PWA_FOLDER_INFO = {
      residence: { slotIdPrefix: "slot", storageKey: "slot", uploadFolder: "residence", defaultDocType: "PROPERTY_EXTERIOR", label: "Residence", slotsMap: uploadedResidenceSlots },
      office: { slotIdPrefix: "slotOffice", storageKey: "office_slot", uploadFolder: "work", defaultDocType: "OFFICE_FACADE", label: "Office", slotsMap: uploadedOfficeSlots },
      co_office: { slotIdPrefix: "slotCoOffice", storageKey: "co_office_slot", uploadFolder: "co_work", defaultDocType: "CO_OFFICE_FACADE", label: "Co-Applicant Office", slotsMap: uploadedCoOfficeSlots },
      co_residence: { slotIdPrefix: "slotCoResidence", storageKey: "co_residence_slot", uploadFolder: "co_residence", defaultDocType: "PROPERTY_EXTERIOR", label: "Co-Applicant Residence", slotsMap: uploadedCoResidenceSlots },
      home_3: { slotIdPrefix: "slotHome3", storageKey: "home_3_slot", uploadFolder: "home_3", defaultDocType: "PROPERTY_EXTERIOR", label: "Applicant 3 Residence", slotsMap: uploadedHome3Slots },
      home_4: { slotIdPrefix: "slotHome4", storageKey: "home_4_slot", uploadFolder: "home_4", defaultDocType: "PROPERTY_EXTERIOR", label: "Applicant 4 Residence", slotsMap: uploadedHome4Slots },
      home_5: { slotIdPrefix: "slotHome5", storageKey: "home_5_slot", uploadFolder: "home_5", defaultDocType: "PROPERTY_EXTERIOR", label: "Applicant 5 Residence", slotsMap: uploadedHome5Slots },
    };

    // Snapshot every mandatory slot's pristine, no-photo-yet markup (thumb icon, "PENDING"
    // badge, capture button text) once, right after the page's own HTML has rendered them -
    // restoring to this on every case switch is what actually clears a PREVIOUS case's photo
    // thumbnails, instead of leaving them visible while the newly-switched-to case's own
    // documents are still loading over the network (or never load at all, e.g. on a flaky
    // field connection).
    const PWA_SLOT_DEFAULTS = {};
    Object.keys(PWA_FOLDER_INFO).forEach(folder => {
      const info = PWA_FOLDER_INFO[folder];
      for (let n = 1; n <= 4; n++) {
        const thumbEl = document.getElementById(`${info.slotIdPrefix}${n}Thumb`);
        const badgeEl = document.getElementById(`${info.slotIdPrefix}${n}Badge`);
        const btnTextEl = document.getElementById(`${info.slotIdPrefix}${n}BtnText`);
        if (thumbEl || badgeEl || btnTextEl) {
          PWA_SLOT_DEFAULTS[`${folder}_${n}`] = {
            thumbHTML: thumbEl ? thumbEl.innerHTML : null,
            badgeHTML: badgeEl ? badgeEl.innerHTML : null,
            badgeClass: badgeEl ? badgeEl.className : null,
            btnText: btnTextEl ? btnTextEl.textContent : null,
          };
        }
      }
    });

    // Clears every mandatory slot thumbnail/badge and "Additional Photos" gallery, in every
    // folder (residence/office/co_office/co_residence/home_3-5), back to its pristine empty
    // state. Must run on every actual case switch, BEFORE the new case's own documents have
    // loaded - otherwise a brand-new case momentarily (or, if the load ever fails or the agent
    // acts before it finishes, permanently) shows whichever photos were last captured for the
    // PREVIOUS case, still sitting untouched in these same DOM slots.
    function resetAllPwaPhotoSlotsUi() {
      Object.keys(PWA_FOLDER_INFO).forEach(folder => {
        const info = PWA_FOLDER_INFO[folder];
        for (let n = 1; n <= 4; n++) {
          const d = PWA_SLOT_DEFAULTS[`${folder}_${n}`];
          const thumbEl = document.getElementById(`${info.slotIdPrefix}${n}Thumb`);
          if (thumbEl) thumbEl.innerHTML = (d && d.thumbHTML !== null) ? d.thumbHTML : `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
          const badgeEl = document.getElementById(`${info.slotIdPrefix}${n}Badge`);
          if (badgeEl) {
            badgeEl.className = (d && d.badgeClass !== null) ? d.badgeClass : "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold";
            badgeEl.innerHTML = (d && d.badgeHTML !== null) ? d.badgeHTML : "PENDING";
          }
          const btnTextEl = document.getElementById(`${info.slotIdPrefix}${n}BtnText`);
          if (btnTextEl) btnTextEl.textContent = (d && d.btnText !== null) ? d.btnText : "Capture Photo";
          info.slotsMap[n] = false;
        }
        const gallery = document.getElementById(`extraGallery_${folder}`);
        if (gallery) gallery.innerHTML = "";
        if (typeof updateExtraPhotoCount === "function") updateExtraPhotoCount(folder);
        extraPhotoNextSlot[folder] = 4;
      });
      if (typeof updateEvidenceProgress === "function") updateEvidenceProgress();
    }

    // In-memory active slot evidence cache so even when mobile localStorage hits its 5MB quota
    // on the 4th photo, or while an upload is in flight / queued offline, loadCaseDocumentsIntoPwa()
    // never resets a captured slot back to PENDING.
    const inMemorySlotEvidence = {};
    let cameraPickerOpenUntil = 0;

    function pruneOversizedPwaLocalStorage(keepCaseId, keepCaseNo) {
      try {
        const toRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (!k) continue;
          if (k.startsWith("pwa_evidence_") || k.startsWith("selfie_")) {
            const raw = localStorage.getItem(k) || "";
            const matchesCurrent =
              (keepCaseId && k.includes(String(keepCaseId))) ||
              (keepCaseNo && k.toUpperCase().includes(String(keepCaseNo).toUpperCase()));
            // Remove any stale evidence from other cases or oversized (>80KB) legacy 1600px base64 entries
            if (!matchesCurrent || raw.length > 80000) {
              toRemove.push(k);
            }
          }
        }
        toRemove.forEach((k) => {
          try {
            localStorage.removeItem(k);
          } catch (_) {}
        });
      } catch (_) {}
    }
    // Clean up any legacy 5MB-clogging base64 entries immediately on script load
    pruneOversizedPwaLocalStorage(
      localStorage.getItem("pwa_active_case_id"),
      localStorage.getItem("pwa_active_case_key")
    );

    function safeSetSlotEvidenceCache(caseId, caseNo, storageKey, slotIdx, payloadObj, thumbSrc) {
      const memPayload = Object.assign({}, payloadObj);
      if (caseId) {
        inMemorySlotEvidence[`pwa_evidence_${caseId}_${storageKey}_${slotIdx}`] = memPayload;
      }
      if (caseNo) {
        inMemorySlotEvidence[`pwa_evidence_${caseNo}_${storageKey}_${slotIdx}`] = memPayload;
      }
      const lsPayloadObj = Object.assign({}, payloadObj, {
        src: thumbSrc || payloadObj.src,
      });
      const serialized = JSON.stringify(lsPayloadObj);
      const writeLs = () => {
        if (caseId) localStorage.setItem(`pwa_evidence_${caseId}_${storageKey}_${slotIdx}`, serialized);
        if (caseNo) localStorage.setItem(`pwa_evidence_${caseNo}_${storageKey}_${slotIdx}`, serialized);
      };
      try {
        writeLs();
      } catch (quotaErr) {
        pruneOversizedPwaLocalStorage(caseId, caseNo);
        try {
          writeLs();
        } catch (_) {}
      }
    }

    function dataUrlToBlob(dataUrl) {
      try {
        if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) return null;
        const parts = dataUrl.split(",");
        if (parts.length < 2) return null;
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      } catch (_) {
        return null;
      }
    }

    function getValidCachedSlotEvidence(caseId, caseNo, storageKey, slotIdx) {
      const keys = [
        caseId ? `pwa_evidence_${caseId}_${storageKey}_${slotIdx}` : null,
        caseNo ? `pwa_evidence_${caseNo}_${storageKey}_${slotIdx}` : null,
      ].filter(Boolean);
      for (const k of keys) {
        const memParsed = inMemorySlotEvidence[k];
        if (memParsed && memParsed.src) {
          if (typeof memParsed.src === "string" && memParsed.src.startsWith("/api/v1/cases/documents/")) {
            delete inMemorySlotEvidence[k];
            continue;
          }
          if (
            (!memParsed.caseId || !caseId || String(memParsed.caseId) === String(caseId)) &&
            (!memParsed.caseNo || !caseNo || String(memParsed.caseNo).toUpperCase() === String(caseNo).toUpperCase())
          ) {
            return memParsed;
          }
        }
      }
      for (const k of keys) {
        try {
          const raw = localStorage.getItem(k);
          if (!raw) continue;
          const parsed = JSON.parse(raw);
          if (!parsed || !parsed.src) continue;
          if (typeof parsed.src === "string" && parsed.src.startsWith("/api/v1/cases/documents/")) {
            localStorage.removeItem(k);
            continue;
          }
          // Strict cross-case ownership verification:
          // 1. If explicit caseId or caseNo was stamped on the cached payload, it MUST match this case.
          if (parsed.caseId && caseId && String(parsed.caseId) !== String(caseId)) {
            localStorage.removeItem(k);
            continue;
          }
          if (parsed.caseNo && caseNo && String(parsed.caseNo).toUpperCase() !== String(caseNo).toUpperCase()) {
            localStorage.removeItem(k);
            continue;
          }
          // 2. If src is a server /storage/case_<uuid_hex>/ URL, verify the UUID hex in the path matches caseId!
          if (typeof parsed.src === "string" && parsed.src.startsWith("/storage/case_") && caseId) {
            const expectedHex = String(caseId).replace(/-/g, "").toLowerCase();
            const pathMatch = parsed.src.match(/\/storage\/case_([0-9a-f]{32})\//i);
            if (pathMatch && pathMatch[1].toLowerCase() !== expectedHex) {
              localStorage.removeItem(k);
              continue;
            }
          }
          return parsed;
        } catch (e) {}
      }
      return null;
    }

    // Switch between Residence, Office/Workplace, and (dual-applicant cases) Co-Applicant
    // Office / Co-Applicant Residence photo folders in the PWA. Co-Applicant Residence only
    // applies when the CA office has flagged the co-applicant as living at a different address
    // from the primary applicant - most dual-applicant cases share one home and never show it.
    const PWA_FOLDER_TAB_IDS = { residence: "pwaTabResidence", office: "pwaTabOffice", co_office: "pwaTabCoOffice", co_residence: "pwaTabCoResidence", home_3: "pwaTabHome3", home_4: "pwaTabHome4", home_5: "pwaTabHome5" };
    const PWA_FOLDER_CONTAINER_IDS = { residence: "pwaResidenceSlotsContainer", office: "pwaOfficeSlotsContainer", co_office: "pwaCoOfficeSlotsContainer", co_residence: "pwaCoResidenceSlotsContainer", home_3: "pwaHome3SlotsContainer", home_4: "pwaHome4SlotsContainer", home_5: "pwaHome5SlotsContainer" };
    const PWA_FOLDER_INSTRUCTIONS = {
      residence: "Upload mandatory geotagged residential photographs in the designated slots below. For employed/business applicants, switch to Office Evidence to capture workplace photos.",
      office: "🏢 OFFICE / WORKPLACE EVIDENCE: Capture school/office entrance, signboard/nameplate, work area/staff desk, and field staff workplace verification selfie.",
      co_office: "🏢 CO-APPLICANT OFFICE / WORKPLACE EVIDENCE: Capture the co-applicant's own office/school entrance, signboard, work area, and field staff verification selfie.",
      co_residence: "🏠 CO-APPLICANT RESIDENCE EVIDENCE: The co-applicant lives at a separate address - capture their society/building gate, house door & nameplate, living room & meter, and the person met at their site.",
      home_3: "🏠 APPLICANT 3 RESIDENCE EVIDENCE: Home visit only (no office visit required) - capture society/building gate, house door & nameplate, living room & meter, and the person met at site.",
      home_4: "🏠 APPLICANT 4 RESIDENCE EVIDENCE: Home visit only (no office visit required) - capture society/building gate, house door & nameplate, living room & meter, and the person met at site.",
      home_5: "🏠 APPLICANT 5 RESIDENCE EVIDENCE: Home visit only (no office visit required) - capture society/building gate, house door & nameplate, living room & meter, and the person met at site.",
    };
    const PWA_TAB_ACTIVE_CLASS = "flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-primary-container text-white shadow-xs";
    const PWA_TAB_INACTIVE_CLASS = "flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container";

    function switchPwaPhotoFolder(folder) {
      currentPwaFolder = folder;
      for (const key of Object.keys(PWA_FOLDER_TAB_IDS)) {
        const tab = document.getElementById(PWA_FOLDER_TAB_IDS[key]);
        if (tab) tab.className = (key === folder ? PWA_TAB_ACTIVE_CLASS : PWA_TAB_INACTIVE_CLASS) + (tab.classList.contains("hidden") ? " hidden" : "");
        const cont = document.getElementById(PWA_FOLDER_CONTAINER_IDS[key]);
        if (cont) cont.classList.toggle("hidden", key !== folder);
      }
      const inst = document.getElementById("pwaFolderInstructionText");
      if (inst) inst.textContent = PWA_FOLDER_INSTRUCTIONS[folder] || PWA_FOLDER_INSTRUCTIONS.residence;
      updateEvidenceProgress();
    }

    // Show/hide the "Co-Applicant Office" photo tab depending on whether this case actually
    // has a co-applicant - most cases are single-applicant and must never show an empty,
    // confusing extra tab.
    function setCoApplicantTabVisible(visible) {
      const tab = document.getElementById("pwaTabCoOffice");
      if (!tab) return;
      tab.classList.toggle("hidden", !visible);
      if (!visible && currentPwaFolder === "co_office") {
        switchPwaPhotoFolder("residence");
      }
      updateAttestationProgress();
    }

    // Show/hide the "Co-Applicant Residence" photo tab and details module - only when the CA
    // office has actually typed a separate co-applicant home address on the case record. Most
    // dual-applicant cases share one home (spouses, etc.) and must never show an empty, confusing
    // extra tab just because a co-applicant exists.
    function setCoResidenceTabVisible(visible) {
      const tab = document.getElementById("pwaTabCoResidence");
      const module = document.getElementById("coApplicantResidenceModule");
      if (module) module.classList.toggle("hidden", !visible);
      if (!tab) return;
      tab.classList.toggle("hidden", !visible);
      if (!visible && currentPwaFolder === "co_residence") {
        switchPwaPhotoFolder("residence");
      }
      updateAttestationProgress();
    }

    // Show/hide an "Applicant N Residence" tab (N = 3, 4, or 5) - only shown when the case
    // actually has that applicant slot filled in AND that applicant isn't sharing another
    // applicant's home visit (applicant_home_sharing) - a shared-home slot has nothing of its
    // own to capture, so showing its tab would just be an empty, confusing duplicate.
    function setHomeSlotTabVisible(slotNum, visible, label) {
      const folder = `home_${slotNum}`;
      const tab = document.getElementById(`pwaTabHome${slotNum}`);
      if (!tab) return;
      tab.classList.toggle("hidden", !visible);
      const labelEl = document.getElementById(`pwaTabHome${slotNum}Label`);
      if (labelEl && label) labelEl.textContent = `${label} (4)`;
      if (!visible && currentPwaFolder === folder) {
        switchPwaPhotoFolder("residence");
      }
      updateAttestationProgress();
    }

    // Community is a real, agent-chosen field (no default) - clicking a chip checks its radio
    // and highlights it; the others reset to the plain unselected look.
    function selectCommunityChip(labelEl) {
      const input = labelEl.querySelector('input[name="pwaCommRadio"]');
      if (input) input.checked = true;
      document.querySelectorAll(".pwa-comm-chip").forEach(l => {
        l.classList.remove("bg-blue-50", "border-blue-300", "text-primary-container", "font-bold");
        l.classList.add("bg-white", "border-outline-variant", "text-on-surface");
      });
      labelEl.classList.remove("bg-white", "border-outline-variant", "text-on-surface");
      labelEl.classList.add("bg-blue-50", "border-blue-300", "text-primary-container", "font-bold");
      if (typeof schedulePwaFormAutoSave === "function") schedulePwaFormAutoSave();
    }

    // Shared Yes/No "pill" toggle styling for radio groups like pwaNameBoardRadio and
    // pwaResEvidenceRadio - the two <label> wrappers' highlighted/plain classes were purely
    // static in the HTML (matching whichever option happened to be marked "checked" at page
    // load), so clicking the other option changed which radio was actually checked but never
    // updated which label looked selected. Called on every change so the visible state always
    // matches the real one.
    function syncPillRadioStyle(groupName) {
      document.querySelectorAll(`input[name="${groupName}"]`).forEach(input => {
        const label = input.closest("label");
        if (!label) return;
        if (input.checked) {
          label.className = "flex-1 py-1.5 px-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 font-bold text-center cursor-pointer text-xs";
        } else {
          label.className = "flex-1 py-1.5 px-2 rounded-lg bg-white border border-outline-variant text-on-surface text-center cursor-pointer text-xs";
        }
      });
    }

    // Toggle Occupation UI between Employed/Teacher/Business and Housewife
    function handleOccupationChange(occ) {
      const noticeWork = document.getElementById("officeVerificationNotice");
      const noticeHw = document.getElementById("housewifeExemptionNotice");
      const dispOcc = document.getElementById("dispNoticeOccupation");
      const dispFirm = document.getElementById("dispNoticeFirm");
      const firmInput = document.getElementById("formFirmName");
      const roleInput = document.getElementById("formDesignation");
      const wfhInput = document.getElementById("formWorkFromHome");
      const fieldsWrap = document.getElementById("officeFieldsWrap");

      if (occ === "House Wife") {
        if (noticeWork) noticeWork.classList.add("hidden");
        if (noticeHw) noticeHw.classList.remove("hidden");
        if (fieldsWrap) fieldsWrap.classList.add("hidden");
        if (wfhInput) wfhInput.value = "NA";
      } else {
        if (noticeWork) noticeWork.classList.remove("hidden");
        if (noticeHw) noticeHw.classList.add("hidden");
        if (fieldsWrap) fieldsWrap.classList.remove("hidden");
        if (dispOcc) dispOcc.textContent = occ === "Job" ? (roleInput ? roleInput.value : "Teacher / Job") : "Business / Self-Employed";
        if (dispFirm) dispFirm.textContent = (firmInput && firmInput.value) || "Employer / School";
        if (wfhInput) wfhInput.value = "No";
      }
    }

    // Toggle the co-applicant's Office Verification notice between working/housewife, same
    // pattern as handleOccupationChange() above but for the co-applicant's own occupation.
    function handleCoOccupationChange(occ) {
      const noticeWork = document.getElementById("coApplicantOfficeNotice");
      const noticeHw = document.getElementById("coApplicantHousewifeNotice");
      const wfhInput = document.getElementById("formCoWorkFromHome");
      const fieldsWrap = document.getElementById("coOfficeFieldsWrap");

      if (occ === "House Wife") {
        if (noticeWork) noticeWork.classList.add("hidden");
        if (noticeHw) noticeHw.classList.remove("hidden");
        if (fieldsWrap) fieldsWrap.classList.add("hidden");
        if (wfhInput) wfhInput.value = "NA";
      } else {
        if (noticeWork) noticeWork.classList.remove("hidden");
        if (noticeHw) noticeHw.classList.add("hidden");
        if (fieldsWrap) fieldsWrap.classList.remove("hidden");
        if (wfhInput) wfhInput.value = "No";
      }
    }

    // Haversine formula calculation in client JS
    function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
      const R = 6371000;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return Math.round(R * c);
    }

    // Geolocation Tracker
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          currentDeviceLat = pos.coords.latitude;
          currentDeviceLon = pos.coords.longitude;
          updateGeofenceUI(currentDeviceLat, currentDeviceLon, pos.coords.accuracy);
        },
        (err) => {
          // If permission denied or simulator, use realistic default with subtle jitter
          setInterval(() => {
            const jitterLat = (Math.random() * 0.0001 - 0.00005);
            const jitterLon = (Math.random() * 0.0001 - 0.00005);
            updateGeofenceUI(19.0592 + jitterLat, 72.8298 + jitterLon, 3.2);
          }, 4000);
        },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    }

    function updateGeofenceUI(lat, lon, accuracy) {
      const safeTargetLat = (TARGET_LAT != null && !isNaN(Number(TARGET_LAT))) ? Number(TARGET_LAT) : 23.0225;
      const safeTargetLon = (TARGET_LON != null && !isNaN(Number(TARGET_LON))) ? Number(TARGET_LON) : 72.5714;
      const safeLat = (lat != null && !isNaN(Number(lat))) ? Number(lat) : safeTargetLat;
      const safeLon = (lon != null && !isNaN(Number(lon))) ? Number(lon) : safeTargetLon;
      const dist = calculateDistanceMeters(safeTargetLat, safeTargetLon, safeLat, safeLon);
      document.getElementById("proximityDistanceText").textContent = `${dist} meters`;
      document.getElementById("deviceLatLonText").textContent = `${safeLat.toFixed(4)}° N`;
      
      const isCompliant = dist <= 150;
      const badge = document.getElementById("geofenceBadge");
      const statusText = document.getElementById("geofenceStatusText");
      const bar = document.getElementById("proximityBar");

      if (isCompliant) {
        badge.className = "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-[11px] font-bold";
        badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span> INSIDE 150m GEOFENCE`;
        statusText.textContent = "100% VALIDATED";
        statusText.className = "font-mono text-[10px] text-secondary font-bold bg-surface-container-lowest px-2 py-1 rounded border border-secondary/30";
        bar.className = "bg-secondary h-2 rounded-full transition-all duration-300";
        bar.style.width = `${Math.min(100, Math.round((dist / 150) * 100))}%`;
      } else {
        badge.className = "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-300 text-red-800 font-mono text-[11px] font-bold";
        badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-600"></span> GEOFENCE BREACHED (+${dist - 150}m)`;
        statusText.textContent = "BREACH FLAGGED";
        statusText.className = "font-mono text-[10px] text-red-700 font-bold bg-red-50 px-2 py-1 rounded border border-red-200";
        bar.className = "bg-red-500 h-2 rounded-full transition-all duration-300";
        bar.style.width = "100%";
      }

      // Update Watermark string preview
      const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + " " + new Date().toLocaleTimeString('en-GB') + " IST";
      document.getElementById("watermarkBannerText").textContent =
        `CASE: ${activeCaseKey} | AGENT: FA-7701/7702 | ${nowStr} | ${safeLat.toFixed(4)}°N, ${safeLon.toFixed(4)}°E | ACC: ${accuracy ? accuracy.toFixed(1) : '3.2'}m | GEOFENCE: ${isCompliant ? 'VALID' : 'BREACH'}`;

      refreshPwaGeofenceMap(safeLat, safeLon, dist);
    }

    // Applicant-shared location (WhatsApp link pasted or shared into the PWA). Self-declared:
    // shown as a blue pin beside the benchmark, never used as the benchmark itself.
    let pwaApplicantLoc = null;

    function pwaApiHeaders(extra = {}) {
      const headers = { ...extra };
      const token = localStorage.getItem("pwa_token");
      if (token && token !== "demo-pwa-token") headers["Authorization"] = `Bearer ${token}`;
      return headers;
    }

    function redrawPwaMapWithApplicant() {
      const dist = (currentDeviceLat && currentDeviceLon && TARGET_LAT && TARGET_LON)
        ? calculateDistanceMeters(TARGET_LAT, TARGET_LON, currentDeviceLat, currentDeviceLon) : null;
      refreshPwaGeofenceMap(currentDeviceLat, currentDeviceLon, dist, true);
    }

    function renderApplicantLocation(r, justSaved) {
      pwaApplicantLoc = r && r.lat != null ? r : null;
      const box = document.getElementById("applicantLocationResult");
      const nav = document.getElementById("applicantNavigateLink");
      if (!box || !nav) return;
      if (!pwaApplicantLoc) {
        box.classList.add("hidden");
        nav.classList.add("hidden");
        redrawPwaMapWithApplicant();
        return;
      }
      const d = r.distance_from_benchmark_m;
      const distText = d === null || d === undefined ? "benchmark not set yet"
        : d >= 1000 ? `${(d / 1000).toFixed(1)} km from benchmark` : `${d} m from benchmark`;
      box.className = `font-mono text-[11px] rounded-lg border px-2.5 py-2 ${r.flagged ? "bg-red-50 border-red-300 text-red-800" : "bg-white border-blue-200 text-blue-900"}`;
      box.textContent = `${justSaved ? "✓ Saved. " : ""}● ${r.lat.toFixed(6)}° N, ${r.lon.toFixed(6)}° E • ${distText}` +
        (r.flagged ? " ⚠ FAR FROM BANK ADDRESS - verify on site and inform CA." : "");
      nav.href = `https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lon}&travelmode=driving`;
      nav.classList.remove("hidden");
      redrawPwaMapWithApplicant();
    }

    async function loadApplicantLocation() {
      pwaApplicantLoc = null;
      renderApplicantLocation(null);
      const caseId = sampleCaseId;
      if (!caseId) return;
      try {
        const res = await fetch(`/api/v1/visits/cases/${encodeURIComponent(caseId)}/applicant-location`, { headers: pwaApiHeaders() });
        const data = res.ok ? await res.json() : null;
        if (caseId === sampleCaseId) renderApplicantLocation(data);   // agent may have switched case meanwhile
      } catch (err) {
        console.warn("loadApplicantLocation error:", err);
      }
    }

    async function saveApplicantLocation() {
      const input = document.getElementById("applicantLocationInput");
      const btn = document.getElementById("btnSaveApplicantLocation");
      const box = document.getElementById("applicantLocationResult");
      const text = (input.value || "").trim();
      if (text.length < 3 || !sampleCaseId) return;
      btn.disabled = true;
      try {
        const res = await fetch(`/api/v1/visits/cases/${encodeURIComponent(sampleCaseId)}/applicant-location`, {
          method: "POST",
          headers: pwaApiHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ text }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.status === "offline_queued") {
          box.className = "font-mono text-[11px] rounded-lg border px-2.5 py-2 bg-red-50 border-red-300 text-red-800";
          box.textContent = data.status === "offline_queued" ? "You are offline. Save again when the network is back."
            : (typeof data.detail === "string" ? data.detail : "Could not read a location from this text.");
          return;
        }
        input.value = "";
        renderApplicantLocation(data, true);
      } catch (err) {
        box.className = "font-mono text-[11px] rounded-lg border px-2.5 py-2 bg-red-50 border-red-300 text-red-800";
        box.textContent = "Network error. Try again.";
      } finally {
        btn.disabled = false;
      }
    }

    // Android: WhatsApp / Google Maps "Share → CPV Field PWA" opens /pwa?shared_text=…&shared_url=…
    window.addEventListener("load", async () => {
      await loadApplicantLocation();   // first, so the share hint below is not overwritten
      const p = new URLSearchParams(location.search);
      const shared = [p.get("shared_title"), p.get("shared_text"), p.get("shared_url")].filter(Boolean).join(" ").trim();
      const input = document.getElementById("applicantLocationInput");
      if (shared && input) {
        input.value = shared;
        document.getElementById("applicantLocationCard").scrollIntoView({ behavior: "smooth", block: "center" });
        const box = document.getElementById("applicantLocationResult");
        box.className = "font-mono text-[11px] rounded-lg border px-2.5 py-2 bg-amber-50 border-amber-300 text-amber-900";
        box.textContent = "Location received from share. Check the case at the top is correct, then tap Save Applicant Location.";
      }
    });

    // Satellite geofence map (shared module /static/geofence-map.js)
    let pwaGeofenceMap;   // undefined = not yet created, null = Leaflet unavailable (offline)
    window.addEventListener("load", () => {
      if (pwaGeofenceMap === undefined) refreshPwaGeofenceMap(currentDeviceLat, currentDeviceLon, null, true);
    });
    function refreshPwaGeofenceMap(lat, lon, dist, refit) {
      try {
        if (pwaGeofenceMap === undefined) {
          pwaGeofenceMap = window.GeofenceMap ? window.GeofenceMap.create(document.getElementById("pwaGeofenceMap"), {}) : null;
          if (!pwaGeofenceMap) {
            const fb = document.getElementById("pwaGeofenceMapFallback");
            if (fb) fb.classList.remove("hidden");
          }
        }
        if (pwaGeofenceMap) {
          pwaGeofenceMap.update({
            benchLat: TARGET_LAT, benchLon: TARGET_LON,
            agentLat: lat, agentLon: lon,
            agentLabel: dist !== null && dist !== undefined ? `YOU • ${dist}m` : "YOU",
            applicantLat: pwaApplicantLoc && pwaApplicantLoc.lat, applicantLon: pwaApplicantLoc && pwaApplicantLoc.lon,
            refit: !!refit,
          });
        }
        const nav = document.getElementById("pwaNavigateLink");
        if (nav && TARGET_LAT && TARGET_LON) {
          nav.href = `https://www.google.com/maps/dir/?api=1&destination=${TARGET_LAT},${TARGET_LON}&travelmode=driving`;
        }
      } catch (err) {
        pwaGeofenceMap = pwaGeofenceMap || null;
        console.warn("PWA geofence map error:", err);
      }
    }

    // ==========================================
    // IN-BROWSER WEBRTC LIVE CAMERA ENGINE (Prevents iOS/Android low-memory tab eviction)
    // ==========================================
    let pwaLiveCameraStream = null;
    let pwaLiveCameraFacing = "environment"; // "environment" | "user"
    let pwaLiveCameraMode = "slot";          // "slot" | "selfie"

    function stopPwaLiveCameraStream() {
      if (pwaLiveCameraStream) {
        try {
          pwaLiveCameraStream.getTracks().forEach((t) => {
            try { t.stop(); } catch (_) {}
          });
        } catch (_) {}
        pwaLiveCameraStream = null;
      }
      const videoEl = document.getElementById("pwaLiveCameraVideo");
      if (videoEl) {
        try {
          videoEl.pause();
          videoEl.srcObject = null;
          videoEl.style.transform = "none";
        } catch (_) {}
      }
    }

    function closePwaLiveCamera() {
      stopPwaLiveCameraStream();
      const modal = document.getElementById("pwaLiveCameraModal");
      if (modal) modal.classList.add("hidden");
      try { document.body.style.overflow = ""; } catch (_) {}
      cameraPickerOpenUntil = 0;
    }

    function fallbackToNativeCameraInput() {
      const mode = pwaLiveCameraMode;
      closePwaLiveCamera();
      cameraPickerOpenUntil = Date.now() + 25000;
      if (mode === "selfie") {
        const sInp = document.getElementById("selfieInput");
        if (sInp) sInp.click();
      } else {
        const cInp = document.getElementById("cameraInput");
        if (cInp) cInp.click();
      }
    }

    async function openPwaLiveCamera(mode, facing, titleText) {
      pwaLiveCameraMode = mode || "slot";
      pwaLiveCameraFacing = facing || (mode === "selfie" ? "user" : "environment");
      if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
        fallbackToNativeCameraInput();
        return;
      }
      stopPwaLiveCameraStream();
      const modal = document.getElementById("pwaLiveCameraModal");
      const videoEl = document.getElementById("pwaLiveCameraVideo");
      const titleEl = document.getElementById("pwaLiveCameraTitle");
      if (!modal || !videoEl) {
        fallbackToNativeCameraInput();
        return;
      }
      if (titleEl && titleText) titleEl.textContent = titleText;
      try {
        // Do NOT force landscape 1280x960 constraints on mobile devices (Vivo/Oppo/Xiaomi front cameras
        // return a sideways/slanted sensor buffer when forced to landscape width>height in portrait hold).
        // Letting the mobile camera use its natural sensor orientation keeps selfies and photos upright.
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: pwaLiveCameraFacing },
          },
          audio: false,
        });
        pwaLiveCameraStream = stream;
        videoEl.srcObject = stream;
        // Natural mirror preview for front-facing selfie camera so agent can align face comfortably
        videoEl.style.transform = pwaLiveCameraFacing === "user" ? "scaleX(-1)" : "none";
        modal.classList.remove("hidden");
        try { document.body.style.overflow = "hidden"; } catch (_) {}
        await videoEl.play().catch(() => {});
      } catch (err) {
        console.warn("In-app getUserMedia unavailable/denied, falling back to system picker:", err);
        fallbackToNativeCameraInput();
      }
    }

    async function flipPwaLiveCamera() {
      const nextFacing = pwaLiveCameraFacing === "user" ? "environment" : "user";
      const titleEl = document.getElementById("pwaLiveCameraTitle");
      await openPwaLiveCamera(
        pwaLiveCameraMode,
        nextFacing,
        titleEl ? titleEl.textContent : "Capture Verification Photo"
      );
    }

    function captureFrameFromPwaLiveCamera() {
      const videoEl = document.getElementById("pwaLiveCameraVideo");
      if (!videoEl || !videoEl.videoWidth || !videoEl.videoHeight) {
        fallbackToNativeCameraInput();
        return;
      }
      const maxDim = 1024;
      let w = videoEl.videoWidth;
      let h = videoEl.videoHeight;
      if (w > maxDim || h > maxDim) {
        if (w >= h) {
          h = Math.max(1, Math.round((h * maxDim) / w));
          w = maxDim;
        } else {
          w = Math.max(1, Math.round((w * maxDim) / h));
          h = maxDim;
        }
      }
      const snapCanvas = document.createElement("canvas");
      snapCanvas.width = w;
      snapCanvas.height = h;
      const ctx = snapCanvas.getContext("2d");
      ctx.drawImage(videoEl, 0, 0, w, h);
      const mode = pwaLiveCameraMode;
      // Stop live stream immediately before processing blob to free 100% of camera buffer RAM
      closePwaLiveCamera();

      snapCanvas.toBlob((blob) => {
        try {
          snapCanvas.width = 0;
          snapCanvas.height = 0;
        } catch (_) {}
        if (!blob) return;
        const fileName = mode === "selfie"
          ? `agent_selfie_${sampleCaseId || Date.now()}.jpg`
          : `photo_slot_${activeUploadSlot || 1}_${Date.now()}.jpg`;
        let capturedFile = blob;
        try {
          capturedFile = new File([blob], fileName, { type: "image/jpeg" });
        } catch (_) {
          capturedFile.name = fileName;
        }
        if (mode === "selfie") {
          handleAgentSelfieCapture({ target: { files: [capturedFile], value: "" } });
        } else {
          handlePhotoUpload({ target: { files: [capturedFile], value: "" } });
        }
      }, "image/jpeg", 0.82);
    }

    function openPwaSelfieCamera() {
      if (!sampleCaseId) {
        alert("This case is still loading. Please wait a moment for the case details to finish loading, then try the selfie again.");
        return;
      }
      if (typeof savePwaFormDraftLocally === "function") savePwaFormDraftLocally();
      openPwaLiveCamera("selfie", "user", "Field Staff Attendance Selfie (સેલ્ફી લો)");
    }

    // Dedicated Slot Capture Trigger with Folder Awareness
    function triggerSlotCapture(slotNum, docType, folder) {
      if (capturePending) {
        alert("Still uploading the previous photo — please wait a moment before capturing the next one.");
        return;
      }
      // See submitDueDiligenceForm's matching guard - sampleCaseId is unset while a
      // just-switched-to case is still loading its real data, and a photo captured in that
      // window has no correct case to attach to.
      if (!sampleCaseId) {
        alert("This case is still loading. Please wait a moment for the case details to finish loading, then try taking the photo again.");
        return;
      }
      // Auto-persist any questionnaire answers typed so far before launching the mobile camera
      // (Android/iOS can evict background tabs while the camera app is open).
      if (typeof savePwaFormDraftLocally === "function") savePwaFormDraftLocally();
      cameraPickerOpenUntil = Date.now() + 25000;
      activeUploadSlot = slotNum;
      activeDocType = docType;
      if (folder) currentPwaFolder = folder;
      const info = PWA_FOLDER_INFO[currentPwaFolder] || PWA_FOLDER_INFO.residence;
      const slotTitle = slotNum > 4
        ? `${info.label} — Additional Photo #${slotNum - 4}`
        : `${info.label} — Slot ${slotNum}`;
      const preferFront = String(docType || "").toUpperCase().includes("SELFIE");
      openPwaLiveCamera("slot", preferFront ? "user" : "environment", slotTitle);
    }

    // "+ Add More Photos" - captures an unlimited number of additional photos per section
    // beyond the 4 mandatory named slots, reusing the exact same slot-capture pipeline with an
    // auto-incrementing slot number > 4 so it's never mistaken for one of the required shots.
    function triggerExtraPhotoCapture(folder) {
      const info = PWA_FOLDER_INFO[folder];
      if (!info) return;
      extraPhotoNextSlot[folder] = (extraPhotoNextSlot[folder] || 4) + 1;
      triggerSlotCapture(extraPhotoNextSlot[folder], info.defaultDocType, folder);
    }

    // Renders/updates one tile in a section's "Additional Photos" gallery strip. Unlike the 4
    // mandatory slots, these don't have pre-existing DOM elements (unbounded count), so the tile
    // is created on first use and just has its image swapped on a retake.
    function addOrUpdateExtraPhotoThumb(folder, slotNum, previewUrl, fullUrl) {
      const gallery = document.getElementById(`extraGallery_${folder}`);
      if (!gallery) return;
      let tile = document.getElementById(`extraThumb_${folder}_${slotNum}`);
      if (!tile) {
        tile = document.createElement("div");
        tile.id = `extraThumb_${folder}_${slotNum}`;
        tile.className = "relative w-16 h-16 rounded-lg overflow-hidden border border-outline-variant cursor-pointer shrink-0 bg-surface-container-lowest";
        tile.onclick = () => viewSlotPhotoFullscreen(tile);
        gallery.appendChild(tile);
      }
      const fullAttr = fullUrl ? ` data-full-src="${fullUrl}" onerror="if(this.dataset.fullSrc && this.src!==this.dataset.fullSrc)this.src=this.dataset.fullSrc;"` : "";
      tile.innerHTML = `<img src="${previewUrl}"${fullAttr} loading="lazy" decoding="async" class="w-full h-full object-cover"/><span class="absolute bottom-0 right-0 bg-emerald-600 text-white text-[8px] px-1 leading-tight">✓</span>`;
      updateExtraPhotoCount(folder);
    }

    function updateExtraPhotoCount(folder) {
      const gallery = document.getElementById(`extraGallery_${folder}`);
      const countEl = document.getElementById(`extraCount_${folder}`);
      if (!gallery || !countEl) return;
      const n = gallery.children.length;
      countEl.textContent = n === 0 ? "No additional photos yet" : `${n} additional photo${n === 1 ? "" : "s"} uploaded`;
    }

    // Server-authoritative restore of a section's "Additional Photos" gallery - mirrors the
    // mandatory-slot restore passes in loadAssignedCase() so extras uploaded from another device,
    // or before a cache clear, still show up after a refresh. `assignedSlotMap` is the {1..4: doc}
    // map that loadAssignedCase() already built for the mandatory slots - anything in the
    // section's docs that ISN'T one of those is, by definition, an additional photo.
    function restoreExtraPhotosForFolder(folder, allDocsForFolder, assignedSlotMap) {
      const gallery = document.getElementById(`extraGallery_${folder}`);
      if (!gallery) return;
      gallery.innerHTML = "";
      // Genuine "Additional Photos" only - a doc explicitly tagged slot_number > 4. NOT "any
      // doc that isn't the current slot map winner": a slot retaken more than once in the field
      // leaves older superseded uploads with the SAME slot_number (1-4) sitting in
      // allDocsForFolder - those are discarded duplicates, not additional photos, and must never
      // reappear here just because a newer upload won that slot.
      const extras = (allDocsForFolder || []).filter(d => {
        const sNum = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
        return Boolean(sNum && sNum > 4);
      });
      let maxSlot = 4;
      extras.forEach((d, idx) => {
        let sNum = d.slot_number > 4 ? d.slot_number : ((d.ocr_data && d.ocr_data.slot_number > 4) ? d.ocr_data.slot_number : null);
        if (!sNum) sNum = 5 + idx;
        if (sNum > maxSlot) maxSlot = sNum;
        const thumbSrc = toPwaThumbUrl(d.url, 180);
        addOrUpdateExtraPhotoThumb(folder, sNum, thumbSrc, d.url);
      });
      extraPhotoNextSlot[folder] = maxSlot;
    }

    function updateEvidenceProgress() {
      const info = PWA_FOLDER_INFO[currentPwaFolder] || PWA_FOLDER_INFO.residence;
      const count = Object.values(info.slotsMap).filter(Boolean).length;
      const countEl = document.getElementById("evidenceSlotsCount");
      if (countEl) countEl.textContent = `${count} OF 4 COMPLETE (${info.label.toUpperCase()})`;
      updateAttestationProgress();
    }

    // The Sign-Off box's "X/Y PENDING" badge used to be a static "2/4 PENDING" string left over
    // from demo content - it never reflected real upload state, so it kept reading PENDING even
    // after every required photo and the selfie were actually captured. Computed here from the
    // same slot-tracking objects the rest of the page already maintains.
    function updateAttestationProgress() {
      const badge = document.getElementById("attestationProgressBadge");
      if (!badge) return;
      const items = [
        Object.values(uploadedResidenceSlots).every(Boolean),
        Object.values(uploadedOfficeSlots).every(Boolean),
        Boolean(agentSelfieDataUrl),
      ];
      const coTab = document.getElementById("pwaTabCoOffice");
      if (coTab && !coTab.classList.contains("hidden")) {
        items.push(Object.values(uploadedCoOfficeSlots).every(Boolean));
      }
      const coResTab = document.getElementById("pwaTabCoResidence");
      if (coResTab && !coResTab.classList.contains("hidden")) {
        items.push(Object.values(uploadedCoResidenceSlots).every(Boolean));
      }
      const homeSlotMaps = { 3: uploadedHome3Slots, 4: uploadedHome4Slots, 5: uploadedHome5Slots };
      [3, 4, 5].forEach(slotNum => {
        const homeTab = document.getElementById(`pwaTabHome${slotNum}`);
        if (homeTab && !homeTab.classList.contains("hidden")) {
          items.push(Object.values(homeSlotMaps[slotNum]).every(Boolean));
        }
      });
      const total = items.length;
      const done = items.filter(Boolean).length;
      const isReady = done === total;
      badge.textContent = `${done}/${total} ${isReady ? "READY" : "PENDING"}`;
      badge.className = `font-mono text-[10px] px-2 py-0.5 rounded border font-bold ${
        isReady ? "text-emerald-700 bg-emerald-50 border-emerald-400" : "text-secondary bg-surface-container-low border-secondary"
      }`;
    }

    // Zero-lag File Upload Handler with Dedicated Evidence Slots (Residence & Office)
    //
    // Two correctness rules, both learned from real field data that went wrong:
    // 1. The slot number, doc type, folder, case id and GPS fix used for THIS photo are captured
    //    into local consts the instant this function starts, and used nowhere else from the
    //    mutable globals again. Those globals (activeUploadSlot/activeDocType/currentPwaFolder/
    //    sampleCaseId) can legitimately change while this async pipeline (FileReader -> Image
    //    decode -> canvas -> toBlob -> fetch) is still running, if the agent starts the next
    //    capture before this one's upload has actually fired — a camera return is NOT modal to
    //    the page, so that's a normal thing for a field agent to do. Reading the globals late
    //    (as the old code did, inside canvas.toBlob) meant a photo could upload under a LATER
    //    slot's doc_type/slot_number than the one it was actually taken for.
    // 2. No applicant name, address or case number is burned into the image here. The server
    //    stamps the single, authoritative watermark banner from the case record in the database
    //    (/api/v1/visits/cases/{id}/upload) — this client only resizes/compresses for a fast
    //    upload and a local preview. Stamping client-side too (the old behaviour) read fields
    //    that were never populated for a live case, so it silently always burned in the original
    //    demo case's name and address, and then the server's correct banner was appended BELOW
    //    it rather than replacing it — every evidence photo ended up with two stacked banners,
    //    the top one permanently wrong.
    let capturePending = false;
    // Holds everything finalizePhotoCapture()/discardAndRetakePhoto() need once the agent has
    // reviewed the shot - populated by handlePhotoUpload() right before showing the review modal.
    let pendingPhotoCapture = null;

    // The upload/sync status banner's icon was static HTML (always spinning), so it kept
    // spinning forever even after the box's own text/color already said "done" - looked like
    // the upload never actually finished. Call this alongside every alertBox.className change
    // so the icon's spin state always matches what the banner is actually saying.
    function setUploadAlertIcon(spinning, colorClass, iconName) {
      const icon = document.getElementById("uploadAlertIcon");
      if (!icon) return;
      icon.textContent = iconName || (spinning ? "autorenew" : "check_circle");
      icon.className = `material-symbols-outlined ${colorClass || "text-blue-600"}` + (spinning ? " animate-spin" : "");
    }

    async function handlePhotoUpload(event) {
      cameraPickerOpenUntil = 0;
      const file = event.target && event.target.files ? event.target.files[0] : null;
      if (event.target) event.target.value = ""; // allow capturing the same slot again without a no-op change event
      if (!file) return;
      if (capturePending) {
        alert("Still processing the previous photo — please wait a moment before capturing the next one.");
        return;
      }
      capturePending = true;

      const slotNum = activeUploadSlot;
      const docType = activeDocType;
      const folderAtCapture = currentPwaFolder;
      const caseIdAtCapture = sampleCaseId;
      const caseKeyAtCapture = activeCaseKey;
      const latAtCapture = currentDeviceLat;
      const lonAtCapture = currentDeviceLon;
      const now = new Date();
      const timeStr = now.toLocaleDateString("en-GB") + " " + now.toLocaleTimeString("en-GB") + " IST";

      const finish = () => { capturePending = false; };

      // Decode image via URL.createObjectURL (zero 15MB base64 heap spike on mobile Chrome)
      // and immediately save & upload the slot upon camera return.
      let objUrl = null;
      const cleanupObjUrl = () => {
        if (objUrl) {
          try { URL.revokeObjectURL(objUrl); } catch (_) {}
          objUrl = null;
        }
      };

      const processDecodedImg = (rawImg) => {
        cleanupObjUrl();
        try {
          const canvas = document.createElement("canvas");
          const maxDim = 1024;
          let w = rawImg.width || 1024;
          let h = rawImg.height || 768;
          if (w > maxDim || h > maxDim) {
            if (w >= h) {
              h = Math.max(1, Math.round((h * maxDim) / w));
              w = maxDim;
            } else {
              w = Math.max(1, Math.round((w * maxDim) / h));
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(rawImg, 0, 0, w, h);
          // Immediately release the 12MP-48MP raw image bitmap from mobile browser memory
          try {
            rawImg.onload = null;
            rawImg.onerror = null;
            rawImg.src = "";
          } catch (_) {}

          const finalPreviewUrl = canvas.toDataURL("image/jpeg", 0.80);

          // Compact 240px thumbnail (~8KB) for DOM thumbnails, inMemory cache, and localStorage
          let thumbPreviewUrl = finalPreviewUrl;
          try {
            const thumbCanvas = document.createElement("canvas");
            const tw = 240;
            const th = Math.max(1, Math.round((h * tw) / w));
            thumbCanvas.width = tw;
            thumbCanvas.height = th;
            const tCtx = thumbCanvas.getContext("2d");
            tCtx.drawImage(canvas, 0, 0, tw, th);
            thumbPreviewUrl = thumbCanvas.toDataURL("image/jpeg", 0.65);
            thumbCanvas.width = 0;
            thumbCanvas.height = 0;
          } catch (_) {}

          pendingPhotoCapture = {
            canvas, file, finalPreviewUrl, thumbPreviewUrl, slotNum, docType, folderAtCapture,
            caseIdAtCapture, caseKeyAtCapture, latAtCapture, lonAtCapture, timeStr, finish,
          };
          // Immediately confirm & upload the captured photo
          finalizePhotoCapture();
        } catch (err) {
          console.warn("Image canvas compression fallback:", err);
          finish();
        }
      };

      const rawImg = new Image();
      rawImg.onload = () => processDecodedImg(rawImg);
      rawImg.onerror = () => {
        cleanupObjUrl();
        finish();
      };

      try {
        if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
          objUrl = URL.createObjectURL(file);
          rawImg.src = objUrl;
        } else {
          const reader = new FileReader();
          reader.onload = (e) => { rawImg.src = e.target.result; };
          reader.onerror = finish;
          reader.readAsDataURL(file);
        }
      } catch (_) {
        const reader = new FileReader();
        reader.onload = (e) => { rawImg.src = e.target.result; };
        reader.onerror = finish;
        reader.readAsDataURL(file);
      }
    }

    // Tap a slot's small thumbnail to inspect the actual saved photo full-screen - lets the
    // agent (or CA reviewing over their shoulder) confirm the shot and its watermark are legible
    // without having to rely on the tiny 56px thumbnail.
    function viewSlotPhotoFullscreen(thumbEl) {
      const img = thumbEl.querySelector("img");
      if (!img || !img.src) return; // empty/pending slot - nothing to view yet
      const viewImg = document.getElementById("pwaSlotPhotoViewImg");
      const viewModal = document.getElementById("pwaSlotPhotoViewModal");
      if (viewImg) viewImg.src = img.dataset.fullSrc || img.src;
      if (viewModal) viewModal.classList.remove("hidden");
      resetSlotPhotoZoom();
    }
    function closeSlotPhotoFullscreen() {
      const viewModal = document.getElementById("pwaSlotPhotoViewModal");
      if (viewModal) viewModal.classList.add("hidden");
      const viewImg = document.getElementById("pwaSlotPhotoViewImg");
      if (viewImg) viewImg.src = "";
      resetSlotPhotoZoom();
    }

    // Pinch-to-zoom and double-tap-to-zoom for the full-screen photo view, so the fine print
    // on a server-stamped watermark (GPS, timestamp, case number) is actually legible on a
    // phone screen. The page's own viewport disables native pinch-zoom (maximum-scale=1,
    // user-scalable=no) so other touch controls stay precise - this is a self-contained CSS
    // transform zoom scoped to just this modal's image, independent of that.
    let slotZoomState = { scale: 1, tx: 0, ty: 0 };
    let slotZoomPinch = null; // { startDist, startScale, startTx, startTy, midX, midY }
    let slotZoomPanStart = null; // { x, y, tx, ty }
    let slotZoomLastTapTime = 0;

    function resetSlotPhotoZoom() {
      slotZoomState = { scale: 1, tx: 0, ty: 0 };
      applySlotPhotoZoom();
    }
    function applySlotPhotoZoom() {
      const img = document.getElementById("pwaSlotPhotoViewImg");
      if (!img) return;
      const { scale, tx, ty } = slotZoomState;
      img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    }
    function slotZoomTouchDistance(t1, t2) {
      return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    }

    (function initSlotPhotoZoomHandlers() {
      const wrap = document.getElementById("pwaSlotPhotoViewWrap");
      if (!wrap) return;

      wrap.addEventListener("touchstart", (e) => {
        if (e.touches.length === 2) {
          const [t1, t2] = e.touches;
          slotZoomPinch = {
            startDist: slotZoomTouchDistance(t1, t2),
            startScale: slotZoomState.scale,
            startTx: slotZoomState.tx,
            startTy: slotZoomState.ty,
          };
          slotZoomPanStart = null;
        } else if (e.touches.length === 1) {
          const now = Date.now();
          if (now - slotZoomLastTapTime < 300) {
            // Double-tap: toggle between 1x and 2.5x, centered roughly on the tap.
            if (slotZoomState.scale > 1) {
              resetSlotPhotoZoom();
            } else {
              slotZoomState = { scale: 2.5, tx: 0, ty: 0 };
              applySlotPhotoZoom();
            }
            slotZoomLastTapTime = 0;
            return;
          }
          slotZoomLastTapTime = now;
          if (slotZoomState.scale > 1) {
            slotZoomPanStart = {
              x: e.touches[0].clientX, y: e.touches[0].clientY,
              tx: slotZoomState.tx, ty: slotZoomState.ty,
            };
          }
        }
      }, { passive: true });

      wrap.addEventListener("touchmove", (e) => {
        if (e.touches.length === 2 && slotZoomPinch) {
          const [t1, t2] = e.touches;
          const dist = slotZoomTouchDistance(t1, t2);
          const ratio = dist / (slotZoomPinch.startDist || dist);
          slotZoomState.scale = Math.min(5, Math.max(1, slotZoomPinch.startScale * ratio));
          applySlotPhotoZoom();
        } else if (e.touches.length === 1 && slotZoomPanStart) {
          const dx = e.touches[0].clientX - slotZoomPanStart.x;
          const dy = e.touches[0].clientY - slotZoomPanStart.y;
          slotZoomState.tx = slotZoomPanStart.tx + dx;
          slotZoomState.ty = slotZoomPanStart.ty + dy;
          applySlotPhotoZoom();
        }
      }, { passive: true });

      wrap.addEventListener("touchend", (e) => {
        if (e.touches.length < 2) slotZoomPinch = null;
        if (e.touches.length === 0) {
          slotZoomPanStart = null;
          if (slotZoomState.scale < 1.05) resetSlotPhotoZoom();
        }
      }, { passive: true });

      // Desktop/testing fallback: double-click to toggle zoom.
      wrap.addEventListener("dblclick", () => {
        if (slotZoomState.scale > 1) {
          resetSlotPhotoZoom();
        } else {
          slotZoomState = { scale: 2.5, tx: 0, ty: 0 };
          applySlotPhotoZoom();
        }
      });
    })();

    function discardAndRetakePhoto() {
      const reviewModal = document.getElementById("pwaPhotoReviewModal");
      if (reviewModal) reviewModal.classList.add("hidden");
      if (!pendingPhotoCapture) return;
      const { slotNum, docType, folderAtCapture, finish } = pendingPhotoCapture;
      pendingPhotoCapture = null;
      finish(); // unlock capture immediately - a discarded photo must never block a retake
      // Re-open the camera for the exact same slot right away.
      activeUploadSlot = slotNum;
      activeDocType = docType;
      currentPwaFolder = folderAtCapture;
      const camInput = document.getElementById("cameraInput");
      if (camInput) camInput.click();
    }

    function finalizePhotoCapture() {
      if (!pendingPhotoCapture) return;
      const {
        canvas, file, finalPreviewUrl, thumbPreviewUrl, slotNum, docType, folderAtCapture,
        caseIdAtCapture, caseKeyAtCapture, latAtCapture, lonAtCapture, timeStr, finish,
      } = pendingPhotoCapture;
      pendingPhotoCapture = null;
      const info = PWA_FOLDER_INFO[folderAtCapture] || PWA_FOLDER_INFO.residence;

      const reviewModal = document.getElementById("pwaPhotoReviewModal");
      if (reviewModal) reviewModal.classList.add("hidden");

      // Show zero-lag ingestion alert
      const alertBox = document.getElementById("uploadAlert");
      const alertText = document.getElementById("uploadAlertText");
      alertBox.className = "p-3 rounded-lg bg-blue-50 border border-blue-200 text-primary-container text-xs flex items-center justify-between";
      alertBox.classList.remove("hidden");
      const isExtra = slotNum > 4;
      alertText.textContent = isExtra ? `Uploading ${info.label} additional photo...` : `Uploading ${info.label} Slot ${slotNum} photo...`;
      setUploadAlertIcon(true, "text-blue-600", "autorenew");

      const lightPreviewUrl = thumbPreviewUrl || finalPreviewUrl;
      const previewImgEl = document.getElementById("previewPhotoImg");
      if (previewImgEl) previewImgEl.src = lightPreviewUrl;

      if (!isExtra) info.slotsMap[slotNum] = true;
      const slotPayloadObj = {
        src: lightPreviewUrl,
        timestamp: timeStr,
        lat: latAtCapture,
        lon: lonAtCapture,
        doc_type: docType,
        caseId: caseIdAtCapture,
        caseNo: caseKeyAtCapture,
        pendingOffline: true,
      };
      safeSetSlotEvidenceCache(
        caseIdAtCapture,
        caseKeyAtCapture,
        info.storageKey,
        slotNum,
        slotPayloadObj,
        lightPreviewUrl
      );

      if (isExtra) {
        addOrUpdateExtraPhotoThumb(folderAtCapture, slotNum, lightPreviewUrl);
      } else {
        const thumbEl = document.getElementById(`${info.slotIdPrefix}${slotNum}Thumb`);
        if (thumbEl) thumbEl.innerHTML = `<img src="${lightPreviewUrl}" loading="lazy" decoding="async" class="w-full h-full object-cover rounded-lg"/>`;
        const badgeEl = document.getElementById(`${info.slotIdPrefix}${slotNum}Badge`);
        if (badgeEl) {
          badgeEl.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold";
          badgeEl.textContent = "✓ UPLOADED";
        }
        const btnTextEl = document.getElementById(`${info.slotIdPrefix}${slotNum}BtnText`);
        if (btnTextEl) btnTextEl.textContent = "Re-take Photo";
      }
      updateEvidenceProgress();
      // Auto-sync the Due Diligence Questionnaire whenever an evidence photo is confirmed, so
      // even if the agent captures all 4 Residence photos and switches directly to another case link
      // without tapping the Save Questionnaire button, all form answers are already saved on the server.
      if (typeof schedulePwaFormAutoSave === "function") schedulePwaFormAutoSave();

      // Unlock capture right away - the slot is already saved locally (preview + inMemory + localStorage)
      // and the server upload below runs in the background.
      finish();

      // Stream the resized photo to the server, which applies the single correct watermark.
      canvas.toBlob(async (blob) => {
        try {
          if (canvas) {
            canvas.width = 0;
            canvas.height = 0;
          }
        } catch (_) {}
        const uploadFile = blob || dataUrlToBlob(finalPreviewUrl) || file;

        const attemptUpload = async (timeoutMs) => {
          const formData = new FormData();
          formData.append("file", uploadFile, (file && file.name) || `photo_slot_${slotNum}.jpg`);
          formData.append("doc_type", docType || info.defaultDocType);
          formData.append("slot_number", slotNum);
          formData.append("folder", info.uploadFolder);
          formData.append("latitude", latAtCapture);
          formData.append("longitude", lonAtCapture);

          const token = localStorage.getItem("pwa_token");
          const headers = {};
          if (token && token !== "demo-pwa-token") {
            headers["Authorization"] = `Bearer ${token}`;
          }
          const uploadController = new AbortController();
          const uploadTimeout = setTimeout(() => uploadController.abort(), timeoutMs);
          try {
            const response = await fetch(`/api/v1/visits/cases/${caseIdAtCapture}/upload`, {
              method: "POST",
              headers: headers,
              body: formData,
              signal: uploadController.signal,
            });
            clearTimeout(uploadTimeout);
            return response;
          } catch (err) {
            clearTimeout(uploadTimeout);
            throw err;
          }
        };

        try {
          let response = null;
          try {
            response = await attemptUpload(45000);
          } catch (firstErr) {
            // Automatic 1.5s retry on transient mobile data drop before falling back to offline queue
            await new Promise((r) => setTimeout(r, 1500));
            response = await attemptUpload(45000);
          }

          if (response.status === 202 || response.status === 200) {
            const data = await response.json();
            if (data && data.status === "offline_queued") {
              throw new Error("offline_queued");
            }
            safeSetSlotEvidenceCache(
              caseIdAtCapture,
              caseKeyAtCapture,
              info.storageKey,
              slotNum,
              Object.assign({}, slotPayloadObj, {
                pendingOffline: false,
                uploadedOnServer: true,
              }),
              thumbPreviewUrl || finalPreviewUrl
            );
            alertBox.className = "p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono shadow-sm animate-fade-in";
            alertText.innerHTML = `✅ <b>Data Uploaded Successfully!</b> ${info.label} Slot ${slotNum} transmitted to CA Scrutiny Desk.<br/>GPS: ${Number(latAtCapture || 0).toFixed(4)}°N, ${Number(lonAtCapture || 0).toFixed(4)}°E | Doc ID: <code>${(data.document_id || data.task_id || '').slice(0, 12)}...</code><br/><i>N.N. SHAH & CO. watermark applied server-side and synced in real time.</i>`;
            setUploadAlertIcon(false, "text-emerald-600", "check_circle");
            loadCaseDocumentsIntoPwa(caseIdAtCapture);
          } else {
            const errData = await response.json().catch(() => ({}));
            alertBox.className = "p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono shadow-sm";
            alertText.textContent = `Upload Notice: ${errData.detail || 'Photo saved locally'}`;
            setUploadAlertIcon(false, "text-amber-600", "warning");
          }
        } catch (netErr) {
          await enqueueOfflinePhoto({
            sampleCaseId: caseIdAtCapture,
            dataUrl: finalPreviewUrl,
            fileName: (file && file.name) || `photo_slot_${slotNum}.jpg`,
            docType: docType || info.defaultDocType,
            slotNumber: slotNum,
            folder: info.uploadFolder,
            latitude: latAtCapture,
            longitude: lonAtCapture,
          });
          alertBox.className = "p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono shadow-sm";
          alertText.innerHTML = `<b>📦 Offline Saved:</b> Photo queued in device memory. <b>It will upload automatically to CA Desk as soon as network is available</b>.`;
          setUploadAlertIcon(false, "text-amber-600", "cloud_off");
        } finally {
          finish();
        }
      }, "image/jpeg", 0.85);
    }

    // Inline Document Flips
    let isAadhaarFlippedInline = false;
    function flipInlineAadhaar() {
      const img = document.getElementById("pwaDocInlineAadhaarImg");
      const badge = document.getElementById("pwaDocAadhaarSideBadge");
      const btn = document.getElementById("btnTextAadhaarFlip");
      if (!img) return;
      const c = caseRegistryPwa[activeCaseKey] || caseRegistryPwa["UBI-HL-2026-20L"];
      isAadhaarFlippedInline = !isAadhaarFlippedInline;
      if (isAadhaarFlippedInline) {
        img.src = c.aadhaar_back_img || "/static/placeholders/doc_pending.svg";
        if (badge) badge.textContent = "BACK";
        if (btn) btn.textContent = "View Front";
      } else {
        img.src = c.aadhaar_front_img || "/static/placeholders/doc_pending.svg";
        if (badge) badge.textContent = "FRONT";
        if (btn) btn.textContent = "Flip Side";
      }
    }

    let isPanFlippedInline = false;
    function flipInlinePan() {
      const img = document.getElementById("pwaDocInlinePanImg");
      const badge = document.getElementById("pwaDocPanSideBadge");
      const btn = document.getElementById("btnTextPanFlip");
      if (!img) return;
      const c = caseRegistryPwa[activeCaseKey] || caseRegistryPwa["UBI-HL-2026-20L"];
      isPanFlippedInline = !isPanFlippedInline;
      if (isPanFlippedInline) {
        img.src = c.pan_back_img || "/static/placeholders/doc_pending.svg";
        if (badge) badge.textContent = "BACK";
        if (btn) btn.textContent = "View Front";
      } else {
        img.src = c.pan_front_img || "/static/placeholders/doc_pending.svg";
        if (badge) badge.textContent = "FRONT";
        if (btn) btn.textContent = "Flip Side";
      }
    }

    // Modal Inspection for CA-Provided Documents
    let isPwaCardFlipped = false;
    function openPwaDocModal(docType) {
      const modal = document.getElementById("pwaDocModal");
      const title = document.getElementById("pwaDocModalTitle");
      const desc = document.getElementById("pwaDocModalDesc");
      const imgFront = document.getElementById("pwaDocModalImgFront");
      const imgBack = document.getElementById("pwaDocModalImgBack");
      const flipBtn = document.getElementById("pwaDocFlipBtn");

      const c = caseRegistryPwa[activeCaseKey] || caseRegistryPwa["UBI-HL-2026-20L"];

      if (docType === "aadhaar") {
        title.textContent = "Aadhaar Card (UIDAI Masked)";
        desc.textContent = `Name: ${c.applicant} | Masked No: ${c.aadhaar_no || 'XXXX-XXXX-7689'} | DOB: ${c.dob || '30/05/1997'}`;
        imgFront.src = c.aadhaar_front_img || "/static/placeholders/doc_pending.svg";
        imgBack.src = c.aadhaar_back_img || "/static/placeholders/doc_pending.svg";
        if (flipBtn) flipBtn.classList.remove("hidden");
      } else if (docType === "pan") {
        title.textContent = "PAN Card (Income Tax Dept)";
        desc.textContent = `Name: ${c.applicant} | PAN: ${c.pan_no || 'BYMPG8996E'} | Ward: ${c.ward || 'Gandhinagar'}`;
        imgFront.src = c.pan_front_img || "/static/placeholders/doc_pending.svg";
        imgBack.src = c.pan_back_img || "/static/placeholders/doc_pending.svg";
        if (flipBtn) flipBtn.classList.remove("hidden");
      } else if (docType === "utility") {
        title.textContent = "Electricity / Utility Bill";
        desc.textContent = `Provider: ${c.utility_provider || 'UGVCL'} | Consumer No: ${c.utility_no || '04128/99102/3'} | Meter: ${c.meter_name || c.applicant}`;
        imgFront.src = c.utility_front_img || "/static/placeholders/doc_pending.svg";
        imgBack.src = c.utility_front_img || "/static/placeholders/doc_pending.svg";
        if (flipBtn) flipBtn.classList.add("hidden");
      } else if (docType === "form16") {
        title.textContent = "Form 16 (Part A & B / TDS Certificate)";
        desc.textContent = `Employee: ${c.applicant}${c.employer_name ? ' | Employer: ' + c.employer_name : ''}`;
        imgFront.src = c.form16_img || "/static/placeholders/doc_pending.svg";
        imgBack.src = c.form16_img || "/static/placeholders/doc_pending.svg";
        if (flipBtn) flipBtn.classList.add("hidden");
      } else if (docType === "payslip") {
        title.textContent = "Salary Payslip (Last Month)";
        desc.textContent = `Employee: ${c.applicant} | ${c.net_salary_text || 'Net salary: Pending AI scan'}`;
        imgFront.src = c.payslip_img || "/static/placeholders/doc_pending.svg";
        imgBack.src = c.payslip_img || "/static/placeholders/doc_pending.svg";
        if (flipBtn) flipBtn.classList.add("hidden");
      } else if (docType === "sale_deed") {
        title.textContent = "Registered Sale Deed (દસ્તાવેજ)";
        desc.textContent = `Buyer: ${c.applicant} | Consideration: ₹48.00 Lacs | Sub-Registrar Reg # 7491/22`;
        imgFront.src = c.sale_deed_img || "/static/placeholders/doc_pending.svg";
        imgBack.src = c.sale_deed_img || "/static/placeholders/doc_pending.svg";
        if (flipBtn) flipBtn.classList.add("hidden");
      } else if (docType === "index2") {
        title.textContent = "Index II Copy (સૂચિ ૨ નકલ)";
        desc.textContent = `Claimant: ${c.applicant} | Sub-Registrar Gandhinagar | Clear Marketable Title`;
        imgFront.src = c.index2_img || "/static/placeholders/doc_pending.svg";
        imgBack.src = c.index2_img || "/static/placeholders/doc_pending.svg";
        if (flipBtn) flipBtn.classList.add("hidden");
      }

      isPwaCardFlipped = false;
      const flipCard = document.getElementById("pwaDocModalCard");
      if (flipCard) flipCard.classList.remove("is-flipped");

      if (modal) modal.classList.remove("hidden");
    }

    function flipPwaDocSide() {
      const flipCard = document.getElementById("pwaDocModalCard");
      if (!flipCard) return;
      isPwaCardFlipped = !isPwaCardFlipped;
      if (isPwaCardFlipped) {
        flipCard.classList.add("is-flipped");
      } else {
        flipCard.classList.remove("is-flipped");
      }
    }

    function closePwaDocModal() {
      const modal = document.getElementById("pwaDocModal");
      if (modal) modal.classList.add("hidden");
    }

    // ==========================================
    // QUESTION 1: EXECUTIVE & PERSONA MANAGERS
    // ==========================================
    function toggleAddExecutiveInput() {
      const box = document.getElementById("addExecutiveBox");
      if (box) {
        box.classList.toggle("hidden");
        if (!box.classList.contains("hidden")) {
          const inp = document.getElementById("newExecutiveInput");
          if (inp) inp.focus();
        }
      }
    }

    function handleExecutiveSelect(val) {
      if (val === "__add_new__") {
        toggleAddExecutiveInput();
      }
    }

    function saveNewExecutive() {
      const input = document.getElementById("newExecutiveInput");
      const val = (input ? input.value : "").trim();
      if (!val) {
        alert("Please enter executive name");
        return;
      }
      const sel = document.getElementById("formExecutive");
      if (sel) {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = `${val} (Custom Executive)`;
        opt.selected = true;
        sel.insertBefore(opt, sel.lastElementChild);
      }
      if (input) input.value = "";
      toggleAddExecutiveInput();
    }

    function toggleAddPersonaInput() {
      const box = document.getElementById("addPersonaBox");
      if (box) {
        box.classList.toggle("hidden");
        if (!box.classList.contains("hidden")) {
          const inp = document.getElementById("newPersonaInput");
          if (inp) inp.focus();
        }
      }
    }

    function handlePersonaSelect(val) {
      if (val === "__add_new__") {
        toggleAddPersonaInput();
      }
    }

    function saveNewPersona() {
      const input = document.getElementById("newPersonaInput");
      const val = (input ? input.value : "").trim();
      if (!val) {
        alert("Please enter persona type");
        return;
      }
      const sel = document.getElementById("formPersona");
      if (sel) {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = `${val} (Custom Persona)`;
        opt.selected = true;
        sel.insertBefore(opt, sel.lastElementChild);
      }
      if (input) input.value = "";
      toggleAddPersonaInput();
    }

    // ==========================================
    // FIELD STAFF OWN SELFIE WATERMARK & ATTESTATION
    // ==========================================
    let agentSelfieDataUrl = null;
    let lastFullSelfieDataUrl = null;

    function rotatePwaSelfie90() {
      if (!sampleCaseId) return;
      const srcToRotate = lastFullSelfieDataUrl || agentSelfieDataUrl || localStorage.getItem("selfie_" + sampleCaseId);
      if (!srcToRotate) {
        alert("Please capture or upload your selfie first, then tap Rotate 90° if needed.");
        return;
      }
      const rotImg = new Image();
      rotImg.crossOrigin = "anonymous";
      rotImg.onload = () => {
        const sw = rotImg.naturalWidth || rotImg.width || 720;
        const sh = rotImg.naturalHeight || rotImg.height || 960;
        const can = document.createElement("canvas");
        // Rotate 90 degrees clockwise: new width = old height, new height = old width
        can.width = sh;
        can.height = sw;
        const rCtx = can.getContext("2d");
        rCtx.translate(sh / 2, sw / 2);
        rCtx.rotate(Math.PI / 2);
        rCtx.drawImage(rotImg, -sw / 2, -sh / 2, sw, sh);
        can.toBlob((blob) => {
          try { can.width = 0; can.height = 0; } catch (_) {}
          if (!blob) return;
          const fileName = `agent_selfie_${sampleCaseId}_${Date.now()}.jpg`;
          let rotFile = blob;
          try {
            rotFile = new File([blob], fileName, { type: "image/jpeg" });
          } catch (_) {
            rotFile.name = fileName;
          }
          handleAgentSelfieCapture({ target: { files: [rotFile], value: "" } });
        }, "image/jpeg", 0.85);
      };
      rotImg.src = srcToRotate;
    }

    function handleAgentSelfieCapture(event) {
      const file = event.target && event.target.files ? event.target.files[0] : null;
      if (event.target) event.target.value = "";
      if (!file) return;
      // See submitDueDiligenceForm's matching guard - don't let a selfie taken while a
      // just-switched-to case is still loading get attached to no case (or cached under a
      // literal "undefined" key that can never be restored/synced).
      if (!sampleCaseId) {
        alert("This case is still loading. Please wait a moment for the case details to finish loading, then try the selfie again.");
        return;
      }

      let selfieObjUrl = null;
      const cleanupSelfieObjUrl = () => {
        if (selfieObjUrl) {
          try { URL.revokeObjectURL(selfieObjUrl); } catch (_) {}
          selfieObjUrl = null;
        }
      };

      const img = new Image();
      img.onload = () => {
        cleanupSelfieObjUrl();
        const canvas = document.createElement("canvas");
        const maxDim = 960;
        let w = img.naturalWidth || img.width || 720;
        let h = img.naturalHeight || img.height || 960;
        if (w > maxDim || h > maxDim) {
          if (w >= h) {
            h = Math.max(1, Math.round((h * maxDim) / w));
            w = maxDim;
          } else {
            w = Math.max(1, Math.round((w * maxDim) / h));
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        try {
          img.onload = null;
          img.onerror = null;
          img.src = "";
        } catch (_) {}

        const now = new Date();
        const timeStr = now.toLocaleDateString("en-GB") + " " + now.toLocaleTimeString("en-GB") + " IST";
        const agentName = (document.getElementById("agentNameDisplay") || {}).textContent || "Field Officer";

        const fullSelfieDataUrl = canvas.toDataURL("image/jpeg", 0.80);
        lastFullSelfieDataUrl = fullSelfieDataUrl;
        // Generate compact 240px selfie thumbnail (~8KB) for DOM preview & localStorage
        let thumbSelfieUrl = fullSelfieDataUrl;
        try {
          const tCan = document.createElement("canvas");
          const tw = 240;
          const th = Math.max(1, Math.round((h * tw) / w));
          tCan.width = tw;
          tCan.height = th;
          tCan.getContext("2d").drawImage(canvas, 0, 0, tw, th);
          thumbSelfieUrl = tCan.toDataURL("image/jpeg", 0.65);
          tCan.width = 0;
          tCan.height = 0;
        } catch (_) {}

        agentSelfieDataUrl = thumbSelfieUrl;
        try {
          localStorage.setItem("selfie_" + sampleCaseId, thumbSelfieUrl);
          localStorage.setItem("selfie_timestamp_" + sampleCaseId, timeStr);
          localStorage.setItem("selfie_agent_" + sampleCaseId, agentName);
        } catch (e) {}
        updateAttestationProgress();

        // Update Preview UI
        const previewImg = document.getElementById("agentSelfiePreview");
        const placeholder = document.getElementById("agentSelfiePlaceholder");
        const wmTag = document.getElementById("selfieWatermarkTag");
        const badge = document.getElementById("selfieStatusBadge");
        const btnText = document.getElementById("selfieBtnText");
        const metaInfo = document.getElementById("selfieMetaInfo");
        const agentText = document.getElementById("selfieAgentNameText");
        const timeText = document.getElementById("selfieTimestampText");

        if (previewImg) {
          previewImg.src = thumbSelfieUrl;
          previewImg.classList.remove("hidden");
        }
        if (placeholder) placeholder.classList.add("hidden");
        if (wmTag) wmTag.classList.remove("hidden");
        if (badge) {
          badge.className = "font-mono text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-2xs";
          badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span><span>SELFIE VERIFIED (સર્વે શરૂ)</span>`;
        }
        if (btnText) btnText.textContent = "Re-take Selfie (ફરીથી લો)";
        if (metaInfo) metaInfo.classList.remove("hidden");
        if (agentText) agentText.textContent = agentName;
        if (timeText) timeText.textContent = timeStr;

        // ZERO-LAG UPLOAD TO SERVER AS AGENT_SELFIE DOCUMENT
        canvas.toBlob(async (blob) => {
          try {
            canvas.width = 0;
            canvas.height = 0;
          } catch (_) {}
          if (!blob) return;
          try {
            const formData = new FormData();
            formData.append("doc_type", "AGENT_SELFIE");
            formData.append("latitude", currentDeviceLat);
            formData.append("longitude", currentDeviceLon);
            formData.append("file", blob, `agent_selfie_${sampleCaseId}.jpg`);

            const token = localStorage.getItem("pwa_token");
            const headers = {};
            if (token && token !== "demo-pwa-token") {
              headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch(`/api/v1/visits/cases/${sampleCaseId}/upload`, {
              method: "POST",
              headers: headers,
              body: formData
            });
            const sData = await res.json().catch(() => ({}));
            if (res.ok && sData.status !== "offline_queued") {
              console.log("[✓] Field staff attendance selfie uploaded to CA Portal successfully!");
            } else {
              throw new Error(sData.status === "offline_queued" ? "offline_queued" : `HTTP ${res.status}`);
            }
          } catch (err) {
            console.warn("Selfie upload background retry queued:", err);
            await enqueueOfflinePhoto({
              sampleCaseId: sampleCaseId,
              dataUrl: fullSelfieDataUrl,
              fileName: `agent_selfie_${sampleCaseId}.jpg`,
              docType: "AGENT_SELFIE",
              slotNumber: null,
              folder: "residence",
              latitude: currentDeviceLat,
              longitude: currentDeviceLon,
            });
          }
        }, "image/jpeg", 0.80);
      };
      img.onerror = () => cleanupSelfieObjUrl();

      try {
        if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
          selfieObjUrl = URL.createObjectURL(file);
          img.src = selfieObjUrl;
        } else {
          const reader = new FileReader();
          reader.onload = (e) => { img.src = e.target.result; };
          reader.readAsDataURL(file);
        }
      } catch (_) {
        const reader = new FileReader();
        reader.onload = (e) => { img.src = e.target.result; };
        reader.readAsDataURL(file);
      }
    }

    // ==========================================
    // STRUCTURED FAMILY DETAILS BUILDER
    // ==========================================
    let familyMembers = [];

    const familyRelations = [
      "Self / Applicant (પોતે / અરજદાર)",
      "Husband (પતિ)", "Wife (પત્ની)", "Son (પુત્ર)", "Daughter (પુત્રી)",
      "Father (પિતા)", "Mother (માતા)", "Father in law (સસરા)", "Mother in law (સાસુ)",
      "Brother (ભાઈ)", "Sister (બહેન)", "Grandfather (દાદા)", "Grandmother (દાદી)",
      "Uncle (કાકા / મામા)", "Aunt (કાકી / મામી)", "Relative / Other (અન્ય)"
    ];

    const familyOccupations = [
      "Business (ધંધો)", "Job / Salaried (નોકરી)", "House wife (ગૃહિણી)",
      "Student (વિદ્યાર્થી)", "Pensioner (પેન્શનર)", "Self-Employed (સ્વરોજગાર)",
      "Agriculture / Farmer (ખેતી)", "Dependent (આધારિત)"
    ];

    function renderFamilyMembers() {
      const container = document.getElementById("familyMembersContainer");
      if (!container) return;

      container.innerHTML = "";
      familyMembers.forEach((m, idx) => {
        if (!m || typeof m !== "object") return;
        const relStr = String(m.relation || "Relative / Other (અન્ય)");
        const occStr = String(m.occupation || (m.earning === "No" ? "Dependent (આધારિત)" : "Job / Salaried (નોકરી)"));
        if (!m.relation) m.relation = relStr;
        if (!m.occupation) m.occupation = occStr;
        const relWord = relStr.split(" ")[0] || "Relative";
        const occWord = occStr.split(" ")[0] || "Job";
        const row = document.createElement("div");
        row.className = "p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant shadow-2xs space-y-2";
        
        let relOptions = familyRelations.map(r => `<option value="${r}" ${r.startsWith(relWord) || relStr === r ? 'selected' : ''}>${r}</option>`).join("");
        let occOptions = familyOccupations.map(o => `<option value="${o}" ${o.startsWith(occWord) || occStr === o ? 'selected' : ''}>${o}</option>`).join("");

        row.innerHTML = `
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/60">
            <span class="font-headline font-bold text-xs text-primary-container">Member #${idx + 1}</span>
            <button type="button" onclick="removeFamilyMemberRow(${idx})" class="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded active:scale-95 transition-all" title="Remove Member">
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <label class="font-mono text-[9px] text-outline block mb-0.5">Full Name (પૂરું નામ)*</label>
              <input type="text" value="${(m.name || '').replace(/"/g, '&quot;')}" oninput="updateFamilyMember(${idx}, 'name', this.value)" placeholder="Name" class="w-full text-xs font-semibold rounded border border-outline-variant bg-white p-1.5 text-on-surface"/>
            </div>
            <div>
              <label class="font-mono text-[9px] text-outline block mb-0.5">Relation (સંબંધ)*</label>
              <select onchange="updateFamilyMember(${idx}, 'relation', this.value)" class="w-full text-xs font-semibold rounded border border-outline-variant bg-white p-1.5 text-on-surface">
                ${relOptions}
              </select>
            </div>
            <div>
              <label class="font-mono text-[9px] text-outline block mb-0.5">Age (ઉંમર)*</label>
              <input type="number" value="${m.age || ''}" oninput="updateFamilyMember(${idx}, 'age', this.value)" placeholder="Age" class="w-full text-xs font-mono font-semibold rounded border border-outline-variant bg-white p-1.5 text-on-surface"/>
            </div>
            <div>
              <label class="font-mono text-[9px] text-outline block mb-0.5">Occupation (વ્યવસાય)*</label>
              <select id="familyMemberOcc_${idx}" onchange="updateFamilyMember(${idx}, 'occupation', this.value)" class="w-full text-xs font-semibold rounded border border-outline-variant bg-white p-1.5 text-on-surface">
                ${occOptions}
              </select>
            </div>
          </div>
        `;
        container.appendChild(row);
      });

      const badge = document.getElementById("familyMemberCountBadge");
      if (badge) badge.textContent = `${familyMembers.length} Members`;

      syncFamilyTextarea();
    }

    function addFamilyMemberRow() {
      familyMembers.push({ name: "", age: "", relation: "Relative / Other (અન્ય)", occupation: "Job / Salaried (નોકરી)" });
      renderFamilyMembers();
      if (typeof schedulePwaFormAutoSave === "function") schedulePwaFormAutoSave();
    }

    function removeFamilyMemberRow(idx) {
      if (familyMembers.length <= 1) {
        alert("At least 1 family member should be recorded.");
        return;
      }
      familyMembers.splice(idx, 1);
      renderFamilyMembers();
      if (typeof schedulePwaFormAutoSave === "function") schedulePwaFormAutoSave();
    }

    function updateFamilyMember(idx, field, val) {
      if (familyMembers[idx]) {
        familyMembers[idx][field] = val;
        if (field === "age") {
          const ageNum = parseInt(val, 10);
          // Only auto-default to Student when a full 2-digit minor age (10..17) or 0-year value is entered,
          // and update the dropdown in-place WITHOUT calling renderFamilyMembers() (which destroyed the active
          // <input> DOM node after typing the first digit "2" of "25", causing the cursor to disappear!).
          if (String(val).trim().length >= 2 && ageNum > 0 && ageNum < 18 && (familyMembers[idx].occupation || "").startsWith("Job")) {
            familyMembers[idx].occupation = "Student (વિદ્યાર્થી)";
            const occSel = document.getElementById(`familyMemberOcc_${idx}`);
            if (occSel) occSel.value = "Student (વિદ્યાર્થી)";
          }
        }
        syncFamilyTextarea();
        if (typeof schedulePwaFormAutoSave === "function") schedulePwaFormAutoSave();
      }
    }

    // The family member UI tracks "Occupation" (what they do), not a separate Yes/No earning
    // toggle - the report's "Earning" column is derived from it rather than left uncaptured.
    function familyMemberEarningStatus(occupation, age) {
      const ageNum = parseInt(age, 10);
      if (!isNaN(ageNum) && ageNum > 0 && ageNum < 18) return "No";
      const o = (occupation || "").toLowerCase();
      if (o.startsWith("house wife") || o.startsWith("housewife") || o.startsWith("student") || o.startsWith("dependent") || o.startsWith("no")) return "No";
      return "Yes";
    }

    // Structured {name, relation, age, earning} rows for the report - the raw familyMembers
    // array also carries "occupation", which the report's family table does not have a column
    // for, so it is intentionally left out here.
    function buildFamilyMembersForReport() {
      return familyMembers.map(m => ({
        name: m.name || "",
        relation: (m.relation || "").split(" (")[0].trim(),
        age: m.age || "",
        occupation: m.occupation || "",
        earning: m.earning && (m.earning === "No" || m.earning === "Yes") && !m.occupation
          ? familyMemberEarningStatus(m.earning, m.age)
          : familyMemberEarningStatus(m.occupation, m.age),
      }));
    }

    function syncFamilyTextarea() {
      const textarea = document.getElementById("formFamily");
      if (!textarea) return;
      const lines = familyMembers.map((m, i) => {
        const cleanRel = (m.relation || "").split(" ")[0];
        const cleanOcc = (m.occupation || "").split(" ")[0];
        return `${i + 1} - ${m.name || 'Member'} - ${m.age || '0'} - ${cleanRel} - ${cleanOcc}`;
      });
      textarea.value = lines.join("\n");
    }

    function toggleRawFamilyView() {
      const box = document.getElementById("rawFamilyBox");
      if (box) box.classList.toggle("hidden");
    }

    // ==========================================
    // INTERACTIVE ASSETS VISIBLE CHIPS MANAGER
    // ==========================================
    let visibleAssets = [
      { id: "ac", name: "AC", active: false },
      { id: "fan", name: "FAN", active: false },
      { id: "light", name: "LIGHT", active: false },
      { id: "sofa", name: "SOFA", active: false },
      { id: "fridge", name: "FRIDGE", active: false },
      { id: "ro", name: "RO", active: false },
      { id: "cctv", name: "CCTV", active: false },
      { id: "tv", name: "TV (ટેલિવિઝન)", active: false },
      { id: "wm", name: "WASHING MACHINE (વોશિંગ મશીન)", active: false },
      { id: "bike", name: "TWO WHEELER (બાઇક / એક્ટિવા)", active: false },
      { id: "car", name: "CAR (ફોર વ્હીલર)", active: false },
      { id: "dining", name: "DINING TABLE (ડાઇનિંગ ટેબલ)", active: false },
      { id: "inverter", name: "INVERTER (ઇન્વર્ટર)", active: false },
      { id: "micro", name: "MICROWAVE (માઇક્રોવેવ)", active: false }
    ];

    function renderAssetsChips() {
      const container = document.getElementById("assetsChipsContainer");
      if (!container) return;

      container.innerHTML = "";
      let activeCount = 0;

      visibleAssets.forEach((a, idx) => {
        if (a.active) activeCount++;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.onclick = () => toggleAssetChip(idx);
        if (a.active) {
          btn.className = "px-2.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-all";
          btn.innerHTML = `<span class="material-symbols-outlined text-[15px] text-emerald-700">check_circle</span> <span>${a.name}</span>`;
        } else {
          btn.className = "px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-container font-medium flex items-center gap-1 shadow-2xs active:scale-95 transition-all";
          btn.innerHTML = `<span class="material-symbols-outlined text-[15px] text-outline">add</span> <span>${a.name}</span>`;
        }
        container.appendChild(btn);
      });

      const countBadge = document.getElementById("activeAssetsCountBadge");
      if (countBadge) countBadge.textContent = `${activeCount} Selected`;

      syncAssetsInput();
    }

    function toggleAssetChip(idx) {
      if (visibleAssets[idx]) {
        visibleAssets[idx].active = !visibleAssets[idx].active;
        renderAssetsChips();
        if (typeof schedulePwaFormAutoSave === "function") schedulePwaFormAutoSave();
      }
    }

    function addNewCustomAsset() {
      const input = document.getElementById("customAssetInput");
      const val = (input ? input.value : "").trim();
      if (!val) {
        alert("Please enter asset name (e.g. Geyser, Chimney)");
        return;
      }
      visibleAssets.push({ id: "custom_" + Date.now(), name: val.toUpperCase(), active: true });
      if (input) input.value = "";
      renderAssetsChips();
      if (typeof schedulePwaFormAutoSave === "function") schedulePwaFormAutoSave();
    }

    function syncAssetsInput() {
      const activeNames = visibleAssets.filter(a => a.active).map(a => a.name);
      const hidden = document.getElementById("formAssetsObserved");
      if (hidden) hidden.value = activeNames.join(", ");
    }

    // Submit & Complete Physical Verification
    async function submitFinalPhysicalVerification() {
      const resCount = Object.values(uploadedResidenceSlots).filter(Boolean).length;
      const offCount = Object.values(uploadedOfficeSlots).filter(Boolean).length;
      const coOffCount = Object.values(uploadedCoOfficeSlots).filter(Boolean).length;
      const coResCount = Object.values(uploadedCoResidenceSlots).filter(Boolean).length;
      const h3Count = Object.values(uploadedHome3Slots).filter(Boolean).length;
      const h4Count = Object.values(uploadedHome4Slots).filter(Boolean).length;
      const h5Count = Object.values(uploadedHome5Slots).filter(Boolean).length;
      const totalUploadedCount = resCount + offCount + coOffCount + coResCount + h3Count + h4Count + h5Count;

      if (totalUploadedCount === 0) {
        if (!confirm("No physical evidence photos have been captured yet. Do you still wish to submit?")) {
          return;
        }
      }

      const btn = document.getElementById("btnSubmitVerification");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[20px]">sync</span> Submitting Physical Verification...`;
      }

      try {
        // Auto-save questionnaire data first so no typed field answers are ever lost if the
        // agent tapped "Submit & Complete Physical Verification" directly.
        try {
          await submitDueDiligenceForm({ silent: true });
        } catch (formErr) {
          console.warn("Auto-save form before checkout:", formErr);
        }

        const token = localStorage.getItem("pwa_token");
        const headers = { "Content-Type": "application/json" };
        if (token && token !== "demo-pwa-token") {
          headers["Authorization"] = `Bearer ${token}`;
        }

        await fetch(`/api/v1/visits/check-out`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            case_id: sampleCaseId,
            latitude: currentDeviceLat,
            longitude: currentDeviceLon,
            notes: `Physical verification completed on-site. ${totalUploadedCount} geotagged photo slot(s) submitted (Residence: ${resCount}/4, Office: ${offCount}/4${coOffCount ? `, Co-Office: ${coOffCount}/4` : ""}).`
          })
        });

        // Show completion modal
        const compModal = document.getElementById("pwaCompletionModal");
        const compCaseNo = document.getElementById("pwaCompletionCaseNo");
        if (compCaseNo) {
          compCaseNo.textContent = activeCaseKey || "Current Case";
        }
        const compTime = document.getElementById("pwaCompletionTimestamp");
        if (compTime) {
          compTime.textContent = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + " IST";
        }
        const compSlots = document.getElementById("pwaCompletionSlots");
        if (compSlots) {
          compSlots.textContent = `${totalUploadedCount} Geotagged Photo Slot(s) Uploaded`;
        }
        if (compModal) compModal.classList.remove("hidden");

      } catch(e) {
        const compModal = document.getElementById("pwaCompletionModal");
        if (compModal) compModal.classList.remove("hidden");
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = `<span class="material-symbols-outlined text-[20px]">task_alt</span> <span>Physical Verification Completed (પૂર્ણ થયેલ)</span>`;
          btn.className = "w-full py-3.5 rounded-lg bg-emerald-900 text-emerald-100 font-headline text-sm font-bold shadow flex items-center justify-center gap-2 cursor-default";
        }
      }
    }

    async function handleSiteCheckIn() {
      const btn = document.getElementById("checkInBtnText");
      const nowDate = new Date();
      const stamp = nowDate.toLocaleDateString('en-GB') + " " +
        nowDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + " IST";
      if (btn) btn.textContent = `Check-In Logged: ${stamp}`;
      try {
        localStorage.setItem(`pwa_checkin_${sampleCaseId}`, stamp);
        localStorage.setItem(`pwa_checkin_${activeCaseKey}`, stamp);
      } catch(e) {}
      if (sampleCaseId) {
        try {
          const token = localStorage.getItem("pwa_token");
          const headers = { "Content-Type": "application/json" };
          if (token && token !== "demo-pwa-token") headers["Authorization"] = `Bearer ${token}`;
          await fetch(`/api/v1/visits/check-in`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              case_id: sampleCaseId,
              current_lat: currentDeviceLat || TARGET_LAT || 23.0225,
              current_lon: currentDeviceLon || TARGET_LON || 72.5714,
              notes: `Field agent checked in at site (${stamp})`,
            }),
          });
        } catch (err) {
          console.warn("Check-in offline/background:", err);
        }
      }
      alert(`Site Check-In successfully recorded at GPS coordinates (${(currentDeviceLat || 23.0225).toFixed(4)}° N, ${(currentDeviceLon || 72.5714).toFixed(4)}° E)`);
    }

    function promptInspectionNotes() {
      const existingNote = (document.getElementById("formOfficeAssessment") && document.getElementById("formOfficeAssessment").value)
        || localStorage.getItem(`pwa_notes_${sampleCaseId}`)
        || "Physical existence confirmed. Property & identity verified on site.";
      const notes = prompt("Enter observation notes for this property visit:", existingNote);
      if (notes) {
        try { localStorage.setItem(`pwa_notes_${sampleCaseId}`, notes); } catch (e) {}
        const assessEl = document.getElementById("formOfficeAssessment");
        if (assessEl && !assessEl.value) assessEl.value = notes;
        alert("Visit notes saved and linked to case dossier.");
      }
    }

    // ==========================================
    // OFFLINE SYNC ENGINE (INDEXEDDB + AUTO-SYNC)
    // ==========================================
    const PWA_DB_NAME = "ValuexCpvOfflineDB";
    const PWA_PHOTO_STORE = "offline_photos";

    function openPwaDb() {
      return new Promise((resolve) => {
        try {
          const req = indexedDB.open(PWA_DB_NAME, 2);
          req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(PWA_PHOTO_STORE)) {
              db.createObjectStore(PWA_PHOTO_STORE, { keyPath: "id", autoIncrement: true });
            }
          };
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }

    async function enqueueOfflinePhoto(payload) {
      const db = await openPwaDb();
      if (db) {
        try {
          const tx = db.transaction(PWA_PHOTO_STORE, "readwrite");
          tx.objectStore(PWA_PHOTO_STORE).add({ ...payload, created_at: Date.now() });
        } catch (e) {
          console.warn("IndexedDB photo queue write error:", e);
        }
      }
      updateOfflineSyncIndicator();
    }

    async function getPendingOfflineCount() {
      const db = await openPwaDb();
      let photoCount = 0;
      if (db) {
        try {
          photoCount = await new Promise((resolve) => {
            const tx = db.transaction(PWA_PHOTO_STORE, "readonly");
            const req = tx.objectStore(PWA_PHOTO_STORE).count();
            req.onsuccess = () => resolve(req.result || 0);
            req.onerror = () => resolve(0);
          });
        } catch (e) {
          photoCount = 0;
        }
      }
      let formCount = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("field_form_")) formCount++;
      }
      return photoCount + formCount;
    }

    async function updateOfflineSyncIndicator(statusMsg) {
      const pill = document.getElementById("pwaStatusPill");
      if (!pill) return;
      if (statusMsg) {
        pill.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span> ${statusMsg}`;
        pill.className = "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-300 text-blue-800 font-mono text-[11px] font-medium";
        return;
      }
      const count = await getPendingOfflineCount();
      if (count > 0) {
        pill.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> 📦 ${count} Offline (Auto-sync on network)`;
        pill.className = "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 font-mono text-[11px] font-bold";
      } else {
        pill.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> PWA Sync Ready`;
        pill.className = "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-[11px] font-medium";
      }
    }

    let isSyncingNow = false;
    async function syncOfflineQueue(isManual = false) {
      if (isSyncingNow) return;
      if (!navigator.onLine) {
        if (isManual) alert("No internet connection detected yet. Photos & form data are safely cached on this phone. They will upload automatically once 4G/WiFi is restored.");
        updateOfflineSyncIndicator();
        return;
      }

      const totalPending = await getPendingOfflineCount();
      if (totalPending === 0) {
        if (isManual) alert("All items are already synced! No pending uploads in device memory.");
        updateOfflineSyncIndicator();
        return;
      }

      isSyncingNow = true;
      updateOfflineSyncIndicator(`⚡ Auto-Syncing ${totalPending} item(s)...`);

      // 1. Sync cached field forms
      const formKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("field_form_")) formKeys.push(k);
      }
      for (const k of formKeys) {
        try {
          const raw = localStorage.getItem(k);
          if (!raw) continue;
          const payload = JSON.parse(raw);
          const caseId = k.replace("field_form_", "");
          const res = await fetch(`/api/v1/visits/cases/${caseId}/field-form`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ form_data: payload })
          });
          const fData = await res.json().catch(() => ({}));
          if (res.ok && fData.status !== "offline_queued") {
            localStorage.removeItem(k);
            console.log(`[✓] Offline field form for case ${caseId} auto-synced successfully!`);
          }
        } catch (err) {
          console.warn("Cached form upload retry:", err);
        }
      }

      // 2. Sync queued photos
      const db = await openPwaDb();
      if (db) {
        try {
          const photos = await new Promise((resolve) => {
            const tx = db.transaction(PWA_PHOTO_STORE, "readonly");
            const req = tx.objectStore(PWA_PHOTO_STORE).getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => resolve([]);
          });

          for (const item of photos) {
            try {
              let uploadBlob = null;
              if (item.dataUrl) {
                uploadBlob = dataUrlToBlob(item.dataUrl);
                if (!uploadBlob) {
                  const bRes = await fetch(item.dataUrl);
                  uploadBlob = await bRes.blob();
                }
              }
              if (!uploadBlob) continue;

              const formData = new FormData();
              formData.append("file", uploadBlob, item.fileName || `photo_slot_${item.slotNumber}.jpg`);
              formData.append("doc_type", item.docType || "PROPERTY_EXTERIOR");
              if (item.slotNumber) formData.append("slot_number", item.slotNumber);
              if (item.folder) formData.append("folder", item.folder);
              if (item.latitude) formData.append("latitude", item.latitude);
              if (item.longitude) formData.append("longitude", item.longitude);

              const token = localStorage.getItem("pwa_token");
              const headers = {};
              if (token && token !== "demo-pwa-token") headers["Authorization"] = `Bearer ${token}`;

              const upRes = await fetch(`/api/v1/visits/cases/${item.sampleCaseId}/upload`, {
                method: "POST",
                headers: headers,
                body: formData
              });
              const upData = await upRes.json().catch(() => ({}));
              if ((upRes.ok || upRes.status === 202) && upData.status !== "offline_queued") {
                const delTx = db.transaction(PWA_PHOTO_STORE, "readwrite");
                delTx.objectStore(PWA_PHOTO_STORE).delete(item.id);
                console.log(`[✓] Queued offline photo ${item.fileName} auto-uploaded to server successfully!`);
              }
            } catch (err) {
              console.warn("Photo sync retry on next online cycle:", err);
            }
          }
        } catch (e) {
          console.warn("IndexedDB sync error:", e);
        }
      }

      isSyncingNow = false;
      const remaining = await getPendingOfflineCount();
      updateOfflineSyncIndicator();

      if (remaining === 0) {
        if (isManual) alert("✓ Success! All offline photos and forms have been transmitted to the CA Scrutiny Desk.");
        // The per-photo "Offline Saved, will upload automatically" banner is a one-time message
        // written at capture time - it never updates itself once the background sync actually
        // finishes, so it was left showing a stale "still queued" status even after a successful
        // upload. Correct it here so the agent sees confirmed delivery, not a frozen old message.
        const alertBox = document.getElementById("uploadAlert");
        const alertText = document.getElementById("uploadAlertText");
        if (alertBox && alertText && !alertBox.classList.contains("hidden")) {
          alertBox.className = "p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono shadow-sm animate-fade-in";
          alertText.innerHTML = `✅ <b>Data Uploaded Successfully!</b> All previously offline-queued photos have now been transmitted to the CA Scrutiny Desk.`;
          setUploadAlertIcon(false, "text-emerald-600", "check_circle");
        }
        if (typeof loadCaseDocumentsIntoPwa === "function" && typeof sampleCaseId !== "undefined" && sampleCaseId) {
          loadCaseDocumentsIntoPwa(sampleCaseId);
        }
      } else if (isManual) {
        alert(`${totalPending - remaining} item(s) synced. ${remaining} remaining.`);
      }
    }

    // AUTOMATIC ONLINE SYNC LISTENERS
    window.addEventListener("online", () => {
      console.log("⚡ Network restored! Auto-flushing offline photos to server...");
      syncOfflineQueue(false);
    });

    // Periodic background auto-check every 20 seconds
    setInterval(() => {
      if (navigator.onLine) {
        getPendingOfflineCount().then(c => {
          if (c > 0) syncOfflineQueue(false);
        });
      }
    }, 20000);

    // Applicant has no pre-existing loan at all: selecting NA on either the Loan Type or the
    // Bank of Previous Loan dropdown locks the whole "Previous Loan Details" row to NA so the
    // agent isn't forced to type a fake amount/bank/date for a loan that doesn't exist.
    function handlePrevLoanNaToggle(isNa) {
      const typeEl = document.getElementById("formLoanType");
      const bankEl = document.getElementById("formPrevBank");
      const bankOtherEl = document.getElementById("formPrevBankOther");
      const amountEl = document.getElementById("formLoanAmount");
      const dateEl = document.getElementById("formDealershipDate");

      if (typeEl) typeEl.value = isNa ? "NA" : (typeEl.value === "NA" ? "Home" : typeEl.value);
      if (bankEl) bankEl.value = isNa ? "NA" : (bankEl.value === "NA" ? "" : bankEl.value);
      if (bankOtherEl) bankOtherEl.classList.toggle("hidden", !(bankEl && bankEl.value === "Other"));

      [amountEl, dateEl].forEach(el => {
        if (!el) return;
        el.disabled = isNa;
        el.value = isNa ? "NA" : (el.value === "NA" ? "" : el.value);
        el.classList.toggle("opacity-50", isNa);
        el.classList.toggle("cursor-not-allowed", isNa);
      });
    }

    // Bank dropdown's own onchange: reveals the free-text box for "Other", and keeps the NA
    // lock in sync with whichever of the two dropdowns the agent actually touched.
    // skipNaSync=true is used when restoring a saved case, where handlePrevLoanNaToggle is
    // called separately right after, so this call must only handle the "Other" box reveal.
    function handlePrevBankSelectChange(value, skipNaSync) {
      const bankOtherEl = document.getElementById("formPrevBankOther");
      if (bankOtherEl) bankOtherEl.classList.toggle("hidden", value !== "Other");
      if (!skipNaSync) handlePrevLoanNaToggle(value === "NA");
    }

    // Dynamic state for 2nd / 3rd / 4th Co-Applicants (Applicants 3, 4, 5) on Mobile PWA
    let pwaExtraCoApplicants = [];

    function enableCoApplicantOnPwa() {
      const coModule = document.getElementById("coApplicantOfficeModule");
      if (coModule) coModule.classList.remove("hidden");
      const btnWrap = document.getElementById("addCoApplicantBtnWrap");
      if (btnWrap) btnWrap.classList.add("hidden");
      setCoApplicantTabVisible(true);
      const fCoName = document.getElementById("formCoName");
      if (fCoName) fCoName.focus();
    }

    function renderExtraCoApplicantsPwa() {
      const mod = document.getElementById("extraCoApplicantsModule");
      const list = document.getElementById("extraCoApplicantsPwaList");
      if (!mod || !list) return;
      if (!Array.isArray(pwaExtraCoApplicants) || pwaExtraCoApplicants.length === 0) {
        mod.classList.add("hidden");
        list.innerHTML = "";
        return;
      }
      mod.classList.remove("hidden");
      list.innerHTML = pwaExtraCoApplicants.map((ec, idx) => {
        const slotNum = ec.slot || (idx + 3);
        const off = ec.office_details || {};
        const occ = ec.occupation || off.occupation || "Job";
        const isHw = String(occ).toLowerCase().includes("house");
        const refsJoined = [off.reference_1 || off.reference, off.reference_2].filter(Boolean).join(", ");
        const esc = (v) => String(v || "").replace(/"/g, "&quot;");
        return `
          <div class="p-3 rounded-xl bg-white border border-indigo-200 shadow-2xs space-y-2.5 text-xs">
            <div class="flex items-center justify-between pb-1.5 border-b border-indigo-100">
              <span class="font-headline font-bold text-indigo-900">Applicant #${slotNum} (Co-Applicant ${idx + 2}): ${esc(ec.name || "New Co-Applicant")}</span>
              <button type="button" onclick="removeExtraCoApplicantPwaRow(${idx})" class="p-1 text-rose-500 hover:bg-rose-50 rounded" title="Remove">
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label class="font-mono text-[9px] text-outline block mb-0.5">Full Name (નામ)*</label>
                <input type="text" value="${esc(ec.name)}" oninput="updateExtraCoApplicantPwa(${idx}, 'name', this.value)" class="w-full text-xs font-semibold rounded border border-outline-variant p-1.5"/>
              </div>
              <div>
                <label class="font-mono text-[9px] text-outline block mb-0.5">Contact Number (નંબર)</label>
                <input type="text" value="${esc(ec.contact_number)}" oninput="updateExtraCoApplicantPwa(${idx}, 'contact_number', this.value)" class="w-full text-xs font-mono font-semibold rounded border border-outline-variant p-1.5"/>
              </div>
              <div>
                <label class="font-mono text-[9px] text-outline block mb-0.5">Age (ઉંમર)</label>
                <input type="text" value="${esc(ec.age)}" oninput="updateExtraCoApplicantPwa(${idx}, 'age', this.value)" class="w-full text-xs font-mono font-semibold rounded border border-outline-variant p-1.5"/>
              </div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label class="font-mono text-[9px] text-outline block mb-0.5">Marital Status</label>
                <select onchange="updateExtraCoApplicantPwa(${idx}, 'marital_status', this.value)" class="w-full text-xs font-semibold rounded border border-outline-variant p-1.5">
                  <option value="Married" ${String(ec.marital_status || "").toLowerCase().includes("unmarried") ? "" : "selected"}>Married</option>
                  <option value="Unmarried" ${String(ec.marital_status || "").toLowerCase().includes("unmarried") ? "selected" : ""}>Unmarried</option>
                </select>
              </div>
              <div>
                <label class="font-mono text-[9px] text-outline block mb-0.5">Qualification</label>
                <input type="text" value="${esc(ec.qualification)}" oninput="updateExtraCoApplicantPwa(${idx}, 'qualification', this.value)" placeholder="e.g. Graduate" class="w-full text-xs font-semibold rounded border border-outline-variant p-1.5"/>
              </div>
              <div>
                <label class="font-mono text-[9px] text-outline block mb-0.5">Relation to Applicant</label>
                <input type="text" value="${esc(ec.relation_to_applicant)}" oninput="updateExtraCoApplicantPwa(${idx}, 'relation_to_applicant', this.value)" placeholder="e.g. Mother, Brother" class="w-full text-xs font-semibold rounded border border-outline-variant p-1.5"/>
              </div>
              <div>
                <label class="font-mono text-[9px] text-outline block mb-0.5">Occupation</label>
                <select onchange="updateExtraCoApplicantPwa(${idx}, 'occupation', this.value); renderExtraCoApplicantsPwa();" class="w-full text-xs font-semibold rounded border border-outline-variant p-1.5">
                  <option value="Job" ${occ === "Job" ? "selected" : ""}>Job / Salaried</option>
                  <option value="Business" ${occ === "Business" ? "selected" : ""}>Business</option>
                  <option value="House Wife" ${isHw ? "selected" : ""}>House Wife</option>
                  <option value="Retired" ${occ === "Retired" ? "selected" : ""}>Retired</option>
                </select>
              </div>
            </div>
            ${isHw ? `<div class="p-2 rounded bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">Housewife / Home Maker — Office verification Not Applicable.</div>` : `
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-indigo-50">
              <div>
                <label class="font-mono text-[9px] text-outline block mb-0.5">Employer / Firm Name</label>
                <input type="text" value="${esc(off.firm_name)}" oninput="updateExtraCoApplicantPwaOffice(${idx}, 'firm_name', this.value)" class="w-full text-xs font-semibold rounded border border-outline-variant p-1.5"/>
              </div>
              <div>
                <label class="font-mono text-[9px] text-outline block mb-0.5">Designation / Business Nature</label>
                <input type="text" value="${esc(off.position || off.designation)}" oninput="updateExtraCoApplicantPwaOffice(${idx}, 'position', this.value)" class="w-full text-xs font-semibold rounded border border-outline-variant p-1.5"/>
              </div>
              <div>
                <label class="font-mono text-[9px] text-outline block mb-0.5">Office Address</label>
                <input type="text" value="${esc(off.address)}" oninput="updateExtraCoApplicantPwaOffice(${idx}, 'address', this.value)" class="w-full text-xs font-semibold rounded border border-outline-variant p-1.5"/>
              </div>
              <div>
                <label class="font-mono text-[9px] text-outline block mb-0.5">Established Since / Stay</label>
                <input type="text" value="${esc(off.established_since || off.period_of_stay)}" oninput="updateExtraCoApplicantPwaOffice(${idx}, 'established_since', this.value)" class="w-full text-xs font-semibold rounded border border-outline-variant p-1.5"/>
              </div>
              <div>
                <label class="font-mono text-[9px] text-outline block mb-0.5">Workplace References (2)</label>
                <input type="text" value="${esc(refsJoined)}" oninput="updateExtraCoApplicantPwaOffice(${idx}, 'references_raw', this.value)" placeholder="Name - Relation, Name - Relation" class="w-full text-xs font-semibold rounded border border-outline-variant p-1.5"/>
              </div>
              <div>
                <label class="font-mono text-[9px] text-outline block mb-0.5">Who Did You Meet</label>
                <input type="text" value="${esc(off.who_meet)}" oninput="updateExtraCoApplicantPwaOffice(${idx}, 'who_meet', this.value)" class="w-full text-xs font-semibold rounded border border-outline-variant p-1.5"/>
              </div>
            </div>`}
          </div>
        `;
      }).join("");
    }

    function addExtraCoApplicantPwaRow() {
      if (pwaExtraCoApplicants.length >= 3) {
        alert("Up to 5 total applicants (Applicant + 4 Co-Applicants) are supported.");
        return;
      }
      const nextSlot = pwaExtraCoApplicants.length + 3;
      pwaExtraCoApplicants.push({
        slot: nextSlot,
        name: "",
        contact_number: "",
        age: "",
        marital_status: "Married",
        qualification: "",
        relation_to_applicant: "",
        occupation: "Job",
        office_details: { occupation: "Job", work_from_home: "No" },
      });
      renderExtraCoApplicantsPwa();
      if (typeof schedulePwaFormAutoSave === "function") schedulePwaFormAutoSave();
    }

    function removeExtraCoApplicantPwaRow(idx) {
      pwaExtraCoApplicants.splice(idx, 1);
      pwaExtraCoApplicants.forEach((item, i) => { item.slot = i + 3; });
      renderExtraCoApplicantsPwa();
      if (typeof schedulePwaFormAutoSave === "function") schedulePwaFormAutoSave();
    }

    function updateExtraCoApplicantPwa(idx, field, val) {
      if (!pwaExtraCoApplicants[idx]) return;
      pwaExtraCoApplicants[idx][field] = val;
      if (field === "occupation") {
        if (!pwaExtraCoApplicants[idx].office_details) pwaExtraCoApplicants[idx].office_details = {};
        pwaExtraCoApplicants[idx].office_details.occupation = val;
      }
      if (typeof schedulePwaFormAutoSave === "function") schedulePwaFormAutoSave();
    }

    function updateExtraCoApplicantPwaOffice(idx, field, val) {
      if (!pwaExtraCoApplicants[idx]) return;
      if (!pwaExtraCoApplicants[idx].office_details) pwaExtraCoApplicants[idx].office_details = {};
      const off = pwaExtraCoApplicants[idx].office_details;
      if (field === "position") {
        off.position = val;
        off.designation = val;
      } else if (field === "established_since") {
        off.established_since = val;
        off.period_of_stay = val;
      } else if (field === "references_raw") {
        off.reference_1 = (val.split(",")[0] || "").trim();
        off.reference_2 = (val.split(",")[1] || "").trim();
      } else {
        off[field] = val;
      }
      if (typeof schedulePwaFormAutoSave === "function") schedulePwaFormAutoSave();
    }

    function renderPwaCoApplicantsBanner(c) {
      const banner = document.getElementById("pwaCoApplicantsBanner");
      if (!banner) return;
      const rows = [];
      if (c && c.co_applicant_name) {
        rows.push(`<div><b>Co-Applicant 1:</b> ${c.co_applicant_name.replace(/</g, "&lt;")}${c.co_applicant_phone ? " • 📞 " + c.co_applicant_phone.replace(/</g, "&lt;") : ""}${c.co_office_address ? " • 🏢 " + c.co_office_address.replace(/</g, "&lt;") : ""}</div>`);
      }
      [3, 4, 5].forEach((slotNum, idx) => {
        const sName = (c && c[`applicant_${slotNum}_name`]) || (pwaExtraCoApplicants[idx] && pwaExtraCoApplicants[idx].name);
        const sPhone = (c && c[`applicant_${slotNum}_phone`]) || (pwaExtraCoApplicants[idx] && pwaExtraCoApplicants[idx].contact_number);
        if (sName) {
          rows.push(`<div><b>Co-Applicant ${idx + 2} (Applicant ${slotNum}):</b> ${String(sName).replace(/</g, "&lt;")}${sPhone ? " • 📞 " + String(sPhone).replace(/</g, "&lt;") : ""}</div>`);
        }
      });
      if (rows.length > 0) {
        banner.innerHTML = rows.join("");
        banner.classList.remove("hidden");
      } else {
        banner.innerHTML = "";
        banner.classList.add("hidden");
      }
    }

    // ==========================================
    // PER-CASE AUTOMATIC FORM PERSISTENCE & MULTI-DAY HOME/OFFICE VISIT ENGINE
    // ==========================================
    let isSwitchingPwaCase = false;
    let pwaFormAutoSyncTimer = null;

    function collectPwaDueDiligencePayload() {
      const exec = document.getElementById("formExecutive") ? document.getElementById("formExecutive").value : "";
      const persona = document.getElementById("formPersona") ? document.getElementById("formPersona").value : "Applicant";
      const contactNumber = document.getElementById("formContactNumber") ? document.getElementById("formContactNumber").value.trim() : "";
      const marital = document.getElementById("formMarital") ? document.getElementById("formMarital").value : "Married (પરિણિત)";
      const ageComm = (document.getElementById("formAge") || {}).value || "";
      const communityChecked = document.querySelector('input[name="pwaCommRadio"]:checked');
      const community = communityChecked ? communityChecked.value : "";
      const qualification = document.getElementById("formQualification") ? document.getElementById("formQualification").value : "";
      const bType = document.getElementById("formBuildingType") ? document.getElementById("formBuildingType").value : "Flat";
      const bhk = document.getElementById("formBhk") ? document.getElementById("formBhk").value : "3 BHK";
      const own = document.getElementById("formOwnership") ? document.getElementById("formOwnership").value : "Owned";
      const stay = document.getElementById("formStayDuration") ? document.getElementById("formStayDuration").value : "";
      const owner = document.getElementById("formOwnerName") ? document.getElementById("formOwnerName").value : "";
      const refs = document.getElementById("formReferences") ? document.getElementById("formReferences").value : "";
      const landmark = document.getElementById("formLandmark") ? document.getElementById("formLandmark").value.trim() : "";
      const personMetRaw = document.getElementById("formPersonMet") ? document.getElementById("formPersonMet").value.trim() : "";
      const personMetRelationSel = document.getElementById("formPersonMetRelation") ? document.getElementById("formPersonMetRelation").value : "";
      const personMet = personMetRelationSel ? `${personMetRaw} (${personMetRelationSel})` : personMetRaw;
      const occupation = document.getElementById("formOccupation") ? document.getElementById("formOccupation").value : "Job";
      const firmName = document.getElementById("formFirmName") ? document.getElementById("formFirmName").value : "";
      const designation = document.getElementById("formDesignation") ? document.getElementById("formDesignation").value : "";
      const officeAddress = document.getElementById("formOfficeAddress") ? document.getElementById("formOfficeAddress").value : "";
      const wfh = document.getElementById("formWorkFromHome") ? document.getElementById("formWorkFromHome").value : "No";
      const firmType = document.getElementById("formFirmType") ? document.getElementById("formFirmType").value : "";
      const numWorkers = document.getElementById("formNumWorkers") ? document.getElementById("formNumWorkers").value.trim() : "";
      const nameboard = document.getElementById("formNameboard") ? document.getElementById("formNameboard").value.trim() : "";
      const infrastructure = document.getElementById("formInfrastructure") ? document.getElementById("formInfrastructure").value : "";
      const premisesOwnership = document.getElementById("formPremisesOwnership") ? document.getElementById("formPremisesOwnership").value : "";
      const premisesOwnerName = document.getElementById("formPremisesOwnerName") ? document.getElementById("formPremisesOwnerName").value.trim() : "";
      const officeLandmark = document.getElementById("formOfficeLandmark") ? document.getElementById("formOfficeLandmark").value.trim() : "";
      const establishedSince = document.getElementById("formEstablishedSince") ? document.getElementById("formEstablishedSince").value.trim() : "";
      const officeLocation = document.getElementById("formOfficeLocation") ? document.getElementById("formOfficeLocation").value : "";
      const officeAssets = document.getElementById("formOfficeAssets") ? document.getElementById("formOfficeAssets").value.trim() : "";
      const officeReferencesRaw = document.getElementById("formOfficeReferences") ? document.getElementById("formOfficeReferences").value : "";
      const officeWhoMeet = document.getElementById("formOfficeWhoMeet") ? document.getElementById("formOfficeWhoMeet").value.trim() : "";
      const officeRegNo = document.getElementById("formOfficeRegNo") ? document.getElementById("formOfficeRegNo").value.trim() : "";
      const officeAssessment = document.getElementById("formOfficeAssessment") ? document.getElementById("formOfficeAssessment").value.trim() : "";
      const prevLoanType = document.getElementById("formLoanType") ? document.getElementById("formLoanType").value : "";
      const prevLoanAmount = document.getElementById("formLoanAmount") ? document.getElementById("formLoanAmount").value.trim() : "";
      const prevBankSelectVal = document.getElementById("formPrevBank") ? document.getElementById("formPrevBank").value : "";
      const prevLoanBank = prevBankSelectVal === "Other"
        ? (document.getElementById("formPrevBankOther") ? document.getElementById("formPrevBankOther").value.trim() : "")
        : prevBankSelectVal;
      const prevLoanDate = document.getElementById("formDealershipDate") ? document.getElementById("formDealershipDate").value.trim() : "";
      const itrAckNo = document.getElementById("formItrAckNo") ? document.getElementById("formItrAckNo").value.trim() : "";
      const itrFilingDate = document.getElementById("formItrFilingDate") ? document.getElementById("formItrFilingDate").value.trim() : "";
      const bankAccountStatus = document.getElementById("formBankAccountStatus") ? document.getElementById("formBankAccountStatus").value : "";
      const bankAccountStatusCo = document.getElementById("formCoBankAccountStatus") ? document.getElementById("formCoBankAccountStatus").value : "";

      const coModuleVisible = (() => {
        const el = document.getElementById("coApplicantOfficeModule");
        return el && !el.classList.contains("hidden");
      })();
      let officeDetailsCo = null;
      let coNameVal = "";
      let coPhoneVal = "";
      let coAgeVal = "";
      if (coModuleVisible) {
        coNameVal = document.getElementById("formCoName") ? document.getElementById("formCoName").value.trim() : "";
        coPhoneVal = document.getElementById("formCoPhone") ? document.getElementById("formCoPhone").value.trim() : "";
        coAgeVal = document.getElementById("formCoAge") ? document.getElementById("formCoAge").value.trim() : "";
        officeDetailsCo = {
          name: coNameVal,
          contact_number: coPhoneVal,
          age: coAgeVal,
          marital_status: document.getElementById("formCoMarital") ? document.getElementById("formCoMarital").value : "",
          community: document.getElementById("formCoCommunity") ? document.getElementById("formCoCommunity").value : "",
          qualification: document.getElementById("formCoQualification") ? document.getElementById("formCoQualification").value : "",
          relation_to_applicant: document.getElementById("formCoRelationToApplicant") ? document.getElementById("formCoRelationToApplicant").value.trim() : "",
          occupation: document.getElementById("formCoOccupation") ? document.getElementById("formCoOccupation").value : "Job",
          designation: document.getElementById("formCoDesignation") ? document.getElementById("formCoDesignation").value : "",
          position: document.getElementById("formCoDesignation") ? document.getElementById("formCoDesignation").value : "",
          firm_name: document.getElementById("formCoFirmName") ? document.getElementById("formCoFirmName").value : "",
          address: document.getElementById("formCoOfficeAddress") ? document.getElementById("formCoOfficeAddress").value : "",
          work_from_home: document.getElementById("formCoWorkFromHome") ? document.getElementById("formCoWorkFromHome").value : "No",
          firm_type: document.getElementById("formCoFirmType") ? document.getElementById("formCoFirmType").value : "",
          employees: document.getElementById("formCoNumWorkers") ? document.getElementById("formCoNumWorkers").value.trim() : "",
          nameboard: document.getElementById("formCoNameboard") ? document.getElementById("formCoNameboard").value.trim() : "",
          infrastructure: document.getElementById("formCoInfrastructure") ? document.getElementById("formCoInfrastructure").value : "",
          premises_ownership: document.getElementById("formCoPremisesOwnership") ? document.getElementById("formCoPremisesOwnership").value : "",
          premises_owner: document.getElementById("formCoPremisesOwnerName") ? document.getElementById("formCoPremisesOwnerName").value.trim() : "",
          landmark: document.getElementById("formCoOfficeLandmark") ? document.getElementById("formCoOfficeLandmark").value.trim() : "",
          established_since: document.getElementById("formCoEstablishedSince") ? document.getElementById("formCoEstablishedSince").value.trim() : "",
          location: document.getElementById("formCoOfficeLocation") ? document.getElementById("formCoOfficeLocation").value : "",
          assets: document.getElementById("formCoOfficeAssets") ? document.getElementById("formCoOfficeAssets").value.trim() : "",
          reference_1: (() => { const v = document.getElementById("formCoOfficeReferences") ? document.getElementById("formCoOfficeReferences").value : ""; return (v.split(",")[0] || "").trim(); })(),
          reference_2: (() => { const v = document.getElementById("formCoOfficeReferences") ? document.getElementById("formCoOfficeReferences").value : ""; return (v.split(",")[1] || "").trim(); })(),
          who_meet: document.getElementById("formCoOfficeWhoMeet") ? document.getElementById("formCoOfficeWhoMeet").value.trim() : "",
          reg_no: document.getElementById("formCoOfficeRegNo") ? document.getElementById("formCoOfficeRegNo").value.trim() : "",
        };
      }

      const coResModuleVisible = (() => {
        const el = document.getElementById("coApplicantResidenceModule");
        return el && !el.classList.contains("hidden");
      })();
      let residenceDetailsCo = null;
      if (coResModuleVisible) {
        const coResRefsRaw1 = document.getElementById("formCoResNeighbour1") ? document.getElementById("formCoResNeighbour1").value.trim() : "";
        const coResRefsRaw2 = document.getElementById("formCoResNeighbour2") ? document.getElementById("formCoResNeighbour2").value.trim() : "";
        residenceDetailsCo = {
          building_type: document.getElementById("formCoResBuildingType") ? document.getElementById("formCoResBuildingType").value : "",
          period_of_stay: document.getElementById("formCoResPeriodOfStay") ? document.getElementById("formCoResPeriodOfStay").value.trim() : "",
          owner_name: document.getElementById("formCoResOwnerName") ? document.getElementById("formCoResOwnerName").value.trim() : "",
          landmark: document.getElementById("formCoResLandmark") ? document.getElementById("formCoResLandmark").value.trim() : "",
          person_met: document.getElementById("formCoResPersonMet") ? document.getElementById("formCoResPersonMet").value.trim() : "",
          neighbour_1: coResRefsRaw1,
          neighbour_2: coResRefsRaw2,
        };
      }

      const assetsObserved = (document.getElementById("formAssetsObserved") || {}).value
        || visibleAssets.filter(a => a.active).map(a => a.name || a.label || a.id).filter(Boolean).join(", ");
      const nameboardRadio = document.querySelector('input[name="pwaNameBoardRadio"]:checked');
      const nameboardVisible = nameboardRadio ? nameboardRadio.value : "";
      const buildingNature = document.getElementById("formBuildingNature") ? document.getElementById("formBuildingNature").value.trim() : "";
      const generalAppearance = document.getElementById("formGeneralAppearance") ? document.getElementById("formGeneralAppearance").value.trim() : "";
      const resLocality = document.getElementById("formLocality") ? document.getElementById("formLocality").value.trim() : "";
      const resSurroundings = document.getElementById("formSurroundings") ? document.getElementById("formSurroundings").value.trim() : "";
      const resEvidenceRadio = document.querySelector('input[name="pwaResEvidenceRadio"]:checked');
      const resEvidence = resEvidenceRadio ? resEvidenceRadio.value : "";

      return {
        _updated_at: Date.now(),
        executive: exec,
        persona: persona,
        agent_selfie: agentSelfieDataUrl || (sampleCaseId ? localStorage.getItem("selfie_" + sampleCaseId) : null) || null,
        agent_selfie_captured_at: (sampleCaseId ? localStorage.getItem("selfie_timestamp_" + sampleCaseId) : null) || new Date().toISOString(),
        contact_number: contactNumber,
        marital_status: marital,
        age_community: ageComm,
        community: community,
        qualification: qualification,
        family_members: buildFamilyMembersForReport(),
        building_type: `${bhk} ${bType}`,
        ownership: own,
        period_of_stay: stay,
        owner_name: owner,
        neighbour_1: (refs.split(",")[0] || "").trim(),
        neighbour_2: (refs.split(",")[1] || "").trim(),
        landmark: landmark,
        person_met: personMet,
        assets_observed: assetsObserved,
        nameboard_visible: nameboardVisible,
        building_nature: buildingNature,
        general_appearance: generalAppearance,
        locality: resLocality,
        surroundings: resSurroundings,
        residence_evidence_obtained: resEvidence,
        occupation: occupation,
        itr_acknowledgement_no: itrAckNo,
        itr_filing_date: itrFilingDate,
        bank_account_status: bankAccountStatus,
        bank_account_status_co: bankAccountStatusCo,
        office_details: {
          occupation: occupation,
          designation: designation,
          position: designation,
          firm_name: firmName,
          address: officeAddress,
          work_from_home: wfh,
          firm_type: firmType,
          employees: numWorkers,
          nameboard: nameboard,
          infrastructure: infrastructure,
          premises_ownership: premisesOwnership,
          premises_owner: premisesOwnerName,
          landmark: officeLandmark,
          established_since: establishedSince,
          location: officeLocation,
          assets: officeAssets,
          reference_1: (officeReferencesRaw.split(",")[0] || "").trim(),
          reference_2: (officeReferencesRaw.split(",")[1] || "").trim(),
          who_meet: officeWhoMeet,
          reg_no: officeRegNo,
          assessment: officeAssessment,
          verification_status: occupation === 'House Wife' ? 'Not Applicable (Home Maker)' : 'Office Verification Conducted'
        },
        previous_loan: {
          loan_type: prevLoanType,
          amount: prevLoanAmount,
          bank: prevLoanBank,
          date: prevLoanDate
        },
        office_details_co: officeDetailsCo,
        residence_details_co: residenceDetailsCo,
        co_applicant_name: coNameVal || undefined,
        co_applicant_contact: coPhoneVal || undefined,
        co_applicant_age: coAgeVal || undefined,
        co_applicant_marital_status: officeDetailsCo ? officeDetailsCo.marital_status : undefined,
        co_applicant_qualification: officeDetailsCo ? officeDetailsCo.qualification : undefined,
        co_applicant_occupation: officeDetailsCo ? officeDetailsCo.occupation : undefined,
        extra_co_applicants: pwaExtraCoApplicants.filter(x => x && (x.name || "").trim()),
        restore: {
          bhk: bhk,
          building_type_only: bType,
          ownership: own,
          period_of_stay: stay,
          owner_name: owner,
          marital_status: marital,
          age_community: ageComm,
          community: community,
          qualification: qualification,
          contact_number: contactNumber,
          landmark: landmark,
          person_met: personMet,
          neighbors: [(refs.split(",")[0] || "").trim(), (refs.split(",")[1] || "").trim()].filter(Boolean),
          family_members: JSON.parse(JSON.stringify(familyMembers)),
          active_asset_ids: visibleAssets.filter(a => a.active).map(a => a.id),
          custom_assets: visibleAssets.filter(a => String(a.id || "").startsWith("custom_")).map(a => ({ id: a.id, name: a.name, active: a.active })),
          itr_acknowledgement_no: itrAckNo,
          itr_filing_date: itrFilingDate,
          bank_account_status: bankAccountStatus,
          bank_account_status_co: bankAccountStatusCo,
          nameboard_visible: nameboardVisible,
          building_nature: buildingNature,
          general_appearance: generalAppearance,
          locality: resLocality,
          surroundings: resSurroundings,
          residence_evidence_obtained: resEvidence,
        },
      };
    }

    function applyFormPayloadToCaseEntryPwa(c, formData) {
      if (!c || !formData || typeof formData !== "object") return c;
      const r = formData.restore || {};
      const off = formData.office_details || {};
      const offCo = formData.office_details_co || {};
      const resCo = formData.residence_details_co || {};
      const prevLoan = formData.previous_loan || {};

      if (formData.executive) c.executive = formData.executive;
      if (formData.persona) c.persona = formData.persona;

      // Parse BHK and Building Type from restore or top-level building_type
      if (r.bhk) {
        c.bhk = r.bhk;
      } else if (formData.building_type) {
        const bhkMatch = String(formData.building_type).match(/\b([1-5]\s*BHK)\b/i);
        if (bhkMatch) c.bhk = bhkMatch[1].toUpperCase();
      }
      if (r.building_type_only) {
        c.building_type = r.building_type_only;
      } else if (formData.building_type) {
        const stripped = String(formData.building_type).replace(/\b[1-5]\s*BHK\b/i, "").trim();
        if (stripped) c.building_type = stripped;
      }

      if (r.ownership !== undefined || formData.ownership !== undefined) {
        c.ownership = r.ownership !== undefined ? r.ownership : formData.ownership;
      }
      if (r.period_of_stay !== undefined || formData.period_of_stay !== undefined) {
        c.stay_period = r.period_of_stay !== undefined ? r.period_of_stay : formData.period_of_stay;
      }
      if (r.owner_name !== undefined || formData.owner_name !== undefined) {
        c.owner_name = r.owner_name !== undefined ? r.owner_name : formData.owner_name;
      }
      if (r.marital_status !== undefined || formData.marital_status !== undefined) {
        c.marital = r.marital_status !== undefined ? r.marital_status : formData.marital_status;
      }
      if (r.age_community !== undefined || formData.age_community !== undefined) {
        c.age = r.age_community !== undefined ? r.age_community : formData.age_community;
      }
      if (r.community !== undefined || formData.community !== undefined) {
        c.community = r.community !== undefined ? r.community : formData.community;
      }
      if (r.qualification !== undefined || formData.qualification !== undefined) {
        c.qualification = r.qualification !== undefined ? r.qualification : formData.qualification;
      }
      if (r.contact_number || formData.contact_number) {
        c.phone = r.contact_number || formData.contact_number;
      }
      if (r.landmark !== undefined || formData.landmark !== undefined) {
        c.landmark = r.landmark !== undefined ? r.landmark : formData.landmark;
      }
      if (r.person_met !== undefined || formData.person_met !== undefined) {
        c.person_met = r.person_met !== undefined ? r.person_met : formData.person_met;
      }
      if (Array.isArray(r.neighbors) && r.neighbors.length > 0) {
        c.neighbors = r.neighbors;
      } else if (formData.neighbour_1 || formData.neighbour_2) {
        c.neighbors = [formData.neighbour_1, formData.neighbour_2].filter(Boolean);
      }
      if (Array.isArray(r.family_members) && r.family_members.length > 0) {
        c.family_members = JSON.parse(JSON.stringify(r.family_members));
      } else if (Array.isArray(formData.family_members) && formData.family_members.length > 0) {
        c.family_members = JSON.parse(JSON.stringify(formData.family_members));
      }
      if (Array.isArray(r.custom_assets)) {
        c.custom_assets = r.custom_assets;
      }
      if (Array.isArray(r.active_asset_ids)) {
        c.active_asset_ids = r.active_asset_ids;
      } else if (formData.assets_observed) {
        const obsUpper = String(formData.assets_observed).toUpperCase();
        c.active_asset_ids = visibleAssets
          .filter(a => obsUpper.includes(String(a.name || "").split(" (")[0].toUpperCase()) || obsUpper.includes(String(a.id || "").toUpperCase()))
          .map(a => a.id);
      }
      if (r.nameboard_visible !== undefined || formData.nameboard_visible !== undefined) {
        c.nameboard_visible = r.nameboard_visible || formData.nameboard_visible || "No";
      }
      if (r.building_nature !== undefined || formData.building_nature !== undefined) {
        c.building_nature = r.building_nature !== undefined ? r.building_nature : formData.building_nature;
      }
      if (r.general_appearance !== undefined || formData.general_appearance !== undefined) {
        c.general_appearance = r.general_appearance !== undefined ? r.general_appearance : formData.general_appearance;
      }
      if (r.locality !== undefined || formData.locality !== undefined) {
        c.locality = r.locality !== undefined ? r.locality : formData.locality;
      }
      if (r.surroundings !== undefined || formData.surroundings !== undefined) {
        c.surroundings = r.surroundings !== undefined ? r.surroundings : formData.surroundings;
      }
      if (r.residence_evidence_obtained !== undefined || formData.residence_evidence_obtained !== undefined) {
        const rawEv = r.residence_evidence_obtained || formData.residence_evidence_obtained || "";
        c.residence_evidence_obtained = String(rawEv).toLowerCase().startsWith("yes") ? "Yes" : (rawEv || "No");
      }

      // Module 3: Office Details
      if (formData.occupation || off.occupation) c.occupation = formData.occupation || off.occupation;
      if (off.firm_name !== undefined) c.firm_name = off.firm_name;
      if (off.position !== undefined || off.designation !== undefined) {
        c.position = off.position || off.designation || "";
        c.designation = c.position;
      }
      if (off.address) c.office_address = off.address;
      if (off.work_from_home !== undefined) c.work_from_home = off.work_from_home;
      if (off.firm_type !== undefined) c.firm_type = off.firm_type;
      if (off.employees !== undefined) c.employees = off.employees;
      if (off.nameboard !== undefined) c.nameboard = off.nameboard;
      if (off.infrastructure !== undefined) c.infrastructure = off.infrastructure;
      if (off.premises_ownership !== undefined) c.premises_ownership = off.premises_ownership;
      if (off.premises_owner !== undefined) c.premises_owner = off.premises_owner;
      if (off.landmark !== undefined) c.office_landmark = off.landmark;
      if (off.established_since !== undefined) c.office_established_since = off.established_since;
      if (off.location !== undefined) c.office_location = off.location;
      if (off.assets !== undefined) c.office_assets = off.assets;
      if (off.reference_1 || off.reference_2 || off.reference) {
        c.office_references = [off.reference_1 || off.reference, off.reference_2].filter(Boolean);
      }
      if (off.who_meet !== undefined) c.office_who_meet = off.who_meet;
      if (off.reg_no !== undefined) c.office_reg_no = off.reg_no;
      if (off.assessment !== undefined) c.office_assessment = off.assessment;

      // Module 4: Previous Loan
      if (prevLoan.loan_type !== undefined) c.prev_loan_type = prevLoan.loan_type;
      if (prevLoan.amount !== undefined) c.prev_loan_amount = prevLoan.amount;
      if (prevLoan.bank !== undefined) c.prev_loan_bank = prevLoan.bank;
      if (prevLoan.date !== undefined) c.prev_loan_date = prevLoan.date;

      // Module 3B: Co-Applicant Office
      if (formData.co_applicant_name || offCo.name) c.co_applicant_name = formData.co_applicant_name || offCo.name || c.co_applicant_name;
      if (formData.co_applicant_contact || offCo.contact_number) c.co_applicant_phone = formData.co_applicant_contact || offCo.contact_number || c.co_applicant_phone;
      if (formData.co_applicant_age || offCo.age) c.co_applicant_age = offCo.age || formData.co_applicant_age || c.co_applicant_age;
      if (offCo.marital_status || formData.co_applicant_marital_status) c.co_marital_status = offCo.marital_status || formData.co_applicant_marital_status;
      if (offCo.community !== undefined) c.co_community = offCo.community;
      if (offCo.qualification || formData.co_applicant_qualification) c.co_qualification = offCo.qualification || formData.co_applicant_qualification;
      if (offCo.relation_to_applicant !== undefined) c.co_relation_to_applicant = offCo.relation_to_applicant;
      if (offCo.occupation || formData.co_applicant_occupation) c.co_occupation = offCo.occupation || formData.co_applicant_occupation;
      if (offCo.firm_name !== undefined) c.co_firm_name = offCo.firm_name;
      if (offCo.position !== undefined || offCo.designation !== undefined) c.co_position = offCo.position || offCo.designation || "";
      if (offCo.address) c.co_office_address = offCo.address;
      if (offCo.firm_type !== undefined) c.co_firm_type = offCo.firm_type;
      if (offCo.employees !== undefined) c.co_employees = offCo.employees;
      if (offCo.nameboard !== undefined) c.co_nameboard = offCo.nameboard;
      if (offCo.infrastructure !== undefined) c.co_infrastructure = offCo.infrastructure;
      if (offCo.premises_ownership !== undefined) c.co_premises_ownership = offCo.premises_ownership;
      if (offCo.premises_owner !== undefined) c.co_premises_owner = offCo.premises_owner;
      if (offCo.landmark !== undefined) c.co_office_landmark = offCo.landmark;
      if (offCo.established_since !== undefined) c.co_office_established_since = offCo.established_since;
      if (offCo.location !== undefined) c.co_office_location = offCo.location;
      if (offCo.assets !== undefined) c.co_office_assets = offCo.assets;
      if (offCo.reference_1 || offCo.reference_2 || offCo.reference) {
        c.co_office_references = [offCo.reference_1 || offCo.reference, offCo.reference_2].filter(Boolean);
      }
      if (offCo.who_meet !== undefined) c.co_office_who_meet = offCo.who_meet;
      if (offCo.reg_no !== undefined) c.co_office_reg_no = offCo.reg_no;

      // Module 3C: Co-Applicant Residence
      if (resCo.building_type !== undefined) c.co_res_building_type = resCo.building_type;
      if (resCo.period_of_stay !== undefined) c.co_res_period_of_stay = resCo.period_of_stay;
      if (resCo.owner_name !== undefined) c.co_res_owner_name = resCo.owner_name;
      if (resCo.landmark !== undefined) c.co_res_landmark = resCo.landmark;
      if (resCo.person_met !== undefined) c.co_res_person_met = resCo.person_met;
      if (resCo.neighbour_1 !== undefined) c.co_res_neighbour_1 = resCo.neighbour_1;
      if (resCo.neighbour_2 !== undefined) c.co_res_neighbour_2 = resCo.neighbour_2;

      // Module 3D: Additional Co-Applicants
      if (Array.isArray(formData.extra_co_applicants) && formData.extra_co_applicants.length > 0) {
        c.extra_co_applicants = JSON.parse(JSON.stringify(formData.extra_co_applicants));
      }
      return c;
    }

    function savePwaFormDraftLocally(explicitPayload) {
      if (isSwitchingPwaCase || !sampleCaseId) return null;
      const appDisp = document.getElementById("applicantNameDisplay");
      if (appDisp && appDisp.textContent === "Loading case...") return null;

      const payload = explicitPayload || collectPwaDueDiligencePayload();
      // Update in-memory registry immediately so any re-render (e.g. loadCaseDocumentsIntoPwa) preserves edits
      if (activeCaseKey && caseRegistryPwa[activeCaseKey]) {
        applyFormPayloadToCaseEntryPwa(caseRegistryPwa[activeCaseKey], payload);
      }
      if (sampleCaseId && caseRegistryPwa[sampleCaseId] && caseRegistryPwa[sampleCaseId] !== caseRegistryPwa[activeCaseKey]) {
        applyFormPayloadToCaseEntryPwa(caseRegistryPwa[sampleCaseId], payload);
      }

      // Strip large base64 selfie from draft JSON (selfie is already stored separately under selfie_<caseId>)
      const draftCopy = Object.assign({}, payload, { agent_selfie: null });
      try {
        const serialized = JSON.stringify(draftCopy);
        localStorage.setItem(`pwa_form_draft_${sampleCaseId}`, serialized);
        if (activeCaseKey) {
          localStorage.setItem(`pwa_form_draft_${activeCaseKey}`, serialized);
        }
      } catch (e) {
        console.warn("Could not save form draft to localStorage:", e);
      }
      return payload;
    }

    function loadPwaFormDraftLocally(caseId, caseKey) {
      const keysToTry = [
        caseId ? `pwa_form_draft_${caseId}` : null,
        caseKey ? `pwa_form_draft_${caseKey}` : null,
        caseId ? `field_form_${caseId}` : null,
        caseKey ? `field_form_${caseKey}` : null,
      ].filter(Boolean);
      let bestDraft = null;
      for (const k of keysToTry) {
        try {
          const raw = localStorage.getItem(k);
          if (!raw) continue;
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            if (!bestDraft || (parsed._updated_at || 0) > (bestDraft._updated_at || 0)) {
              bestDraft = parsed;
            }
          }
        } catch (e) {}
      }
      return bestDraft;
    }

    function mergeServerAndLocalDraftFormData(serverData, draftData) {
      const s = (serverData && typeof serverData === "object") ? serverData : {};
      const d = (draftData && typeof draftData === "object") ? draftData : null;
      if (!d) return { merged: s, hasNewerLocalDraft: false };

      const serverHasRestore = Boolean(s.restore && Object.keys(s.restore).length > 0);
      const draftIsNewer = !serverHasRestore || ((d._updated_at || 0) >= (s._updated_at || 0));

      const pickVal = (sVal, dVal) => {
        const sEmpty = sVal === undefined || sVal === null || sVal === "" || (Array.isArray(sVal) && sVal.length === 0);
        const dEmpty = dVal === undefined || dVal === null || dVal === "" || (Array.isArray(dVal) && dVal.length === 0);
        if (draftIsNewer) return !dEmpty ? dVal : sVal;
        return !sEmpty ? sVal : dVal;
      };

      const merged = Object.assign({}, s);
      for (const k of Object.keys(d)) {
        if (k === "office_details" || k === "office_details_co" || k === "residence_details_co" || k === "previous_loan" || k === "restore") {
          continue;
        }
        merged[k] = pickVal(s[k], d[k]);
      }
      ["office_details", "office_details_co", "residence_details_co", "previous_loan", "restore"].forEach(subKey => {
        if (d[subKey] && typeof d[subKey] === "object") {
          const sSub = (s[subKey] && typeof s[subKey] === "object") ? s[subKey] : {};
          const mSub = Object.assign({}, sSub);
          for (const sk of Object.keys(d[subKey])) {
            mSub[sk] = pickVal(sSub[sk], d[subKey][sk]);
          }
          merged[subKey] = mSub;
        }
      });
      return { merged, hasNewerLocalDraft: draftIsNewer };
    }

    function schedulePwaFormAutoSave() {
      if (isSwitchingPwaCase || !sampleCaseId) return;
      savePwaFormDraftLocally();
      if (pwaFormAutoSyncTimer) clearTimeout(pwaFormAutoSyncTimer);
      pwaFormAutoSyncTimer = setTimeout(() => {
        if (!isSwitchingPwaCase && sampleCaseId) {
          submitDueDiligenceForm({ silent: true, autoDraft: true });
        }
      }, 1800);
    }

    function flushPwaFormWithKeepalive() {
      if (isSwitchingPwaCase || !sampleCaseId) return;
      const payload = savePwaFormDraftLocally();
      if (!payload) return;
      // If the native mobile camera app is currently being launched by triggerSlotCapture(),
      // skip the background network POST so Chrome doesn't compete with the camera activity.
      if (Date.now() < cameraPickerOpenUntil) return;
      try {
        const bodyStr = JSON.stringify({ form_data: Object.assign({}, payload, { agent_selfie: null }) });
        fetch(`/api/v1/visits/cases/${sampleCaseId}/field-form`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: bodyStr,
          keepalive: true,
        }).catch(() => {});
      } catch (e) {}
    }

    async function submitDueDiligenceForm(opts = {}) {
      const isSilent = Boolean(opts && opts.silent);
      const isAutoDraft = Boolean(opts && opts.autoDraft);
      if (!sampleCaseId) {
        if (!isSilent) alert("This case is still loading. Please wait a moment for the case details to finish loading, then try saving again.");
        return;
      }
      if (!agentSelfieDataUrl && !isSilent) {
        if (!confirm("Field Staff Selfie has not been captured yet. Capturing your selfie authenticates attendance to start the survey. Do you wish to continue without selfie?")) {
          return;
        }
      }

      const targetCaseId = sampleCaseId;
      const targetCaseKey = activeCaseKey;
      const payload = collectPwaDueDiligencePayload();
      // Always persist locally per-case immediately (both online & offline) so switching cases or closing the browser never loses form data
      savePwaFormDraftLocally(payload);

      const bhk = (payload.restore && payload.restore.bhk) || "3 BHK";
      const bType = (payload.restore && payload.restore.building_type_only) || "Flat";
      const own = payload.ownership || "Owned";
      const stay = payload.period_of_stay || "";
      const exec = payload.executive || "";
      const persona = payload.persona || "Applicant";
      const assetsObserved = payload.assets_observed || "";

      const alertBox = document.getElementById("uploadAlert");
      const alertText = document.getElementById("uploadAlertText");
      if (!isAutoDraft && alertBox && alertText) {
        alertBox.className = "p-3 rounded-lg bg-blue-50 border border-blue-200 text-primary-container text-xs flex items-center justify-between";
        alertBox.classList.remove("hidden");
        alertText.textContent = "Syncing Due Diligence Form to CA Verification Portal...";
        setUploadAlertIcon(true, "text-blue-600", "autorenew");
      }

      const confirmBox = document.getElementById("formSubmitConfirm");
      const showSubmitConfirm = (cls, html, scroll) => {
        if (!confirmBox) return;
        confirmBox.className = `p-3 rounded-lg text-xs font-bold flex items-center gap-2 ${cls}`;
        confirmBox.innerHTML = html;
        confirmBox.classList.remove("hidden");
        if (scroll) confirmBox.scrollIntoView({ behavior: "smooth", block: "center" });
      };

      try {
        const res = await fetch(`/api/v1/visits/cases/${targetCaseId}/field-form`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form_data: payload })
        });
        const resData = await res.json().catch(() => ({}));
        if (res.ok && resData.status !== "offline_queued") {
          const savedAt = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
          if (!isAutoDraft && alertBox && alertText) {
            alertBox.className = "p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono shadow-sm animate-fade-in";
            alertText.innerHTML = `<b>✓ Data Uploaded Successfully!</b> ${bhk} ${bType} (${own}), ${stay} stay, ${visibleAssets.filter(a=>a.active).length} assets. Pushed to CA Portal for Scrutiny.`;
            setUploadAlertIcon(false, "text-emerald-600", "check_circle");
          }
          if (!isSilent) {
            showSubmitConfirm(
              "bg-emerald-50 border border-emerald-300 text-emerald-900",
              `<span class="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span><span>Saved & synced to CA Portal at ${savedAt} (You can reopen this link anytime to continue Office / Home visit)</span>`,
              true
            );
            alert(`[✓] Due Diligence Form Synced Successfully!\nCase: ${targetCaseKey}\nExecutive: ${exec}\nProperty: ${bhk} ${bType} (${own})\nDuration of Stay: ${stay}\n\nAll filled details are saved on the server & your phone. You can reopen this link tomorrow or switch cases anytime without losing data.`);
          } else if (isAutoDraft && targetCaseId === sampleCaseId) {
            showSubmitConfirm(
              "bg-emerald-50/80 border border-emerald-200 text-emerald-800",
              `<span class="material-symbols-outlined text-[16px] text-emerald-600">cloud_done</span><span>Auto-saved for Case ${targetCaseKey} at ${savedAt}</span>`,
              false
            );
          }
        } else {
          localStorage.setItem(`field_form_${targetCaseId}`, JSON.stringify(Object.assign({}, payload, { agent_selfie: null })));
          if (!isAutoDraft && alertBox && alertText) {
            alertBox.className = "p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono shadow-sm";
            alertText.innerHTML = `<b>✓ Cached Locally:</b> Form saved in PWA offline queue. Will auto-sync when online.`;
            setUploadAlertIcon(false, "text-amber-600", "cloud_off");
          }
          if (!isSilent) {
            showSubmitConfirm(
              "bg-amber-50 border border-amber-300 text-amber-900",
              `<span class="material-symbols-outlined text-[18px] text-amber-600">cloud_off</span><span>Saved on this phone - will sync to CA Portal once back online</span>`,
              true
            );
          }
        }
      } catch (e) {
        localStorage.setItem(`field_form_${targetCaseId}`, JSON.stringify(Object.assign({}, payload, { agent_selfie: null })));
        if (!isAutoDraft && alertBox && alertText) {
          alertBox.className = "p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono shadow-sm";
          alertText.innerHTML = `<b>✓ Offline Mode:</b> Form cached in PWA device storage. Will auto-sync when back in network.`;
          setUploadAlertIcon(false, "text-amber-600", "cloud_off");
        }
        if (!isSilent) {
          showSubmitConfirm(
            "bg-amber-50 border border-amber-300 text-amber-900",
            `<span class="material-symbols-outlined text-[18px] text-amber-600">cloud_off</span><span>Saved on this phone (offline) - will sync to CA Portal once back online</span>`,
            true
          );
          alert(`[✓ Offline Saved] Due Diligence Form cached locally on your device. It will auto-sync with the CA Office portal when you are back in network.`);
        }
      }
    }

    // ==========================================
    // FIELD AGENT DYNAMIC CASE SWITCHER
    // ==========================================
    function switchPwaCase(key) {
      const isActualSwitch = key !== activeCaseKey;
      // Before switching away from the currently active case, persist its latest form draft into
      // localStorage and caseRegistryPwa so no typed home/office details are ever lost.
      if (isActualSwitch && sampleCaseId && !isSwitchingPwaCase) {
        savePwaFormDraftLocally();
      }
      isSwitchingPwaCase = true;
      try {
      let c = caseRegistryPwa[key];
      if (!c) {
        // A case this device has never cached yet (e.g. a brand-new case just handed over) -
        // this used to just return here and leave WHATEVER case was active before fully
        // rendered on screen (header, address, every Module 2/3 form field, and - because the
        // photo slot thumbnails are never touched by this function at all - every photo
        // thumbnail too) until the real case data arrived moments later over the network. An
        // agent who looked at the screen, or acted, during that window saw/submitted the
        // PREVIOUS case's own office address, form answers, and even its cached selfie as if
        // they belonged to this new case - exactly how one case's details have ended up saved
        // against a completely different one. Render a safe, clearly-blank placeholder instead.
        c = {
          case_no: key, applicant: "Loading case...", amount: "", loan_type: "",
          address: "Loading case details...", lat: TARGET_LAT, lon: TARGET_LON,
          dev_lat: currentDeviceLat, dev_lon: currentDeviceLon,
          // caseRegistryPwa is rebuilt empty on every page load, so this placeholder branch is
          // ALSO hit on a plain refresh of the SAME case the agent was already working on - not
          // just a genuine switch to a different one. Only blank out the working case id for a
          // real switch; on a same-case refresh, keep whatever id was already active (read from
          // localStorage at page load) so saving/uploading keeps working immediately instead of
          // being blocked until the network round-trip finishes.
          id: isActualSwitch ? undefined : sampleCaseId,
        };
      }
      // Overlay any locally-saved draft for this exact case onto `c` before rendering inputs
      if (c && c.applicant !== "Loading case...") {
        const localDraft = loadPwaFormDraftLocally(c.id, c.case_no || key);
        if (localDraft) {
          applyFormPayloadToCaseEntryPwa(c, localDraft);
        }
      }
      // Always reset every photo slot thumbnail/badge to PENDING first so previous case's photos
      // can NEVER remain in the DOM when switching to or loading another case.
      resetAllPwaPhotoSlotsUi();

      activeCaseKey = key;
      sampleCaseId = c.id; // undefined only when actually switching to an uncached case - safer than silently keeping the PREVIOUS case's real id while this screen shows blank/loading data
      const safeLat = (c.lat != null && !isNaN(Number(c.lat))) ? Number(c.lat) : (TARGET_LAT || 23.0225);
      const safeLon = (c.lon != null && !isNaN(Number(c.lon))) ? Number(c.lon) : (TARGET_LON || 72.5714);
      TARGET_LAT = safeLat;
      TARGET_LON = safeLon;
      currentDeviceLat = (c.dev_lat != null && !isNaN(Number(c.dev_lat))) ? Number(c.dev_lat) : safeLat;
      currentDeviceLon = (c.dev_lon != null && !isNaN(Number(c.dev_lon))) ? Number(c.dev_lon) : safeLon;

      document.getElementById("caseNoDisplay").textContent = `CASE: ${c.case_no || key}`;
      document.getElementById("applicantNameDisplay").textContent = c.applicant || "—";
      document.getElementById("loanAmountDisplay").textContent = c.amount || "";
      document.getElementById("targetAddressDisplay").textContent = c.address || "";
      document.getElementById("targetLatLonText").textContent = `${safeLat.toFixed(4)}° N`;
      refreshPwaGeofenceMap(currentDeviceLat, currentDeviceLon,
        (currentDeviceLat && currentDeviceLon && TARGET_LAT && TARGET_LON) ? calculateDistanceMeters(TARGET_LAT, TARGET_LON, currentDeviceLat, currentDeviceLon) : null, true);
      loadApplicantLocation();
      const pin = (c.pin || ((c.address || "").match(/\b\d{6}\b/) || [])[0] || "");
      document.getElementById("pinDisplay").textContent = pin ? `PIN: ${pin} •` : "";
      document.getElementById("branchDisplay").textContent = c.branch || "—";
      if (c.bank) document.getElementById("bankNameDisplay").textContent = c.bank;
      document.getElementById("loanTypeDisplay").textContent = c.loan_type || "";
      document.getElementById("cpvTypeDisplay").textContent = (c.loan_type || "CPV").toUpperCase();

      // Dynamically update CA-provided documents for this case
      if (document.getElementById("pwaDocAadhaarName")) {
        document.getElementById("pwaDocAadhaarName").textContent = c.applicant || "—";
        document.getElementById("pwaDocAadhaarNo").textContent = c.aadhaar_no || "Aadhaar: Pending AI scan";
        document.getElementById("pwaDocAadhaarDob").textContent = `DOB: ${c.dob || "Pending AI scan"}`;
      }
      if (document.getElementById("pwaDocPanName")) {
        document.getElementById("pwaDocPanName").textContent = (c.applicant || "—").toUpperCase();
        document.getElementById("pwaDocPanNo").textContent = `PAN: ${c.pan_no || "Pending AI scan"}`;
        document.getElementById("pwaDocPanWard").textContent = (c.father_name ? `Father: ${c.father_name}` : (c.ward ? `WARD: ${c.ward}` : ""));
      }
      if (document.getElementById("pwaDocUtilityProvider")) {
        document.getElementById("pwaDocUtilityProvider").textContent = c.utility_provider || "Electricity bill: Pending AI scan";
        document.getElementById("pwaDocUtilityNo").textContent = c.utility_no || "";
        document.getElementById("pwaDocUtilityMeter").textContent = c.meter_name || "";
      }

      // Only decode CA-provided KYC inline images if #caDocsSection is actually visible
      // (it is hidden on the Field Agent PWA, so skipping 5 full-page 2000px scans saves ~100MB of RAM)
      const caDocsSecEl = document.getElementById("caDocsSection");
      if (caDocsSecEl && !caDocsSecEl.classList.contains("hidden")) {
        const aadhImg = document.getElementById("pwaDocInlineAadhaarImg");
        if (aadhImg) aadhImg.src = c.aadhaar_front_img || "/static/placeholders/doc_pending.svg";
        const panImg = document.getElementById("pwaDocInlinePanImg");
        if (panImg) panImg.src = c.pan_front_img || "/static/placeholders/doc_pending.svg";
        const utilImg = document.getElementById("pwaDocInlineUtilityImg");
        if (utilImg) utilImg.src = c.utility_front_img || "/static/placeholders/doc_pending.svg";
        const f16Img = document.getElementById("pwaDocInlineForm16Img");
        if (f16Img) f16Img.src = c.form16_img || "/static/placeholders/doc_pending.svg";
        const deedImg = document.getElementById("pwaDocInlineSaleDeedImg");
        if (deedImg) deedImg.src = c.sale_deed_img || "/static/placeholders/doc_pending.svg";
      }

      if (document.getElementById("pwaDocIncomeName")) {
        document.getElementById("pwaDocIncomeName").textContent = `Form 16 • ${c.applicant}`;
      }
      if (document.getElementById("pwaDocPropertyTitle")) {
        document.getElementById("pwaDocPropertyTitle").textContent = `Sale Deed (દસ્તાવેજ) • ${c.applicant}`;
        document.getElementById("pwaDocPropertyAddress").textContent = c.address;
      }

      // ==========================================
      // SYNCHRONIZE MODULE 1 & MODULE 2 (Residential & Family Inquiries) DYNAMICALLY
      // ==========================================
      if (c.executive) {
        const fExec = document.getElementById("formExecutive");
        if (fExec) fExec.value = c.executive;
      }
      if (c.persona) {
        const fPersona = document.getElementById("formPersona");
        if (fPersona) fPersona.value = c.persona;
      }
      const fName = document.getElementById("formApplicantName");
      if (fName) fName.value = c.applicant;
      const fPhone = document.getElementById("formContactNumber");
      if (fPhone) fPhone.value = c.phone || "";
      const fAge = document.getElementById("formAge");
      if (fAge) fAge.value = c.age || "";
      const fMarital = document.getElementById("formMarital");
      if (fMarital) fMarital.value = c.marital || "Married (પરિણિત)";
      document.querySelectorAll('input[name="pwaCommRadio"]').forEach(r => { r.checked = false; });
      document.querySelectorAll(".pwa-comm-chip").forEach(l => {
        l.classList.remove("bg-blue-50", "border-blue-300", "text-primary-container", "font-bold");
        l.classList.add("bg-white", "border-outline-variant", "text-on-surface");
      });
      if (c.community) {
        const fCommInput = document.querySelector(`input[name="pwaCommRadio"][value="${c.community}"]`);
        if (fCommInput) selectCommunityChip(fCommInput.closest(".pwa-comm-chip"));
      }
      const fQual = document.getElementById("formQualification");
      if (fQual) fQual.value = c.qualification || "";
      const fAddr = document.getElementById("formAddressVisited");
      if (fAddr) fAddr.value = c.address;
      const fOwn = document.getElementById("formOwnership");
      if (fOwn) fOwn.value = c.ownership || "Owned";
      const fBType = document.getElementById("formBuildingType");
      if (fBType) fBType.value = c.building_type || "Flat";
      const fBhk = document.getElementById("formBhk");
      if (fBhk) fBhk.value = c.bhk || "3 BHK";
      const fStay = document.getElementById("formStayDuration");
      if (fStay) fStay.value = c.stay_period || "";
      const fOwner = document.getElementById("formOwnerName");
      if (fOwner) fOwner.value = c.owner_name || "";
      const fMet = document.getElementById("formPersonMet");
      const fMetRelation = document.getElementById("formPersonMetRelation");
      const metRawVal = c.person_met || "";
      const metSplit = metRawVal.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
      if (fMet) fMet.value = metSplit ? metSplit[1].trim() : metRawVal;
      if (fMetRelation) {
        const metRelationVal = metSplit ? metSplit[2].trim() : "";
        fMetRelation.value = Array.from(fMetRelation.options).some(o => o.value === metRelationVal) ? metRelationVal : "";
      }
      const fRefs = document.getElementById("formReferences");
      if (fRefs) fRefs.value = (c.neighbors || []).join(", ");
      const fLandmark = document.getElementById("formLandmark");
      if (fLandmark) fLandmark.value = c.landmark || "";
      const fNameboardRadio = document.querySelector(`input[name="pwaNameBoardRadio"][value="${c.nameboard_visible || "No"}"]`);
      if (fNameboardRadio) fNameboardRadio.checked = true;
      syncPillRadioStyle("pwaNameBoardRadio");
      const fBuildingNature = document.getElementById("formBuildingNature");
      if (fBuildingNature) fBuildingNature.value = c.building_nature || "";
      const fGeneralAppearance = document.getElementById("formGeneralAppearance");
      if (fGeneralAppearance) fGeneralAppearance.value = c.general_appearance || "";
      const fLocality = document.getElementById("formLocality");
      if (fLocality) fLocality.value = c.locality || "";
      const fSurroundings = document.getElementById("formSurroundings");
      if (fSurroundings) fSurroundings.value = c.surroundings || "";
      const fResEvidenceRadio = document.querySelector(`input[name="pwaResEvidenceRadio"][value="${c.residence_evidence_obtained || "No"}"]`);
      if (fResEvidenceRadio) fResEvidenceRadio.checked = true;
      syncPillRadioStyle("pwaResEvidenceRadio");

      // Update dynamic family members
      if (c.family_members && Array.isArray(c.family_members)) {
        familyMembers = JSON.parse(JSON.stringify(c.family_members));
      } else {
        familyMembers = [
          { name: c.applicant, relation: "Self / Applicant", age: "35", occupation: "Service", earning: "Yes" }
        ];
      }
      renderFamilyMembers();

      // Restore custom assets and which "Assets Visible in Home" chips were previously tapped for this case.
      if (Array.isArray(c.custom_assets)) {
        c.custom_assets.forEach(ca => {
          if (ca && ca.id && !visibleAssets.some(a => a.id === ca.id)) {
            visibleAssets.push({ id: ca.id, name: ca.name || ca.id, active: Boolean(ca.active) });
          }
        });
      }
      if (c.active_asset_ids && Array.isArray(c.active_asset_ids)) {
        const activeSet = new Set(c.active_asset_ids);
        visibleAssets.forEach(a => { a.active = activeSet.has(a.id); });
      } else {
        visibleAssets.forEach(a => { a.active = false; });
      }
      if (typeof renderAssetsChips === "function") renderAssetsChips();

      // ==========================================
      // SYNCHRONIZE MODULE 3 (Office / Occupation & Employer Details) DYNAMICALLY
      // ==========================================
      const occRaw = (c.occupation || (c.firm_name ? "Job" : "House Wife")).toLowerCase();
      const fOcc = document.getElementById("formOccupation");
      if (fOcc) {
        if (occRaw.includes("job") || occRaw.includes("teach") || occRaw.includes("salar") || occRaw.includes("shikshak")) {
          fOcc.value = "Job";
        } else if (occRaw.includes("business") || occRaw.includes("shop") || occRaw.includes("trade")) {
          fOcc.value = "Business";
        } else if (occRaw.includes("retire") || occRaw.includes("pension")) {
          fOcc.value = "Retired";
        } else {
          fOcc.value = "House Wife";
        }
      }

      const fFirm = document.getElementById("formFirmName");
      if (fFirm) fFirm.value = c.firm_name || c.employer_name || "";

      const fRole = document.getElementById("formDesignation");
      if (fRole) fRole.value = c.position || c.designation || "";

      const fOffAddr = document.getElementById("formOfficeAddress");
      if (fOffAddr) fOffAddr.value = c.office_address || "";

      const fFirmType = document.getElementById("formFirmType");
      if (fFirmType) fFirmType.value = c.firm_type || "";

      const fNumWorkers = document.getElementById("formNumWorkers");
      if (fNumWorkers) fNumWorkers.value = c.employees || "";

      const fNameboard = document.getElementById("formNameboard");
      if (fNameboard) fNameboard.value = c.nameboard || "";

      const fInfra = document.getElementById("formInfrastructure");
      if (fInfra) fInfra.value = c.infrastructure || "";

      const fPremOwnership = document.getElementById("formPremisesOwnership");
      if (fPremOwnership) fPremOwnership.value = c.premises_ownership || "";

      const fPremOwnerName = document.getElementById("formPremisesOwnerName");
      if (fPremOwnerName) fPremOwnerName.value = c.premises_owner || "";

      const fOffLandmark = document.getElementById("formOfficeLandmark");
      if (fOffLandmark) fOffLandmark.value = c.office_landmark || "";
      const fEstSince = document.getElementById("formEstablishedSince");
      if (fEstSince) fEstSince.value = c.office_established_since || "";
      const fOffLocation = document.getElementById("formOfficeLocation");
      if (fOffLocation) fOffLocation.value = c.office_location || "";
      const fOffAssets = document.getElementById("formOfficeAssets");
      if (fOffAssets) fOffAssets.value = c.office_assets || "";
      const fOffReferences = document.getElementById("formOfficeReferences");
      if (fOffReferences) fOffReferences.value = (c.office_references || []).join(", ");
      const fOffWhoMeet = document.getElementById("formOfficeWhoMeet");
      if (fOffWhoMeet) fOffWhoMeet.value = c.office_who_meet || "";
      const fOffRegNo = document.getElementById("formOfficeRegNo");
      if (fOffRegNo) fOffRegNo.value = c.office_reg_no || "";
      const fOffAssessment = document.getElementById("formOfficeAssessment");
      if (fOffAssessment) fOffAssessment.value = c.office_assessment || "";

      const fItrAckNo = document.getElementById("formItrAckNo");
      if (fItrAckNo) fItrAckNo.value = c.itr_ack_no || "";
      const fItrFilingDate = document.getElementById("formItrFilingDate");
      if (fItrFilingDate) fItrFilingDate.value = c.itr_filing_date || "";
      const fBankAccountStatus = document.getElementById("formBankAccountStatus");
      if (fBankAccountStatus) fBankAccountStatus.value = c.bank_account_status || "";
      const fCoBankAccountStatus = document.getElementById("formCoBankAccountStatus");
      if (fCoBankAccountStatus) fCoBankAccountStatus.value = c.bank_account_status_co || "";

      const fPrevLoanType = document.getElementById("formLoanType");
      if (fPrevLoanType) fPrevLoanType.value = c.prev_loan_type || "Home";

      const fPrevLoanAmount = document.getElementById("formLoanAmount");
      if (fPrevLoanAmount) fPrevLoanAmount.value = c.prev_loan_amount || "";

      // A saved bank name that isn't one of the listed banks (or isn't "NA") falls back to
      // "Other" with the real text restored into the companion free-text box, rather than
      // silently landing on whatever option happens to be first in the <select>.
      const fPrevLoanBank = document.getElementById("formPrevBank");
      const fPrevLoanBankOther = document.getElementById("formPrevBankOther");
      if (fPrevLoanBank) {
        const savedBank = c.prev_loan_bank || "";
        const knownOption = Array.from(fPrevLoanBank.options).some(o => o.value === savedBank);
        if (!savedBank) {
          fPrevLoanBank.value = "";
        } else if (knownOption) {
          fPrevLoanBank.value = savedBank;
        } else {
          fPrevLoanBank.value = "Other";
          if (fPrevLoanBankOther) fPrevLoanBankOther.value = savedBank;
        }
        handlePrevBankSelectChange(fPrevLoanBank.value, /*skipNaSync=*/true);
      }

      const fPrevLoanDate = document.getElementById("formDealershipDate");
      if (fPrevLoanDate) fPrevLoanDate.value = c.prev_loan_date || "";

      // Reflect NA (no existing loan) lock state from whichever field actually carries it.
      handlePrevLoanNaToggle((c.prev_loan_type === "NA") || (c.prev_loan_bank === "NA"));

      const fWfh = document.getElementById("formWorkFromHome");
      if (fWfh) fWfh.value = (fOcc && fOcc.value === "House Wife") ? "NA" : "No";

      handleOccupationChange(fOcc ? fOcc.value : "Job");

      // ==========================================
      // SYNCHRONIZE MODULE 3B (Co-Applicant Office Details) - dual-applicant cases only
      // ==========================================
      const coModule = document.getElementById("coApplicantOfficeModule");
      const coNameLabel = document.getElementById("coApplicantNameLabel");
      const addCoBtnWrap = document.getElementById("addCoApplicantBtnWrap");
      if (c.co_applicant_name) {
        if (coModule) coModule.classList.remove("hidden");
        if (addCoBtnWrap) addCoBtnWrap.classList.add("hidden");
        if (coNameLabel) coNameLabel.textContent = c.co_applicant_name;
        setCoApplicantTabVisible(true);

        const fCoName = document.getElementById("formCoName");
        if (fCoName) fCoName.value = c.co_applicant_name || "";
        const fCoPhone = document.getElementById("formCoPhone");
        if (fCoPhone) fCoPhone.value = c.co_applicant_phone || "";
        const fCoAge = document.getElementById("formCoAge");
        if (fCoAge) fCoAge.value = c.co_applicant_age || "";

        // Every other field in this block falls back to a neutral default ("" or "Job") when
        // this case has no saved value of its own yet - this one didn't, so switching from a
        // case where the co-applicant's Marital Status had been set to one where it hadn't left
        // the dropdown showing the PREVIOUS case's selection, unchanged, looking like a
        // deliberate answer for this co-applicant when nobody had actually set it yet.
        const fCoMarital = document.getElementById("formCoMarital");
        if (fCoMarital) fCoMarital.value = c.co_marital_status || "Married (પરિણિત)";
        const fCoCommunity = document.getElementById("formCoCommunity");
        if (fCoCommunity) fCoCommunity.value = c.co_community || "";
        const fCoQual = document.getElementById("formCoQualification");
        if (fCoQual) fCoQual.value = c.co_qualification || "";
        const fCoRelation = document.getElementById("formCoRelationToApplicant");
        if (fCoRelation) fCoRelation.value = c.co_relation_to_applicant || "";

        const fCoOcc = document.getElementById("formCoOccupation");
        if (fCoOcc) fCoOcc.value = c.co_occupation || "Job";
        const fCoFirm = document.getElementById("formCoFirmName");
        if (fCoFirm) fCoFirm.value = c.co_firm_name || "";
        const fCoRole = document.getElementById("formCoDesignation");
        if (fCoRole) fCoRole.value = c.co_position || "";
        const fCoOffAddr = document.getElementById("formCoOfficeAddress");
        if (fCoOffAddr) fCoOffAddr.value = c.co_office_address || "";
        const fCoFirmType = document.getElementById("formCoFirmType");
        if (fCoFirmType) fCoFirmType.value = c.co_firm_type || "";
        const fCoNumWorkers = document.getElementById("formCoNumWorkers");
        if (fCoNumWorkers) fCoNumWorkers.value = c.co_employees || "";
        const fCoNameboard = document.getElementById("formCoNameboard");
        if (fCoNameboard) fCoNameboard.value = c.co_nameboard || "";
        const fCoInfra = document.getElementById("formCoInfrastructure");
        if (fCoInfra) fCoInfra.value = c.co_infrastructure || "";
        const fCoPremOwnership = document.getElementById("formCoPremisesOwnership");
        if (fCoPremOwnership) fCoPremOwnership.value = c.co_premises_ownership || "";
        const fCoPremOwnerName = document.getElementById("formCoPremisesOwnerName");
        if (fCoPremOwnerName) fCoPremOwnerName.value = c.co_premises_owner || "";
        const fCoOffLandmark = document.getElementById("formCoOfficeLandmark");
        if (fCoOffLandmark) fCoOffLandmark.value = c.co_office_landmark || "";
        const fCoEstSince = document.getElementById("formCoEstablishedSince");
        if (fCoEstSince) fCoEstSince.value = c.co_office_established_since || "";
        const fCoOffLocation = document.getElementById("formCoOfficeLocation");
        if (fCoOffLocation) fCoOffLocation.value = c.co_office_location || "";
        const fCoOffAssets = document.getElementById("formCoOfficeAssets");
        if (fCoOffAssets) fCoOffAssets.value = c.co_office_assets || "";
        const fCoOffReferences = document.getElementById("formCoOfficeReferences");
        if (fCoOffReferences) fCoOffReferences.value = (c.co_office_references || []).join(", ");
        const fCoOffWhoMeet = document.getElementById("formCoOfficeWhoMeet");
        if (fCoOffWhoMeet) fCoOffWhoMeet.value = c.co_office_who_meet || "";
        const fCoOffRegNo = document.getElementById("formCoOfficeRegNo");
        if (fCoOffRegNo) fCoOffRegNo.value = c.co_office_reg_no || "";
        const fCoWfh = document.getElementById("formCoWorkFromHome");
        if (fCoWfh) fCoWfh.value = (fCoOcc && fCoOcc.value === "House Wife") ? "NA" : "No";
        handleCoOccupationChange(fCoOcc ? fCoOcc.value : "Job");
      } else {
        if (coModule) coModule.classList.add("hidden");
        if (addCoBtnWrap) addCoBtnWrap.classList.remove("hidden");
        setCoApplicantTabVisible(false);
        const fCoName = document.getElementById("formCoName");
        if (fCoName) fCoName.value = "";
        const fCoPhone = document.getElementById("formCoPhone");
        if (fCoPhone) fCoPhone.value = "";
        const fCoAge = document.getElementById("formCoAge");
        if (fCoAge) fCoAge.value = "";
      }

      // Restore 2nd/3rd/4th Co-Applicants (Applicants 3, 4, 5)
      if (Array.isArray(c.extra_co_applicants) && c.extra_co_applicants.length > 0) {
        pwaExtraCoApplicants = JSON.parse(JSON.stringify(c.extra_co_applicants));
      } else {
        pwaExtraCoApplicants = [];
        [3, 4, 5].forEach(slotNum => {
          const sName = c[`applicant_${slotNum}_name`];
          const sPhone = c[`applicant_${slotNum}_phone`];
          if (sName) {
            pwaExtraCoApplicants.push({
              slot: slotNum,
              name: sName,
              contact_number: sPhone || "",
              age: "",
              marital_status: "Married",
              qualification: "",
              relation_to_applicant: "",
              occupation: "Job",
              office_details: { occupation: "Job", work_from_home: "No" },
            });
          }
        });
      }
      renderExtraCoApplicantsPwa();
      renderPwaCoApplicantsBanner(c);

      // ==========================================
      // SYNCHRONIZE MODULE 3C (Co-Applicant Residence Details) - only when the CA office has
      // flagged a separate co-applicant home address on the case record.
      // ==========================================
      const coResNameLabel2 = document.getElementById("coApplicantResNameLabel");
      if (c.co_applicant_name && c.co_applicant_address) {
        if (coResNameLabel2) coResNameLabel2.textContent = c.co_applicant_name;
        setCoResidenceTabVisible(true);

        const fCoResBldg = document.getElementById("formCoResBuildingType");
        if (fCoResBldg) fCoResBldg.value = c.co_res_building_type || "";
        const fCoResStay = document.getElementById("formCoResPeriodOfStay");
        if (fCoResStay) fCoResStay.value = c.co_res_period_of_stay || "";
        const fCoResOwner = document.getElementById("formCoResOwnerName");
        if (fCoResOwner) fCoResOwner.value = c.co_res_owner_name || "";
        const fCoResLandmark = document.getElementById("formCoResLandmark");
        if (fCoResLandmark) fCoResLandmark.value = c.co_res_landmark || "";
        const fCoResPersonMet = document.getElementById("formCoResPersonMet");
        if (fCoResPersonMet) fCoResPersonMet.value = c.co_res_person_met || "";
        const fCoResN1 = document.getElementById("formCoResNeighbour1");
        if (fCoResN1) fCoResN1.value = c.co_res_neighbour_1 || "";
        const fCoResN2 = document.getElementById("formCoResNeighbour2");
        if (fCoResN2) fCoResN2.value = c.co_res_neighbour_2 || "";
      } else {
        setCoResidenceTabVisible(false);
      }

      // Applicant 3-5 Residence tabs (home visit only, per bank rule) - same visibility rule as
      // on initial case load: shown only when that slot is filled in and isn't sharing another
      // applicant's home visit.
      let switchHomeSharingMap = {};
      try { switchHomeSharingMap = JSON.parse(c.applicant_home_sharing || "{}") || {}; } catch (e) { switchHomeSharingMap = {}; }
      [3, 4, 5].forEach(slotNum => {
        const slotName = c[`applicant_${slotNum}_name`];
        const sharesWith = switchHomeSharingMap[String(slotNum)];
        const hasOwnHomeVisit = !!slotName && !sharesWith;
        setHomeSlotTabVisible(slotNum, hasOwnHomeVisit, slotName ? `Applicant ${slotNum} (${slotName}) Residence` : null);
      });

      // Reset flip button states
      isAadhaarFlippedInline = false;
      isPanFlippedInline = false;
      if (document.getElementById("pwaDocAadhaarSideBadge")) document.getElementById("pwaDocAadhaarSideBadge").textContent = "FRONT";
      if (document.getElementById("btnTextAadhaarFlip")) document.getElementById("btnTextAadhaarFlip").textContent = "Flip Side";
      if (document.getElementById("pwaDocPanSideBadge")) document.getElementById("pwaDocPanSideBadge").textContent = "FRONT";
      if (document.getElementById("btnTextPanFlip")) document.getElementById("btnTextPanFlip").textContent = "Flip Side";

      try {
        localStorage.setItem("pwa_active_case_key", key);
        localStorage.setItem("pwa_active_case_id", sampleCaseId);
      } catch(e) {}

      // Reset & restore slot states for Residence & Office Folders (with strict per-case ownership validation)
      for (let i = 1; i <= 4; i++) {
        // 1. Residence Slot
        uploadedResidenceSlots[i] = false;
        const bRes = document.getElementById(`slot${i}Badge`);
        const btnRes = document.getElementById(`slot${i}BtnText`);
        const thumbRes = document.getElementById(`slot${i}Thumb`);
        const defRes = PWA_SLOT_DEFAULTS[`residence_${i}`];
        const parsedRes = getValidCachedSlotEvidence(sampleCaseId, c.case_no, "slot", i);
        if (parsedRes) {
          uploadedResidenceSlots[i] = true;
          if (bRes) { bRes.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold"; bRes.textContent = "✓ UPLOADED"; }
          if (btnRes) btnRes.textContent = "Re-take Photo";
          if (thumbRes) thumbRes.innerHTML = `<img src="${parsedRes.src}" class="w-full h-full object-cover rounded-lg"/>`;
        } else {
          if (bRes) { bRes.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold"; bRes.textContent = "PENDING"; }
          if (btnRes) btnRes.textContent = (defRes && defRes.btnText) ? defRes.btnText : "Capture Photo";
          if (thumbRes) thumbRes.innerHTML = (defRes && defRes.thumbHTML) ? defRes.thumbHTML : `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
        }

        // 2. Office / Workplace Slot
        uploadedOfficeSlots[i] = false;
        const bOff = document.getElementById(`slotOffice${i}Badge`);
        const btnOff = document.getElementById(`slotOffice${i}BtnText`);
        const thumbOff = document.getElementById(`slotOffice${i}Thumb`);
        const defOff = PWA_SLOT_DEFAULTS[`office_${i}`];
        const parsedOff = getValidCachedSlotEvidence(sampleCaseId, c.case_no, "office_slot", i);
        if (parsedOff) {
          uploadedOfficeSlots[i] = true;
          if (bOff) { bOff.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold"; bOff.textContent = "✓ UPLOADED"; }
          if (btnOff) btnOff.textContent = "Re-take Photo";
          if (thumbOff) thumbOff.innerHTML = `<img src="${parsedOff.src}" class="w-full h-full object-cover rounded-lg"/>`;
        } else {
          if (bOff) { bOff.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold"; bOff.textContent = "PENDING"; }
          if (btnOff) btnOff.textContent = (defOff && defOff.btnText) ? defOff.btnText : "Capture Photo";
          if (thumbOff) thumbOff.innerHTML = (defOff && defOff.thumbHTML) ? defOff.thumbHTML : `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
        }

        // 3. Co-Applicant Office / Workplace Slot (dual-applicant cases only)
        uploadedCoOfficeSlots[i] = false;
        const bCoOff = document.getElementById(`slotCoOffice${i}Badge`);
        const btnCoOff = document.getElementById(`slotCoOffice${i}BtnText`);
        const thumbCoOff = document.getElementById(`slotCoOffice${i}Thumb`);
        const defCoOff = PWA_SLOT_DEFAULTS[`co_office_${i}`];
        const parsedCoOff = getValidCachedSlotEvidence(sampleCaseId, c.case_no, "co_office_slot", i);
        if (parsedCoOff) {
          uploadedCoOfficeSlots[i] = true;
          if (bCoOff) { bCoOff.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold"; bCoOff.textContent = "✓ UPLOADED"; }
          if (btnCoOff) btnCoOff.textContent = "Re-take Photo";
          if (thumbCoOff) thumbCoOff.innerHTML = `<img src="${parsedCoOff.src}" class="w-full h-full object-cover rounded-lg"/>`;
        } else {
          if (bCoOff) { bCoOff.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold"; bCoOff.textContent = "PENDING"; }
          if (btnCoOff) btnCoOff.textContent = (defCoOff && defCoOff.btnText) ? defCoOff.btnText : "Capture Photo";
          if (thumbCoOff) thumbCoOff.innerHTML = (defCoOff && defCoOff.thumbHTML) ? defCoOff.thumbHTML : `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
        }

        // 4. Co-Applicant Residence Slot (only when co-applicant has a separate home address)
        uploadedCoResidenceSlots[i] = false;
        const bCoRes = document.getElementById(`slotCoResidence${i}Badge`);
        const btnCoRes = document.getElementById(`slotCoResidence${i}BtnText`);
        const thumbCoRes = document.getElementById(`slotCoResidence${i}Thumb`);
        const defCoRes = PWA_SLOT_DEFAULTS[`co_residence_${i}`];
        const parsedCoRes = getValidCachedSlotEvidence(sampleCaseId, c.case_no, "co_residence_slot", i);
        if (parsedCoRes) {
          uploadedCoResidenceSlots[i] = true;
          if (bCoRes) { bCoRes.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold"; bCoRes.textContent = "✓ UPLOADED"; }
          if (btnCoRes) btnCoRes.textContent = "Re-take Photo";
          if (thumbCoRes) thumbCoRes.innerHTML = `<img src="${parsedCoRes.src}" class="w-full h-full object-cover rounded-lg"/>`;
        } else {
          if (bCoRes) { bCoRes.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold"; bCoRes.textContent = "PENDING"; }
          if (btnCoRes) btnCoRes.textContent = (defCoRes && defCoRes.btnText) ? defCoRes.btnText : "Capture Photo";
          if (thumbCoRes) thumbCoRes.innerHTML = (defCoRes && defCoRes.thumbHTML) ? defCoRes.thumbHTML : `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
        }
        // 5. Applicant 3/4/5 Residence Slots (home_3, home_4, home_5)
        [3, 4, 5].forEach(slotNum => {
          const homeSlotsMapRef = { 3: uploadedHome3Slots, 4: uploadedHome4Slots, 5: uploadedHome5Slots }[slotNum];
          homeSlotsMapRef[i] = false;
          const bHome = document.getElementById(`slotHome${slotNum}${i}Badge`);
          const btnHome = document.getElementById(`slotHome${slotNum}${i}BtnText`);
          const thumbHome = document.getElementById(`slotHome${slotNum}${i}Thumb`);
          const defHome = PWA_SLOT_DEFAULTS[`home_${slotNum}_${i}`];
          const parsedHome = getValidCachedSlotEvidence(sampleCaseId, c.case_no, `home_${slotNum}_slot`, i);
          if (parsedHome) {
            homeSlotsMapRef[i] = true;
            if (bHome) { bHome.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold"; bHome.textContent = "✓ UPLOADED"; }
            if (btnHome) btnHome.textContent = "Re-take Photo";
            if (thumbHome) thumbHome.innerHTML = `<img src="${parsedHome.src}" class="w-full h-full object-cover rounded-lg"/>`;
          } else {
            if (bHome) { bHome.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold"; bHome.textContent = "PENDING"; }
            if (btnHome) btnHome.textContent = (defHome && defHome.btnText) ? defHome.btnText : "Capture Photo";
            if (thumbHome) thumbHome.innerHTML = (defHome && defHome.thumbHTML) ? defHome.thumbHTML : `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
          }
        });
      }
      updateEvidenceProgress();

      const selector = document.getElementById("pwaCaseSelector");
      if (selector && selector.value !== key) {
        selector.value = key;
      }

      // Restore check-in state for this case only (never leak another case's time)
      const checkInBtn = document.getElementById("checkInBtnText");
      if (checkInBtn) {
        const cachedCheckIn = localStorage.getItem(`pwa_checkin_${sampleCaseId}`) ||
                               (c.case_no ? localStorage.getItem(`pwa_checkin_${c.case_no}`) : null);
        checkInBtn.textContent = cachedCheckIn ? `Check-In Logged: ${cachedCheckIn}` : "Tap to Log Check-In";
      }

      // Restore selfie state if previously captured for this case
      const cachedSelfie = localStorage.getItem("selfie_" + sampleCaseId) ||
                           (c.case_no ? localStorage.getItem("selfie_" + c.case_no) : null);
      const previewImg = document.getElementById("agentSelfiePreview");
      const placeholder = document.getElementById("agentSelfiePlaceholder");
      const wmTag = document.getElementById("selfieWatermarkTag");
      const badge = document.getElementById("selfieStatusBadge");
      const btnText = document.getElementById("selfieBtnText");
      const metaInfo = document.getElementById("selfieMetaInfo");
      const agentText = document.getElementById("selfieAgentNameText");
      const timeText = document.getElementById("selfieTimestampText");

      if (cachedSelfie) {
        agentSelfieDataUrl = cachedSelfie;
        if (previewImg) { previewImg.src = cachedSelfie; previewImg.classList.remove("hidden"); }
        if (placeholder) placeholder.classList.add("hidden");
        if (wmTag) wmTag.classList.remove("hidden");
        if (badge) {
          badge.className = "font-mono text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-2xs";
          badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span><span>SELFIE VERIFIED (સર્વે શરૂ)</span>`;
        }
        if (btnText) btnText.textContent = "Re-take Selfie (ફરીથી લો)";
        if (metaInfo) metaInfo.classList.remove("hidden");
        if (agentText) agentText.textContent = localStorage.getItem("selfie_agent_" + sampleCaseId) || (c.case_no ? localStorage.getItem("selfie_agent_" + c.case_no) : null) || "Field Officer";
        if (timeText) timeText.textContent = localStorage.getItem("selfie_timestamp_" + sampleCaseId) || (c.case_no ? localStorage.getItem("selfie_timestamp_" + c.case_no) : null) || "Logged";
      } else {
        agentSelfieDataUrl = null;
        if (previewImg) { previewImg.src = ""; previewImg.classList.add("hidden"); }
        if (placeholder) placeholder.classList.remove("hidden");
        if (wmTag) wmTag.classList.add("hidden");
        if (badge) {
          badge.className = "font-mono text-[10px] bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-2xs";
          badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span><span>SELFIE PENDING</span>`;
        }
        if (btnText) btnText.textContent = "Capture Own Selfie (સેલ્ફી લો)";
        if (metaInfo) metaInfo.classList.add("hidden");
      }
      updateAttestationProgress();

      updateGeofenceUI(currentDeviceLat, currentDeviceLon, 3.2);
      } finally {
        isSwitchingPwaCase = false;
      }
    }

    // ==========================================
    // FIELD AGENT AUTHENTICATION & LOGIN SCREEN
    // ==========================================
    // ==========================================
    // LIVE ASSIGNED-CASE LOADING & SWITCHING. A field agent can legitimately be handling
    // several open cases at once, so "MY TASK" is a real dropdown of every case assigned to
    // them (GET /api/v1/cases already filters to just their own, newest-created first) - not
    // just the one the current link happens to point to.
    // ==========================================
    function getEffectivePwaAgentId(explicitAgentId) {
      let loggedUserId = null;
      try {
        const u = JSON.parse(localStorage.getItem("pwa_user") || "{}") || {};
        if (u.user_id && (!u.role || u.role === "FIELD_AGENT")) {
          loggedUserId = u.user_id;
        }
      } catch (e) {}
      return explicitAgentId || loggedUserId || localStorage.getItem("pwa_assigned_agent_id") || null;
    }

    async function fetchMyAgentCases(token, explicitAgentId) {
      const myAgentId = getEffectivePwaAgentId(explicitAgentId);
      if (myAgentId) {
        try {
          const pubRes = await fetch(`/api/v1/cases/public-agent/${encodeURIComponent(myAgentId)}`);
          if (pubRes.ok) {
            const pubCases = await pubRes.json();
            if (Array.isArray(pubCases)) {
              return pubCases.filter(c => c.assigned_agent_id === myAgentId);
            }
          }
        } catch (e) {}
      }
      if (token && token !== "demo-pwa-token") {
        try {
          const res = await fetch("/api/v1/cases", { headers: { "Authorization": `Bearer ${token}` } });
          if (res.ok) {
            const allCases = await res.json();
            if (Array.isArray(allCases)) {
              return myAgentId ? allCases.filter(c => c.assigned_agent_id === myAgentId) : allCases;
            }
          }
        } catch (e) {}
      }
      return [];
    }

    async function populatePwaCaseSelector(token, currentKey, currentCaseNo, currentApplicantName, currentBranch, assignedAgentId) {
      const selector = document.getElementById("pwaCaseSelector");
      if (!selector) return;
      let myCases = await fetchMyAgentCases(token, assignedAgentId);
      if (Array.isArray(myCases) && myCases.length > 0) {
        myCases.sort((a, b) => {
          const aDone = CASE_DONE_STATUSES.has(a.status) ? 1 : 0;
          const bDone = CASE_DONE_STATUSES.has(b.status) ? 1 : 0;
          if (aDone !== bDone) return aDone - bDone;
          return new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0);
        });
      }

      selector.innerHTML = "";
      const list = (myCases && myCases.length > 0) ? [...myCases] : [];
      if (currentCaseNo && !list.some(c => c.case_no === currentCaseNo)) {
        list.unshift({
          case_no: currentCaseNo,
          applicant_name: currentApplicantName || "Current Case",
          branch: currentBranch || "",
        });
      }
      if (list.length === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "No cases allotted to your mobile yet";
        selector.appendChild(opt);
        return;
      }
      list.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.case_no;
        const isDone = c.status && CASE_DONE_STATUSES.has(c.status);
        const statusTag = c.status ? (isDone ? " • ✓ Completed" : " • Allotted") : "";
        opt.textContent = `[${c.case_no}] - ${c.applicant_name}${c.branch ? " (" + c.branch + ")" : ""}${statusTag}`;
        if (c.case_no === currentKey) opt.selected = true;
        selector.appendChild(opt);
      });
      // Always enabled, even with just one case on it - a disabled control that visually
      // looks like a dropdown but can never be opened is itself confusing.
      selector.disabled = false;
      selector.classList.remove("opacity-90", "cursor-not-allowed");
    }

    // Agent picked a different one of their own cases from the "MY TASK" dropdown.
    async function handlePwaCaseDropdownChange(caseNo) {
      if (!caseNo || caseNo === activeCaseKey) return;
      // Auto-save & sync current case's questionnaire before switching to the next case
      if (sampleCaseId && !isSwitchingPwaCase) {
        if (pwaFormAutoSyncTimer) {
          clearTimeout(pwaFormAutoSyncTimer);
          pwaFormAutoSyncTimer = null;
        }
        savePwaFormDraftLocally();
        submitDueDiligenceForm({ silent: true, autoDraft: true }).catch(() => {});
      }
      const token = localStorage.getItem("pwa_token");
      switchPwaCase(caseNo); // instant render from any locally-cached data for this case
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("case", caseNo);
        window.history.replaceState({}, "", url);
      } catch (e) {}
      const resolved = await loadAssignedCaseForAgent(token, caseNo);
      if (resolved) await loadCaseDocumentsIntoPwa(sampleCaseId);
    }

    async function loadAssignedCaseForAgent(token, paramCase) {
      const caseLookup = paramCase || activeCaseKey || localStorage.getItem("pwa_active_case_key");
      if (!caseLookup) return false;
      try {
        let target = null;
        // 1. Try public single-case endpoint first (instant, zero auth restriction, not
        //    filtered by which agent it's assigned to - this is the authoritative lookup
        //    for "the exact case this link points to", so retry once before giving up:
        //    a dropped request here must never be allowed to fall through to a WRONG case.
        for (let attempt = 0; attempt < 2 && !target; attempt++) {
          try {
            const pubRes = await fetch(`/api/v1/cases/public/${encodeURIComponent(caseLookup)}`);
            if (pubRes.ok) {
              target = await pubRes.json();
            }
          } catch (pubErr) {}
        }

        // 2. If still not found and the user has a real token, check the agent's own
        //    assigned-case list for an exact match. Deliberately NO fallback to cases[0]
        //    here: an agent handling several visits in one day, each with its own case
        //    link, must NEVER have a failed lookup silently substitute a DIFFERENT one of
        //    their cases - that is exactly how a residence photo for visit 2 has ended up
        //    attached to visit 1 before. An explicit "case not found" is always safer than
        //    a silently wrong one.
        if (!target && token && token !== "demo-pwa-token") {
          try {
            const res = await fetch("/api/v1/cases", {
              headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
              const cases = await res.json();
              if (Array.isArray(cases)) {
                target = cases.find(c =>
                  (c.case_no || "").toLowerCase() === caseLookup.toLowerCase() ||
                  (c.id || "").toLowerCase() === caseLookup.toLowerCase()
                ) || null;
              }
            }
          } catch(e) {}
        }

        if (!target) {
          showCaseLoadError(caseLookup);
        }

        if (target) {
          const existingErrModal = document.getElementById("pwaCaseLoadError");
          if (existingErrModal) existingErrModal.remove();

          // Show the REAL agent this case is assigned to on the server, not whoever happens to
          // be logged into this particular phone/browser right now - the two can drift apart
          // (a shared/demo login left over from earlier testing, a device handed to a different
          // field staffer, etc.), and the dashboard's "who did this visit" must always agree with
          // what the agent's own screen says. This is best-effort: a lookup failure silently
          // leaves whatever name is already showing in place.
          if (target.assigned_agent_id) {
            try {
              localStorage.setItem("pwa_assigned_agent_id", target.assigned_agent_id);
            } catch (e) {}
            try {
              const agentsRes = await fetch("/api/v1/agents");
              if (agentsRes.ok) {
                const agents = await agentsRes.json();
                const realAgent = Array.isArray(agents) ? agents.find(a => a.id === target.assigned_agent_id) : null;
                if (realAgent && realAgent.full_name) {
                  const realName = `${realAgent.full_name} (${realAgent.designation || "Field Officer"})`;
                  const nameDisp = document.getElementById("agentNameDisplay");
                  if (nameDisp) nameDisp.textContent = realAgent.full_name;
                  const execInput = document.getElementById("formExecutive");
                  if (execInput) execInput.value = realName;
                }
              }
            } catch (agentErr) {}
          }

          const key = target.case_no;
          const amtLakhs = target.loan_amount ? (target.loan_amount / 100000).toFixed(2) : "0.00";
          let serverFormData = {};
          if (target.field_form_data) {
            try {
              serverFormData = typeof target.field_form_data === 'string' ? JSON.parse(target.field_form_data) : target.field_form_data;
            } catch(e) {}
          }
          // Merge server field_form_data with any locally-saved draft for THIS exact case so
          // partial Home visit or Office visit edits typed on this phone are never lost when
          // switching between cases or reopening the link later.
          const localDraft = loadPwaFormDraftLocally(target.id, key);
          const { merged: parsedFormData, hasNewerLocalDraft } = mergeServerAndLocalDraftFormData(serverFormData, localDraft);
          const off = parsedFormData.office_details || {};
          const occ = parsedFormData.occupation || off.position || off.occupation || "Job";
          const firm = off.firm_name || "";
          const pos = off.position || off.designation || "";
          const offAddr = off.address || target.office_address || "";
          const offFirmType = off.firm_type || "";
          const offNumWorkers = off.employees || "";
          const offNameboard = off.nameboard || "";
          const offInfrastructure = off.infrastructure || "";
          const offPremisesOwnership = off.premises_ownership || "";
          const offPremisesOwnerName = off.premises_owner || "";
          const offLandmark = off.landmark || "";
          const offEstablishedSince = off.established_since || "";
          const offLocation = off.location || "";
          const offAssets = off.assets || "";
          const offReferences = [off.reference_1 || off.reference, off.reference_2].filter(Boolean);
          const offWhoMeet = off.who_meet || "";
          const offRegNo = off.reg_no || "";
          const offAssessment = off.assessment || "";
          const prevLoan = parsedFormData.previous_loan || {};
          const offCo = parsedFormData.office_details_co || {};
          const resCo = parsedFormData.residence_details_co || {};
          const itrAckNoSaved = parsedFormData.itr_acknowledgement_no || "";
          const itrFilingDateSaved = parsedFormData.itr_filing_date || "";
          const bankAccountStatusSaved = parsedFormData.bank_account_status || "";
          const bankAccountStatusCoSaved = parsedFormData.bank_account_status_co || "";

          const mergedCase = Object.assign({}, caseRegistryPwa[key] || {}, {
            id: target.id,
            case_no: target.case_no,
            applicant_3_name: target.applicant_3_name || "",
            applicant_3_phone: target.applicant_3_phone || "",
            applicant_4_name: target.applicant_4_name || "",
            applicant_4_phone: target.applicant_4_phone || "",
            applicant_5_name: target.applicant_5_name || "",
            applicant_5_phone: target.applicant_5_phone || "",
            applicant_home_sharing: target.applicant_home_sharing || "",
            applicant: target.applicant_name,
            phone: target.applicant_phone,
            amount: `₹${amtLakhs} Lakhs`,
            loan_type: (target.loan_type || "LOAN") + " CPV",
            branch: target.branch || "",
            bank: target.bank_name,
            address: target.target_address,
            ward: target.branch || "",
            lat: target.target_lat != null ? Number(target.target_lat) : (TARGET_LAT || 23.0225),
            lon: target.target_lon != null ? Number(target.target_lon) : (TARGET_LON || 72.5714),
            dev_lat: target.target_lat != null ? Number(target.target_lat) : (currentDeviceLat || 23.0225),
            dev_lon: target.target_lon != null ? Number(target.target_lon) : (currentDeviceLon || 72.5714),
            occupation: occ,
            firm_name: firm,
            position: pos,
            designation: pos,
            office_address: offAddr,
            firm_type: offFirmType,
            employees: offNumWorkers,
            nameboard: offNameboard,
            infrastructure: offInfrastructure,
            premises_ownership: offPremisesOwnership,
            premises_owner: offPremisesOwnerName,
            office_landmark: offLandmark,
            office_established_since: offEstablishedSince,
            office_location: offLocation,
            office_assets: offAssets,
            office_references: offReferences,
            office_who_meet: offWhoMeet,
            office_reg_no: offRegNo,
            office_assessment: offAssessment,
            itr_ack_no: itrAckNoSaved,
            itr_filing_date: itrFilingDateSaved,
            bank_account_status: bankAccountStatusSaved,
            bank_account_status_co: bankAccountStatusCoSaved,
            prev_loan_type: prevLoan.loan_type || "",
            prev_loan_amount: prevLoan.amount || "",
            prev_loan_bank: prevLoan.bank || "",
            prev_loan_date: prevLoan.date || "",
            co_applicant_name: target.co_applicant_name || parsedFormData.co_applicant_name || "",
            co_applicant_phone: target.co_applicant_phone || parsedFormData.co_applicant_contact || offCo.contact_number || "",
            co_applicant_age: offCo.age || parsedFormData.co_applicant_age || "",
            co_marital_status: offCo.marital_status || parsedFormData.co_applicant_marital_status || "",
            co_community: offCo.community || "",
            co_qualification: offCo.qualification || parsedFormData.co_applicant_qualification || "",
            co_relation_to_applicant: offCo.relation_to_applicant || "",
            co_occupation: offCo.occupation || parsedFormData.co_applicant_occupation || "Job",
            extra_co_applicants: Array.isArray(parsedFormData.extra_co_applicants) ? parsedFormData.extra_co_applicants : [],
            co_firm_name: offCo.firm_name || "",
            co_position: offCo.position || offCo.designation || "",
            co_office_address: offCo.address || target.co_applicant_office_address || "",
            co_firm_type: offCo.firm_type || "",
            co_employees: offCo.employees || "",
            co_nameboard: offCo.nameboard || "",
            co_infrastructure: offCo.infrastructure || "",
            co_premises_ownership: offCo.premises_ownership || "",
            co_premises_owner: offCo.premises_owner || "",
            co_office_landmark: offCo.landmark || "",
            co_office_established_since: offCo.established_since || "",
            co_office_location: offCo.location || "",
            co_office_assets: offCo.assets || "",
            co_office_references: [offCo.reference_1 || offCo.reference, offCo.reference_2].filter(Boolean),
            co_office_who_meet: offCo.who_meet || "",
            co_office_reg_no: offCo.reg_no || "",
            co_applicant_address: target.co_applicant_address || "",
            co_res_building_type: resCo.building_type || "",
            co_res_period_of_stay: resCo.period_of_stay || "",
            co_res_owner_name: resCo.owner_name || "",
            co_res_landmark: resCo.landmark || "",
            co_res_person_met: resCo.person_met || "",
            co_res_neighbour_1: resCo.neighbour_1 || "",
            co_res_neighbour_2: resCo.neighbour_2 || "",
            is_live_case: true,
          });
          applyFormPayloadToCaseEntryPwa(mergedCase, parsedFormData);
          if (localDraft && hasNewerLocalDraft && !(serverFormData && serverFormData.restore && Object.keys(serverFormData.restore).length > 0)) {
            fetch(`/api/v1/visits/cases/${target.id}/field-form`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ form_data: parsedFormData })
            }).catch(() => {});
          }

          // Show/hide Module 3B and the Co-Applicant Office photo tab based on whether this
          // case actually has a co-applicant - set from the server, never guessed client-side.
          const coModule = document.getElementById("coApplicantOfficeModule");
          const coNameLabel = document.getElementById("coApplicantNameLabel");
          if (mergedCase.co_applicant_name) {
            if (coModule) coModule.classList.remove("hidden");
            if (coNameLabel) coNameLabel.textContent = mergedCase.co_applicant_name;
            setCoApplicantTabVisible(true);
          } else {
            if (coModule) coModule.classList.add("hidden");
            setCoApplicantTabVisible(false);
          }

          // Co-Applicant Residence module/tab: only when the CA office has actually typed a
          // separate address for the co-applicant - never shown just because a co-applicant exists.
          const coResNameLabel = document.getElementById("coApplicantResNameLabel");
          if (mergedCase.co_applicant_name && mergedCase.co_applicant_address) {
            if (coResNameLabel) coResNameLabel.textContent = mergedCase.co_applicant_name;
            setCoResidenceTabVisible(true);
          } else {
            setCoResidenceTabVisible(false);
          }

          // Applicant 3-5 Residence tabs: per bank rule these are home-visit-only (no office),
          // and shown only for a slot the CA office actually filled in AND that isn't sharing
          // another applicant's home visit (applicant_home_sharing) - a shared slot has nothing
          // of its own to capture, so its tab stays hidden.
          let homeSharingMap = {};
          try { homeSharingMap = JSON.parse(mergedCase.applicant_home_sharing || "{}") || {}; } catch (e) { homeSharingMap = {}; }
          [3, 4, 5].forEach(slotNum => {
            const slotName = mergedCase[`applicant_${slotNum}_name`];
            const sharesWith = homeSharingMap[String(slotNum)];
            const hasOwnHomeVisit = !!slotName && !sharesWith;
            setHomeSlotTabVisible(slotNum, hasOwnHomeVisit, slotName ? `Applicant ${slotNum} (${slotName}) Residence` : null);
          });

          caseRegistryPwa[key] = mergedCase;
          caseRegistryPwa[target.id] = mergedCase;

          activeCaseKey = key;
          sampleCaseId = target.id;
          try {
            localStorage.setItem("pwa_active_case_key", key);
            localStorage.setItem("pwa_active_case_id", sampleCaseId);
          } catch(e) {}

          await populatePwaCaseSelector(token, key, target.case_no, target.applicant_name, target.branch, target.assigned_agent_id);

          try {
            switchPwaCase(key);
          } catch (switchErr) {
            console.warn("Non-fatal UI render warning in switchPwaCase:", switchErr);
          }
          try {
            await loadCaseDocumentsIntoPwa(target.id);
          } catch (docErr) {
            console.warn("Non-fatal document load warning:", docErr);
          }
          return true;
        }
        // No match anywhere: do NOT fall back to whatever case happened to be loaded
        // before (sampleCaseId/localStorage carry the PREVIOUS case on this device) -
        // that is precisely how one visit's photos end up attributed to another visit.
        return false;
      } catch (err) {
        console.warn("Could not load assigned case from server:", err);
        showCaseLoadError(caseLookup);
        return false;
      }
    }

    // Blocking error state for "this link's case could not be loaded" - deliberately NOT
    // auto-recovered by showing some other case, since a wrong-but-plausible-looking case
    // is far worse for a field agent than an honest error with a retry button.
    function showCaseLoadError(caseLookup) {
      if (document.getElementById("pwaCaseLoadError")) return;
      const overlay = document.createElement("div");
      overlay.id = "pwaCaseLoadError";
      overlay.className = "fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-5";
      overlay.innerHTML = `
        <div class="bg-white rounded-xl p-5 max-w-sm w-full text-center space-y-3 shadow-2xl">
          <span class="material-symbols-outlined text-rose-600 text-[40px]">error</span>
          <h3 class="font-headline font-bold text-sm text-on-surface">Could Not Load This Case</h3>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            This link ("${(caseLookup || "").replace(/</g, "&lt;")}") could not be opened — it may not be allotted to your login yet, or the connection dropped.
            To protect against showing the wrong case's photos, nothing has been loaded. Please check your connection and retry, or contact the CA office.
          </p>
          <button onclick="window.location.reload()" class="w-full py-2.5 rounded-lg bg-primary-container text-white font-headline text-xs font-bold">Retry</button>
        </div>`;
      document.body.appendChild(overlay);
    }

    // Case status -> what the agent cares about: "have I finished my part of this one".
    const CASE_STATUS_LABELS = {
      DRAFT: { label: "Not Yet Started", cls: "bg-slate-200 text-slate-700" },
      ASSIGNED: { label: "Assigned — Not Started", cls: "bg-amber-100 text-amber-800" },
      IN_PROGRESS: { label: "Visit In Progress", cls: "bg-blue-100 text-blue-800" },
      PENDING_CA_REVIEW: { label: "Completed — With CA", cls: "bg-emerald-100 text-emerald-800" },
      APPROVED: { label: "Completed — Approved", cls: "bg-emerald-100 text-emerald-800" },
      CERTIFIED: { label: "Completed — Certified", cls: "bg-emerald-100 text-emerald-800" },
      FLAGGED: { label: "Completed — Flagged", cls: "bg-rose-100 text-rose-800" },
      REJECTED: { label: "Completed — Rejected", cls: "bg-rose-100 text-rose-800" },
    };
    const CASE_DONE_STATUSES = new Set(["PENDING_CA_REVIEW", "APPROVED", "CERTIFIED", "FLAGGED", "REJECTED"]);

    function fmtRecordDate(iso) {
      if (!iso) return "—";
      try {
        const d = new Date(iso);
        if (isNaN(d.getTime())) return "—";
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + " " +
          d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      } catch (e) { return "—"; }
    }

    // Agent's own visit history, pulled live from the server (not any locally-cached copy) so it
    // always reflects every case actually allotted to or completed by this agent.
    async function openMyRecords() {
      const modal = document.getElementById("pwaMyRecordsModal");
      const body = document.getElementById("pwaMyRecordsBody");
      if (!modal || !body) return;
      modal.classList.remove("hidden");
      body.innerHTML = `<div class="text-center text-xs text-on-surface-variant py-8 font-mono">Loading your allotted & completed cases...</div>`;

      const token = localStorage.getItem("pwa_token");
      const myAgentId = getEffectivePwaAgentId();
      if ((!token || token === "demo-pwa-token") && !myAgentId) {
        body.innerHTML = `<div class="text-center text-xs text-on-surface-variant py-8 px-4 font-mono">
          Log in with your field agent account to see your allotted & completed case records here.
        </div>`;
        return;
      }

      try {
        const cases = await fetchMyAgentCases(token, myAgentId);
        if (!Array.isArray(cases) || cases.length === 0) {
          let dbgUser = {};
          try { dbgUser = JSON.parse(localStorage.getItem("pwa_user") || "{}") || {}; } catch (e) {}
          body.innerHTML = `<div class="text-center text-xs text-on-surface-variant py-8 px-4 font-mono">
            No cases have been allotted to your mobile yet.
            <div class="mt-4 text-[9px] text-outline border-t border-outline-variant pt-3 break-all">
              Agent: ${(dbgUser.full_name || document.getElementById("agentNameDisplay")?.textContent || "Field Officer").replace(/</g, "&lt;")}<br/>
              Account ID: ${myAgentId || "none"}
            </div>
          </div>`;
          return;
        }
        cases.sort((a, b) => {
          const aDone = CASE_DONE_STATUSES.has(a.status) ? 1 : 0;
          const bDone = CASE_DONE_STATUSES.has(b.status) ? 1 : 0;
          if (aDone !== bDone) return aDone - bDone;
          return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
        });

        const rows = cases.map(c => {
          const meta = CASE_STATUS_LABELS[c.status] || { label: c.status || "Unknown", cls: "bg-slate-200 text-slate-700" };
          const isDone = CASE_DONE_STATUSES.has(c.status);
          const completionDate = isDone ? fmtRecordDate(c.updated_at) : "—";
          const safeApplicant = (c.applicant_name || "—").replace(/</g, "&lt;");
          const safeAddress = (c.target_address || "—").replace(/</g, "&lt;");
          const safeCaseNo = (c.case_no || "—").replace(/</g, "&lt;");
          const safeCaseNoAttr = (c.case_no || "").replace(/'/g, "\\'");
          const safeBank = (c.bank_name || "—").replace(/</g, "&lt;");
          const isCurrent = c.case_no === activeCaseKey;
          return `
            <div onclick="closeMyRecords(); handlePwaCaseDropdownChange('${safeCaseNoAttr}')" class="bg-surface-container-lowest border ${isCurrent ? 'border-primary ring-1 ring-primary/30' : 'border-outline-variant'} rounded-lg p-3 mb-2.5 shadow-sm cursor-pointer active:scale-[0.99] transition-all">
              <div class="flex items-start justify-between gap-2 mb-1.5">
                <span class="font-mono text-[11px] font-bold text-primary">${safeCaseNo} ${isCurrent ? '• ACTIVE VIEW' : ''}</span>
                <span class="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${meta.cls}">${meta.label}</span>
              </div>
              <div class="text-xs font-semibold text-on-surface mb-0.5">${safeApplicant}</div>
              <div class="text-[10px] text-on-surface-variant leading-snug mb-1.5">${safeAddress}</div>
              <div class="flex items-center justify-between text-[10px] font-mono text-on-surface-variant border-t border-outline-variant pt-1.5">
                <span>${safeBank}</span>
                <span>${isDone ? "Completed: " + completionDate : "Allotted: " + fmtRecordDate(c.created_at)}</span>
              </div>
            </div>`;
        }).join("");

        const doneCount = cases.filter(c => CASE_DONE_STATUSES.has(c.status)).length;
        const allottedCount = cases.length - doneCount;
        body.innerHTML = `
          <div class="text-[10px] font-mono text-on-surface-variant mb-3 px-1 flex items-center justify-between">
            <span>${allottedCount} Allotted · ${doneCount} Completed · ${cases.length} Total</span>
            <span class="text-primary font-bold">Tap any case to open</span>
          </div>
          ${rows}`;
      } catch (e) {
        body.innerHTML = `<div class="text-center text-xs text-rose-700 py-8 px-4 font-mono">
          Could not load your records — check your connection and try again.
        </div>`;
      }
    }

    function closeMyRecords() {
      const modal = document.getElementById("pwaMyRecordsModal");
      if (modal) modal.classList.add("hidden");
    }

    function toPwaThumbUrl(src, w = 180) {
      if (!src || typeof src !== "string") return src;
      if (src.startsWith("/storage/") || src.startsWith("/static/extracted_pages/")) {
        return `/api/v1/cases/thumb?u=${encodeURIComponent(src)}&w=${w}`;
      }
      return src;
    }

    // Fetches every document the CA office has scanned (via Gemini AI) for this case —
    // real content, never a filename guess — and overlays it onto the document cards
    // plus the full "All Case Documents" gallery.
    async function loadCaseDocumentsIntoPwa(caseId) {
      if (!caseId) return;
      try {
        const res = await fetch(`/api/v1/cases/${caseId}/documents?light=1`);
        if (!res.ok) return;
        const docsRaw = await res.json();
        if (docsRaw && docsRaw.status === "offline_queued") return;
        // Stale async response guard: if the agent switched to a different case while this fetch
        // was in flight, discard it so Case 1's photos never render into Case 2's screen!
        if (String(caseId) !== String(sampleCaseId)) return;
        const docs = Array.isArray(docsRaw) ? docsRaw : [];
        if (docs.length === 0) {
          renderAllCaseDocumentsGallery([]);
        }

        const c = caseRegistryPwa[activeCaseKey];
        const kycDocs = docs.filter(d => d.ocr_data && d.ocr_data.source === "pdf_ingest");
        const scanned = kycDocs.filter(d => d.ocr_data.scan_status !== "FAILED");
        // Identity values only from the applicant's OWN documents — never a co-applicant's PAN
        // or the name of whoever the electricity bill happens to be in.
        const own = scanned.filter(d => (d.ocr_data.relationship_to_applicant || "SELF") === "SELF");
        const kind = d => d.ocr_data.llm_doc_type || d.ocr_data.doc_type || d.doc_type;
        const sub = d => (d.ocr_data.doc_sub_type || "").toUpperCase();
        const pick = (list, pred) => list.find(pred);
        const field = (name, types) => { const d = own.find(x => x.ocr_data[name] && (!types || types.includes(kind(x)))); return d ? d.ocr_data[name] : null; };

        // Whichever is newer — an AI scan of this doc type, or any upload of the same type
        // (manual, or a later AI re-scan) — wins. Shared by the AI picks right below and the
        // manual-upload fallback further down, via a companion "<field>_at" timestamp on the
        // case object, so neither can regress a card to an older image no matter which runs last.
        const tsMs = (d) => {
          const raw = d && (d.created_at_raw || d.created_at);
          const t = raw ? new Date(raw).getTime() : NaN;
          return Number.isFinite(t) ? t : 0;
        };
        const setKycImageIfNewer = (field, url, timeMs) => {
          if (!c || !url || !Number.isFinite(timeMs) || timeMs <= 0) return false;
          const prevAt = c[`${field}_at`] || 0;
          if (timeMs >= prevAt) { c[field] = url; c[`${field}_at`] = timeMs; return true; }
          return false;
        };

        if (c) {
          const aFront = pick(own, d => kind(d) === "AADHAAR_CARD" && sub(d) !== "BACK");
          const aBack = pick(own, d => kind(d) === "AADHAAR_CARD" && sub(d) === "BACK") || aFront;
          if (aFront) setKycImageIfNewer("aadhaar_front_img", aFront.url, tsMs(aFront));
          if (aBack) c.aadhaar_back_img = aBack.url;
          const pFront = pick(own, d => kind(d) === "PAN_CARD" && sub(d) !== "BACK");
          if (pFront) { setKycImageIfNewer("pan_front_img", pFront.url, tsMs(pFront)); c.pan_back_img = (pick(own, d => kind(d) === "PAN_CARD" && sub(d) === "BACK") || pFront).url; }
          const f16 = pick(own, d => kind(d) === "FORM_16");
          if (f16) c.form16_img = f16.url;
          const slip = pick(own, d => kind(d) === "SALARY_SLIP");
          if (slip) c.payslip_img = slip.url;
          const deed = pick(own, d => kind(d) === "PROPERTY_DOCUMENT" && !/index/i.test(d.ocr_data.document_title || ""));
          if (deed) c.sale_deed_img = deed.url;
          const idx2 = pick(own, d => kind(d) === "PROPERTY_DOCUMENT" && /index/i.test(d.ocr_data.document_title || ""));
          if (idx2) c.index2_img = idx2.url;

          c.aadhaar_no = field("extracted_aadhaar", ["AADHAAR_CARD"]) || c.aadhaar_no;
          c.pan_no = field("extracted_pan") || c.pan_no;
          const dob = field("date_of_birth", ["AADHAAR_CARD", "PAN_CARD", "EMPLOYEE_ID_CARD"]);
          const gender = field("gender", ["AADHAAR_CARD"]);
          if (dob) c.dob = gender ? `${dob} | ${gender.charAt(0)}${gender.slice(1).toLowerCase()}` : dob;
          c.father_name = field("father_or_spouse_name", ["PAN_CARD", "AADHAAR_CARD"]) || c.father_name;
          c.employer_name = field("employer_name") || c.employer_name;
          const slips = own.filter(d => kind(d) === "SALARY_SLIP" && d.ocr_data.net_salary_monthly)
            .sort((x, y) => (x.ocr_data.page_number || 0) - (y.ocr_data.page_number || 0));
          if (slips.length) {
            c.net_salary_text = "Net salary: " + slips.map(d => `₹${Number(d.ocr_data.net_salary_monthly).toLocaleString("en-IN")} (${d.ocr_data.pay_month || d.ocr_data.document_period || "—"})`).join(", ");
          }

          const bill = pick(scanned, d => kind(d) === "UTILITY_BILL");
          if (bill && setKycImageIfNewer("utility_front_img", bill.url, tsMs(bill))) {
            const od = bill.ocr_data;
            c.utility_provider = od.utility_provider ? `${od.utility_provider} Electricity Bill` : "Electricity Bill";
            c.utility_no = od.consumer_number ? `Consumer # ${od.consumer_number}` : "";
            c.meter_name = od.holder_name
              ? `Bill holder: ${od.holder_name}${od.relationship_to_applicant === "DIFFERENT_PERSON" ? " ⚠ not the applicant" : ""}`
              : "";
          }

          // A document uploaded straight from the CA portal's "Manual Upload" tab (or a raw photo
          // of a card/bill) never passes through the AI PDF-ingestion pipeline, so everything above
          // (which only looks at pdf_ingest-sourced docs) never sees it. Same persistence rule as
          // the CA dashboard's applyFieldCapturedKycFallback(): whichever of the AI scan above or
          // this latest raw upload is NEWER wins — a re-upload done specifically because the AI
          // scan was wrong/blurry must be able to replace it, not just fill in when it's missing.
          const isPlaceholderImg = (src) => !src || src.includes("placeholders/doc_pending.svg");
          const latestManualOfType = (type) => {
            const matches = (docs || []).filter(d =>
              (d.doc_type || "").toUpperCase() === type &&
              !(d.ocr_data && d.ocr_data.source === "pdf_ingest")
            );
            if (!matches.length) return null;
            matches.sort((a, b) => tsMs(b) - tsMs(a));
            return matches[0];
          };
          const aManual = latestManualOfType("AADHAAR_CARD");
          if (aManual && setKycImageIfNewer("aadhaar_front_img", aManual.url, tsMs(aManual)) && isPlaceholderImg(c.aadhaar_back_img)) {
            c.aadhaar_back_img = aManual.url;
          }
          const pManual = latestManualOfType("PAN_CARD");
          if (pManual && setKycImageIfNewer("pan_front_img", pManual.url, tsMs(pManual)) && isPlaceholderImg(c.pan_back_img)) {
            c.pan_back_img = pManual.url;
          }
          const uManual = latestManualOfType("UTILITY_BILL");
          if (uManual && setKycImageIfNewer("utility_front_img", uManual.url, tsMs(uManual))) {
            c.utility_provider = "Electricity Bill (manually uploaded)";
          }

          // Update ONLY the CA-provided KYC document cards & employer fallback in-place instead of
          // calling switchPwaCase(activeCaseKey) a second time, which would otherwise overwrite any
          // form fields the agent started typing while /documents?light=1 was in flight.
          if (document.getElementById("pwaDocAadhaarName")) {
            document.getElementById("pwaDocAadhaarName").textContent = c.applicant || "—";
            document.getElementById("pwaDocAadhaarNo").textContent = c.aadhaar_no || "Aadhaar: Pending AI scan";
            document.getElementById("pwaDocAadhaarDob").textContent = `DOB: ${c.dob || "Pending AI scan"}`;
          }
          if (document.getElementById("pwaDocPanName")) {
            document.getElementById("pwaDocPanName").textContent = (c.applicant || "—").toUpperCase();
            document.getElementById("pwaDocPanNo").textContent = `PAN: ${c.pan_no || "Pending AI scan"}`;
            document.getElementById("pwaDocPanWard").textContent = (c.father_name ? `Father: ${c.father_name}` : (c.ward ? `WARD: ${c.ward}` : ""));
          }
          if (document.getElementById("pwaDocUtilityProvider")) {
            document.getElementById("pwaDocUtilityProvider").textContent = c.utility_provider || "Electricity bill: Pending AI scan";
            document.getElementById("pwaDocUtilityNo").textContent = c.utility_no || "";
            document.getElementById("pwaDocUtilityMeter").textContent = c.meter_name || "";
          }
          const caDocsSecEl2 = document.getElementById("caDocsSection");
          if (caDocsSecEl2 && !caDocsSecEl2.classList.contains("hidden")) {
            const aadhImg = document.getElementById("pwaDocInlineAadhaarImg");
            if (aadhImg) aadhImg.src = c.aadhaar_front_img || "/static/placeholders/doc_pending.svg";
            const panImg = document.getElementById("pwaDocInlinePanImg");
            if (panImg) panImg.src = c.pan_front_img || "/static/placeholders/doc_pending.svg";
            const utilImg = document.getElementById("pwaDocInlineUtilityImg");
            if (utilImg) utilImg.src = c.utility_front_img || "/static/placeholders/doc_pending.svg";
            const f16Img = document.getElementById("pwaDocInlineForm16Img");
            if (f16Img) f16Img.src = c.form16_img || "/static/placeholders/doc_pending.svg";
            const deedImg = document.getElementById("pwaDocInlineSaleDeedImg");
            if (deedImg) deedImg.src = c.sale_deed_img || "/static/placeholders/doc_pending.svg";
          }
          const fFirm = document.getElementById("formFirmName");
          if (fFirm && !fFirm.value && c.employer_name) fFirm.value = c.employer_name;
          const salaryEl = document.getElementById("pwaDocIncomeSalary");
          if (salaryEl && c.net_salary_text) salaryEl.textContent = c.net_salary_text;
        }

        // ==========================================
        // RESTORE UPLOADED FIELD EVIDENCE PHOTOS & SELFIE FROM SERVER (PERSISTENCE)
        // ==========================================
        // Co-applicant office docs (folder "co_work", doc_type CO_OFFICE_*) must never be
        // treated as the applicant's own work docs - dt.includes("OFFICE") would otherwise
        // match "CO_OFFICE_FACADE" too, silently restoring the co-applicant's photos into the
        // applicant's own Office Evidence slots after a refresh.
        const isCoWorkDoc = (d) => {
          if (d.folder === "co_work" || (d.ocr_data && d.ocr_data.folder === "co_work")) return true;
          return (d.doc_type || "").toUpperCase().startsWith("CO_OFFICE");
        };
        const isWorkDoc = (d) => {
          if (isCoWorkDoc(d)) return false;
          if (d.folder === "work" || (d.ocr_data && d.ocr_data.folder === "work")) return true;
          const dt = (d.doc_type || "").toUpperCase();
          return ["OFFICE_FACADE", "OFFICE_NAMEBOARD", "OFFICE_INTERIOR", "OFFICE_SELFIE", "WORK_FACADE", "WORK_OFFICE", "WORK_DESK", "WORK_APPROACH"].includes(dt) ||
                 dt.includes("OFFICE") || dt.includes("WORK");
        };
        // Co-applicant residence docs (folder "co_residence") reuse the applicant's own generic
        // residence doc types (PROPERTY_EXTERIOR/ELECTRICITY_METER/NEIGHBOR_VERIFICATION), so the
        // folder tag is the only signal - without this exclusion they'd be mistaken for the
        // applicant's own residence photos, exactly the co_work/work collision documented above.
        const isCoResidenceDoc = (d) => d.folder === "co_residence" || (d.ocr_data && d.ocr_data.folder === "co_residence");
        const isHomeSlotDoc = (d, slotNum) => d.folder === `home_${slotNum}` || (d.ocr_data && d.ocr_data.folder === `home_${slotNum}`);

        // Exact match only here - "OFFICE_SELFIE" (Office Slot 4: Field Staff at Workplace) is
        // a normal workplace evidence photo and must still flow into officeDocs/isWorkDoc below;
        // only the true identity-verification AGENT_SELFIE is excluded from both evidence grids.
        //
        // KYC documents (Aadhaar/PAN/utility bill/salary slip/title deed/Form16/Other) manually
        // uploaded from the CA portal's "Manual Upload" tab carry no folder tag at all, so without
        // this explicit exclusion they fell through the catch-all below and got mistaken for a
        // residence evidence photo (e.g. a scanned electricity bill landing in a Residence slot).
        const KYC_DOC_TYPES = ["AADHAAR_CARD", "PAN_CARD", "UTILITY_BILL", "SALARY_SLIP", "PROPERTY_TITLE_DEED", "FORM_16", "ITR_ACKNOWLEDGEMENT", "COMPUTATION_OF_INCOME", "PROFIT_LOSS_BALANCE_SHEET", "OTHER"];
        const isKycDoc = (d) => KYC_DOC_TYPES.includes((d.doc_type || "").toUpperCase());

        const residenceDocs = (docs || []).filter(d =>
          d.doc_type !== "AGENT_SELFIE" &&
          !(d.ocr_data && d.ocr_data.source === "pdf_ingest") &&
          !isWorkDoc(d) &&
          !isCoWorkDoc(d) &&
          !isCoResidenceDoc(d) &&
          !isHomeSlotDoc(d, 3) && !isHomeSlotDoc(d, 4) && !isHomeSlotDoc(d, 5) &&
          !isKycDoc(d)
        );
        const homeSlotDocs = { 3: [], 4: [], 5: [] };
        [3, 4, 5].forEach(slotNum => {
          homeSlotDocs[slotNum] = (docs || []).filter(d =>
            d.doc_type !== "AGENT_SELFIE" &&
            !(d.ocr_data && d.ocr_data.source === "pdf_ingest") &&
            isHomeSlotDoc(d, slotNum) &&
            !isKycDoc(d)
          );
        });

        const officeDocs = (docs || []).filter(d =>
          d.doc_type !== "AGENT_SELFIE" &&
          !(d.ocr_data && d.ocr_data.source === "pdf_ingest") &&
          isWorkDoc(d) &&
          !isKycDoc(d)
        );

        const coOfficeDocs = (docs || []).filter(d =>
          d.doc_type !== "AGENT_SELFIE" &&
          !(d.ocr_data && d.ocr_data.source === "pdf_ingest") &&
          isCoWorkDoc(d) &&
          !isKycDoc(d)
        );

        const coResidenceDocs = (docs || []).filter(d =>
          d.doc_type !== "AGENT_SELFIE" &&
          !(d.ocr_data && d.ocr_data.source === "pdf_ingest") &&
          isCoResidenceDoc(d) &&
          !isKycDoc(d)
        );

        const sortNewest = (arr) => arr.sort((a, b) => {
          const tA = new Date(a.created_at_raw || a.created_at || 0).getTime();
          const tB = new Date(b.created_at_raw || b.created_at || 0).getTime();
          return tB - tA;
        });

        sortNewest(residenceDocs);
        sortNewest(officeDocs);
        sortNewest(coOfficeDocs);
        sortNewest(coResidenceDocs);
        [3, 4, 5].forEach(slotNum => sortNewest(homeSlotDocs[slotNum]));

        // 1. Restore Residence Slots
        const serverResSlotMap = { 1: null, 2: null, 3: null, 4: null };
        const getResSlot = (d, fb) => {
          if (d.slot_number && d.slot_number >= 1 && d.slot_number <= 4) return d.slot_number;
          if (d.ocr_data && d.ocr_data.slot_number >= 1 && d.ocr_data.slot_number <= 4) return d.ocr_data.slot_number;
          const dt = (d.doc_type || "").toUpperCase();
          if (dt.includes("GATE") || dt.includes("SOCIETY") || dt.includes("EXTERIOR")) return 1;
          if (dt.includes("ELEVATION") || dt.includes("DOOR")) return 2;
          if (dt.includes("METER") || dt.includes("INTERIOR")) return 3;
          if (dt.includes("NEIGHBOR") || dt.includes("PERSON")) return 4;
          return fb;
        };

        residenceDocs.forEach((d, idx) => {
          const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
          if (explicitSlot && explicitSlot > 4) return; // genuine "Additional Photo" - never a mandatory slot
          const s = getResSlot(d, idx + 1);
          if (s >= 1 && s <= 4 && !serverResSlotMap[s]) {
            serverResSlotMap[s] = d;
          }
        });

        // Any unassigned residence docs fill remaining empty slots - except a doc explicitly
        // tagged with a slot_number (either 1..4 retake or > 4 "Additional Photo").
        residenceDocs.forEach(d => {
          const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
          if (explicitSlot) return;
          const isAssigned = Object.values(serverResSlotMap).some(assigned => assigned && assigned.id === d.id);
          if (!isAssigned) {
            for (let s = 1; s <= 4; s++) {
              if (!serverResSlotMap[s]) {
                serverResSlotMap[s] = d;
                break;
              }
            }
          }
        });

        for (let s = 1; s <= 4; s++) {
          const d = serverResSlotMap[s];
          const cacheKey1 = `pwa_evidence_${sampleCaseId}_slot_${s}`;
          const cacheKey2 = `pwa_evidence_${activeCaseKey}_slot_${s}`;
          if (d) {
            uploadedResidenceSlots[s] = true;
            uploadedSlots[s] = true;
            const bRes = document.getElementById(`slot${s}Badge`);
            const btnRes = document.getElementById(`slot${s}BtnText`);
            const thumbRes = document.getElementById(`slot${s}Thumb`);
            if (bRes) {
              bRes.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold";
              bRes.textContent = "✓ UPLOADED";
            }
            if (btnRes) btnRes.textContent = "Re-take Photo";
            const resThumbUrl = toPwaThumbUrl(d.url, 180);
            if (thumbRes) thumbRes.innerHTML = `<img src="${resThumbUrl}" data-full-src="${d.url}" onerror="if(this.dataset.fullSrc && this.src!==this.dataset.fullSrc)this.src=this.dataset.fullSrc;" loading="lazy" decoding="async" class="w-full h-full object-cover rounded-lg"/>`;
            safeSetSlotEvidenceCache(sampleCaseId, activeCaseKey, "slot", s, {
              src: resThumbUrl,
              timestamp: d.created_at || "Verified on Server",
              lat: d.latitude || 23.2154,
              lon: d.longitude || 72.6367,
              doc_type: d.doc_type,
              caseId: sampleCaseId,
              caseNo: activeCaseKey,
            });
          } else {
            // Server returned no photo for this slot on this case. Preserve a local/in-memory capture
            // if it is tagged pendingOffline or uploadedOnServer for THIS exact caseId/caseNo.
            const validCached = getValidCachedSlotEvidence(sampleCaseId, activeCaseKey, "slot", s);
            const keepOffline = Boolean(
              validCached &&
              (validCached.pendingOffline || validCached.uploadedOnServer) &&
              ((validCached.caseId && String(validCached.caseId) === String(sampleCaseId)) ||
                (validCached.caseNo && String(validCached.caseNo) === String(activeCaseKey)))
            );
            if (keepOffline && validCached) {
              uploadedResidenceSlots[s] = true;
              uploadedSlots[s] = true;
              const bRes = document.getElementById(`slot${s}Badge`);
              const btnRes = document.getElementById(`slot${s}BtnText`);
              const thumbRes = document.getElementById(`slot${s}Thumb`);
              if (bRes) {
                bRes.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold";
                bRes.textContent = "✓ UPLOADED";
              }
              if (btnRes) btnRes.textContent = "Re-take Photo";
              if (thumbRes && validCached.src) {
                thumbRes.innerHTML = `<img src="${validCached.src}" class="w-full h-full object-cover rounded-lg"/>`;
              }
            } else {
              localStorage.removeItem(cacheKey1);
              localStorage.removeItem(cacheKey2);
              uploadedResidenceSlots[s] = false;
              uploadedSlots[s] = false;
              const defRes = PWA_SLOT_DEFAULTS[`residence_${s}`];
              const bRes = document.getElementById(`slot${s}Badge`);
              const btnRes = document.getElementById(`slot${s}BtnText`);
              const thumbRes = document.getElementById(`slot${s}Thumb`);
              if (bRes) {
                bRes.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold";
                bRes.textContent = "PENDING";
              }
              if (btnRes) btnRes.textContent = (defRes && defRes.btnText) ? defRes.btnText : "Capture Photo";
              if (thumbRes) thumbRes.innerHTML = (defRes && defRes.thumbHTML) ? defRes.thumbHTML : `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
            }
          }
        }
        restoreExtraPhotosForFolder('residence', residenceDocs, serverResSlotMap);

        // 2. Restore Office / Workplace Slots
        const serverOffSlotMap = { 1: null, 2: null, 3: null, 4: null };
        const getOffSlot = (d, fb) => {
          if (d.slot_number && d.slot_number >= 1 && d.slot_number <= 4) return d.slot_number;
          if (d.ocr_data && d.ocr_data.slot_number >= 1 && d.ocr_data.slot_number <= 4) return d.ocr_data.slot_number;
          const dt = (d.doc_type || "").toUpperCase();
          if (dt.includes("FACADE") || dt.includes("GATE") || dt.includes("ENTRANCE")) return 1;
          if (dt.includes("BOARD") || dt.includes("NAME")) return 2;
          if (dt.includes("INTERIOR") || dt.includes("DESK") || dt.includes("ROOM")) return 3;
          if (dt.includes("SELFIE") || dt.includes("PERSON") || dt.includes("STAFF") || dt.includes("APPROACH")) return 4;
          return fb;
        };

        officeDocs.forEach((d, idx) => {
          const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
          if (explicitSlot && explicitSlot > 4) return; // genuine "Additional Photo" - never a mandatory slot
          const s = getOffSlot(d, idx + 1);
          if (s >= 1 && s <= 4 && !serverOffSlotMap[s]) {
            serverOffSlotMap[s] = d;
          }
        });

        // Any unassigned workplace docs fill remaining empty slots - except explicit slot uploads.
        officeDocs.forEach(d => {
          const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
          if (explicitSlot) return;
          const isAssigned = Object.values(serverOffSlotMap).some(assigned => assigned && assigned.id === d.id);
          if (!isAssigned) {
            for (let s = 1; s <= 4; s++) {
              if (!serverOffSlotMap[s]) {
                serverOffSlotMap[s] = d;
                break;
              }
            }
          }
        });

        for (let s = 1; s <= 4; s++) {
          const d = serverOffSlotMap[s];
          const offCacheKey1 = `pwa_evidence_${sampleCaseId}_office_slot_${s}`;
          const offCacheKey2 = `pwa_evidence_${activeCaseKey}_office_slot_${s}`;
          if (d) {
            uploadedOfficeSlots[s] = true;
            const bOff = document.getElementById(`slotOffice${s}Badge`);
            const btnOff = document.getElementById(`slotOffice${s}BtnText`);
            const thumbOff = document.getElementById(`slotOffice${s}Thumb`);
            if (bOff) {
              bOff.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold";
              bOff.textContent = "✓ UPLOADED";
            }
            if (btnOff) btnOff.textContent = "Re-take Photo";
            const offThumbUrl = toPwaThumbUrl(d.url, 180);
            if (thumbOff) thumbOff.innerHTML = `<img src="${offThumbUrl}" data-full-src="${d.url}" onerror="if(this.dataset.fullSrc && this.src!==this.dataset.fullSrc)this.src=this.dataset.fullSrc;" loading="lazy" decoding="async" class="w-full h-full object-cover rounded-lg"/>`;
            safeSetSlotEvidenceCache(sampleCaseId, activeCaseKey, "office_slot", s, {
              src: offThumbUrl,
              timestamp: d.created_at || "Verified on Server",
              lat: d.latitude || 23.2154,
              lon: d.longitude || 72.6367,
              doc_type: d.doc_type,
              caseId: sampleCaseId,
              caseNo: activeCaseKey,
            });
          } else {
            const validCached = getValidCachedSlotEvidence(sampleCaseId, activeCaseKey, "office_slot", s);
            const keepOffline = Boolean(
              validCached &&
              (validCached.pendingOffline || validCached.uploadedOnServer) &&
              ((validCached.caseId && String(validCached.caseId) === String(sampleCaseId)) ||
                (validCached.caseNo && String(validCached.caseNo) === String(activeCaseKey)))
            );
            if (keepOffline && validCached) {
              uploadedOfficeSlots[s] = true;
              const bOff = document.getElementById(`slotOffice${s}Badge`);
              const btnOff = document.getElementById(`slotOffice${s}BtnText`);
              const thumbOff = document.getElementById(`slotOffice${s}Thumb`);
              if (bOff) {
                bOff.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold";
                bOff.textContent = "✓ UPLOADED";
              }
              if (btnOff) btnOff.textContent = "Re-take Photo";
              if (thumbOff && validCached.src) {
                thumbOff.innerHTML = `<img src="${validCached.src}" class="w-full h-full object-cover rounded-lg"/>`;
              }
            } else {
              localStorage.removeItem(offCacheKey1);
              localStorage.removeItem(offCacheKey2);
              uploadedOfficeSlots[s] = false;
              const defOff = PWA_SLOT_DEFAULTS[`office_${s}`];
              const bOff = document.getElementById(`slotOffice${s}Badge`);
              const btnOff = document.getElementById(`slotOffice${s}BtnText`);
              const thumbOff = document.getElementById(`slotOffice${s}Thumb`);
              if (bOff) {
                bOff.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold";
                bOff.textContent = "PENDING";
              }
              if (btnOff) btnOff.textContent = (defOff && defOff.btnText) ? defOff.btnText : "Capture Photo";
              if (thumbOff) thumbOff.innerHTML = (defOff && defOff.thumbHTML) ? defOff.thumbHTML : `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
            }
          }
        }
        restoreExtraPhotosForFolder('office', officeDocs, serverOffSlotMap);

        const serverCoOffSlotMap = { 1: null, 2: null, 3: null, 4: null };
        coOfficeDocs.forEach((d, idx) => {
          const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
          if (explicitSlot && explicitSlot > 4) return;
          const s = getOffSlot(d, idx + 1);
          if (s >= 1 && s <= 4 && !serverCoOffSlotMap[s]) {
            serverCoOffSlotMap[s] = d;
          }
        });
        coOfficeDocs.forEach(d => {
          const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
          if (explicitSlot) return;
          const isAssigned = Object.values(serverCoOffSlotMap).some(assigned => assigned && assigned.id === d.id);
          if (!isAssigned) {
            for (let s = 1; s <= 4; s++) {
              if (!serverCoOffSlotMap[s]) {
                serverCoOffSlotMap[s] = d;
                break;
              }
            }
          }
        });

        for (let s = 1; s <= 4; s++) {
          const d = serverCoOffSlotMap[s];
          const coOffCacheKey1 = `pwa_evidence_${sampleCaseId}_co_office_slot_${s}`;
          const coOffCacheKey2 = `pwa_evidence_${activeCaseKey}_co_office_slot_${s}`;
          if (d) {
            uploadedCoOfficeSlots[s] = true;
            const bCoOff = document.getElementById(`slotCoOffice${s}Badge`);
            const btnCoOff = document.getElementById(`slotCoOffice${s}BtnText`);
            const thumbCoOff = document.getElementById(`slotCoOffice${s}Thumb`);
            if (bCoOff) {
              bCoOff.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold";
              bCoOff.textContent = "✓ UPLOADED";
            }
            if (btnCoOff) btnCoOff.textContent = "Re-take Photo";
            const coOffThumbUrl = toPwaThumbUrl(d.url, 180);
            if (thumbCoOff) thumbCoOff.innerHTML = `<img src="${coOffThumbUrl}" data-full-src="${d.url}" onerror="if(this.dataset.fullSrc && this.src!==this.dataset.fullSrc)this.src=this.dataset.fullSrc;" loading="lazy" decoding="async" class="w-full h-full object-cover rounded-lg"/>`;
            safeSetSlotEvidenceCache(sampleCaseId, activeCaseKey, "co_office_slot", s, {
              src: coOffThumbUrl,
              timestamp: d.created_at || "Verified on Server",
              lat: d.latitude || 23.2154,
              lon: d.longitude || 72.6367,
              doc_type: d.doc_type,
              caseId: sampleCaseId,
              caseNo: activeCaseKey,
            });
          } else {
            const validCached = getValidCachedSlotEvidence(sampleCaseId, activeCaseKey, "co_office_slot", s);
            const keepOffline = Boolean(
              validCached &&
              (validCached.pendingOffline || validCached.uploadedOnServer) &&
              ((validCached.caseId && String(validCached.caseId) === String(sampleCaseId)) ||
                (validCached.caseNo && String(validCached.caseNo) === String(activeCaseKey)))
            );
            if (keepOffline && validCached) {
              uploadedCoOfficeSlots[s] = true;
              const bCoOff = document.getElementById(`slotCoOffice${s}Badge`);
              const btnCoOff = document.getElementById(`slotCoOffice${s}BtnText`);
              const thumbCoOff = document.getElementById(`slotCoOffice${s}Thumb`);
              if (bCoOff) {
                bCoOff.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold";
                bCoOff.textContent = "✓ UPLOADED";
              }
              if (btnCoOff) btnCoOff.textContent = "Re-take Photo";
              if (thumbCoOff && validCached.src) {
                thumbCoOff.innerHTML = `<img src="${validCached.src}" class="w-full h-full object-cover rounded-lg"/>`;
              }
            } else {
              localStorage.removeItem(coOffCacheKey1);
              localStorage.removeItem(coOffCacheKey2);
              uploadedCoOfficeSlots[s] = false;
              const defCoOff = PWA_SLOT_DEFAULTS[`co_office_${s}`];
              const bCoOff = document.getElementById(`slotCoOffice${s}Badge`);
              const btnCoOff = document.getElementById(`slotCoOffice${s}BtnText`);
              const thumbCoOff = document.getElementById(`slotCoOffice${s}Thumb`);
              if (bCoOff) {
                bCoOff.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold";
                bCoOff.textContent = "PENDING";
              }
              if (btnCoOff) btnCoOff.textContent = (defCoOff && defCoOff.btnText) ? defCoOff.btnText : "Capture Photo";
              if (thumbCoOff) thumbCoOff.innerHTML = (defCoOff && defCoOff.thumbHTML) ? defCoOff.thumbHTML : `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
            }
          }
        }
        restoreExtraPhotosForFolder('co_office', coOfficeDocs, serverCoOffSlotMap);

        const serverCoResSlotMap = { 1: null, 2: null, 3: null, 4: null };
        coResidenceDocs.forEach((d, idx) => {
          const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
          if (explicitSlot && explicitSlot > 4) return;
          const s = getResSlot(d, idx + 1);
          if (s >= 1 && s <= 4 && !serverCoResSlotMap[s]) {
            serverCoResSlotMap[s] = d;
          }
        });
        coResidenceDocs.forEach(d => {
          const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
          if (explicitSlot) return;
          const isAssigned = Object.values(serverCoResSlotMap).some(assigned => assigned && assigned.id === d.id);
          if (!isAssigned) {
            for (let s = 1; s <= 4; s++) {
              if (!serverCoResSlotMap[s]) {
                serverCoResSlotMap[s] = d;
                break;
              }
            }
          }
        });

        for (let s = 1; s <= 4; s++) {
          const d = serverCoResSlotMap[s];
          const coResCacheKey1 = `pwa_evidence_${sampleCaseId}_co_residence_slot_${s}`;
          const coResCacheKey2 = `pwa_evidence_${activeCaseKey}_co_residence_slot_${s}`;
          if (d) {
            uploadedCoResidenceSlots[s] = true;
            const bCoRes = document.getElementById(`slotCoResidence${s}Badge`);
            const btnCoRes = document.getElementById(`slotCoResidence${s}BtnText`);
            const thumbCoRes = document.getElementById(`slotCoResidence${s}Thumb`);
            if (bCoRes) {
              bCoRes.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold";
              bCoRes.textContent = "✓ UPLOADED";
            }
            if (btnCoRes) btnCoRes.textContent = "Re-take Photo";
            const coResThumbUrl = toPwaThumbUrl(d.url, 180);
            if (thumbCoRes) thumbCoRes.innerHTML = `<img src="${coResThumbUrl}" data-full-src="${d.url}" onerror="if(this.dataset.fullSrc && this.src!==this.dataset.fullSrc)this.src=this.dataset.fullSrc;" loading="lazy" decoding="async" class="w-full h-full object-cover rounded-lg"/>`;
            safeSetSlotEvidenceCache(sampleCaseId, activeCaseKey, "co_residence_slot", s, {
              src: coResThumbUrl,
              timestamp: d.created_at || "Verified on Server",
              lat: d.latitude || 23.2154,
              lon: d.longitude || 72.6367,
              doc_type: d.doc_type,
              caseId: sampleCaseId,
              caseNo: activeCaseKey,
            });
          } else {
            const validCached = getValidCachedSlotEvidence(sampleCaseId, activeCaseKey, "co_residence_slot", s);
            const keepOffline = Boolean(
              validCached &&
              (validCached.pendingOffline || validCached.uploadedOnServer) &&
              ((validCached.caseId && String(validCached.caseId) === String(sampleCaseId)) ||
                (validCached.caseNo && String(validCached.caseNo) === String(activeCaseKey)))
            );
            if (keepOffline && validCached) {
              uploadedCoResidenceSlots[s] = true;
              const bCoRes = document.getElementById(`slotCoResidence${s}Badge`);
              const btnCoRes = document.getElementById(`slotCoResidence${s}BtnText`);
              const thumbCoRes = document.getElementById(`slotCoResidence${s}Thumb`);
              if (bCoRes) {
                bCoRes.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold";
                bCoRes.textContent = "✓ UPLOADED";
              }
              if (btnCoRes) btnCoRes.textContent = "Re-take Photo";
              if (thumbCoRes && validCached.src) {
                thumbCoRes.innerHTML = `<img src="${validCached.src}" class="w-full h-full object-cover rounded-lg"/>`;
              }
            } else {
              localStorage.removeItem(coResCacheKey1);
              localStorage.removeItem(coResCacheKey2);
              uploadedCoResidenceSlots[s] = false;
              const defCoRes = PWA_SLOT_DEFAULTS[`co_residence_${s}`];
              const bCoRes = document.getElementById(`slotCoResidence${s}Badge`);
              const btnCoRes = document.getElementById(`slotCoResidence${s}BtnText`);
              const thumbCoRes = document.getElementById(`slotCoResidence${s}Thumb`);
              if (bCoRes) {
                bCoRes.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold";
                bCoRes.textContent = "PENDING";
              }
              if (btnCoRes) btnCoRes.textContent = (defCoRes && defCoRes.btnText) ? defCoRes.btnText : "Capture Photo";
              if (thumbCoRes) thumbCoRes.innerHTML = (defCoRes && defCoRes.thumbHTML) ? defCoRes.thumbHTML : `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
            }
          }
        }
        restoreExtraPhotosForFolder('co_residence', coResidenceDocs, serverCoResSlotMap);

        [3, 4, 5].forEach(slotNum => {
          const slotDocs = homeSlotDocs[slotNum];
          const serverHomeSlotMap = { 1: null, 2: null, 3: null, 4: null };
          slotDocs.forEach((d, idx) => {
            const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
            if (explicitSlot && explicitSlot > 4) return;
            const s = getResSlot(d, idx + 1);
            if (s >= 1 && s <= 4 && !serverHomeSlotMap[s]) {
              serverHomeSlotMap[s] = d;
            }
          });
          slotDocs.forEach(d => {
            const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
            if (explicitSlot) return;
            const isAssigned = Object.values(serverHomeSlotMap).some(assigned => assigned && assigned.id === d.id);
            if (!isAssigned) {
              for (let s = 1; s <= 4; s++) {
                if (!serverHomeSlotMap[s]) {
                  serverHomeSlotMap[s] = d;
                  break;
                }
              }
            }
          });

          const homeSlotsMapRef = { 3: uploadedHome3Slots, 4: uploadedHome4Slots, 5: uploadedHome5Slots }[slotNum];
          for (let s = 1; s <= 4; s++) {
            const d = serverHomeSlotMap[s];
            const homeCacheKey1 = `pwa_evidence_${sampleCaseId}_home_${slotNum}_slot_${s}`;
            const homeCacheKey2 = `pwa_evidence_${activeCaseKey}_home_${slotNum}_slot_${s}`;
            if (d) {
              homeSlotsMapRef[s] = true;
              const bHome = document.getElementById(`slotHome${slotNum}${s}Badge`);
              const btnHome = document.getElementById(`slotHome${slotNum}${s}BtnText`);
              const thumbHome = document.getElementById(`slotHome${slotNum}${s}Thumb`);
              if (bHome) {
                bHome.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold";
                bHome.textContent = "✓ UPLOADED";
              }
              if (btnHome) btnHome.textContent = "Re-take Photo";
              const homeThumbUrl = toPwaThumbUrl(d.url, 180);
              if (thumbHome) thumbHome.innerHTML = `<img src="${homeThumbUrl}" data-full-src="${d.url}" onerror="if(this.dataset.fullSrc && this.src!==this.dataset.fullSrc)this.src=this.dataset.fullSrc;" loading="lazy" decoding="async" class="w-full h-full object-cover rounded-lg"/>`;
              safeSetSlotEvidenceCache(sampleCaseId, activeCaseKey, `home_${slotNum}_slot`, s, {
                src: homeThumbUrl,
                timestamp: d.created_at || "Verified on Server",
                lat: d.latitude || 23.2154,
                lon: d.longitude || 72.6367,
                doc_type: d.doc_type,
                caseId: sampleCaseId,
                caseNo: activeCaseKey,
              });
            } else {
              const validCached = getValidCachedSlotEvidence(sampleCaseId, activeCaseKey, `home_${slotNum}_slot`, s);
              const keepOffline = Boolean(
                validCached &&
                (validCached.pendingOffline || validCached.uploadedOnServer) &&
                ((validCached.caseId && String(validCached.caseId) === String(sampleCaseId)) ||
                  (validCached.caseNo && String(validCached.caseNo) === String(activeCaseKey)))
              );
              if (keepOffline && validCached) {
                homeSlotsMapRef[s] = true;
                const bHome = document.getElementById(`slotHome${slotNum}${s}Badge`);
                const btnHome = document.getElementById(`slotHome${slotNum}${s}BtnText`);
                const thumbHome = document.getElementById(`slotHome${slotNum}${s}Thumb`);
                if (bHome) {
                  bHome.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold";
                  bHome.textContent = "✓ UPLOADED";
                }
                if (btnHome) btnHome.textContent = "Re-take Photo";
                if (thumbHome && validCached.src) {
                  thumbHome.innerHTML = `<img src="${validCached.src}" class="w-full h-full object-cover rounded-lg"/>`;
                }
              } else {
                localStorage.removeItem(homeCacheKey1);
                localStorage.removeItem(homeCacheKey2);
                homeSlotsMapRef[s] = false;
                const defHome = PWA_SLOT_DEFAULTS[`home_${slotNum}_${s}`];
                const bHome = document.getElementById(`slotHome${slotNum}${s}Badge`);
                const btnHome = document.getElementById(`slotHome${slotNum}${s}BtnText`);
                const thumbHome = document.getElementById(`slotHome${slotNum}${s}Thumb`);
                if (bHome) {
                  bHome.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold";
                  bHome.textContent = "PENDING";
                }
                if (btnHome) btnHome.textContent = (defHome && defHome.btnText) ? defHome.btnText : "Capture Photo";
                if (thumbHome) thumbHome.innerHTML = (defHome && defHome.thumbHTML) ? defHome.thumbHTML : `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
              }
            }
          }
          restoreExtraPhotosForFolder(`home_${slotNum}`, slotDocs, serverHomeSlotMap);
        });

        updateEvidenceProgress();

        // Restore Agent Selfie if uploaded
        // Exact match only - see the officeDocs/selfieDocs comment above for why.
        const serverSelfie = (docs || []).find(d => d.doc_type === "AGENT_SELFIE");
        if (serverSelfie) {
          const selfieThumbUrl = toPwaThumbUrl(serverSelfie.url, 180);
          agentSelfieDataUrl = selfieThumbUrl;
          const previewImg = document.getElementById("agentSelfiePreview") || document.getElementById("selfiePreview");
          const placeholder = document.getElementById("agentSelfiePlaceholder") || document.getElementById("selfiePlaceholder");
          const wmTag = document.getElementById("selfieWatermarkTag");
          const badge = document.getElementById("selfieStatusBadge") || document.getElementById("selfieVerifiedBadge");
          const btnText = document.getElementById("selfieBtnText") || document.getElementById("btnSelfieText");
          const metaInfo = document.getElementById("selfieMetaInfo");
          const tsText = document.getElementById("selfieTimestampText");
          const agentText = document.getElementById("selfieAgentNameText");

          if (previewImg) {
            previewImg.src = selfieThumbUrl;
            previewImg.onerror = function() {
              if (serverSelfie.url && this.src !== serverSelfie.url) this.src = serverSelfie.url;
            };
            previewImg.classList.remove("hidden");
          }
          if (placeholder) placeholder.classList.add("hidden");
          if (wmTag) wmTag.classList.remove("hidden");
          if (badge) {
            badge.className = "font-mono text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-2xs";
            badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span><span>SELFIE VERIFIED (સર્વે શરૂ)</span>`;
          }
          if (btnText) btnText.textContent = "Re-take Selfie (ફરીથી લો)";
          if (metaInfo) metaInfo.classList.remove("hidden");
          if (tsText) tsText.textContent = serverSelfie.created_at || "Verified on Server";
          if (agentText) {
            const liveName = (document.getElementById("agentNameDisplay") || {}).textContent;
            agentText.textContent = liveName ? `${liveName} (Field Officer)` : "Field Officer";
          }

          try {
            localStorage.setItem("selfie_" + sampleCaseId, selfieThumbUrl);
            localStorage.setItem("selfie_" + activeCaseKey, selfieThumbUrl);
            localStorage.setItem("selfie_timestamp_" + sampleCaseId, serverSelfie.created_at || "Verified on Server");
            localStorage.setItem("selfie_timestamp_" + activeCaseKey, serverSelfie.created_at || "Verified on Server");
          } catch(e) {}
        }
        updateEvidenceProgress();

        renderAllCaseDocumentsGallery(kycDocs);
      } catch (err) {
        console.warn("Could not load case documents:", err);
      }
    }

    function renderAllCaseDocumentsGallery(docs) {
      // Hidden on Field Agent PWA per CA Office confidentiality & data security policy
      const section = document.getElementById("pwaAllDocsSection");
      if (section) section.classList.add("hidden");
      const caDocsSec = document.getElementById("caDocsSection");
      if (caDocsSec) caDocsSec.classList.add("hidden");
    }

    // The header's name badge/avatar used to be hardcoded to the old "agent1 / Rajesh Varma"
    // demo persona and never updated after a real login - shown to every agent regardless of
    // who actually signed in. Derive both from the real logged-in user instead.
    function applyAgentIdentityToHeader(u) {
      const badge = document.getElementById("agentBadgeDisplay");
      if (badge) {
        const roleLabel = u.role === "FIELD_AGENT" ? "Field Verification Officer"
          : (u.role || "Field Staff").replace(/_/g, " ");
        badge.textContent = roleLabel;
      }
      const avatar = document.getElementById("agentAvatarDisplay");
      if (avatar && u.full_name) {
        const initials = u.full_name.trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
        avatar.textContent = initials || "FA";
      }
    }

    // Resolves which case is the agent's real, presently-allotted one from the server (not
    // whatever happens to be cached in this device's localStorage, which can be a stale,
    // already-completed prior assignment). Used only when the agent opened the bare /pwa
    // bookmark with no case-specific link - a dispatch link's own ?case= always wins outright.
    // GET /api/v1/cases already filters to just this agent's own cases (assigned_agent_id ==
    // current_user.id) and orders newest-created first; prefer one that's still active work
    // over one already CERTIFIED, since that's the agent's actual current task.
    async function resolveCurrentAgentCaseNo(token) {
      try {
        const cases = await fetchMyAgentCases(token);
        if (!Array.isArray(cases) || cases.length === 0) return null;
        const active = cases.find(c => c.status && !CASE_DONE_STATUSES.has(c.status));
        return (active || cases[0]).case_no || null;
      } catch (e) {
        return null;
      }
    }

    async function checkAgentAuth() {
      const urlParams = new URLSearchParams(window.location.search);
      const explicitCase = urlParams.get("case") || urlParams.get("case_id");
      const token = localStorage.getItem("pwa_token");
      const modal = document.getElementById("agentLoginModal");

      const userJson = localStorage.getItem("pwa_user");
      if (userJson) {
        try {
          const u = JSON.parse(userJson);
          if (u.user_id && (!u.role || u.role === "FIELD_AGENT")) {
            localStorage.setItem("pwa_assigned_agent_id", u.user_id);
          }
          if (u.full_name && document.getElementById("agentNameDisplay")) {
            document.getElementById("agentNameDisplay").textContent = u.full_name;
          }
          applyAgentIdentityToHeader(u);
          const execInput = document.getElementById("formExecutive");
          if (execInput && (!execInput.value || execInput.value.includes("Kamal"))) {
            execInput.value = `${u.full_name} (Field Officer)`;
          }
        } catch(e){}
      }

      let paramCase = explicitCase || null;

      // No case-specific dispatch link was opened - the agent just hit their bare /pwa
      // bookmark, so resolve ONLY from the cases actually allotted to or completed by this agent.
      if (!explicitCase) {
        const currentAssigned = await resolveCurrentAgentCaseNo(token);
        if (currentAssigned) {
          paramCase = currentAssigned;
        } else {
          await populatePwaCaseSelector(token, null, null, null, null);
          document.getElementById("caseNoDisplay").textContent = "CASE: NO ACTIVE TASK";
          document.getElementById("applicantNameDisplay").textContent = "No cases allotted to your mobile yet";
          document.getElementById("loanAmountDisplay").textContent = "";
          document.getElementById("targetAddressDisplay").textContent = "Once the CA Office allots a case to your login, it will appear in MY TASK above.";
        }
      }

      if (paramCase) {
        switchPwaCase(paramCase);
        let caseResolved = false;
        try {
          caseResolved = await loadAssignedCaseForAgent(token, paramCase);
        } catch(e) {}

        const hasExplicitCaseParam = !!(urlParams.get("case") || urlParams.get("case_id"));
        if (caseResolved || !hasExplicitCaseParam) {
          await loadCaseDocumentsIntoPwa(sampleCaseId);
        }
      }

      // Show login modal only if agent is not authenticated and has no explicit dispatch link
      if (!token && !urlParams.get("case") && !urlParams.get("case_id")) {
        if (modal) modal.classList.remove("hidden");
      } else {
        if (modal) modal.classList.add("hidden");
      }
    }

    async function handleAgentLogin(e) {
      if (e) e.preventDefault();
      const uInput = document.getElementById("agentLoginUsername");
      const pInput = document.getElementById("agentLoginPassword");
      const alertEl = document.getElementById("agentLoginAlert");
      const submitBtn = document.getElementById("agentLoginSubmitBtn");

      const username = uInput.value.trim();
      const password = pInput.value;

      alertEl.classList.add("hidden");
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">sync</span> Authenticating...`;

      try {
        const res = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("pwa_token", data.access_token);
          localStorage.setItem("pwa_user", JSON.stringify(data));
          if (data.user_id) {
            localStorage.setItem("pwa_assigned_agent_id", data.user_id);
          }
          localStorage.removeItem("pwa_active_case_key");
          localStorage.removeItem("pwa_active_case_id");
          document.getElementById("agentLoginModal").classList.add("hidden");
          if (document.getElementById("agentNameDisplay") && data.full_name) {
            document.getElementById("agentNameDisplay").textContent = data.full_name;
          }
          await checkAgentAuth();
        } else {
          const err = await res.json().catch(() => ({}));
          alertEl.textContent = err.detail || "Invalid agent credentials. Check your username and password.";
          alertEl.classList.remove("hidden");
        }
      } catch (err) {
        if (username.toLowerCase() === "agent1" && password === "agent1@123") {
          localStorage.setItem("pwa_token", "demo-pwa-token");
          localStorage.setItem("pwa_user", JSON.stringify({ full_name: "Rajesh Varma", role: "FIELD_AGENT" }));
          document.getElementById("agentLoginModal").classList.add("hidden");
          await checkAgentAuth();
        } else {
          alertEl.textContent = "Unable to connect to auth server. Try demo agent1 / agent1@123";
          alertEl.classList.remove("hidden");
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Sign In & Access Field Tasks</span><span class="material-symbols-outlined text-[18px]">login</span>`;
      }
    }

    function togglePasswordVisibility(fieldId) {
      const field = document.getElementById(fieldId);
      if (field) {
        field.type = field.type === "password" ? "text" : "password";
      }
    }

    function logoutAgent() {
      if (confirm("Sign out of the Field Verification PWA?")) {
        localStorage.removeItem("pwa_token");
        localStorage.removeItem("pwa_user");
        localStorage.removeItem("pwa_assigned_agent_id");
        localStorage.removeItem("pwa_active_case_key");
        localStorage.removeItem("pwa_active_case_id");
        document.getElementById("agentLoginModal").classList.remove("hidden");
      }
    }

    window.addEventListener("DOMContentLoaded", () => {
      checkAgentAuth();
      renderFamilyMembers();
      renderAssetsChips();
      updateOfflineSyncIndicator();
      if (navigator.onLine) {
        syncOfflineQueue(false);
      }

      // Attach automatic per-case form persistence & background sync on every input/change
      const qSec = document.getElementById("dueDiligenceQuestionnaireSection");
      if (qSec) {
        qSec.addEventListener("input", () => {
          if (!isSwitchingPwaCase) schedulePwaFormAutoSave();
        });
        qSec.addEventListener("change", () => {
          if (!isSwitchingPwaCase) schedulePwaFormAutoSave();
        });
      }
      // Flush current form draft locally and to the server whenever the mobile browser tab is
      // backgrounded (e.g. agent switches to WhatsApp to tap a second case link) or closed.
      window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          flushPwaFormWithKeepalive();
        }
      });
      window.addEventListener("pagehide", () => {
        flushPwaFormWithKeepalive();
      });

      // Purely additive background session heartbeat for CA Office Live Active Sessions tracker
      try {
        let pwaSid = sessionStorage.getItem("pwa_live_session_id");
        if (!pwaSid) {
          pwaSid = "pwa-" + Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);
          sessionStorage.setItem("pwa_live_session_id", pwaSid);
        }
        if (!sessionStorage.getItem("pwa_live_session_started")) {
          sessionStorage.setItem("pwa_live_session_started", new Date().toISOString());
        }
        const sendPwaSessionHeartbeat = async () => {
          try {
            if (!navigator.onLine) return;
            let uName = "Field Agent (PWA)";
            try {
              const uObj = JSON.parse(localStorage.getItem("pwa_user") || "{}");
              if (uObj && uObj.full_name) uName = uObj.full_name;
            } catch (_) {}
            const nameEl = document.getElementById("agentNameDisplay");
            if (uName === "Field Agent (PWA)" && nameEl && nameEl.textContent.trim()) {
              uName = nameEl.textContent.trim();
            }
            const curCaseObj = (typeof pwaCases !== "undefined" && typeof currentCaseKey !== "undefined" && pwaCases[currentCaseKey])
              ? pwaCases[currentCaseKey]
              : null;
            const curCaseNo = curCaseObj ? curCaseObj.caseNo : null;
            const tok = localStorage.getItem("pwa_token");
            const hdrs = { "Content-Type": "application/json" };
            if (tok && tok !== "demo-pwa-token") hdrs["Authorization"] = `Bearer ${tok}`;
            await fetch("/api/v1/activity-log/heartbeat", {
              method: "POST",
              headers: hdrs,
              body: JSON.stringify({
                session_id: pwaSid,
                surface: "PWA",
                user_name: uName,
                role: "FIELD_AGENT",
                active_case_no: curCaseNo,
                started_at_iso: sessionStorage.getItem("pwa_live_session_started") || null,
              }),
            });
          } catch (_) {
            // Silent fail-safe: never disturb field agent offline/online workflow
          }
        };
        setTimeout(sendPwaSessionHeartbeat, 1200);
        setInterval(sendPwaSessionHeartbeat, 25000);
      } catch (_) {}
    });
