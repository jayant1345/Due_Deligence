    // Register PWA Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(() => {
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
    let sampleCaseId = _savedCaseId || (caseRegistryPwa[activeCaseKey] ? caseRegistryPwa[activeCaseKey].id : "b8df82fd-e33a-493e-8d4b-a802861cf294");
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
          if (!d) continue;
          const thumbEl = document.getElementById(`${info.slotIdPrefix}${n}Thumb`);
          if (thumbEl && d.thumbHTML !== null) thumbEl.innerHTML = d.thumbHTML;
          const badgeEl = document.getElementById(`${info.slotIdPrefix}${n}Badge`);
          if (badgeEl) {
            if (d.badgeClass !== null) badgeEl.className = d.badgeClass;
            if (d.badgeHTML !== null) badgeEl.innerHTML = d.badgeHTML;
          }
          const btnTextEl = document.getElementById(`${info.slotIdPrefix}${n}BtnText`);
          if (btnTextEl && d.btnText !== null) btnTextEl.textContent = d.btnText;
          info.slotsMap[n] = false;
        }
        const gallery = document.getElementById(`extraGallery_${folder}`);
        if (gallery) gallery.innerHTML = "";
        if (typeof updateExtraPhotoCount === "function") updateExtraPhotoCount(folder);
        extraPhotoNextSlot[folder] = 4;
      });
      if (typeof updateEvidenceProgress === "function") updateEvidenceProgress();
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
      const dist = calculateDistanceMeters(TARGET_LAT, TARGET_LON, lat, lon);
      document.getElementById("proximityDistanceText").textContent = `${dist} meters`;
      document.getElementById("deviceLatLonText").textContent = `${lat.toFixed(4)}° N`;
      
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
        `CASE: ${activeCaseKey} | AGENT: FA-7701/7702 | ${nowStr} | ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E | ACC: ${accuracy ? accuracy.toFixed(1) : '3.2'}m | GEOFENCE: ${isCompliant ? 'VALID' : 'BREACH'}`;

      refreshPwaGeofenceMap(lat, lon, dist);
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
      activeUploadSlot = slotNum;
      activeDocType = docType;
      if (folder) currentPwaFolder = folder;
      const camInput = document.getElementById("cameraInput");
      if (camInput) {
        camInput.click();
      }
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
    function addOrUpdateExtraPhotoThumb(folder, slotNum, previewUrl) {
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
      tile.innerHTML = `<img src="${previewUrl}" class="w-full h-full object-cover"/><span class="absolute bottom-0 right-0 bg-emerald-600 text-white text-[8px] px-1 leading-tight">✓</span>`;
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
        addOrUpdateExtraPhotoThumb(folder, sNum, d.url);
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
      const file = event.target.files[0];
      event.target.value = ""; // allow capturing the same slot again without a no-op change event
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

      // Read file and draw onto a resized canvas (compression only — no text is drawn; the
      // server applies the one authoritative watermark banner from the case record), then let
      // the agent look at the actual shot before it's saved to the slot - a blurry/badly-framed
      // photo can be discarded and retaken right away instead of only being noticed later.
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawImg = new Image();
        rawImg.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 1600;
          let w = rawImg.width;
          let h = rawImg.height;
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(rawImg, 0, 0, w, h);

          const finalPreviewUrl = canvas.toDataURL("image/jpeg", 0.92);

          pendingPhotoCapture = {
            canvas, file, finalPreviewUrl, slotNum, docType, folderAtCapture,
            caseIdAtCapture, caseKeyAtCapture, latAtCapture, lonAtCapture, timeStr, finish,
          };
          const reviewImg = document.getElementById("pwaPhotoReviewImg");
          const reviewModal = document.getElementById("pwaPhotoReviewModal");
          if (reviewImg) reviewImg.src = finalPreviewUrl;
          if (reviewModal) reviewModal.classList.remove("hidden");
        };
        rawImg.onerror = finish;
        rawImg.src = e.target.result;
      };
      reader.onerror = finish;
      reader.readAsDataURL(file);
    }

    // Tap a slot's small thumbnail to inspect the actual saved photo full-screen - lets the
    // agent (or CA reviewing over their shoulder) confirm the shot and its watermark are legible
    // without having to rely on the tiny 56px thumbnail.
    function viewSlotPhotoFullscreen(thumbEl) {
      const img = thumbEl.querySelector("img");
      if (!img || !img.src) return; // empty/pending slot - nothing to view yet
      const viewImg = document.getElementById("pwaSlotPhotoViewImg");
      const viewModal = document.getElementById("pwaSlotPhotoViewModal");
      if (viewImg) viewImg.src = img.src;
      if (viewModal) viewModal.classList.remove("hidden");
      resetSlotPhotoZoom();
    }
    function closeSlotPhotoFullscreen() {
      const viewModal = document.getElementById("pwaSlotPhotoViewModal");
      if (viewModal) viewModal.classList.add("hidden");
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
        canvas, file, finalPreviewUrl, slotNum, docType, folderAtCapture,
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
      alertText.textContent = isExtra ? `Processing ${info.label} additional photo...` : `Processing ${info.label} Slot ${slotNum} photo...`;
      setUploadAlertIcon(true, "text-blue-600", "autorenew");

      const previewImgEl = document.getElementById("previewPhotoImg");
      if (previewImgEl) previewImgEl.src = finalPreviewUrl;

      if (!isExtra) info.slotsMap[slotNum] = true;
      try {
        const slotPayload = JSON.stringify({ src: finalPreviewUrl, timestamp: timeStr, lat: latAtCapture, lon: lonAtCapture, doc_type: docType });
        localStorage.setItem(`pwa_evidence_${caseIdAtCapture}_${info.storageKey}_${slotNum}`, slotPayload);
        localStorage.setItem(`pwa_evidence_${caseKeyAtCapture}_${info.storageKey}_${slotNum}`, slotPayload);
      } catch (storageErr) {
        console.warn("Storage quota limit or private browsing:", storageErr);
      }
      if (isExtra) {
        addOrUpdateExtraPhotoThumb(folderAtCapture, slotNum, finalPreviewUrl);
      } else {
        const thumbEl = document.getElementById(`${info.slotIdPrefix}${slotNum}Thumb`);
        if (thumbEl) thumbEl.innerHTML = `<img src="${finalPreviewUrl}" class="w-full h-full object-cover rounded-lg"/>`;
        const badgeEl = document.getElementById(`${info.slotIdPrefix}${slotNum}Badge`);
        if (badgeEl) {
          badgeEl.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold";
          badgeEl.textContent = "✓ UPLOADED";
        }
        const btnTextEl = document.getElementById(`${info.slotIdPrefix}${slotNum}BtnText`);
        if (btnTextEl) btnTextEl.textContent = "Re-take Photo";
      }
      updateEvidenceProgress();

          // Unlock capture right away - the slot is already saved locally (preview + localStorage)
          // and the server upload below runs in the background. The agent must never be made to
          // wait for a network round-trip before taking the next photo.
          finish();

          // Stream the resized photo to the server, which applies the single correct watermark.
          canvas.toBlob(async (blob) => {
            const uploadFile = blob || file;
            const formData = new FormData();
            formData.append("file", uploadFile, file.name || `photo_slot_${slotNum}.jpg`);
            formData.append("doc_type", docType || info.defaultDocType);
            formData.append("slot_number", slotNum);
            formData.append("folder", info.uploadFolder);
            formData.append("latitude", latAtCapture);
            formData.append("longitude", lonAtCapture);

            try {
              const token = localStorage.getItem("pwa_token");
              const headers = {};
              if (token && token !== "demo-pwa-token") {
                headers["Authorization"] = `Bearer ${token}`;
              }
              // A slow (not outright failed) connection must not hang forever - after 15s,
              // treat it the same as offline and queue it for background retry.
              const uploadController = new AbortController();
              const uploadTimeout = setTimeout(() => uploadController.abort(), 15000);
              const response = await fetch(`/api/v1/visits/cases/${caseIdAtCapture}/upload`, {
                method: "POST",
                headers: headers,
                body: formData,
                signal: uploadController.signal
              });
              clearTimeout(uploadTimeout);

              if (response.status === 202 || response.status === 200) {
                const data = await response.json();
                alertBox.className = "p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono shadow-sm animate-fade-in";
                alertText.innerHTML = `✅ <b>Data Uploaded Successfully!</b> ${info.label} Slot ${slotNum} transmitted to CA Scrutiny Desk.<br/>GPS: ${latAtCapture.toFixed(4)}°N, ${lonAtCapture.toFixed(4)}°E | Doc ID: <code>${(data.document_id || data.task_id || '').slice(0, 12)}...</code><br/><i>N.N. SHAH & CO. watermark applied server-side and synced in real time.</i>`;
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
                fileName: file.name || `photo_slot_${slotNum}.jpg`,
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
          }, "image/jpeg", 0.92);
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
    function handleAgentSelfieCapture(event) {
      const file = event.target.files[0];
      if (!file) return;
      // See submitDueDiligenceForm's matching guard - don't let a selfie taken while a
      // just-switched-to case is still loading get attached to no case (or cached under a
      // literal "undefined" key that can never be restored/synced).
      if (!sampleCaseId) {
        alert("This case is still loading. Please wait a moment for the case details to finish loading, then try the selfie again.");
        event.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Canvas watermarking with hardware GPS
          const canvas = document.createElement("canvas");
          const w = Math.min(img.width, 1080);
          const scale = w / img.width;
          const h = img.height * scale;
          canvas.width = w;
          canvas.height = h;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          // No text is drawn here — the server stamps the single authoritative watermark banner
          // from the case record (same /upload endpoint as evidence photos). Drawing one here too
          // used to produce two stacked banners on every attendance selfie.

          const now = new Date();
          const timeStr = now.toLocaleDateString("en-GB") + " " + now.toLocaleTimeString("en-GB") + " IST";
          const agentName = (document.getElementById("agentNameDisplay") || {}).textContent || "Field Officer";

          agentSelfieDataUrl = canvas.toDataURL("image/jpeg", 0.88);
          try {
            localStorage.setItem("selfie_" + sampleCaseId, agentSelfieDataUrl);
            localStorage.setItem("selfie_timestamp_" + sampleCaseId, timeStr);
            localStorage.setItem("selfie_agent_" + sampleCaseId, agentName);
          } catch(e){}
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
            previewImg.src = agentSelfieDataUrl;
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
              if (res.ok) {
                console.log("[✓] Field staff attendance selfie uploaded to CA Portal successfully!");
              }
            } catch (err) {
              console.warn("Selfie upload background retry queued:", err);
            }
          }, "image/jpeg", 0.88);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
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
        const row = document.createElement("div");
        row.className = "p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant shadow-2xs space-y-2";
        
        let relOptions = familyRelations.map(r => `<option value="${r}" ${r.startsWith(m.relation.split(' ')[0]) || m.relation === r ? 'selected' : ''}>${r}</option>`).join("");
        let occOptions = familyOccupations.map(o => `<option value="${o}" ${o.startsWith(m.occupation.split(' ')[0]) || m.occupation === o ? 'selected' : ''}>${o}</option>`).join("");

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
              <input type="text" value="${m.name}" oninput="updateFamilyMember(${idx}, 'name', this.value)" placeholder="Name" class="w-full text-xs font-semibold rounded border border-outline-variant bg-white p-1.5 text-on-surface"/>
            </div>
            <div>
              <label class="font-mono text-[9px] text-outline block mb-0.5">Relation (સંબંધ)*</label>
              <select onchange="updateFamilyMember(${idx}, 'relation', this.value)" class="w-full text-xs font-semibold rounded border border-outline-variant bg-white p-1.5 text-on-surface">
                ${relOptions}
              </select>
            </div>
            <div>
              <label class="font-mono text-[9px] text-outline block mb-0.5">Age (ઉંમર)*</label>
              <input type="number" value="${m.age}" oninput="updateFamilyMember(${idx}, 'age', this.value)" placeholder="Age" class="w-full text-xs font-mono font-semibold rounded border border-outline-variant bg-white p-1.5 text-on-surface"/>
            </div>
            <div>
              <label class="font-mono text-[9px] text-outline block mb-0.5">Occupation (વ્યવસાય)*</label>
              <select onchange="updateFamilyMember(${idx}, 'occupation', this.value)" class="w-full text-xs font-semibold rounded border border-outline-variant bg-white p-1.5 text-on-surface">
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
    }

    function removeFamilyMemberRow(idx) {
      if (familyMembers.length <= 1) {
        alert("At least 1 family member should be recorded.");
        return;
      }
      familyMembers.splice(idx, 1);
      renderFamilyMembers();
    }

    function updateFamilyMember(idx, field, val) {
      if (familyMembers[idx]) {
        familyMembers[idx][field] = val;
        if (field === "age") {
          const ageNum = parseInt(val, 10);
          if (ageNum > 0 && ageNum < 18 && (familyMembers[idx].occupation || "").startsWith("Job")) {
            familyMembers[idx].occupation = "Student (વિદ્યાર્થી)";
            renderFamilyMembers();
            return;
          }
        }
        syncFamilyTextarea();
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
    }

    function syncAssetsInput() {
      const activeNames = visibleAssets.filter(a => a.active).map(a => a.name);
      const hidden = document.getElementById("formAssetsObserved");
      if (hidden) hidden.value = activeNames.join(", ");
    }

    // Submit & Complete Physical Verification
    async function submitFinalPhysicalVerification() {
      const count = Object.values(uploadedSlots).filter(Boolean).length;
      if (count === 0) {
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
            notes: `Physical verification completed on-site. ${count}/4 evidence photo slots submitted. Verified with applicant identity.`
          })
        });

        // Show completion modal
        const compModal = document.getElementById("pwaCompletionModal");
        const compTime = document.getElementById("pwaCompletionTimestamp");
        if (compTime) {
          compTime.textContent = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + " IST";
        }
        const compSlots = document.getElementById("pwaCompletionSlots");
        if (compSlots) {
          compSlots.textContent = `${count} of 4 Geotagged Slots Uploaded`;
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

    function handleSiteCheckIn() {
      const btn = document.getElementById("checkInBtnText");
      const nowDate = new Date();
      const stamp = nowDate.toLocaleDateString('en-GB') + " " +
        nowDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + " IST";
      btn.textContent = `Check-In Logged: ${stamp}`;
      try {
        localStorage.setItem(`pwa_checkin_${sampleCaseId}`, stamp);
        localStorage.setItem(`pwa_checkin_${activeCaseKey}`, stamp);
      } catch(e) {}
      alert(`Site Check-In successfully recorded at GPS coordinates (${currentDeviceLat.toFixed(4)}° N, ${currentDeviceLon.toFixed(4)}° E)`);
    }

    function promptInspectionNotes() {
      const notes = prompt("Enter observation notes for this property visit:", "Physical existence confirmed. Met building society security guard. Flat 402 is self-occupied.");
      if (notes) {
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
          if (res.ok) {
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
                const bRes = await fetch(item.dataUrl);
                uploadBlob = await bRes.blob();
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
              if (upRes.ok || upRes.status === 202) {
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

    async function submitDueDiligenceForm() {
      // sampleCaseId is intentionally left unset while a just-switched-to case is still loading
      // its real data from the server (see switchPwaCase's placeholder branch) - saving here
      // would otherwise either queue against a literal "undefined" case id that can never sync,
      // or (before that placeholder existed) silently save under whichever case was PREVIOUSLY
      // open. Block the save and tell the agent to wait, instead of either of those.
      if (!sampleCaseId) {
        alert("This case is still loading. Please wait a moment for the case details to finish loading, then try saving again.");
        return;
      }
      if (!agentSelfieDataUrl) {
        if (!confirm("Field Staff Selfie has not been captured yet. Capturing your selfie authenticates attendance to start the survey. Do you wish to continue without selfie?")) {
          return;
        }
      }

      const exec = document.getElementById("formExecutive").value;
      const persona = document.getElementById("formPersona").value;
      const contactNumber = document.getElementById("formContactNumber") ? document.getElementById("formContactNumber").value.trim() : "";
      const marital = document.getElementById("formMarital").value;
      const ageComm = (document.getElementById("formAge") || {}).value || "";
      const communityChecked = document.querySelector('input[name="pwaCommRadio"]:checked');
      const community = communityChecked ? communityChecked.value : "";
      const qualification = document.getElementById("formQualification") ? document.getElementById("formQualification").value : "";
      const bType = document.getElementById("formBuildingType").value;
      const bhk = document.getElementById("formBhk").value;
      const own = document.getElementById("formOwnership").value;
      const stay = document.getElementById("formStayDuration").value;
      const owner = document.getElementById("formOwnerName").value;
      const refs = document.getElementById("formReferences").value;
      const landmark = document.getElementById("formLandmark") ? document.getElementById("formLandmark").value.trim() : "";
      // Combine the Name/Contact box with the explicit Relation dropdown into the same
      // "Name - Phone (Relation)" string the backend already parses (person_met) - an explicit
      // dropdown is far more reliable than expecting the agent to type "(Relation)" by hand, and
      // this way no backend change is needed to make use of it.
      const personMetRaw = document.getElementById("formPersonMet").value.trim();
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

      // Co-applicant office details - only actually submitted when this case has a
      // co-applicant (Module 3B visible); omitted entirely for ordinary single-applicant
      // cases rather than saving an empty/irrelevant object onto every case.
      const coModuleVisible = (() => {
        const el = document.getElementById("coApplicantOfficeModule");
        return el && !el.classList.contains("hidden");
      })();
      let officeDetailsCo = null;
      if (coModuleVisible) {
        officeDetailsCo = {
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

      // Co-applicant residence details - only submitted when the CA office flagged a separate
      // co-applicant home address (Module 3C visible), same opt-in pattern as office_details_co.
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
      // The Name board Visibility Yes/No radio (pwaNameBoardRadio) was a real, filled-in field
      // in the UI that this function never actually read - it hardcoded nameboard_visible to ""
      // regardless of the agent's answer, so the data the field staff correctly captured never
      // reached the server at all, let alone the report.
      const nameboardRadio = document.querySelector('input[name="pwaNameBoardRadio"]:checked');
      const nameboardVisible = nameboardRadio ? nameboardRadio.value : "";
      const buildingNature = document.getElementById("formBuildingNature") ? document.getElementById("formBuildingNature").value.trim() : "";
      const generalAppearance = document.getElementById("formGeneralAppearance") ? document.getElementById("formGeneralAppearance").value.trim() : "";
      const resLocality = document.getElementById("formLocality") ? document.getElementById("formLocality").value.trim() : "";
      const resSurroundings = document.getElementById("formSurroundings") ? document.getElementById("formSurroundings").value.trim() : "";
      const resEvidenceRadio = document.querySelector('input[name="pwaResEvidenceRadio"]:checked');
      const resEvidence = resEvidenceRadio ? resEvidenceRadio.value : "";

      const payload = {
        executive: exec,
        persona: persona,
        agent_selfie: agentSelfieDataUrl || localStorage.getItem("selfie_" + sampleCaseId) || null,
        agent_selfie_captured_at: localStorage.getItem("selfie_timestamp_" + sampleCaseId) || new Date().toISOString(),
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
        // Raw, lossless values for restoring the form's own inputs when this case is reopened
        // (the fields above are flattened/combined for the report, which loses information -
        // e.g. building_type above merges BHK into one string, family_members is a flat
        // textarea string, neighbours get split into two keys). Without these, switching away
        // from a case and back wiped every Residential Details & Family field blank even
        // though the data had been saved successfully - only photos persisted, because those
        // are restored from their own CaseDocument records, not from this form payload at all.
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
          family_members: familyMembers,
          active_asset_ids: visibleAssets.filter(a => a.active).map(a => a.id),
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

      const alertBox = document.getElementById("uploadAlert");
      const alertText = document.getElementById("uploadAlertText");
      alertBox.className = "p-3 rounded-lg bg-blue-50 border border-blue-200 text-primary-container text-xs flex items-center justify-between";
      alertBox.classList.remove("hidden");
      alertText.textContent = "Syncing Due Diligence Form to CA Verification Portal...";
      setUploadAlertIcon(true, "text-blue-600", "autorenew");

      // Shown right next to the Save button itself, scrolled into view, so the agent sees
      // confirmation at the exact spot they just tapped - not only in the shared status banner
      // two whole sections further down the page, which was easy to miss on a phone screen.
      const confirmBox = document.getElementById("formSubmitConfirm");
      const showSubmitConfirm = (cls, html) => {
        if (!confirmBox) return;
        confirmBox.className = `p-3 rounded-lg text-xs font-bold flex items-center gap-2 ${cls}`;
        confirmBox.innerHTML = html;
        confirmBox.classList.remove("hidden");
        confirmBox.scrollIntoView({ behavior: "smooth", block: "center" });
      };

      try {
        const res = await fetch(`/api/v1/visits/cases/${sampleCaseId}/field-form`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form_data: payload })
        });
        if (res.ok) {
          alertBox.className = "p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono shadow-sm animate-fade-in";
          alertText.innerHTML = `<b>✓ Data Uploaded Successfully!</b> ${bhk} ${bType} (${own}), ${stay} stay, ${visibleAssets.filter(a=>a.active).length} assets. Pushed to CA Portal for Scrutiny.`;
          setUploadAlertIcon(false, "text-emerald-600", "check_circle");
          const savedAt = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
          showSubmitConfirm(
            "bg-emerald-50 border border-emerald-300 text-emerald-900",
            `<span class="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span><span>Saved & synced to CA Portal at ${savedAt}</span>`
          );
          alert(`[✓] Due Diligence Form Synced Successfully!\nExecutive: ${exec}\nPersona: ${persona}\nProperty: ${bhk} ${bType} (${own})\nDuration of Stay: ${stay}\nAssets: ${assetsObserved}\nData has been pushed to CA Verification Desk.`);
        } else {
          localStorage.setItem(`field_form_${sampleCaseId}`, JSON.stringify(payload));
          alertBox.className = "p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono shadow-sm";
          alertText.innerHTML = `<b>✓ Cached Locally:</b> Form saved in PWA offline queue. Will auto-sync when online.`;
          setUploadAlertIcon(false, "text-amber-600", "cloud_off");
          showSubmitConfirm(
            "bg-amber-50 border border-amber-300 text-amber-900",
            `<span class="material-symbols-outlined text-[18px] text-amber-600">cloud_off</span><span>Saved on this phone - will sync to CA Portal once back online</span>`
          );
        }
      } catch (e) {
        localStorage.setItem(`field_form_${sampleCaseId}`, JSON.stringify(payload));
        alertBox.className = "p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono shadow-sm";
        alertText.innerHTML = `<b>✓ Offline Mode:</b> Form cached in PWA device storage. Will auto-sync when back in network.`;
        setUploadAlertIcon(false, "text-amber-600", "cloud_off");
        showSubmitConfirm(
          "bg-amber-50 border border-amber-300 text-amber-900",
          `<span class="material-symbols-outlined text-[18px] text-amber-600">cloud_off</span><span>Saved on this phone (offline) - will sync to CA Portal once back online</span>`
        );
        alert(`[✓ Offline Saved] Due Diligence Form cached locally on your device. It will auto-sync with the CA Office portal when you are back in network.`);
      }
    }

    // ==========================================
    // FIELD AGENT DYNAMIC CASE SWITCHER
    // ==========================================
    function switchPwaCase(key) {
      const isActualSwitch = key !== activeCaseKey;
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
      if (isActualSwitch) resetAllPwaPhotoSlotsUi();

      activeCaseKey = key;
      sampleCaseId = c.id; // undefined only when actually switching to an uncached case - safer than silently keeping the PREVIOUS case's real id while this screen shows blank/loading data
      TARGET_LAT = c.lat;
      TARGET_LON = c.lon;
      currentDeviceLat = c.dev_lat;
      currentDeviceLon = c.dev_lon;

      document.getElementById("caseNoDisplay").textContent = `CASE: ${c.case_no}`;
      document.getElementById("applicantNameDisplay").textContent = c.applicant;
      document.getElementById("loanAmountDisplay").textContent = c.amount;
      document.getElementById("targetAddressDisplay").textContent = c.address;
      document.getElementById("targetLatLonText").textContent = `${c.lat.toFixed(4)}° N`;
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
        document.getElementById("pwaDocAadhaarName").textContent = c.applicant;
        document.getElementById("pwaDocAadhaarNo").textContent = c.aadhaar_no || "Aadhaar: Pending AI scan";
        document.getElementById("pwaDocAadhaarDob").textContent = `DOB: ${c.dob || "Pending AI scan"}`;
      }
      if (document.getElementById("pwaDocPanName")) {
        document.getElementById("pwaDocPanName").textContent = c.applicant.toUpperCase();
        document.getElementById("pwaDocPanNo").textContent = `PAN: ${c.pan_no || "Pending AI scan"}`;
        document.getElementById("pwaDocPanWard").textContent = (c.father_name ? `Father: ${c.father_name}` : (c.ward ? `WARD: ${c.ward}` : ""));
      }
      if (document.getElementById("pwaDocUtilityProvider")) {
        document.getElementById("pwaDocUtilityProvider").textContent = c.utility_provider || "Electricity bill: Pending AI scan";
        document.getElementById("pwaDocUtilityNo").textContent = c.utility_no || "";
        document.getElementById("pwaDocUtilityMeter").textContent = c.meter_name || "";
      }

      // Update All Document Image Sources for the Active Case
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

      if (document.getElementById("pwaDocIncomeName")) {
        document.getElementById("pwaDocIncomeName").textContent = `Form 16 • ${c.applicant}`;
      }
      if (document.getElementById("pwaDocPropertyTitle")) {
        document.getElementById("pwaDocPropertyTitle").textContent = `Sale Deed (દસ્તાવેજ) • ${c.applicant}`;
        document.getElementById("pwaDocPropertyAddress").textContent = c.address;
      }

      // ==========================================
      // SYNCHRONIZE MODULE 2 (Residential & Family Inquiries) DYNAMICALLY
      // ==========================================
      const fName = document.getElementById("formApplicantName");
      if (fName) fName.value = c.applicant;
      const fPhone = document.getElementById("formContactNumber");
      if (fPhone) fPhone.value = c.phone || "";
      const fAge = document.getElementById("formAge");
      if (fAge) fAge.value = c.age || "";
      // Same stale-carryover bug as formCoMarital below: with no fallback here, switching to a
      // case whose Marital Status hadn't been set yet left whichever OTHER case's selection was
      // already showing, looking like a deliberate answer for this applicant.
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
      if (fOwn) fOwn.value = c.ownership || "";
      const fBType = document.getElementById("formBuildingType");
      if (fBType) fBType.value = c.building_type || "";
      const fBhk = document.getElementById("formBhk");
      if (fBhk) fBhk.value = c.bhk || "";
      const fStay = document.getElementById("formStayDuration");
      if (fStay) fStay.value = c.stay_period || "";
      const fOwner = document.getElementById("formOwnerName");
      if (fOwner) fOwner.value = c.owner_name || "";
      const fMet = document.getElementById("formPersonMet");
      const fMetRelation = document.getElementById("formPersonMetRelation");
      // c.person_met is the combined "Name - Phone (Relation)" string - split it back apart so
      // the Relation dropdown shows the right selection on reopen, not just dumped into the name
      // box as raw text.
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

      // Restore which "Assets Visible in Home" chips were previously tapped for this case.
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
      if (c.co_applicant_name) {
        if (coModule) coModule.classList.remove("hidden");
        if (coNameLabel) coNameLabel.textContent = c.co_applicant_name;
        setCoApplicantTabVisible(true);

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
        setCoApplicantTabVisible(false);
      }

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

      // Reset & restore slot states for Residence & Office Folders
      for (let i = 1; i <= 4; i++) {
        // 1. Residence Slot
        uploadedResidenceSlots[i] = false;
        const bRes = document.getElementById(`slot${i}Badge`);
        const btnRes = document.getElementById(`slot${i}BtnText`);
        const thumbRes = document.getElementById(`slot${i}Thumb`);
        const cachedRes = localStorage.getItem(`pwa_evidence_${sampleCaseId}_slot_${i}`) ||
                          (c.case_no ? localStorage.getItem(`pwa_evidence_${c.case_no}_slot_${i}`) : null);
        if (cachedRes) {
          try {
            const parsed = JSON.parse(cachedRes);
            uploadedResidenceSlots[i] = true;
            if (bRes) { bRes.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold"; bRes.textContent = "✓ UPLOADED"; }
            if (btnRes) btnRes.textContent = "Re-take Photo";
            if (thumbRes) thumbRes.innerHTML = `<img src="${parsed.src}" class="w-full h-full object-cover rounded-lg"/>`;
          } catch(e) {}
        } else {
          if (bRes) { bRes.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold"; bRes.textContent = "PENDING"; }
          if (btnRes) btnRes.textContent = "Capture Photo";
        }

        // 2. Office / Workplace Slot
        uploadedOfficeSlots[i] = false;
        const bOff = document.getElementById(`slotOffice${i}Badge`);
        const btnOff = document.getElementById(`slotOffice${i}BtnText`);
        const thumbOff = document.getElementById(`slotOffice${i}Thumb`);
        const cachedOff = localStorage.getItem(`pwa_evidence_${sampleCaseId}_office_slot_${i}`) ||
                          (c.case_no ? localStorage.getItem(`pwa_evidence_${c.case_no}_office_slot_${i}`) : null);
        if (cachedOff) {
          try {
            const parsed = JSON.parse(cachedOff);
            uploadedOfficeSlots[i] = true;
            if (bOff) { bOff.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold"; bOff.textContent = "✓ UPLOADED"; }
            if (btnOff) btnOff.textContent = "Re-take Photo";
            if (thumbOff) thumbOff.innerHTML = `<img src="${parsed.src}" class="w-full h-full object-cover rounded-lg"/>`;
          } catch(e) {}
        } else {
          if (bOff) { bOff.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold"; bOff.textContent = "PENDING"; }
          if (btnOff) btnOff.textContent = "Capture Photo";
        }

        // 3. Co-Applicant Office / Workplace Slot (dual-applicant cases only)
        uploadedCoOfficeSlots[i] = false;
        const bCoOff = document.getElementById(`slotCoOffice${i}Badge`);
        const btnCoOff = document.getElementById(`slotCoOffice${i}BtnText`);
        const thumbCoOff = document.getElementById(`slotCoOffice${i}Thumb`);
        const cachedCoOff = localStorage.getItem(`pwa_evidence_${sampleCaseId}_co_office_slot_${i}`) ||
                          (c.case_no ? localStorage.getItem(`pwa_evidence_${c.case_no}_co_office_slot_${i}`) : null);
        if (cachedCoOff) {
          try {
            const parsed = JSON.parse(cachedCoOff);
            uploadedCoOfficeSlots[i] = true;
            if (bCoOff) { bCoOff.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold"; bCoOff.textContent = "✓ UPLOADED"; }
            if (btnCoOff) btnCoOff.textContent = "Re-take Photo";
            if (thumbCoOff) thumbCoOff.innerHTML = `<img src="${parsed.src}" class="w-full h-full object-cover rounded-lg"/>`;
          } catch(e) {}
        } else {
          if (bCoOff) { bCoOff.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold"; bCoOff.textContent = "PENDING"; }
          if (btnCoOff) btnCoOff.textContent = "Capture Photo";
        }

        // 4. Co-Applicant Residence Slot (only when co-applicant has a separate home address)
        uploadedCoResidenceSlots[i] = false;
        const bCoRes = document.getElementById(`slotCoResidence${i}Badge`);
        const btnCoRes = document.getElementById(`slotCoResidence${i}BtnText`);
        const thumbCoRes = document.getElementById(`slotCoResidence${i}Thumb`);
        const cachedCoRes = localStorage.getItem(`pwa_evidence_${sampleCaseId}_co_residence_slot_${i}`) ||
                          (c.case_no ? localStorage.getItem(`pwa_evidence_${c.case_no}_co_residence_slot_${i}`) : null);
        if (cachedCoRes) {
          try {
            const parsed = JSON.parse(cachedCoRes);
            uploadedCoResidenceSlots[i] = true;
            if (bCoRes) { bCoRes.className = "font-mono text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-bold"; bCoRes.textContent = "✓ UPLOADED"; }
            if (btnCoRes) btnCoRes.textContent = "Re-take Photo";
            if (thumbCoRes) thumbCoRes.innerHTML = `<img src="${parsed.src}" class="w-full h-full object-cover rounded-lg"/>`;
          } catch(e) {}
        } else {
          if (bCoRes) { bCoRes.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold"; bCoRes.textContent = "PENDING"; }
          if (btnCoRes) btnCoRes.textContent = "Capture Photo";
        }
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
    async function populatePwaCaseSelector(token, currentKey, currentCaseNo, currentApplicantName, currentBranch) {
      const selector = document.getElementById("pwaCaseSelector");
      if (!selector) return;
      let myCases = null;
      if (token && token !== "demo-pwa-token") {
        try {
          const res = await fetch("/api/v1/cases", { headers: { "Authorization": `Bearer ${token}` } });
          if (res.ok) {
            const cases = await res.json();
            if (Array.isArray(cases) && cases.length > 0) myCases = cases;
          }
        } catch (e) {}
      }

      selector.innerHTML = "";
      const list = (myCases && myCases.length > 0) ? myCases : [{
        case_no: currentCaseNo, applicant_name: currentApplicantName, branch: currentBranch,
      }];
      list.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.case_no;
        opt.textContent = `[${c.case_no}] - ${c.applicant_name}${c.branch ? " (" + c.branch + ")" : ""}`;
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
      const caseLookup = paramCase || activeCaseKey || localStorage.getItem("pwa_active_case_key") || "UBI-HL-2026-531";
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
          // Show the REAL agent this case is assigned to on the server, not whoever happens to
          // be logged into this particular phone/browser right now - the two can drift apart
          // (a shared/demo login left over from earlier testing, a device handed to a different
          // field staffer, etc.), and the dashboard's "who did this visit" must always agree with
          // what the agent's own screen says. This is best-effort: a lookup failure silently
          // leaves whatever name is already showing in place.
          if (target.assigned_agent_id) {
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
          let parsedFormData = {};
          if (target.field_form_data) {
            try {
              parsedFormData = typeof target.field_form_data === 'string' ? JSON.parse(target.field_form_data) : target.field_form_data;
            } catch(e) {}
          }
          const off = parsedFormData.office_details || {};
          const occ = parsedFormData.occupation || off.position || off.occupation || "Job";
          const firm = off.firm_name || "";
          const pos = off.position || off.designation || "";
          // Falls back to the CA office's own pre-typed office_address on the case record (new
          // field, captured at case creation) until the agent has filled this in themselves on
          // site - gives the agent a starting reference instead of a blank field to guess from.
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
          // Co-applicant office details - a case only has these when target.co_applicant_name
          // is set server-side (dual-applicant case); the co-applicant's workplace is captured
          // entirely separately from the primary applicant's, since they're frequently different.
          const offCo = parsedFormData.office_details_co || {};
          const resCo = parsedFormData.residence_details_co || {};
          const itrAckNoSaved = parsedFormData.itr_acknowledgement_no || "";
          const itrFilingDateSaved = parsedFormData.itr_filing_date || "";
          const bankAccountStatusSaved = parsedFormData.bank_account_status || "";
          const bankAccountStatusCoSaved = parsedFormData.bank_account_status_co || "";
          // The lossless fields saved alongside the flattened report fields - see the
          // "restore" comment in submitDueDiligenceForm(). Without these, every Residential
          // Details & Family input went back to blank the moment the agent switched to a
          // different case and back, even though the form had already been submitted.
          const r = parsedFormData.restore || {};
          // Object.assign would otherwise overwrite an already-known value with `undefined`
          // for any case that has never had the form submitted (r is {}) - only patch in the
          // keys that actually came back from a real submission.
          const restorePatch = {};
          if (r.bhk !== undefined) restorePatch.bhk = r.bhk;
          if (r.building_type_only !== undefined) restorePatch.building_type = r.building_type_only;
          if (r.ownership !== undefined) restorePatch.ownership = r.ownership;
          if (r.period_of_stay !== undefined) restorePatch.stay_period = r.period_of_stay;
          if (r.owner_name !== undefined) restorePatch.owner_name = r.owner_name;
          if (r.marital_status !== undefined) restorePatch.marital = r.marital_status;
          if (r.age_community !== undefined) restorePatch.age = r.age_community;
          if (r.community !== undefined) restorePatch.community = r.community;
          if (r.qualification !== undefined) restorePatch.qualification = r.qualification;
          if (r.contact_number !== undefined) restorePatch.phone = r.contact_number;
          if (r.landmark !== undefined) restorePatch.landmark = r.landmark;
          if (r.person_met !== undefined) restorePatch.person_met = r.person_met;
          if (r.neighbors !== undefined) restorePatch.neighbors = r.neighbors;
          if (r.family_members !== undefined) restorePatch.family_members = r.family_members;
          if (r.active_asset_ids !== undefined) restorePatch.active_asset_ids = r.active_asset_ids;
          if (r.itr_acknowledgement_no !== undefined) restorePatch.itr_ack_no = r.itr_acknowledgement_no;
          if (r.itr_filing_date !== undefined) restorePatch.itr_filing_date = r.itr_filing_date;
          if (r.bank_account_status !== undefined) restorePatch.bank_account_status = r.bank_account_status;
          if (r.bank_account_status_co !== undefined) restorePatch.bank_account_status_co = r.bank_account_status_co;
          if (r.nameboard_visible !== undefined) restorePatch.nameboard_visible = r.nameboard_visible;
          if (r.building_nature !== undefined) restorePatch.building_nature = r.building_nature;
          if (r.general_appearance !== undefined) restorePatch.general_appearance = r.general_appearance;
          if (r.locality !== undefined) restorePatch.locality = r.locality;
          if (r.surroundings !== undefined) restorePatch.surroundings = r.surroundings;
          if (r.residence_evidence_obtained !== undefined) restorePatch.residence_evidence_obtained = r.residence_evidence_obtained;

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
            lat: target.target_lat,
            lon: target.target_lon,
            dev_lat: target.target_lat,
            dev_lon: target.target_lon,
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
            co_applicant_name: target.co_applicant_name || "",
            co_applicant_phone: target.co_applicant_phone || "",
            co_marital_status: offCo.marital_status || "",
            co_community: offCo.community || "",
            co_qualification: offCo.qualification || "",
            co_relation_to_applicant: offCo.relation_to_applicant || "",
            co_occupation: offCo.occupation || "Job",
            co_firm_name: offCo.firm_name || "",
            co_position: offCo.position || offCo.designation || "",
            // Falls back to the CA office's own pre-typed co_applicant_office_address on the
            // case record (captured at case creation, same reasoning as offAddr above) until
            // the agent has filled this in themselves on site.
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
          }, restorePatch);

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

          await populatePwaCaseSelector(token, key, target.case_no, target.applicant_name, target.branch);

          switchPwaCase(key);
          await loadCaseDocumentsIntoPwa(target.id);
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
    // always reflects every case actually allotted to this login, across devices and over time.
    async function openMyRecords() {
      const modal = document.getElementById("pwaMyRecordsModal");
      const body = document.getElementById("pwaMyRecordsBody");
      if (!modal || !body) return;
      modal.classList.remove("hidden");
      body.innerHTML = `<div class="text-center text-xs text-on-surface-variant py-8 font-mono">Loading your records...</div>`;

      const token = localStorage.getItem("pwa_token");
      if (!token || token === "demo-pwa-token") {
        body.innerHTML = `<div class="text-center text-xs text-on-surface-variant py-8 px-4 font-mono">
          Log in with your real agent account (not the demo link) to see your personal case records here.
        </div>`;
        return;
      }

      try {
        const res = await fetch("/api/v1/cases", { headers: { "Authorization": `Bearer ${token}` } });
        if (res.status === 401) {
          // The account behind this token was deactivated (or the token expired) since login.
          // Clear the stale session instead of leaving the agent looking "logged in" while every
          // API call silently fails.
          localStorage.removeItem("pwa_token");
          localStorage.removeItem("pwa_user");
          body.innerHTML = `<div class="text-center text-xs text-rose-700 py-8 px-4 font-mono">
            Your session is no longer valid (account deactivated or login expired).
            Please close this and log in again.
          </div>`;
          return;
        }
        if (!res.ok) throw new Error("fetch failed");
        const allCases = await res.json();
        // GET /api/v1/cases returns every case in the firm (the same endpoint the CA dashboard
        // uses) — this view's own heading promises "All cases ever assigned to you", so it must
        // be scoped to this agent's own assigned_agent_id, not shown unfiltered.
        let myUserId = null;
        try { myUserId = (JSON.parse(localStorage.getItem("pwa_user") || "{}") || {}).user_id || null; } catch (e) {}
        const cases = myUserId
          ? (Array.isArray(allCases) ? allCases.filter(c => c.assigned_agent_id === myUserId) : [])
          : allCases;
        if (!Array.isArray(cases) || cases.length === 0) {
          let dbgUser = {};
          try { dbgUser = JSON.parse(localStorage.getItem("pwa_user") || "{}") || {}; } catch (e) {}
          body.innerHTML = `<div class="text-center text-xs text-on-surface-variant py-8 px-4 font-mono">
            No cases have been assigned to you yet.
            <div class="mt-4 text-[9px] text-outline border-t border-outline-variant pt-3 break-all">
              Logged in as: ${(dbgUser.full_name || "unknown").replace(/</g, "&lt;")}<br/>
              Account ID: ${myUserId || "none"}<br/>
              Role: ${(dbgUser.role || "unknown")}<br/>
              Total cases visible to this account: ${Array.isArray(allCases) ? allCases.length : 0}
            </div>
          </div>`;
          return;
        }
        cases.sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));

        const rows = cases.map(c => {
          const meta = CASE_STATUS_LABELS[c.status] || { label: c.status || "Unknown", cls: "bg-slate-200 text-slate-700" };
          const isDone = CASE_DONE_STATUSES.has(c.status);
          const completionDate = isDone ? fmtRecordDate(c.updated_at) : "—";
          const safeApplicant = (c.applicant_name || "—").replace(/</g, "&lt;");
          const safeAddress = (c.target_address || "—").replace(/</g, "&lt;");
          const safeCaseNo = (c.case_no || "—").replace(/</g, "&lt;");
          const safeBank = (c.bank_name || "—").replace(/</g, "&lt;");
          return `
            <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 mb-2.5 shadow-sm">
              <div class="flex items-start justify-between gap-2 mb-1.5">
                <span class="font-mono text-[11px] font-bold text-primary">${safeCaseNo}</span>
                <span class="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${meta.cls}">${meta.label}</span>
              </div>
              <div class="text-xs font-semibold text-on-surface mb-0.5">${safeApplicant}</div>
              <div class="text-[10px] text-on-surface-variant leading-snug mb-1.5">${safeAddress}</div>
              <div class="flex items-center justify-between text-[10px] font-mono text-on-surface-variant border-t border-outline-variant pt-1.5">
                <span>${safeBank}</span>
                <span>${isDone ? "Completed: " + completionDate : "Assigned: " + fmtRecordDate(c.created_at)}</span>
              </div>
            </div>`;
        }).join("");

        const doneCount = cases.filter(c => CASE_DONE_STATUSES.has(c.status)).length;
        body.innerHTML = `
          <div class="text-[10px] font-mono text-on-surface-variant mb-3 px-1">
            ${cases.length} case(s) total · ${doneCount} completed by you
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

    // Fetches every document the CA office has scanned (via Gemini AI) for this case —
    // real content, never a filename guess — and overlays it onto the document cards
    // plus the full "All Case Documents" gallery.
    async function loadCaseDocumentsIntoPwa(caseId) {
      try {
        const res = await fetch(`/api/v1/cases/${caseId}/documents`);
        if (!res.ok) return;
        const docs = await res.json();
        if (!Array.isArray(docs) || docs.length === 0) {
          renderAllCaseDocumentsGallery([]);
          return;
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

          // Re-render the currently visible case so the real scanned documents show up
          switchPwaCase(activeCaseKey);
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
        // tagged slot_number > 4, which is a genuine "Additional Photo" and must never steal a
        // mandatory slot just because that slot happens to still be empty.
        residenceDocs.forEach(d => {
          const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
          if (explicitSlot && explicitSlot > 4) return;
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
            if (thumbRes) thumbRes.innerHTML = `<img src="${d.url}" class="w-full h-full object-cover rounded-lg"/>`;
            try {
              const resPayload = JSON.stringify({
                src: d.url,
                timestamp: d.created_at || "Verified on Server",
                lat: d.latitude || 23.2154,
                lon: d.longitude || 72.6367,
                doc_type: d.doc_type
              });
              localStorage.setItem(cacheKey1, resPayload);
              localStorage.setItem(cacheKey2, resPayload);
            } catch(e) {}
          } else {
            // No server document for this slot right now. Only clear the cached "uploaded" badge
            // if what's cached was itself a server-confirmed photo (a /storage/... URL) that has
            // since been deleted server-side (e.g. a misfiled duplicate removed from the CA
            // dashboard) - never touch a locally-captured-but-not-yet-synced photo (a blob:/data:
            // URL from the camera), which is real pending field work waiting to sync, not stale cache.
            let cached = null;
            try { cached = JSON.parse(localStorage.getItem(cacheKey2) || localStorage.getItem(cacheKey1) || "null"); } catch (e) {}
            if (cached && typeof cached.src === "string" && cached.src.startsWith("/storage/")) {
              localStorage.removeItem(cacheKey1);
              localStorage.removeItem(cacheKey2);
              uploadedResidenceSlots[s] = false;
              uploadedSlots[s] = false;
              const bRes = document.getElementById(`slot${s}Badge`);
              const btnRes = document.getElementById(`slot${s}BtnText`);
              const thumbRes = document.getElementById(`slot${s}Thumb`);
              if (bRes) {
                bRes.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold";
                bRes.textContent = "PENDING";
              }
              if (btnRes) btnRes.textContent = "Capture Photo";
              if (thumbRes) thumbRes.innerHTML = `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
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

        // Any unassigned workplace docs fill remaining empty slots - except explicit "Additional
        // Photo" uploads (slot_number > 4), which must never steal a still-empty mandatory slot.
        officeDocs.forEach(d => {
          const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
          if (explicitSlot && explicitSlot > 4) return;
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
            if (thumbOff) thumbOff.innerHTML = `<img src="${d.url}" class="w-full h-full object-cover rounded-lg"/>`;
            try {
              const offPayload = JSON.stringify({
                src: d.url,
                timestamp: d.created_at || "Verified on Server",
                lat: d.latitude || 23.2154,
                lon: d.longitude || 72.6367,
                doc_type: d.doc_type
              });
              localStorage.setItem(offCacheKey1, offPayload);
              localStorage.setItem(offCacheKey2, offPayload);
            } catch(e) {}
          } else {
            // Same "only clear a server-confirmed photo that's since been deleted, never a
            // locally-captured-but-unsynced one" rule as the residence slots above.
            let cached = null;
            try { cached = JSON.parse(localStorage.getItem(offCacheKey2) || localStorage.getItem(offCacheKey1) || "null"); } catch (e) {}
            if (cached && typeof cached.src === "string" && cached.src.startsWith("/storage/")) {
              localStorage.removeItem(offCacheKey1);
              localStorage.removeItem(offCacheKey2);
              uploadedOfficeSlots[s] = false;
              const bOff = document.getElementById(`slotOffice${s}Badge`);
              const btnOff = document.getElementById(`slotOffice${s}BtnText`);
              const thumbOff = document.getElementById(`slotOffice${s}Thumb`);
              if (bOff) {
                bOff.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold";
                bOff.textContent = "PENDING";
              }
              if (btnOff) btnOff.textContent = "Capture Photo";
              if (thumbOff) thumbOff.innerHTML = `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
            }
          }
        }
        restoreExtraPhotosForFolder('office', officeDocs, serverOffSlotMap);

        // 3. Restore Co-Applicant Office / Workplace Slots - same server-authoritative pass as
        // the applicant's own Office slots above. Without this, these slots only ever checked
        // localStorage (switchPwaCase's cachedCoOff lookup), so a cleared cache, a different
        // device, or simply enough time passing made successfully-uploaded, server-stored
        // co-applicant office photos show as PENDING again after a refresh, even though the CA
        // dashboard (which reads straight from the server) still showed them correctly.
        const serverCoOffSlotMap = { 1: null, 2: null, 3: null, 4: null };
        coOfficeDocs.forEach((d, idx) => {
          const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
          if (explicitSlot && explicitSlot > 4) return; // genuine "Additional Photo" - never a mandatory slot
          const s = getOffSlot(d, idx + 1);
          if (s >= 1 && s <= 4 && !serverCoOffSlotMap[s]) {
            serverCoOffSlotMap[s] = d;
          }
        });
        coOfficeDocs.forEach(d => {
          const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
          if (explicitSlot && explicitSlot > 4) return;
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
            if (thumbCoOff) thumbCoOff.innerHTML = `<img src="${d.url}" class="w-full h-full object-cover rounded-lg"/>`;
            try {
              const coOffPayload = JSON.stringify({
                src: d.url,
                timestamp: d.created_at || "Verified on Server",
                lat: d.latitude || 23.2154,
                lon: d.longitude || 72.6367,
                doc_type: d.doc_type
              });
              localStorage.setItem(coOffCacheKey1, coOffPayload);
              localStorage.setItem(coOffCacheKey2, coOffPayload);
            } catch(e) {}
          } else {
            let cached = null;
            try { cached = JSON.parse(localStorage.getItem(coOffCacheKey2) || localStorage.getItem(coOffCacheKey1) || "null"); } catch (e) {}
            if (cached && typeof cached.src === "string" && cached.src.startsWith("/storage/")) {
              localStorage.removeItem(coOffCacheKey1);
              localStorage.removeItem(coOffCacheKey2);
              uploadedCoOfficeSlots[s] = false;
              const bCoOff = document.getElementById(`slotCoOffice${s}Badge`);
              const btnCoOff = document.getElementById(`slotCoOffice${s}BtnText`);
              const thumbCoOff = document.getElementById(`slotCoOffice${s}Thumb`);
              if (bCoOff) {
                bCoOff.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold";
                bCoOff.textContent = "PENDING";
              }
              if (btnCoOff) btnCoOff.textContent = "Capture Photo";
              if (thumbCoOff) thumbCoOff.innerHTML = `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
            }
          }
        }
        restoreExtraPhotosForFolder('co_office', coOfficeDocs, serverCoOffSlotMap);

        // 4. Restore Co-Applicant Residence Slots - same server-authoritative pass, only
        // relevant when the co-applicant has their own separate home address on the case.
        const serverCoResSlotMap = { 1: null, 2: null, 3: null, 4: null };
        coResidenceDocs.forEach((d, idx) => {
          const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
          if (explicitSlot && explicitSlot > 4) return; // genuine "Additional Photo" - never a mandatory slot
          const s = getResSlot(d, idx + 1);
          if (s >= 1 && s <= 4 && !serverCoResSlotMap[s]) {
            serverCoResSlotMap[s] = d;
          }
        });
        coResidenceDocs.forEach(d => {
          const explicitSlot = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
          if (explicitSlot && explicitSlot > 4) return;
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
            if (thumbCoRes) thumbCoRes.innerHTML = `<img src="${d.url}" class="w-full h-full object-cover rounded-lg"/>`;
            try {
              const coResPayload = JSON.stringify({
                src: d.url,
                timestamp: d.created_at || "Verified on Server",
                lat: d.latitude || 23.2154,
                lon: d.longitude || 72.6367,
                doc_type: d.doc_type
              });
              localStorage.setItem(coResCacheKey1, coResPayload);
              localStorage.setItem(coResCacheKey2, coResPayload);
            } catch(e) {}
          } else {
            let cached = null;
            try { cached = JSON.parse(localStorage.getItem(coResCacheKey2) || localStorage.getItem(coResCacheKey1) || "null"); } catch (e) {}
            if (cached && typeof cached.src === "string" && cached.src.startsWith("/storage/")) {
              localStorage.removeItem(coResCacheKey1);
              localStorage.removeItem(coResCacheKey2);
              uploadedCoResidenceSlots[s] = false;
              const bCoRes = document.getElementById(`slotCoResidence${s}Badge`);
              const btnCoRes = document.getElementById(`slotCoResidence${s}BtnText`);
              const thumbCoRes = document.getElementById(`slotCoResidence${s}Thumb`);
              if (bCoRes) {
                bCoRes.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold";
                bCoRes.textContent = "PENDING";
              }
              if (btnCoRes) btnCoRes.textContent = "Capture Photo";
              if (thumbCoRes) thumbCoRes.innerHTML = `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
            }
          }
        }
        restoreExtraPhotosForFolder('co_residence', coResidenceDocs, serverCoResSlotMap);

        // 5. Restore Applicant 3/4/5 Residence Slots - same server-authoritative pass as
        // Co-Applicant Residence above, one static folder per extra applicant slot.
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
            if (explicitSlot && explicitSlot > 4) return;
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
              if (thumbHome) thumbHome.innerHTML = `<img src="${d.url}" class="w-full h-full object-cover rounded-lg"/>`;
              try {
                const homePayload = JSON.stringify({
                  src: d.url,
                  timestamp: d.created_at || "Verified on Server",
                  lat: d.latitude || 23.2154,
                  lon: d.longitude || 72.6367,
                  doc_type: d.doc_type
                });
                localStorage.setItem(homeCacheKey1, homePayload);
                localStorage.setItem(homeCacheKey2, homePayload);
              } catch(e) {}
            } else {
              let cached = null;
              try { cached = JSON.parse(localStorage.getItem(homeCacheKey2) || localStorage.getItem(homeCacheKey1) || "null"); } catch (e) {}
              if (cached && typeof cached.src === "string" && cached.src.startsWith("/storage/")) {
                localStorage.removeItem(homeCacheKey1);
                localStorage.removeItem(homeCacheKey2);
                homeSlotsMapRef[s] = false;
                const bHome = document.getElementById(`slotHome${slotNum}${s}Badge`);
                const btnHome = document.getElementById(`slotHome${slotNum}${s}BtnText`);
                const thumbHome = document.getElementById(`slotHome${slotNum}${s}Thumb`);
                if (bHome) {
                  bHome.className = "font-mono text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold";
                  bHome.textContent = "PENDING";
                }
                if (btnHome) btnHome.textContent = "Capture Photo";
                if (thumbHome) thumbHome.innerHTML = `<span class="material-symbols-outlined text-[22px]">photo_camera</span>`;
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
          agentSelfieDataUrl = serverSelfie.url;
          const previewImg = document.getElementById("agentSelfiePreview") || document.getElementById("selfiePreview");
          const placeholder = document.getElementById("agentSelfiePlaceholder") || document.getElementById("selfiePlaceholder");
          const wmTag = document.getElementById("selfieWatermarkTag");
          const badge = document.getElementById("selfieStatusBadge") || document.getElementById("selfieVerifiedBadge");
          const btnText = document.getElementById("selfieBtnText") || document.getElementById("btnSelfieText");
          const metaInfo = document.getElementById("selfieMetaInfo");
          const tsText = document.getElementById("selfieTimestampText");
          const agentText = document.getElementById("selfieAgentNameText");

          if (previewImg) {
            previewImg.src = serverSelfie.url;
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
            localStorage.setItem("selfie_" + sampleCaseId, serverSelfie.url);
            localStorage.setItem("selfie_" + activeCaseKey, serverSelfie.url);
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
      const section = document.getElementById("pwaAllDocsSection");
      const grid = document.getElementById("pwaAllDocsGrid");
      const countEl = document.getElementById("pwaAllDocsCount");
      if (!section || !grid) return;

      if (!docs || docs.length === 0) {
        section.classList.add("hidden");
        return;
      }

      // Built with textContent: titles come from AI-read document text.
      grid.innerHTML = "";
      docs.forEach(d => {
        const od = d.ocr_data || {};
        const failed = od.scan_status === "FAILED";
        const other = od.relationship_to_applicant === "DIFFERENT_PERSON";
        const title = failed ? "Not scanned" : `${od.document_title || d.doc_type}${other && od.holder_name ? " — " + od.holder_name : ""}`;
        const item = document.createElement("div");
        item.className = "rounded-lg overflow-hidden border border-outline-variant bg-slate-900 cursor-pointer group shadow-xs";
        item.title = title;
        item.onclick = () => window.open(d.url, "_blank", "noopener");

        const frame = document.createElement("div");
        frame.className = "w-full h-16 overflow-hidden bg-slate-800";
        const img = document.createElement("img");
        img.src = d.url; img.alt = title; img.loading = "lazy";
        img.className = "w-full h-full object-cover group-hover:scale-105 transition-transform";
        frame.appendChild(img);

        const cap = document.createElement("div");
        cap.className = "px-1 py-0.5 " + (failed ? "bg-red-900" : other ? "bg-orange-900" : "bg-black/80");
        const span = document.createElement("span");
        span.className = "text-[8px] font-mono text-white truncate block";
        span.textContent = title;
        cap.appendChild(span);

        item.appendChild(frame);
        item.appendChild(cap);
        grid.appendChild(item);
      });

      if (countEl) countEl.textContent = `${docs.length} DOCS`;
      section.classList.remove("hidden");
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
      if (!token || token === "demo-pwa-token") return null;
      try {
        const res = await fetch("/api/v1/cases", { headers: { "Authorization": `Bearer ${token}` } });
        if (!res.ok) return null;
        const cases = await res.json();
        if (!Array.isArray(cases) || cases.length === 0) return null;
        const active = cases.find(c => c.status && c.status !== "CERTIFIED");
        return (active || cases[0]).case_no || null;
      } catch (e) {
        return null;
      }
    }

    async function checkAgentAuth() {
      const urlParams = new URLSearchParams(window.location.search);
      const explicitCase = urlParams.get("case") || urlParams.get("case_id");
      let paramCase = explicitCase || localStorage.getItem("pwa_active_case_key") || "UBI-HL-2026-531";

      const token = localStorage.getItem("pwa_token");
      const modal = document.getElementById("agentLoginModal");

      const userJson = localStorage.getItem("pwa_user");
      if (userJson) {
        try {
          const u = JSON.parse(userJson);
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

      // Step 1: Immediately render the active case and restore from localStorage (instant display, zero blank screen)
      switchPwaCase(paramCase);

      // No case-specific dispatch link was opened - the agent just hit their bare /pwa
      // bookmark, so whatever is cached in localStorage could be a stale prior assignment.
      // Ask the server which case is actually allotted to this agent right now and prefer
      // that over the cache before loading anything further.
      if (!explicitCase) {
        const currentAssigned = await resolveCurrentAgentCaseNo(token);
        if (currentAssigned && currentAssigned !== paramCase) {
          paramCase = currentAssigned;
          switchPwaCase(paramCase);
        }
      }

      // Step 2: Try fetching updated case dossier from Railway server
      let caseResolved = false;
      try {
        caseResolved = await loadAssignedCaseForAgent(token, paramCase);
      } catch(e) {}

      // Step 3: Guarantee all documents and photo slots are restored from Railway server & saved to local storage.
      // Only do this when the case was actually resolved this run, OR the agent opened the
      // bare /pwa link with no explicit case (a legitimate "resume whatever I had open last"
      // case) - never after a dispatch link's case lookup failed, which would otherwise show
      // documents belonging to a DIFFERENT, previously-open case under the new link.
      const hasExplicitCaseParam = !!(urlParams.get("case") || urlParams.get("case_id"));
      if (caseResolved || !hasExplicitCaseParam) {
        await loadCaseDocumentsIntoPwa(sampleCaseId);
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
    });
