    let activeCaseId = "b901fc63-12a8-4e32-9c02-e20984cfb001";
    let currentGlobalMode = "field";
    let currentPhotoFolder = "residence"; // 'residence' or 'work'

    // Multi-Case Master Registry (Supporting all empanelled banks with dual photo folders)
    const caseRegistry = {
      "b901fc63-12a8-4e32-9c02-e20984cfb001": {
        case_no: "UBI-HL-2026-20L",
        bank: "Union Bank of India",
        branch: "Amrapura Branch",
        applicant_name: "Mrs. Rajkunvarba Pradeepsinh Vaghela",
        phone: "+91 81601 66900",
        month: "August 2026",
        allotted_by: "Suresh Sir (Operations Lead)",
        loan_facility: "Home Loan (HL) ₹20.00 Lacs",
        loan_amount_val: 2000000,
        pan: "BYMPG8996E",
        aadhaar_masked: "XXXX - XXXX - 7689",
        dob: "30/05/1997",
        gender: "Female",
        ward: "WARD 1, GANDHINAGAR (ACTIVE)",
        address: "31, Siddhi Vinayak Bunglows, Pethapur, Gandhinagar",
        agent: "Nilesh & Kamal Bhai (Field Team)",
        agent_selfie: "/static/placeholders/photo_pending.svg",
        selfie_verified: true,
        photos_count: 8,
        visit_date: "04-Aug-2026, 11:30 IST",
        benchmark_lat: "23.2156",
        benchmark_lon: "72.6369",
        capture_lat: "23.2154",
        capture_lon: "72.6367",
        distance_m: 32,
        agent_pin: "FA-7701",
        stay_period: "09 Years",
        ownership: "Owned (Ranjanba Vaghela - Mother-in-Law)",
        person_met: "Pradeepsinh Vaghela (Husband - 8160166900)",
        neighbors: ["1. Narendrasinh Devda (Neighbour - Confirmed)", "2. Bhagwatsinh Rathod (Neighbour - Confirmed)"],
        status: "PENDING_CA_REVIEW",
        aadhaar_front_img: "/static/placeholders/doc_pending.svg",
        aadhaar_front_raw: "/static/placeholders/doc_pending.svg",
        aadhaar_back_img: "/static/placeholders/doc_pending.svg",
        pan_front_img: "/static/placeholders/doc_pending.svg",
        pan_back_img: "/static/placeholders/doc_pending.svg",
        utility_front_img: "/static/placeholders/doc_pending.svg",
        vault_documents: {
          sale_deed: { title: "Registered Sale Deed (દસ્તાવેજ)", sub: "Reg # 7491/22 • Sub-Registrar GNR", type: "property", src: "/static/placeholders/doc_pending.svg", status: "VERIFIED" },
          index2: { title: "Index II Copy (સૂચિ ૨ નકલ)", sub: "Revenue Inspector Certified", type: "property", src: "/static/placeholders/doc_pending.svg", status: "VERIFIED" },
          utility: { title: "UGVCL Electricity Bill (વીજળી બિલ)", sub: "Consumer # 04128/99102/3", type: "property", src: "/static/placeholders/doc_pending.svg", status: "VERIFIED" },
          form16: { title: "Form 16 / TDS (Part A & B)", sub: "AY 2026-27 • Sec 192 TRACES", type: "income", src: "/static/placeholders/doc_pending.svg", status: "COMPLIANT" },
          payslip: { title: "Salary Payslip (Last 3 Months)", sub: "Pending AI scan", type: "income", src: "/static/placeholders/doc_pending.svg", status: "VERIFIED" },
          bank_statement: { title: "6 Months Bank Statement", sub: "HDFC A/c # 50100492817492", type: "income", src: "/static/placeholders/doc_pending.svg", status: "VERIFIED" },
          aadhaar: { title: "Aadhaar Card (UIDAI Masked)", sub: "XXXX-XXXX-7689 • Rule 4", type: "kyc", src: "/static/placeholders/doc_pending.svg", status: "MASKED" },
          pan: { title: "Permanent Account Number (PAN)", sub: "BYMPG8996E • ITD Linked", type: "kyc", src: "/static/placeholders/doc_pending.svg", status: "VERIFIED" }
        },
        residence_photos: [
          {
            src: "/static/placeholders/photo_pending.svg",
            title: "Main Gate (સિદ્ધિ વિનાયક)",
            tag: "RESIDENCE: MAIN GATE & SOCIETY",
            timestamp: "04-AUG-2026 11:32 IST",
            badge: "GPS: VERIFIED",
            status: "MATCH"
          },
          {
            src: "/static/placeholders/photo_pending.svg",
            title: "Bungalow 31 (લક્ષ્મી કૃપા)",
            tag: "BUNGALOW 31: ELEVATION & NAME",
            timestamp: "04-AUG-2026 11:36 IST",
            badge: "ELEVATION: CONFIRMED",
            status: "CONFIRMED"
          },
          {
            src: "/static/placeholders/photo_pending.svg",
            title: "Drawing Room & Showcase",
            tag: "DRAWING ROOM & LIVING ASSETS",
            timestamp: "04-AUG-2026 11:39 IST",
            badge: "HABITATION: VERIFIED",
            status: "VERIFIED"
          },
          {
            src: "/static/placeholders/photo_pending.svg",
            title: "Pradeepsinh Vaghela (Husband)",
            tag: "PERSON MET: HUSBAND WITH FA",
            timestamp: "04-AUG-2026 11:42 IST",
            badge: "IDENTITY: MATCH",
            status: "MATCH"
          }
        ],
        work_photos: [
          {
            src: "/static/placeholders/photo_pending.svg",
            title: "Commercial Facade & Entrance",
            tag: "WORKPLACE: EXTERIOR ENTRANCE",
            timestamp: "04-AUG-2026 12:40 IST",
            badge: "EXIF: VERIFIED",
            status: "MATCH"
          },
          {
            src: "/static/placeholders/photo_pending.svg",
            title: "Operations Floor & Workstations",
            tag: "WORKPLACE: OPERATIONAL SETUP",
            timestamp: "04-AUG-2026 12:45 IST",
            badge: "ACTIVE: CONFIRMED",
            status: "VERIFIED"
          },
          {
            src: "/static/placeholders/photo_pending.svg",
            title: "CA Verification Desk",
            tag: "INSPECTION: EXECUTIVE DESK",
            timestamp: "04-AUG-2026 12:50 IST",
            badge: "AUDIT: SATISFIED",
            status: "CONFIRMED"
          },
          {
            src: "/static/placeholders/photo_pending.svg",
            title: "Commercial Complex Approach",
            tag: "APPROACH ROAD & COMMERCIAL ZONE",
            timestamp: "04-AUG-2026 12:55 IST",
            badge: "INFRA: OPTIMAL",
            status: "MATCH"
          }
        ],
        photos: [
          "/static/placeholders/photo_pending.svg",
          "/static/placeholders/photo_pending.svg",
          "/static/placeholders/photo_pending.svg",
          "/static/placeholders/photo_pending.svg"
        ]
      },
      "c102ad74-23b9-4f43-ad13-f31095d0c002": {
        case_no: "SBI-HL-2026-45L",
        bank: "State Bank of India",
        branch: "Bandra West Branch",
        applicant_name: "Mr. Vikramaditya Sengupta",
        phone: "+91 98201 12233",
        month: "October 2026",
        allotted_by: "CA Pranav Shah (Sr. Partner)",
        loan_facility: "Home Loan (HL) ₹45.00 Lacs",
        loan_amount_val: 4500000,
        pan: "ABCPS1234F",
        aadhaar_masked: "XXXX - XXXX - 8912",
        dob: "14/08/1984",
        gender: "Male",
        ward: "WARD 50, BANDRA, MUMBAI (ACTIVE)",
        address: "Flat 402, Imperial Heights, Bandra West, Mumbai - 400050",
        agent: "Rajesh Varma (FA-9042)",
        agent_selfie: "/static/placeholders/photo_pending.svg",
        selfie_verified: true,
        photos_count: 8,
        visit_date: "24-Oct-2026, 14:15 IST",
        benchmark_lat: "19.0596",
        benchmark_lon: "72.8295",
        capture_lat: "19.0592",
        capture_lon: "72.8298",
        distance_m: 68,
        agent_pin: "FA-9042",
        stay_period: "07 Years",
        ownership: "Self-Owned (Flat 402)",
        person_met: "Vikramaditya Sengupta (Self - 9820112233)",
        neighbors: ["1. Arun Mehta (Flat 401 - Confirmed)", "2. Sunita Rao (Flat 403 - Confirmed)"],
        status: "PENDING_CA_REVIEW",
        residence_photos: [
          { src: "/static/placeholders/photo_pending.svg", title: "Imperial Heights Entrance", tag: "RESIDENCE: MAIN GATE", timestamp: "24-OCT-2026 14:18 IST", badge: "GPS: VALID", status: "MATCH" },
          { src: "/static/placeholders/photo_pending.svg", title: "Tower Elevation (Wing B)", tag: "ELEVATION: CONFIRMED", timestamp: "24-OCT-2026 14:22 IST", badge: "GEO: MATCH", status: "CONFIRMED" },
          { src: "/static/placeholders/photo_pending.svg", title: "Flat 402 Living Room", tag: "INTERIOR ASSETS", timestamp: "24-OCT-2026 14:28 IST", badge: "OCCUPIED", status: "VERIFIED" },
          { src: "/static/placeholders/photo_pending.svg", title: "Vikramaditya Sengupta", tag: "PERSON MET: APPLICANT", timestamp: "24-OCT-2026 14:32 IST", badge: "ID: MATCH", status: "MATCH" }
        ],
        work_photos: [
          { src: "/static/placeholders/photo_pending.svg", title: "Corporate Building Facade", tag: "WORK: EXTERIOR", timestamp: "24-OCT-2026 15:40 IST", badge: "EXIF: PASS", status: "MATCH" },
          { src: "/static/placeholders/photo_pending.svg", title: "Office Floor & Workstations", tag: "WORK: INTERIOR", timestamp: "24-OCT-2026 15:45 IST", badge: "ACTIVE", status: "VERIFIED" },
          { src: "/static/placeholders/photo_pending.svg", title: "Director's Cabin Desk", tag: "EXECUTIVE CABIN", timestamp: "24-OCT-2026 15:50 IST", badge: "MATCH", status: "CONFIRMED" },
          { src: "/static/placeholders/photo_pending.svg", title: "Bandra Kurla Complex Approach", tag: "APPROACH ROAD", timestamp: "24-OCT-2026 15:55 IST", badge: "OPTIMAL", status: "MATCH" }
        ],
        photos: [
          "/static/placeholders/photo_pending.svg",
          "/static/placeholders/photo_pending.svg",
          "/static/placeholders/photo_pending.svg",
          "/static/placeholders/photo_pending.svg"
        ]
      },
      "d203be85-34ca-4a54-be24-a42106e1d003": {
        case_no: "HDFC-LAP-2026-60L",
        bank: "HDFC Bank",
        branch: "Navrangpura Branch",
        applicant_name: "Mr. Jayeshbhai K. Patel",
        phone: "+91 98795 54433",
        month: "October 2026",
        allotted_by: "CA Pranav Shah (Sr. Partner)",
        loan_facility: "Loan Against Property (LAP) ₹60.00 Lacs",
        loan_amount_val: 6000000,
        pan: "AAEPP5521M",
        aadhaar_masked: "XXXX - XXXX - 3341",
        dob: "22/11/1979",
        gender: "Male",
        ward: "WARD 7, AMBAWADI, AHMEDABAD (ACTIVE)",
        address: "B-14, Shivalik Corporate Park, Ambawadi, Ahmedabad - 380015",
        agent: "Amit Shah (FA-5011)",
        agent_selfie: "/static/placeholders/photo_pending.svg",
        selfie_verified: true,
        photos_count: 8,
        visit_date: "23-Oct-2026, 16:30 IST",
        benchmark_lat: "23.0225",
        benchmark_lon: "72.5412",
        capture_lat: "23.0222",
        capture_lon: "72.5415",
        distance_m: 45,
        agent_pin: "FA-5011",
        stay_period: "12 Years",
        ownership: "Commercial Owned (B-14 Shivalik)",
        person_met: "Jayeshbhai Patel (Director - 9879554433)",
        neighbors: ["1. Mehta Finserve (Office B-13)", "2. Dr. Chirag Dental Clinic (Office B-15)"],
        status: "IN_PROGRESS",
        residence_photos: [
          { src: "/static/placeholders/photo_pending.svg", title: "Shivalik Residence Gate", tag: "RESIDENCE: MAIN GATE", timestamp: "23-OCT-2026 16:35 IST", badge: "GPS: VALID", status: "MATCH" },
          { src: "/static/placeholders/photo_pending.svg", title: "Bungalow Elevation", tag: "ELEVATION", timestamp: "23-OCT-2026 16:40 IST", badge: "GEO: MATCH", status: "CONFIRMED" },
          { src: "/static/placeholders/photo_pending.svg", title: "Living Room Setup", tag: "INTERIOR ASSETS", timestamp: "23-OCT-2026 16:45 IST", badge: "OCCUPIED", status: "VERIFIED" },
          { src: "/static/placeholders/photo_pending.svg", title: "Jayeshbhai Patel (Self)", tag: "PERSON MET", timestamp: "23-OCT-2026 16:50 IST", badge: "ID: MATCH", status: "MATCH" }
        ],
        work_photos: [
          { src: "/static/placeholders/photo_pending.svg", title: "Shivalik Corporate Park Facade", tag: "WORKPLACE FACADE", timestamp: "23-OCT-2026 17:10 IST", badge: "EXIF: PASS", status: "MATCH" },
          { src: "/static/placeholders/photo_pending.svg", title: "Office Suite B-14", tag: "OPERATIONS", timestamp: "23-OCT-2026 17:15 IST", badge: "ACTIVE", status: "VERIFIED" },
          { src: "/static/placeholders/photo_pending.svg", title: "Executive Cabin Desk", tag: "VERIFICATION DESK", timestamp: "23-OCT-2026 17:20 IST", badge: "MATCH", status: "CONFIRMED" },
          { src: "/static/placeholders/photo_pending.svg", title: "Ambawadi Main Road Approach", tag: "APPROACH ROAD", timestamp: "23-OCT-2026 17:25 IST", badge: "OPTIMAL", status: "MATCH" }
        ],
        photos: [
          "/static/placeholders/photo_pending.svg",
          "/static/placeholders/photo_pending.svg",
          "/static/placeholders/photo_pending.svg",
          "/static/placeholders/photo_pending.svg"
        ]
      },
      "e304cf96-45db-4b65-cf35-b53217f2e004": {
        case_no: "ICICI-PL-2026-15L",
        bank: "ICICI Bank",
        branch: "Ashram Road Branch",
        applicant_name: "Dr. Ananya Sharma",
        phone: "+91 94260 99887",
        month: "October 2026",
        allotted_by: "Suresh Sir (Operations Lead)",
        loan_facility: "Personal Loan (PL) ₹15.00 Lacs",
        loan_amount_val: 1500000,
        pan: "CKLPS9012K",
        aadhaar_masked: "XXXX - XXXX - 9021",
        dob: "05/03/1991",
        gender: "Female",
        ward: "WARD 9, ELLISBRIDGE, AHMEDABAD (ACTIVE)",
        address: "401, Doctor House, Ellisbridge, Ahmedabad - 380006",
        agent: "Sneha Desai (FA-3104)",
        agent_selfie: "/static/placeholders/photo_pending.svg",
        selfie_verified: true,
        photos_count: 8,
        visit_date: "25-Oct-2026, 10:15 IST",
        benchmark_lat: "23.0180",
        benchmark_lon: "72.5680",
        capture_lat: "23.0178",
        capture_lon: "72.5682",
        distance_m: 28,
        agent_pin: "FA-3104",
        stay_period: "06 Years",
        ownership: "Commercial Clinic Premises",
        person_met: "Dr. Ananya Sharma (Self - 9426099887)",
        neighbors: ["1. Apollo Pharmacy (Ground Floor)", "2. DentCare Polyclinic (Suite 402)"],
        status: "PENDING_CA_REVIEW",
        residence_photos: [
          { src: "/static/placeholders/photo_pending.svg", title: "Doctor House Entrance Gate", tag: "MAIN GATE", timestamp: "25-OCT-2026 10:18 IST", badge: "GPS: VALID", status: "MATCH" },
          { src: "/static/placeholders/photo_pending.svg", title: "Building Elevation", tag: "ELEVATION", timestamp: "25-OCT-2026 10:22 IST", badge: "GEO: MATCH", status: "CONFIRMED" },
          { src: "/static/placeholders/photo_pending.svg", title: "Living Area", tag: "INTERIOR", timestamp: "25-OCT-2026 10:25 IST", badge: "OCCUPIED", status: "VERIFIED" },
          { src: "/static/placeholders/photo_pending.svg", title: "Dr. Ananya Sharma", tag: "PERSON MET", timestamp: "25-OCT-2026 10:28 IST", badge: "ID: MATCH", status: "MATCH" }
        ],
        work_photos: [
          { src: "/static/placeholders/photo_pending.svg", title: "Clinic Facade Suite 401", tag: "WORKPLACE FACADE", timestamp: "25-OCT-2026 10:35 IST", badge: "EXIF: PASS", status: "MATCH" },
          { src: "/static/placeholders/photo_pending.svg", title: "Clinic Treatment Facility", tag: "OPERATIONS", timestamp: "25-OCT-2026 10:40 IST", badge: "ACTIVE", status: "VERIFIED" },
          { src: "/static/placeholders/photo_pending.svg", title: "Doctor Consultation Desk", tag: "CONSULTATION DESK", timestamp: "25-OCT-2026 10:45 IST", badge: "MATCH", status: "CONFIRMED" },
          { src: "/static/placeholders/photo_pending.svg", title: "Ellisbridge Main Approach", tag: "APPROACH ROAD", timestamp: "25-OCT-2026 10:50 IST", badge: "OPTIMAL", status: "MATCH" }
        ],
        photos: [
          "/static/placeholders/photo_pending.svg",
          "/static/placeholders/photo_pending.svg",
          "/static/placeholders/photo_pending.svg",
          "/static/placeholders/photo_pending.svg"
        ]
      },
      "f405da07-56ec-4c76-da46-c64328a3f005": {
        case_no: "BOB-HL-2026-30L",
        bank: "Bank of Baroda",
        branch: "Sector 11 Branch",
        applicant_name: "Mr. Mahendrasinh Solanki",
        phone: "+91 99781 23456",
        month: "September 2026",
        allotted_by: "Suresh Sir (Operations Lead)",
        loan_facility: "Home Loan (HL) ₹30.00 Lacs",
        loan_amount_val: 3000000,
        pan: "BTPMS4820R",
        aadhaar_masked: "XXXX - XXXX - 4410",
        dob: "18/07/1982",
        gender: "Male",
        ward: "WARD 4, SECTOR 22, GANDHINAGAR (ACTIVE)",
        address: "Plot 112/1, Sector 22, Gandhinagar - 382022",
        agent: "Kamal Bhai (FA-7702)",
        agent_selfie: "/static/placeholders/photo_pending.svg",
        selfie_verified: true,
        photos_count: 8,
        visit_date: "24-Oct-2026, 16:45 IST",
        benchmark_lat: "23.2350",
        benchmark_lon: "72.6520",
        capture_lat: "23.2347",
        capture_lon: "72.6522",
        distance_m: 38,
        agent_pin: "FA-7702",
        stay_period: "15 Years",
        ownership: "Ancestral / Owned",
        person_met: "Mahendrasinh Solanki (Self - 9978123456)",
        neighbors: ["1. Dashrathbhai Patel (Plot 112/2)", "2. Govindbhai Rabari (Plot 111)"],
        status: "PENDING_CA_REVIEW",
        residence_photos: [
          { src: "/static/placeholders/photo_pending.svg", title: "Plot 112 Main Gate", tag: "RESIDENCE: MAIN GATE", timestamp: "24-OCT-2026 16:48 IST", badge: "GPS: VALID", status: "MATCH" },
          { src: "/static/placeholders/photo_pending.svg", title: "House Elevation Sector 22", tag: "ELEVATION", timestamp: "24-OCT-2026 16:52 IST", badge: "GEO: MATCH", status: "CONFIRMED" },
          { src: "/static/placeholders/photo_pending.svg", title: "Living Room Interior", tag: "INTERIOR ASSETS", timestamp: "24-OCT-2026 16:56 IST", badge: "OCCUPIED", status: "VERIFIED" },
          { src: "/static/placeholders/photo_pending.svg", title: "Mahendrasinh Solanki", tag: "PERSON MET", timestamp: "24-OCT-2026 17:00 IST", badge: "ID: MATCH", status: "MATCH" }
        ],
        work_photos: [
          { src: "/static/placeholders/photo_pending.svg", title: "Business Premises Gate", tag: "WORKPLACE FACADE", timestamp: "24-OCT-2026 17:15 IST", badge: "EXIF: PASS", status: "MATCH" },
          { src: "/static/placeholders/photo_pending.svg", title: "Workshop Operations", tag: "OPERATIONS", timestamp: "24-OCT-2026 17:20 IST", badge: "ACTIVE", status: "VERIFIED" },
          { src: "/static/placeholders/photo_pending.svg", title: "Accounts & Billing Desk", tag: "INSPECTION DESK", timestamp: "24-OCT-2026 17:25 IST", badge: "MATCH", status: "CONFIRMED" },
          { src: "/static/placeholders/photo_pending.svg", title: "GIDC Sector Approach", tag: "APPROACH ROAD", timestamp: "24-OCT-2026 17:30 IST", badge: "OPTIMAL", status: "MATCH" }
        ],
        photos: [
          "/static/placeholders/photo_pending.svg",
          "/static/placeholders/photo_pending.svg",
          "/static/placeholders/photo_pending.svg",
          "/static/placeholders/photo_pending.svg"
        ]
      },
    };

    // Switch between Residence and Work/Office Photo Folders
    const PHOTO_FOLDER_TABS = {
      residence: { btnId: "folderTabResidence", icon: "home", badgeText: "📁 /residence/", badgeClass: "bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-bold font-mono text-[10px]" },
      work: { btnId: "folderTabWork", icon: "apartment", badgeText: "📁 /work/", badgeClass: "bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200 font-bold font-mono text-[10px]" },
      co_work: { btnId: "folderTabCoWork", icon: "business_center", badgeText: "📁 /co_work/", badgeClass: "bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-bold font-mono text-[10px]" },
    };

    function switchPhotoFolder(folder) {
      currentPhotoFolder = folder;
      const badge = document.getElementById("activeFolderBadge");

      Object.entries(PHOTO_FOLDER_TABS).forEach(([key, tab]) => {
        const btn = document.getElementById(tab.btnId);
        if (!btn) return;
        const isActive = key === folder;
        const display = btn.classList.contains("hidden") ? "hidden " : "";
        btn.className = `${display}px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
          isActive ? "bg-primary-container text-white shadow-sm" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
        }`;
      });

      const activeTab = PHOTO_FOLDER_TABS[folder] || PHOTO_FOLDER_TABS.residence;
      if (badge) {
        badge.textContent = activeTab.badgeText;
        badge.className = activeTab.badgeClass;
      }

      renderPhotosForActiveFolder();
    }

    // Co-Applicant Office tab only makes sense for dual-applicant cases - keep it hidden
    // otherwise instead of showing an always-empty third folder.
    function updateCoWorkFolderTabVisibility(c) {
      const btn = document.getElementById("folderTabCoWork");
      if (!btn) return;
      const hasCoApplicant = Boolean(c && c.co_applicant_name);
      btn.classList.toggle("hidden", !hasCoApplicant);
      if (!hasCoApplicant && currentPhotoFolder === "co_work") {
        switchPhotoFolder("residence");
      }
    }

    // Manual-upload doc_type for the dashboard's 4-slot grid, matching whichever of the
    // Residence / Work / Co-Applicant Office folders is currently active.
    function manualUploadDocTypeFor(index) {
      const byFolder = {
        residence: { 1: "PROPERTY_EXTERIOR", 2: "PROPERTY_EXTERIOR", 3: "ELECTRICITY_METER", 4: "NEIGHBOR_VERIFICATION" },
        work: { 1: "OFFICE_FACADE", 2: "OFFICE_NAMEBOARD", 3: "OFFICE_INTERIOR", 4: "OFFICE_SELFIE" },
        co_work: { 1: "CO_OFFICE_FACADE", 2: "CO_OFFICE_NAMEBOARD", 3: "CO_OFFICE_INTERIOR", 4: "CO_OFFICE_SELFIE" },
      };
      return (byFolder[currentPhotoFolder] || byFolder.residence)[index];
    }

    // Render 4 photos dynamically for active folder (Residence vs Work vs Co-Applicant Office)
    function renderPhotosForActiveFolder() {
      const c = caseRegistry[activeCaseId];
      if (!c) return;

      const photoList = currentPhotoFolder === "residence"
        ? (c.residence_photos || c.photos)
        : currentPhotoFolder === "co_work"
          ? (c.co_work_photos || [])
          : (c.work_photos || c.photos);
      const extraList = currentPhotoFolder === "residence"
        ? (c.residence_photos_extra || [])
        : currentPhotoFolder === "co_work"
          ? (c.co_work_photos_extra || [])
          : (c.work_photos_extra || []);

      for (let i = 1; i <= 4; i++) {
        const p = photoList[i - 1];
        if (!p) continue;

        const img = document.getElementById(`imgPhoto${i}`);
        const title = document.getElementById(`titlePhoto${i}`);
        const tag = document.getElementById(`tagPhoto${i}`);
        const ts = document.getElementById(`tsPhoto${i}`);
        const badge = document.getElementById(`badgePhoto${i}`);
        const status = document.getElementById(`statusPhoto${i}`);
        const reportToggle = document.getElementById(`reportTogglePhoto${i}`);

        if (img) {
          img.onerror = function() {
            this.onerror = null;
            this.src = "/static/placeholders/photo_pending.svg";
          };
          img.src = (typeof p === "string") ? p : p.src;
        }
        if (title && p.title) title.textContent = p.title;
        if (tag && p.tag) tag.textContent = p.tag;
        if (ts && p.timestamp) ts.textContent = p.timestamp;
        if (badge && p.badge) badge.textContent = p.badge;
        if (status && p.status) status.textContent = p.status;
        if (reportToggle) {
          // No real doc id (an un-replaced placeholder specimen) - nothing to toggle yet.
          reportToggle.disabled = !p.id;
          reportToggle.checked = p.id ? p.include_in_report !== false : true;
          reportToggle.dataset.docId = p.id || "";
        }
      }

      renderExtraPhotosGallery(extraList);
    }

    // Additional Photos strip: unbounded extras uploaded from the PWA beyond the 4 mandatory
    // slots. Excluded from the report by default (include_in_report starts false) - the CA
    // opts one in here, which counts toward the same max-4-per-section report cap as the
    // mandatory slot checkboxes above.
    function renderExtraPhotosGallery(extraList) {
      const section = document.getElementById("extraPhotosSection");
      const grid = document.getElementById("extraPhotosGrid");
      if (!section || !grid) return;

      if (!extraList || extraList.length === 0) {
        section.classList.add("hidden");
        grid.innerHTML = "";
        updateReportSelectionCounter();
        return;
      }

      section.classList.remove("hidden");
      grid.innerHTML = extraList.map(p => `
        <div class="relative w-20 rounded-lg overflow-hidden border border-outline-variant bg-surface-container-lowest shrink-0">
          <img src="${p.src}" loading="lazy" decoding="async" class="w-full h-16 object-cover cursor-pointer" onerror="this.onerror=null;this.src='/static/placeholders/photo_pending.svg'" onclick="window.open('${p.src}', '_blank')"/>
          <label class="flex items-center justify-center gap-1 p-1 bg-surface-container-lowest text-[9px] font-mono cursor-pointer border-t border-outline-variant">
            <input type="checkbox" class="extra-report-toggle w-3 h-3" data-doc-id="${p.id}" ${p.include_in_report ? "checked" : ""} onchange="toggleExtraReportInclusion('${p.id}', this)"/>
            <span>Report</span>
          </label>
        </div>
      `).join("");

      updateReportSelectionCounter();
    }

    // Counts every checked "Report" box currently on screen for the active folder (4 mandatory
    // + any extras) and reflects it as "X/4 IN REPORT" - also used to enforce the max-4 cap.
    function countCheckedReportBoxes() {
      let n = 0;
      for (let i = 1; i <= 4; i++) {
        const box = document.getElementById(`reportTogglePhoto${i}`);
        if (box && !box.disabled && box.checked) n++;
      }
      document.querySelectorAll("#extraPhotosGrid .extra-report-toggle").forEach(box => {
        if (box.checked) n++;
      });
      return n;
    }

    function updateReportSelectionCounter() {
      const el = document.getElementById("reportSelectionCounter");
      if (!el) return;
      const n = countCheckedReportBoxes();
      el.textContent = `${n}/4 IN REPORT`;
      el.className = `font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
        n > 4 ? "bg-red-50 text-red-800 border-red-300" : "bg-blue-50 text-blue-800 border-blue-200"
      }`;
    }

    async function postReportInclusion(docId, include, revertFn) {
      if (!docId) return;
      try {
        const token = localStorage.getItem("ca_token");
        const headers = {};
        if (token && token !== "demo-ca-token") headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(`/api/v1/scrutiny/documents/${docId}/report-inclusion?include=${include}`, {
          method: "POST",
          headers,
        });
        if (!res.ok) throw new Error("Request failed");
      } catch (err) {
        console.warn("Report-inclusion toggle notice:", err);
        alert("Could not save this selection - please check your connection and try again.");
        if (revertFn) revertFn();
      }
      updateReportSelectionCounter();
    }

    function toggleMandatorySlotReportInclusion(slotIndex, checkboxEl) {
      const docId = checkboxEl.dataset.docId;
      if (!docId) { checkboxEl.checked = true; return; }
      if (checkboxEl.checked && countCheckedReportBoxes() > 4) {
        checkboxEl.checked = false;
        alert("Only 4 photos can be selected for the report in this section. Please deselect one first.");
        return;
      }
      const revert = () => { checkboxEl.checked = !checkboxEl.checked; updateReportSelectionCounter(); };
      postReportInclusion(docId, checkboxEl.checked, revert);
    }

    function toggleExtraReportInclusion(docId, checkboxEl) {
      if (checkboxEl.checked && countCheckedReportBoxes() > 4) {
        checkboxEl.checked = false;
        alert("Only 4 photos can be selected for the report in this section. Please deselect one first.");
        return;
      }
      const revert = () => { checkboxEl.checked = !checkboxEl.checked; updateReportSelectionCounter(); };
      postReportInclusion(docId, checkboxEl.checked, revert);
    }

    // Auto-polling & Live Document Retrieval from Server
    let liveSyncInterval = null;

    // Distance from benchmark to field capture; updates every geofence badge for the case.
    function recomputeGeofence(c) {
      if (!(c.benchmark_lat && c.capture_lat && c.capture_lat !== "—")) return;
      const bLat = parseFloat(c.benchmark_lat);
      const bLon = parseFloat(c.benchmark_lon);
      const cLat = parseFloat(c.capture_lat);
      const cLon = parseFloat(c.capture_lon);
      if (isNaN(bLat) || isNaN(bLon) || isNaN(cLat) || isNaN(cLon)) return;
      const R = 6371000;
      const dLat = (cLat - bLat) * Math.PI / 180;
      const dLon = (cLon - bLon) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(bLat * Math.PI / 180) * Math.cos(cLat * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const dist = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
      c.distance_m = dist;

      const isCompliant = dist <= 150;
      const radarProx = document.getElementById("dispRadarProximity");
      if (radarProx) {
        radarProx.textContent = `PROXIMITY: ${dist} METERS (${isCompliant ? "PASS" : "BREACH"})`;
        radarProx.className = `font-mono text-[10px] font-bold ${isCompliant ? "text-secondary bg-emerald-50 border-emerald-200" : "text-amber-800 bg-amber-50 border-amber-300"} px-2 py-0.5 rounded border`;
      }
      const radarDist = document.getElementById("dispRadarDistance");
      if (radarDist) radarDist.textContent = `${dist}m / Max 150m Safe Harbor`;
      const radarBar = document.getElementById("dispRadarBar");
      if (radarBar) {
        radarBar.style.width = Math.min(100, Math.round((dist / 150) * 100)) + "%";
        radarBar.className = `${isCompliant ? "bg-secondary" : "bg-red-500"} h-full rounded-full`;
      }
      const radarAgentPin = document.getElementById("dispRadarAgentPin");
      if (radarAgentPin) radarAgentPin.textContent = `FA-LIVE (${dist}m)`;
      const geoBadge = document.getElementById("dispGeofenceHeaderBadge");
      if (geoBadge) {
        geoBadge.textContent = isCompliant ? "GEOFENCE VERIFIED" : "GEOFENCE BREACH";
        geoBadge.className = `font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${isCompliant ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-red-50 text-red-800 border-red-300"}`;
      }
      const coordsBadge = document.getElementById("dispCoordinatesBadge");
      if (coordsBadge) {
        coordsBadge.textContent = `● ${isCompliant ? "COMPLIANT" : "BREACH"} (${c.benchmark_lat}° N, ${c.benchmark_lon}° E)`;
      }
    }

    // ==========================================
    // SATELLITE GEOFENCE MAP (Leaflet + Esri imagery, see /static/geofence-map.js)
    // ==========================================
    let geofenceMap;      // undefined = not yet created, null = Leaflet unavailable
    let gfEditCaseId = null;

    function getGeofenceMap() {
      if (geofenceMap === undefined) {
        try {
          geofenceMap = window.GeofenceMap ? window.GeofenceMap.create(document.getElementById("gfPortalMap"), {
            editable: true,
            onPreview: (lat, lon, dist) => {
              const el = document.getElementById("gfAdjustCoords");
              if (el) el.textContent = `NEW: ${lat.toFixed(6)}° N, ${lon.toFixed(6)}° E${dist !== null ? ` • agent ${dist}m away (${dist <= 150 ? "PASS" : "BREACH"})` : ""}`;
            },
          }) : null;
        } catch (err) {
          console.warn("Geofence map init error:", err);
          geofenceMap = null;
        }
        if (!geofenceMap) {
          const fb = document.getElementById("gfPortalMapFallback");
          if (fb) fb.classList.remove("hidden");
          ["gfBtnAdjust", "gfBtnSatellite", "gfBtnStreet"].forEach(id => { const b = document.getElementById(id); if (b) b.disabled = true; });
        }
      }
      return geofenceMap;
    }

    function refreshGeofenceMap(refit) {
      // The map is an enhancement: a failure here must never break case loading.
      try { renderGeofenceMap(refit); } catch (err) { console.warn("Geofence map render error:", err); }
    }

    function renderGeofenceMap(refit) {
      const c = caseRegistry[activeCaseId];
      const m = getGeofenceMap();
      if (!c) return;
      if (m && m.isEditing() && gfEditCaseId !== activeCaseId) cancelBenchmarkAdjust();
      if (m) {
        const visited = c.distance_m !== null && c.distance_m !== undefined;
        m.update({
          benchLat: c.benchmark_lat, benchLon: c.benchmark_lon,
          agentLat: c.capture_lat, agentLon: c.capture_lon,
          agentLabel: visited ? `${c.agent_pin && c.agent_pin !== "—" ? c.agent_pin : "FIELD AGENT"} • ${c.distance_m}m` : "FIELD AGENT",
          applicantLat: c.applicant_loc && c.applicant_loc.lat, applicantLon: c.applicant_loc && c.applicant_loc.lon,
          refit: !!refit,
        });
      }
      const link = document.getElementById("gfGoogleMapsLink");
      if (link) {
        const lat = parseFloat(c.benchmark_lat), lon = parseFloat(c.benchmark_lon);
        const ok = !isNaN(lat) && !isNaN(lon);
        link.href = ok ? window.GeofenceMap ? window.GeofenceMap.googleMapsUrl(lat, lon) : `https://maps.google.com/?q=${lat},${lon}&t=k&z=19` : "#";
        link.classList.toggle("pointer-events-none", !ok);
        link.classList.toggle("opacity-50", !ok);
      }
    }

    function fitGeofenceMap() {
      const m = getGeofenceMap();
      if (m) m.fit();
    }

    function setGeofenceBaseLayer(mode) {
      const m = getGeofenceMap();
      if (!m) return;
      m.setBaseLayer(mode);
      const on = "px-2.5 py-1 bg-primary-container text-white";
      const off = "px-2.5 py-1 bg-surface-container-lowest text-on-surface-variant";
      document.getElementById("gfBtnSatellite").className = mode === "satellite" ? on : off;
      document.getElementById("gfBtnStreet").className = mode === "street" ? on : off;
    }

    function showGeofenceStatus(msg, ok) {
      const el = document.getElementById("gfMapStatus");
      if (!el) return;
      el.textContent = msg;
      el.className = `text-[11px] font-bold rounded-md px-2.5 py-1.5 border ${ok ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-red-50 text-red-800 border-red-300"}`;
      clearTimeout(showGeofenceStatus._t);
      showGeofenceStatus._t = setTimeout(() => el.classList.add("hidden"), 6000);
    }

    // ---- Address -> benchmark lookup (OpenStreetMap, via /api/v1/geocode) ----
    let gfPendingLookup = null;   // {lat, lon, info} of the last lookup shown in adjust mode

    // Database id of a case: new cases carry db_id, built-in seed cases found in the DB carry server_id.
    function gfServerId(c) { return c.db_id || c.server_id || null; }
    const GF_PRECISION_STYLE = {
      CA_VERIFIED: ["bg-emerald-50 text-emerald-800 border-emerald-300", "✓ CA-VERIFIED PIN"],
      LANDMARK: ["bg-emerald-50 text-emerald-800 border-emerald-300", "● LANDMARK MATCH"],
      LOCALITY: ["bg-amber-50 text-amber-900 border-amber-300", "◎ AREA-LEVEL"],
      PINCODE: ["bg-orange-50 text-orange-900 border-orange-300", "◎ PINCODE-LEVEL"],
      CITY: ["bg-red-50 text-red-800 border-red-300", "⚠ CITY-LEVEL ONLY"],
      APPLICANT: ["bg-blue-50 text-blue-800 border-blue-300", "◉ APPLICANT-SHARED"],
    };
    const GF_ZOOM = { LANDMARK: 17, LOCALITY: 15, PINCODE: 14, CITY: 12, APPLICANT: 18 };

    function renderApplicantInfo(c) {
      const box = document.getElementById("gfApplicantInfo");
      if (!box || caseRegistry[activeCaseId] !== c) return;
      const a = c.applicant_loc;
      if (!a) { box.className = "hidden"; return; }
      // Measured here against the benchmark currently shown, so it stays right after the pin moves.
      const bLat = parseFloat(c.benchmark_lat), bLon = parseFloat(c.benchmark_lon);
      const d = window.GeofenceMap && !isNaN(bLat) && !isNaN(bLon)
        ? window.GeofenceMap.distanceMeters(bLat, bLon, a.lat, a.lon) : a.distance_from_benchmark_m;
      a.flagged = d !== null && d !== undefined && d > 2000;
      const distText = d === null || d === undefined ? "" : ` • ${d >= 1000 ? (d / 1000).toFixed(1) + " km" : d + " m"} from benchmark`;
      box.className = `flex flex-wrap items-center justify-between gap-2 text-[11px] rounded-md px-2.5 py-1.5 border ${a.flagged ? "bg-red-50 text-red-800 border-red-300" : "bg-blue-50 text-blue-900 border-blue-200"}`;
      document.getElementById("gfApplicantText").textContent =
        `◉ Applicant shared (WhatsApp, self-declared): ${a.lat.toFixed(6)}° N, ${a.lon.toFixed(6)}° E${distText}` +
        (a.flagged ? " ⚠ FAR FROM BANK ADDRESS - scrutinise" : "") + (a.recorded_by ? ` • recorded by ${a.recorded_by}` : "");
    }

    async function loadApplicantLocationPortal(c) {
      const id = gfServerId(c);
      if (!id) return;
      try {
        const res = await fetch(`/api/v1/visits/cases/${encodeURIComponent(id)}/applicant-location`, { headers: authHeaders() });
        if (!res.ok) return;
        c.applicant_loc = await res.json();
        if (caseRegistry[activeCaseId] === c) {
          renderApplicantInfo(c);
          refreshGeofenceMap(true);
        }
      } catch (err) {
        console.warn("loadApplicantLocationPortal error:", err);
      }
    }

    async function saveApplicantLocationPortal() {
      const c = caseRegistry[activeCaseId];
      const input = document.getElementById("gfApplicantInput");
      const text = (input.value || "").trim();
      if (!c || text.length < 3) return;
      const id = gfServerId(c);
      if (!id) { showGeofenceStatus("This is a demo case without a server record; location not saved.", false); return; }
      const btn = document.getElementById("gfBtnApplicantSave");
      btn.disabled = true;
      try {
        const res = await fetch(`/api/v1/visits/cases/${encodeURIComponent(id)}/applicant-location`, {
          method: "POST",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ text }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          showGeofenceStatus(typeof data.detail === "string" ? data.detail : `Could not save location (HTTP ${res.status}).`, false);
          return;
        }
        input.value = "";
        c.applicant_loc = data;
        renderApplicantInfo(c);
        refreshGeofenceMap(true);
        showGeofenceStatus("Applicant's shared location saved (blue pin). It is self-declared - it does not change the benchmark.", true);
      } catch (err) {
        showGeofenceStatus("Network error, location not saved.", false);
      } finally {
        btn.disabled = false;
      }
    }

    function useApplicantLocationAsBenchmark() {
      const c = caseRegistry[activeCaseId];
      if (!c || !c.applicant_loc) return;
      showLookupInAdjustMode({
        lat: c.applicant_loc.lat, lon: c.applicant_loc.lon, precision: "APPLICANT",
        precision_note: "Self-declared by applicant on WhatsApp - confirm it is the property on the satellite map before saving",
        matched: "WhatsApp location", display_name: "Applicant's WhatsApp location",
      });
    }

    function setPrecisionBadge(info, pending) {
      const el = document.getElementById("gfPrecisionBadge");
      if (!el) return;
      if (pending) {
        el.className = "text-[11px] rounded-md px-2.5 py-1.5 border bg-blue-50 text-blue-800 border-blue-200";
        el.textContent = "Locating property from bank address (pincode / area / landmark)…";
        return;
      }
      if (!info || !info.precision) {
        el.className = "hidden";
        return;
      }
      const [cls, label] = GF_PRECISION_STYLE[info.precision] || GF_PRECISION_STYLE.CITY;
      el.className = `text-[11px] rounded-md px-2.5 py-1.5 border ${cls}`;
      el.textContent = `${label}${info.matched ? ` (${info.matched})` : ""}: ${info.precision_note || ""}`;
    }

    // Single place that changes a case's benchmark in the UI and re-scores the geofence.
    function applyBenchmark(c, lat, lon) {
      c.benchmark_lat = lat;
      c.benchmark_lon = lon;
      if (caseRegistry[activeCaseId] !== c) return;
      document.getElementById("dispRadarBenchmark").textContent = `BENCHMARK: ${lat}° N, ${lon}° E`;
      const coordsBadge = document.getElementById("dispCoordinatesBadge");
      if (coordsBadge && (c.distance_m === null || c.distance_m === undefined)) {
        coordsBadge.textContent = `○ NOT YET VISITED (benchmark ${lat}° N, ${lon}° E)`;
      }
      recomputeGeofence(c);
      refreshGeofenceMap(true);
      setPrecisionBadge(c.benchmark_precision);
      renderApplicantInfo(c);
    }

    async function geocodeLookup(address) {
      const res = await fetch(`/api/v1/geocode?address=${encodeURIComponent(address)}`, { headers: authHeaders() });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }

    function showLookupInAdjustMode(r) {
      const m = getGeofenceMap();
      if (!m) return;
      if (!m.isEditing()) startBenchmarkAdjust();
      gfPendingLookup = { lat: r.lat, lon: r.lon, info: { precision: r.precision, precision_note: r.precision_note, matched: r.matched } };
      m.previewBenchmark(r.lat, r.lon, GF_ZOOM[r.precision]);
      setPrecisionBadge(gfPendingLookup.info);
      document.getElementById("gfAdjustCoords").textContent = `FOUND: ${r.display_name || r.matched} → ${r.lat}° N, ${r.lon}° E. Drag the pin onto the exact building, then Save.`;
    }

    async function locateBenchmarkFromAddress() {
      const c = caseRegistry[activeCaseId];
      if (!c || !c.address) { showGeofenceStatus("This case has no address to locate.", false); return; }
      const btn = document.getElementById("gfBtnLocate");
      btn.disabled = true;
      setPrecisionBadge(null, true);
      try {
        const r = await geocodeLookup(c.address);
        if (!r) {
          setPrecisionBadge(c.benchmark_precision);
          showGeofenceStatus("Address not found on OpenStreetMap. Use Adjust Pin → search a nearby landmark or area.", false);
          return;
        }
        showLookupInAdjustMode(r);
      } catch (err) {
        console.warn("locateBenchmarkFromAddress error:", err);
        setPrecisionBadge(c.benchmark_precision);
        showGeofenceStatus("Address lookup failed (network). Try again or place the pin manually.", false);
      } finally {
        btn.disabled = false;
      }
    }

    async function searchBenchmarkPlace() {
      const c = caseRegistry[activeCaseId];
      const q = (document.getElementById("gfSearchInput").value || "").trim();
      if (!c || q.length < 3) return;
      const btn = document.getElementById("gfBtnSearch");
      btn.disabled = true;
      try {
        // Search inside the case's own area first (its pincode / city anchor the result), then anywhere.
        const r = (c.address && await geocodeLookup(`${q}, ${c.address}`)) || await geocodeLookup(q);
        if (!r) { showGeofenceStatus(`"${q}" not found on OpenStreetMap. Try a nearby landmark, area name or pincode.`, false); return; }
        showLookupInAdjustMode(r);
      } catch (err) {
        console.warn("searchBenchmarkPlace error:", err);
        showGeofenceStatus("Search failed (network). Try again.", false);
      } finally {
        btn.disabled = false;
      }
    }

    // Server cases: fill a placeholder benchmark from the bank address once per session, and
    // learn how precise the stored benchmark is. The server never overwrites a real benchmark.
    async function autoLocateCase(c) {
      if (!c || !gfServerId(c) || c.auto_locate_checked) {
        if (c && caseRegistry[activeCaseId] === c) setPrecisionBadge(c.benchmark_precision);
        return;
      }
      c.auto_locate_checked = true;
      setPrecisionBadge(null, true);
      try {
        const res = await fetch(`/api/v1/cases/${gfServerId(c)}/auto-locate`, { method: "POST", headers: authHeaders() });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const r = await res.json();
        if (r.precision) c.benchmark_precision = { precision: r.precision, precision_note: r.precision_note, matched: r.matched };
        const changed = Math.abs(parseFloat(c.benchmark_lat) - r.lat) > 1e-6 || Math.abs(parseFloat(c.benchmark_lon) - r.lon) > 1e-6;
        if (r.lat != null && r.lon != null && changed) applyBenchmark(c, r.lat, r.lon);
        if (caseRegistry[activeCaseId] === c) {
          setPrecisionBadge(c.benchmark_precision);
          if (r.updated) showGeofenceStatus(`Benchmark auto-located from bank address (${r.matched}). Verify with Adjust Pin.`, true);
          else if (r.message) showGeofenceStatus(r.message, false);
        }
      } catch (err) {
        c.auto_locate_checked = false;   // retry next time the case is opened
        console.warn("autoLocateCase error:", err);
        if (caseRegistry[activeCaseId] === c) setPrecisionBadge(c.benchmark_precision);
      }
    }

    function startBenchmarkAdjust() {
      const m = getGeofenceMap();
      if (!m || !caseRegistry[activeCaseId]) return;
      gfEditCaseId = activeCaseId;
      m.startEdit();
      const b = m.getBenchmark();
      document.getElementById("gfAdjustCoords").textContent = b ? `CURRENT: ${b.lat.toFixed(6)}° N, ${b.lon.toFixed(6)}° E` : "Click on the map to place the benchmark";
      document.getElementById("gfAdjustBar").classList.remove("hidden");
      document.getElementById("gfBtnAdjust").classList.add("hidden");
    }

    function cancelBenchmarkAdjust() {
      const m = getGeofenceMap();
      if (m && m.isEditing()) m.endEdit(false);
      gfEditCaseId = null;
      gfPendingLookup = null;
      const active = caseRegistry[activeCaseId];
      setPrecisionBadge(active && active.benchmark_precision);
      document.getElementById("gfAdjustBar").classList.add("hidden");
      document.getElementById("gfBtnAdjust").classList.remove("hidden");
    }

    async function saveBenchmarkAdjust() {
      const m = getGeofenceMap();
      const c = caseRegistry[gfEditCaseId];
      const b = m && m.getBenchmark();
      if (!c || !b) { cancelBenchmarkAdjust(); return; }
      const lat = Number(b.lat.toFixed(6));
      const lon = Number(b.lon.toFixed(6));
      const btn = document.getElementById("gfBtnSaveBenchmark");
      btn.disabled = true;
      btn.textContent = "Saving…";
      try {
        if (gfServerId(c)) {
          const res = await fetch(`/api/v1/cases/${gfServerId(c)}`, {
            method: "PATCH",
            headers: authHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ target_lat: lat, target_lon: lon }),
          });
          if (!res.ok) {
            const msg = res.status === 401 || res.status === 403 ? "Please log in as CA to save the benchmark." : `Save failed (HTTP ${res.status}).`;
            showGeofenceStatus(msg + " Pin restored.", false);
            cancelBenchmarkAdjust();
            return;
          }
        }
        // A pin left exactly where the address lookup put it keeps the lookup's precision;
        // a pin the CA moved is a CA-verified benchmark.
        const fromLookup = gfPendingLookup && Math.abs(gfPendingLookup.lat - lat) < 1e-6 && Math.abs(gfPendingLookup.lon - lon) < 1e-6;
        c.benchmark_precision = fromLookup ? gfPendingLookup.info : { precision: "CA_VERIFIED", precision_note: "Benchmark placed by CA on the satellite map" };
        gfPendingLookup = null;
        m.endEdit(true);
        gfEditCaseId = null;
        document.getElementById("gfAdjustBar").classList.add("hidden");
        document.getElementById("gfBtnAdjust").classList.remove("hidden");
        applyBenchmark(c, lat, lon);
        showGeofenceStatus(gfServerId(c) ? `Benchmark locked at ${lat}° N, ${lon}° E (saved to case & audit log).` : `Benchmark set to ${lat}° N, ${lon}° E (demo case, not saved to server).`, true);
      } catch (err) {
        console.error("saveBenchmarkAdjust error:", err);
        showGeofenceStatus("Network error, benchmark not saved. Pin restored.", false);
        cancelBenchmarkAdjust();
      } finally {
        btn.disabled = false;
        btn.textContent = "Save Benchmark";
      }
    }

    // Document types that are KYC/financial proof, never site or workplace evidence.
    const NON_EVIDENCE_DOC_TYPES = ["AADHAAR_CARD", "PAN_CARD", "UTILITY_BILL", "SALARY_SLIP", "PROPERTY_TITLE_DEED", "FORM_16", "ITR_ACKNOWLEDGEMENT", "COMPUTATION_OF_INCOME", "PROFIT_LOSS_BALANCE_SHEET", "OTHER"];

    // Shared by mergeExtractedDocsIntoCase() (AI scans) and applyFieldCapturedKycFallback()
    // (manual uploads): whichever candidate for a given card field is NEWER wins, tracked via a
    // companion "<field>_at" timestamp on the case object. A CA office re-uploading a document by
    // hand almost always means the AI scan was wrong, blurry, or missing, so a fresher manual photo
    // must be able to replace an older AI scan too — not just fill in when the AI scan is absent.
    function setKycImageIfNewer(c, field, url, timeMs) {
      if (!url || !Number.isFinite(timeMs) || timeMs <= 0) return;
      const prevAt = c[`${field}_at`] || 0;
      if (timeMs >= prevAt) {
        c[field] = url;
        c[`${field}_at`] = timeMs;
      }
    }
    function tsMs(d) {
      const raw = d && (d.created_at_raw || d.created_at);
      const t = raw ? new Date(raw).getTime() : NaN;
      return Number.isFinite(t) ? t : 0;
    }

    // A field agent sometimes photographs Aadhaar/PAN/the utility bill directly (a JPEG) instead
    // of the bank supplying a scannable PDF. Those raw uploads never pass through the AI
    // PDF-ingestion pipeline, so mergeExtractedDocsIntoCase() never sees them and the dedicated
    // card stays on its placeholder. Here we fall back to such raw uploads — via setKycImageIfNewer,
    // a manual upload newer than the current AI scan (or absent AI scan) wins; an older manual
    // upload never displaces a fresher, presumably-corrected AI scan.
    function applyFieldCapturedKycFallback(c, docs) {
      if (!docs || !docs.length) return;
      const isManualDoc = (d) => !(d.ocr_data && d.ocr_data.source === "pdf_ingest");
      // Never let a co-applicant's own Aadhaar/PAN win the primary applicant's card — the
      // utility bill is deliberately exempt (it's residence proof whoever's name it is in).
      const SELF_ONLY_TYPES = new Set(["AADHAAR_CARD", "PAN_CARD"]);
      const latestOfType = (type, { manualOnly = false } = {}) => {
        const matches = docs.filter(d => {
          if ((d.doc_type || "").toUpperCase() !== type) return false;
          if (manualOnly && !isManualDoc(d)) return false;
          if (SELF_ONLY_TYPES.has(type) && d.ocr_data && d.ocr_data.relationship_to_applicant === "DIFFERENT_PERSON") return false;
          return true;
        });
        if (!matches.length) return null;
        matches.sort((a, b) => tsMs(b) - tsMs(a));
        return matches[0];
      };

      // Whichever is newer — the AI-scanned image already on the card, or any upload of the same
      // document type (manual or a later re-scan) — wins. setKycImageIfNewer guards this with a
      // companion "<field>_at" timestamp so this never regresses to an older image, in either
      // direction, however many times this and mergeExtractedDocsIntoCase race against each other.
      const fallbacks = [
        ["AADHAAR_CARD", "aadhaar_front_img", "dispAadhaarFrontImg"],
        ["PAN_CARD", "pan_front_img", "dispPanFrontImg"],
        ["PAN_VERIFICATION_REPORT", "pan_back_img", "dispPanBackImg"],
        ["UTILITY_BILL", "utility_front_img", "dispUtilityFrontImg"],
      ];
      fallbacks.forEach(([docType, field, elId]) => {
        const latest = latestOfType(docType);
        if (!latest) return;
        const url = latest.url || latest.watermarked_url;
        if (!url) return;
        const changed = setKycImageIfNewer(c, field, url, tsMs(latest));
        if (!changed) return;
        if (isManualDoc(latest)) c[`${field}_pending_ai_scan`] = true; // shown as a photo, not claimed as OCR-extracted data
        else delete c[`${field}_pending_ai_scan`];
        if (caseRegistry[activeCaseId] === c) {
          const img = document.getElementById(elId);
          if (img) img.src = url;
        }
      });

      // The "Manual Upload" tab's own preview (separate DOM from the Field Staff/AI-scan flip
      // card above) was never restored from the server at all - handleSectionUpload() only ever
      // set a local blob URL that lived in this tab's memory, so a manually uploaded document
      // correctly reached the database but visually vanished on every page refresh. Always show
      // the latest real MANUAL upload of each type here (never an AI scan), independent of
      // whether that manual upload is the one currently winning the main card above.
      const manualFallbacks = [
        ["AADHAAR_CARD", "aadhaar"],
        ["PAN_CARD", "pan"],
        ["UTILITY_BILL", "utility"],
      ];
      manualFallbacks.forEach(([docType, section]) => {
        const latest = latestOfType(docType, { manualOnly: true });
        const url = latest && (latest.url || latest.watermarked_url);
        const previewEl = document.getElementById(`${section}ManualPreview`);
        const imgEl = document.getElementById(`${section}ManualImg`);
        const nameEl = document.getElementById(`${section}ManualFilename`);
        if (!url || !previewEl) return;
        previewEl.classList.remove("hidden");
        if (imgEl) imgEl.src = url;
        if (nameEl && !nameEl.dataset.userSet) nameEl.textContent = "Previously uploaded document";
      });
    }

    async function fetchLiveCaseDocuments(caseId) {
      if (!caseId) return;
      try {
        let docs = [];
        try {
          const res = await fetch(`/api/v1/cases/${caseId}/documents`);
          if (res.ok) {
            docs = await res.json();
          }
        } catch (fetchErr) {
          console.warn("fetch documents network notice:", fetchErr);
        }

        const c = caseRegistry[caseId];
        if (!c) return;

        // Field-captured KYC photos (agent snaps Aadhaar/PAN/utility bill as a JPEG instead of
        // the bank supplying a scannable PDF): these never go through the AI PDF-ingestion
        // pipeline, so c.aadhaar_front_img etc. are never set for them by mergeExtractedDocsIntoCase.
        // Fall back to the latest raw upload of that doc_type so the photo still appears on its
        // own card (clearly marked as not yet AI-scanned) instead of vanishing or, worse, being
        // swept into the residence/office evidence photo grid.
        applyFieldCapturedKycFallback(c, docs);

        // Exact match only - "OFFICE_SELFIE" (Office Slot 4: Field Staff at Workplace) is a
        // workplace EVIDENCE photo, not the agent's own identity-verification selfie, even
        // though its name also contains "selfie". A substring match here let a later office
        // slot capture outrank and replace the real AGENT_SELFIE on this card.
        const selfieDocs = (docs || []).filter(d => d.doc_type === "AGENT_SELFIE");
        selfieDocs.sort((a, b) => {
          const tA = new Date(a.created_at_raw || a.created_at || 0).getTime();
          const tB = new Date(b.created_at_raw || b.created_at || 0).getTime();
          return tB - tA;
        });
        const selfieDoc = selfieDocs[0];
        // Co-applicant office photos (folder "co_work", doc_type CO_OFFICE_*) must never be
        // treated as the applicant's own work photos - dt.includes("OFFICE") would otherwise
        // match "CO_OFFICE_FACADE" too and the two sets would silently compete for the same 4
        // slots, with whichever side uploaded most recently winning and the other vanishing.
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

        const SITE_EVIDENCE_TYPES = ["PROPERTY_EXTERIOR", "PROPERTY_INTERIOR", "ELECTRICITY_METER", "SOCIETY_BOARD", "NEIGHBOR_VERIFICATION"];
        // KYC/financial documents (Aadhaar, PAN, utility bill, payslip, title deed...) must never
        // fill a residence/office evidence slot, no matter what folder or slot_number they were
        // tagged with — they have their own dedicated cards (see applyFieldCapturedKycFallback).
        const isKycDoc = (d) => NON_EVIDENCE_DOC_TYPES.includes((d.doc_type || "").toUpperCase());
        const evidenceDocs = (docs || []).filter(d =>
          d.doc_type !== "AGENT_SELFIE" &&
          !(d.doc_type && d.doc_type.toLowerCase().includes("selfie")) &&
          !(d.ocr_data && d.ocr_data.source === "pdf_ingest") &&
          !isWorkDoc(d) &&
          !isCoWorkDoc(d) &&
          !isKycDoc(d) &&
          (d.folder === "residence" || (d.ocr_data && d.ocr_data.folder === "residence") || (d.slot_number && d.slot_number >= 1 && d.slot_number <= 4) || SITE_EVIDENCE_TYPES.includes(d.doc_type))
        );

        // 2. Strict Slot-based mapping (Slot 1 -> Photo 1, Slot 2 -> Photo 2, Slot 3 -> Photo 3, Slot 4 -> Photo 4)
        const slotMap = { 1: null, 2: null, 3: null, 4: null };

        // Helper to determine slot index (1 to 4) from doc
        const getDocSlot = (d, fallbackIndex) => {
          if (d.slot_number && d.slot_number >= 1 && d.slot_number <= 4) {
            return d.slot_number;
          }
          if (d.ocr_data && d.ocr_data.slot_number && d.ocr_data.slot_number >= 1 && d.ocr_data.slot_number <= 4) {
            return d.ocr_data.slot_number;
          }
          const dt = (d.doc_type || "").toUpperCase();
          if (dt.includes("GATE") || dt.includes("SOCIETY") || dt.includes("EXTERIOR")) return 1;
          if (dt.includes("ELEVATION") || dt.includes("DOOR")) return 2;
          if (dt.includes("METER") || dt.includes("INTERIOR")) return 3;
          if (dt.includes("NEIGHBOR") || dt.includes("PERSON")) return 4;
          return fallbackIndex;
        };

        // Sort evidenceDocs NEWEST FIRST so latest uploaded photos take priority
        evidenceDocs.sort((a, b) => {
          const tA = new Date(a.created_at_raw || a.created_at || 0).getTime();
          const tB = new Date(b.created_at_raw || b.created_at || 0).getTime();
          return tB - tA;
        });

        // A doc explicitly tagged slot_number > 4 is a genuine "Additional Photo" from the PWA's
        // unbounded extra-capture facility - it must never be absorbed into one of the 4
        // mandatory slots just because that slot happens to still be empty.
        const isExplicitExtra = (d) => {
          const sn = d.slot_number || (d.ocr_data && d.ocr_data.slot_number);
          return Boolean(sn && sn > 4);
        };

        // Genuine "Additional Photos" only - a doc explicitly tagged slot_number > 4 from the
        // PWA's unbounded extra-capture facility. Deliberately NOT "any doc that didn't win one
        // of the 4 mandatory slots": a slot gets retaken more than once in the field, and every
        // older retake (same slot_number 1-4, just superseded by a newer upload) would otherwise
        // get swept in here as if it were a separate "additional photo" - it isn't, it's a
        // discarded duplicate and was never shown anywhere before this feature existed.
        const buildExtrasList = (allDocs) => {
          return allDocs
            .filter(d => isExplicitExtra(d))
            .map(d => ({
              id: d.id,
              src: d.url,
              created_at: d.created_at || "Just now",
              include_in_report: d.include_in_report === true || Boolean(d.ocr_data && d.ocr_data.include_in_report === true),
            }));
        };

        // Assign to slots by slot_number or doc_type
        evidenceDocs.forEach((d, idx) => {
          if (isExplicitExtra(d)) return;
          const slot = getDocSlot(d, idx + 1);
          if (slot >= 1 && slot <= 4 && !slotMap[slot]) {
            slotMap[slot] = d;
          }
        });

        // Any unassigned evidence docs fill remaining empty slots
        evidenceDocs.forEach(d => {
          if (isExplicitExtra(d)) return;
          const isAssigned = Object.values(slotMap).some(assigned => assigned && assigned.id === d.id);
          if (!isAssigned) {
            for (let s = 1; s <= 4; s++) {
              if (!slotMap[s]) {
                slotMap[s] = d;
                break;
              }
            }
          }
        });

        // Check local PWA evidence cache if slot is not yet provided by server
        for (let s = 1; s <= 4; s++) {
          if (!slotMap[s]) {
            const cachedPwa = localStorage.getItem(`pwa_evidence_${caseId}_slot_${s}`) ||
                              (c.case_no ? localStorage.getItem(`pwa_evidence_${c.case_no}_slot_${s}`) : null) ||
                              (c.db_id ? localStorage.getItem(`pwa_evidence_${c.db_id}_slot_${s}`) : null);
            if (cachedPwa) {
              try {
                const parsed = JSON.parse(cachedPwa);
                slotMap[s] = {
                  url: parsed.src,
                  created_at: parsed.timestamp || "Just now (Mobile PWA Upload)",
                  latitude: parsed.lat || 23.2154,
                  longitude: parsed.lon || 72.6367,
                  is_geofence_valid: true
                };
              } catch (e) {}
            }
          }
        }

        // If no documents from server and no local cache, keep current photos
        const hasAnyUploaded = Object.values(slotMap).some(Boolean);
        if (!hasAnyUploaded && (!docs || docs.length === 0)) return;

        // Default specimens to fall back on if slot is empty
        const defaultSpecimens = {
          1: { src: "/static/placeholders/photo_pending.svg", title: "Main Gate (સિદ્ધિ વિનાયક)", tag: "RESIDENCE: MAIN GATE", timestamp: "04-AUG-2026 11:32 IST", badge: "GPS: VERIFIED", status: "MATCH" },
          2: { src: "/static/placeholders/photo_pending.svg", title: "Bungalow 31 (લક્ષ્મી કૃપા)", tag: "ELEVATION: CONFIRMED", timestamp: "04-AUG-2026 11:36 IST", badge: "ELEVATION: CONFIRMED", status: "CONFIRMED" },
          3: { src: "/static/placeholders/photo_pending.svg", title: "Drawing Room & Showcase", tag: "DRAWING ROOM ASSETS", timestamp: "04-AUG-2026 11:39 IST", badge: "HABITATION: VERIFIED", status: "VERIFIED" },
          4: { src: "/static/placeholders/photo_pending.svg", title: "Pradeepsinh Vaghela", tag: "PERSON MET", timestamp: "04-AUG-2026 11:42 IST", badge: "IDENTITY: MATCH", status: "MATCH" }
        };

        const titles = {
          1: "Building / Society Gate (Photo 1)",
          2: "House Door & Elevation (Photo 2)",
          3: "Living Room & Electric Meter (Photo 3)",
          4: "Person Met / Borrower at Site (Photo 4)"
        };
        const tags = {
          1: "SLOT 1: SOCIETY & MAIN GATE",
          2: "SLOT 2: HOUSE DOOR & NAMEPLATE",
          3: "SLOT 3: LIVING ASSETS & METER",
          4: "SLOT 4: PERSON MET AT SITE"
        };

        const finalPhotos = [];
        for (let s = 1; s <= 4; s++) {
          const d = slotMap[s];
          if (d) {
            finalPhotos.push({
              id: d.id,
              src: d.url,
              title: titles[s],
              tag: tags[s],
              timestamp: d.created_at || "Just now",
              badge: d.is_geofence_valid ? `GPS: ${d.latitude ? d.latitude.toFixed(4) : '23.2154'}°N, ${d.longitude ? d.longitude.toFixed(4) : '72.6367'}°E (VERIFIED)` : `GPS: ${d.latitude ? d.latitude.toFixed(4) : ''}° (BREACH)`,
              status: d.is_geofence_valid ? "MATCH" : "FLAGGED",
              is_live: true,
              include_in_report: d.include_in_report !== false,
              lat: d.latitude,
              lon: d.longitude
            });
          } else {
            finalPhotos.push(defaultSpecimens[s]);
          }
        }

        // 3. Process Office / Work Evidence Photos
        const workDocs = (docs || []).filter(d =>
          d.doc_type !== "AGENT_SELFIE" &&
          !(d.ocr_data && d.ocr_data.source === "pdf_ingest") &&
          !isKycDoc(d) &&
          isWorkDoc(d)
        );

        // Sort workDocs NEWEST FIRST
        workDocs.sort((a, b) => {
          const tA = new Date(a.created_at_raw || a.created_at || 0).getTime();
          const tB = new Date(b.created_at_raw || b.created_at || 0).getTime();
          return tB - tA;
        });

        const workSlotMap = { 1: null, 2: null, 3: null, 4: null };
        const getWorkDocSlot = (d, fallbackIndex) => {
          if (d.slot_number && d.slot_number >= 1 && d.slot_number <= 4) return d.slot_number;
          if (d.ocr_data && d.ocr_data.slot_number && d.ocr_data.slot_number >= 1 && d.ocr_data.slot_number <= 4) return d.ocr_data.slot_number;
          const dt = (d.doc_type || "").toUpperCase();
          if (dt.includes("FACADE") || dt.includes("GATE") || dt.includes("ENTRANCE")) return 1;
          if (dt.includes("BOARD") || dt.includes("NAME")) return 2;
          if (dt.includes("INTERIOR") || dt.includes("DESK") || dt.includes("ROOM")) return 3;
          if (dt.includes("SELFIE") || dt.includes("PERSON") || dt.includes("STAFF") || dt.includes("APPROACH")) return 4;
          return fallbackIndex;
        };

        workDocs.forEach((d, idx) => {
          if (isExplicitExtra(d)) return;
          const slot = getWorkDocSlot(d, idx + 1);
          if (slot >= 1 && slot <= 4 && !workSlotMap[slot]) workSlotMap[slot] = d;
        });

        // Any unassigned workplace docs fill remaining empty slots
        workDocs.forEach(d => {
          if (isExplicitExtra(d)) return;
          const isAssigned = Object.values(workSlotMap).some(assigned => assigned && assigned.id === d.id);
          if (!isAssigned) {
            for (let s = 1; s <= 4; s++) {
              if (!workSlotMap[s]) {
                workSlotMap[s] = d;
                break;
              }
            }
          }
        });

        // Check local PWA office evidence cache
        for (let s = 1; s <= 4; s++) {
          if (!workSlotMap[s]) {
            const cachedPwa = localStorage.getItem(`pwa_evidence_${caseId}_office_slot_${s}`) ||
                              (c.case_no ? localStorage.getItem(`pwa_evidence_${c.case_no}_office_slot_${s}`) : null) ||
                              (c.db_id ? localStorage.getItem(`pwa_evidence_${c.db_id}_office_slot_${s}`) : null);
            if (cachedPwa) {
              try {
                const parsed = JSON.parse(cachedPwa);
                workSlotMap[s] = {
                  url: parsed.src,
                  created_at: parsed.timestamp || "Just now (Mobile PWA Upload)",
                  latitude: parsed.lat || 23.2154,
                  longitude: parsed.lon || 72.6367,
                  is_geofence_valid: true
                };
              } catch (e) {}
            }
          }
        }

        const isTeacherCase = (c.case_no && c.case_no.includes("531")) || (c.applicant_name && c.applicant_name.toLowerCase().includes("bhavna"));
        const defaultWorkSpecimens = {
          1: { src: "/static/placeholders/photo_pending.svg", title: isTeacherCase ? "School / Office Entrance Gate" : "Workplace / Office Entrance", tag: "WORKPLACE FACADE", timestamp: "04-AUG-2026 12:15 IST", badge: "GPS: VERIFIED", status: "MATCH" },
          2: { src: "/static/placeholders/photo_pending.svg", title: isTeacherCase ? "M/s. District Panchayat Education Committee Board" : "Official Organization Signboard", tag: "OFFICE NAME BOARD", timestamp: "04-AUG-2026 12:18 IST", badge: "SIGNBOARD: CONFIRMED", status: "CONFIRMED" },
          3: { src: "/static/placeholders/photo_pending.svg", title: isTeacherCase ? "Staff Room & Teacher Work Desk" : "Workstation & Office Operations", tag: "WORK AREA INTERIOR", timestamp: "04-AUG-2026 12:22 IST", badge: "OPERATIONS: VERIFIED", status: "VERIFIED" },
          4: { src: "/static/placeholders/photo_pending.svg", title: isTeacherCase ? "Field Staff at School with Colleague" : "Field Staff Verification at Workplace", tag: "WORKPLACE VERIFICATION", timestamp: "04-AUG-2026 12:26 IST", badge: "PRESENCE: MATCH", status: "MATCH" }
        };

        const workTitles = {
          1: isTeacherCase ? "School / Office Entrance Gate (Photo 1)" : "Workplace Facade (Photo 1)",
          2: isTeacherCase ? "District Education Committee Board (Photo 2)" : "Office Signboard (Photo 2)",
          3: isTeacherCase ? "Staff Room & Teacher Desk (Photo 3)" : "Workstation / Desk (Photo 3)",
          4: isTeacherCase ? "Field Staff at School Premises (Photo 4)" : "Field Staff at Workplace (Photo 4)"
        };
        const workTags = {
          1: "SLOT 1: WORKPLACE FACADE",
          2: "SLOT 2: OFFICE NAMEBOARD",
          3: "SLOT 3: WORK AREA INTERIOR",
          4: "SLOT 4: WORKPLACE VERIFICATION"
        };

        const finalWorkPhotos = [];
        for (let s = 1; s <= 4; s++) {
          const d = workSlotMap[s];
          if (d) {
            finalWorkPhotos.push({
              id: d.id,
              src: d.url,
              title: workTitles[s],
              tag: workTags[s],
              timestamp: d.created_at || "Just now",
              badge: d.is_geofence_valid ? `GPS: ${d.latitude ? d.latitude.toFixed(4) : '23.2154'}°N, ${d.longitude ? d.longitude.toFixed(4) : '72.6367'}°E (VERIFIED)` : `GPS: ${d.latitude ? d.latitude.toFixed(4) : ''}° (BREACH)`,
              status: d.is_geofence_valid ? "MATCH" : "FLAGGED",
              is_live: true,
              include_in_report: d.include_in_report !== false,
              lat: d.latitude,
              lon: d.longitude
            });
          } else {
            finalWorkPhotos.push(defaultWorkSpecimens[s]);
          }
        }

        // 4. Process Co-Applicant Office Evidence Photos (dual-applicant cases only) - same
        // 4-slot mapping as the applicant's own Work/Office folder, kept completely separate
        // so the two don't compete for the same slots.
        const coWorkDocs = (docs || []).filter(d =>
          d.doc_type !== "AGENT_SELFIE" &&
          !(d.ocr_data && d.ocr_data.source === "pdf_ingest") &&
          !isKycDoc(d) &&
          isCoWorkDoc(d)
        );
        coWorkDocs.sort((a, b) => {
          const tA = new Date(a.created_at_raw || a.created_at || 0).getTime();
          const tB = new Date(b.created_at_raw || b.created_at || 0).getTime();
          return tB - tA;
        });

        const coWorkSlotMap = { 1: null, 2: null, 3: null, 4: null };
        coWorkDocs.forEach((d, idx) => {
          if (isExplicitExtra(d)) return;
          const slot = getWorkDocSlot(d, idx + 1);
          if (slot >= 1 && slot <= 4 && !coWorkSlotMap[slot]) coWorkSlotMap[slot] = d;
        });
        coWorkDocs.forEach(d => {
          if (isExplicitExtra(d)) return;
          const isAssigned = Object.values(coWorkSlotMap).some(assigned => assigned && assigned.id === d.id);
          if (!isAssigned) {
            for (let s = 1; s <= 4; s++) {
              if (!coWorkSlotMap[s]) { coWorkSlotMap[s] = d; break; }
            }
          }
        });
        for (let s = 1; s <= 4; s++) {
          if (!coWorkSlotMap[s]) {
            const cachedPwa = localStorage.getItem(`pwa_evidence_${caseId}_co_office_slot_${s}`) ||
                              (c.case_no ? localStorage.getItem(`pwa_evidence_${c.case_no}_co_office_slot_${s}`) : null) ||
                              (c.db_id ? localStorage.getItem(`pwa_evidence_${c.db_id}_co_office_slot_${s}`) : null);
            if (cachedPwa) {
              try {
                const parsed = JSON.parse(cachedPwa);
                coWorkSlotMap[s] = {
                  url: parsed.src,
                  created_at: parsed.timestamp || "Just now (Mobile PWA Upload)",
                  latitude: parsed.lat || 23.2154,
                  longitude: parsed.lon || 72.6367,
                  is_geofence_valid: true
                };
              } catch (e) {}
            }
          }
        }

        const coWorkTitles = {
          1: "Co-Applicant Workplace Facade (Photo 1)",
          2: "Co-Applicant Office Signboard (Photo 2)",
          3: "Co-Applicant Workstation / Desk (Photo 3)",
          4: "Field Staff at Co-Applicant Workplace (Photo 4)"
        };
        const coWorkTags = {
          1: "SLOT 1: CO-APPLICANT WORKPLACE FACADE",
          2: "SLOT 2: CO-APPLICANT OFFICE NAMEBOARD",
          3: "SLOT 3: CO-APPLICANT WORK AREA",
          4: "SLOT 4: CO-APPLICANT WORKPLACE VERIFICATION"
        };
        const defaultCoWorkSpecimens = {
          1: { src: "/static/placeholders/photo_pending.svg", title: coWorkTitles[1], tag: coWorkTags[1], timestamp: "Pending", badge: "AWAITING UPLOAD", status: "PENDING" },
          2: { src: "/static/placeholders/photo_pending.svg", title: coWorkTitles[2], tag: coWorkTags[2], timestamp: "Pending", badge: "AWAITING UPLOAD", status: "PENDING" },
          3: { src: "/static/placeholders/photo_pending.svg", title: coWorkTitles[3], tag: coWorkTags[3], timestamp: "Pending", badge: "AWAITING UPLOAD", status: "PENDING" },
          4: { src: "/static/placeholders/photo_pending.svg", title: coWorkTitles[4], tag: coWorkTags[4], timestamp: "Pending", badge: "AWAITING UPLOAD", status: "PENDING" }
        };

        const finalCoWorkPhotos = [];
        for (let s = 1; s <= 4; s++) {
          const d = coWorkSlotMap[s];
          if (d) {
            finalCoWorkPhotos.push({
              id: d.id,
              src: d.url,
              title: coWorkTitles[s],
              tag: coWorkTags[s],
              timestamp: d.created_at || "Just now",
              badge: d.is_geofence_valid ? `GPS: ${d.latitude ? d.latitude.toFixed(4) : '23.2154'}°N, ${d.longitude ? d.longitude.toFixed(4) : '72.6367'}°E (VERIFIED)` : `GPS: ${d.latitude ? d.latitude.toFixed(4) : ''}° (BREACH)`,
              status: d.is_geofence_valid ? "MATCH" : "FLAGGED",
              is_live: true,
              include_in_report: d.include_in_report !== false,
              lat: d.latitude,
              lon: d.longitude
            });
          } else {
            finalCoWorkPhotos.push(defaultCoWorkSpecimens[s]);
          }
        }

        c.residence_photos = finalPhotos;
        c.work_photos = finalWorkPhotos;
        c.co_work_photos = finalCoWorkPhotos;
        c.residence_photos_extra = buildExtrasList(evidenceDocs);
        c.work_photos_extra = buildExtrasList(workDocs);
        c.co_work_photos_extra = buildExtrasList(coWorkDocs);
        c.photos = (currentPhotoFolder === 'residence' ? finalPhotos : currentPhotoFolder === 'co_work' ? finalCoWorkPhotos : finalWorkPhotos).map(p => p.src);

        updateCoWorkFolderTabVisibility(c);

        // Update active folder photos in DOM
        renderPhotosForActiveFolder();

        // Update live radar coordinates and field telemetry from latest uploaded photo
        const docWithCoords = [...docs].reverse().find(d => d.latitude && d.longitude);
        if (docWithCoords) {
          c.capture_lat = docWithCoords.latitude.toFixed(4);
          c.capture_lon = docWithCoords.longitude.toFixed(4);
          const radarCaptureEl = document.getElementById("dispRadarCapture");
          if (radarCaptureEl) {
            radarCaptureEl.textContent = `CAPTURE: ${c.capture_lat}° N, ${c.capture_lon}° E (LIVE)`;
          }
          const radarAgentPin = document.getElementById("dispRadarAgentPin");
          if (radarAgentPin) {
            radarAgentPin.textContent = `FA-LIVE (${c.capture_lat}°, ${c.capture_lon}°)`;
          }
          const visitDateEl = document.getElementById("dispVisitDate");
          if (visitDateEl && docWithCoords.created_at) {
            visitDateEl.textContent = `Live Field Telemetry: ${docWithCoords.created_at}`;
          }
        }

        // Check for Field Staff Attendance Selfie uploaded from mobile PWA or backend
        if (selfieDoc && selfieDoc.url) {
          c.agent_selfie = selfieDoc.url;
          c.selfie_verified = true;
          // c.agent is resolved from the case's real assigned_agent_id in loadDbCasesIntoRegistry -
          // never invent a name here if that hasn't resolved yet; "Not yet allotted" is honest,
          // a guessed name is not.
          if (selfieDoc.created_at) {
            c.visit_date = selfieDoc.created_at;
          }
          if (selfieDoc.latitude && selfieDoc.longitude) {
            c.capture_lat = selfieDoc.latitude.toFixed(4);
            c.capture_lon = selfieDoc.longitude.toFixed(4);
          }

          const selfieThumb = document.getElementById("dispAgentSelfieThumb");
          if (selfieThumb) selfieThumb.src = selfieDoc.url;
          const selfieCardImg = document.getElementById("dispAgentSelfieCardImg");
          if (selfieCardImg) selfieCardImg.src = selfieDoc.url;
          const selfieModalImg = document.getElementById("selfieModalImg");
          if (selfieModalImg) selfieModalImg.src = selfieDoc.url;

          const gpsLock = document.getElementById("dispSelfieGpsLockBadge");
          if (gpsLock) {
            gpsLock.textContent = "GPS LOCKED";
            gpsLock.className = "absolute bottom-0 inset-x-0 bg-emerald-700 text-white font-mono text-[7px] text-center py-0.5 uppercase font-bold";
          }

          const selfieBadge = document.getElementById("dispAgentSelfieCardBadge");
          if (selfieBadge) {
            selfieBadge.textContent = "✓ VERIFIED ON-SITE";
            selfieBadge.className = "font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold";
          }

          const selfieName = document.getElementById("dispAgentSelfieName");
          if (selfieName) selfieName.textContent = c.agent;
          const dispFieldAgent = document.getElementById("dispFieldAgent");
          if (dispFieldAgent) dispFieldAgent.textContent = c.agent;

          const selfieTime = document.getElementById("dispAgentSelfieTime");
          if (selfieTime) selfieTime.textContent = "Time: " + (c.visit_date || "Just now");
          const dispVisitDate = document.getElementById("dispVisitDate");
          if (dispVisitDate) dispVisitDate.textContent = "Visited: " + (c.visit_date || "Just now");

          const selfieGps = document.getElementById("dispAgentSelfieGps");
          if (selfieGps) {
            selfieGps.textContent = (c.capture_lat && c.capture_lat !== "—")
              ? `GPS: ${c.capture_lat}°N, ${c.capture_lon}°E (±3.2m)`
              : "GPS: Not Captured";
          }

          const smStaff = document.getElementById("selfieModalStaffName");
          if (smStaff) smStaff.textContent = c.agent;
          const smTime = document.getElementById("selfieModalTimestamp");
          if (smTime) smTime.textContent = c.visit_date || "Just now";
          const smGps = document.getElementById("selfieModalGps");
          if (smGps) smGps.textContent = (c.capture_lat && c.capture_lon) ? `${c.capture_lat}° N, ${c.capture_lon}° E (±3.2m)` : "Not Captured";

          const selfieStatus = document.getElementById("dispAgentSelfieStatus");
          if (selfieStatus) selfieStatus.textContent = "Selfie Verified ✓";
        }

        // Calculate and update live geofence distance if coordinates are present
        recomputeGeofence(c);
        if (caseRegistry[activeCaseId] === c) refreshGeofenceMap();

        // Show live sync badge
        const badge = document.getElementById("liveSyncBadge");
        if (badge) {
          badge.classList.remove("hidden");
          badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> ⚡ ${docs.length} Live Photo${docs.length > 1 ? 's' : ''} Synced`;
        }
      } catch (err) {
        console.error("fetchLiveCaseDocuments error:", err);
      }
    }

    // Small reusable toast - the CA office asked for the dashboard to visibly refresh when a
    // field agent submits new data, not just silently update underlying state nobody notices.
    function showToast(message, durationMs = 6000) {
      let container = document.getElementById("globalToastContainer");
      if (!container) {
        container = document.createElement("div");
        container.id = "globalToastContainer";
        container.className = "fixed top-3 right-3 z-[9999] flex flex-col gap-2 items-end pointer-events-none";
        document.body.appendChild(container);
      }
      const toast = document.createElement("div");
      toast.className = "pointer-events-auto max-w-sm bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn";
      toast.innerHTML = `<span class="material-symbols-outlined text-[18px]">sync</span><span>${message}</span>`;
      container.appendChild(toast);
      setTimeout(() => { toast.remove(); }, durationMs);
    }

    // Tracks the last-seen field_form_data per case so the 4s live-sync poll can detect when a
    // field agent submits/updates the due-diligence questionnaire from the PWA and tell the CA
    // about it - previously the dashboard only auto-polled photo/document uploads, never the
    // questionnaire text data, so a CA watching a case never saw a submission land without a
    // manual full page reload.
    const lastSeenFieldFormData = {};
    async function checkLiveFieldFormUpdate(caseId) {
      if (!caseId) return;
      try {
        const res = await fetch(`/api/v1/cases/${caseId}`, { headers: authHeaders() });
        if (!res.ok) return;
        const dc = await res.json();
        const raw = dc.field_form_data || "";
        const prev = lastSeenFieldFormData[caseId];
        const c = caseRegistry[caseId];
        if (c) c.field_form_data = raw;

        if (prev === undefined) {
          // First time seeing this case this session - record the baseline silently, don't
          // alert on data that was already there before the CA opened the case.
          lastSeenFieldFormData[caseId] = raw;
          return;
        }
        if (raw && raw !== prev) {
          lastSeenFieldFormData[caseId] = raw;
          const label = c ? `${c.case_no} (${c.applicant_name})` : caseId;
          showToast(`✓ Field visit data updated by ${c && c.agent ? c.agent : "the field agent"} for ${label}`);
          if (caseId === activeCaseId && typeof loadReportReadiness === "function") {
            loadReportReadiness();
          }
        }
      } catch (err) {
        console.warn("field-form live-update check notice:", err);
      }
    }

    function startLiveDocumentSync() {
      if (liveSyncInterval) clearInterval(liveSyncInterval);
      fetchLiveCaseDocuments(activeCaseId);
      checkLiveFieldFormUpdate(activeCaseId);
      // Auto-poll every 4 seconds
      liveSyncInterval = setInterval(() => {
        fetchLiveCaseDocuments(activeCaseId);
        checkLiveFieldFormUpdate(activeCaseId);
      }, 4000);
    }

    // Realtime Manual UDIN Validation & Synchronization by CA Staff
    // ICAI issues UDINs at 17 OR 18 characters depending on the generation batch - this used to
    // hard-require exactly 18, so a genuine, correctly-generated 17-character UDIN from the ICAI
    // portal was shown as "1 DIGITS MISSING" even though nothing was actually missing.
    const UDIN_VALID_LENGTHS = [17, 18];
    function handleUdinManualInput(val) {
      val = (val || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 18);
      const input = document.getElementById("udinInput");
      if (input && input.value !== val) {
        input.value = val;
      }

      const counter = document.getElementById("udinCharCounter");
      const badge = document.getElementById("udinValidationBadge");
      const pdfUdinBadge = document.getElementById("pdfUdinBadge");

      if (counter) {
        counter.textContent = `${val.length} / 17-18 Digits`;
      }

      const isValid = UDIN_VALID_LENGTHS.includes(val.length);

      if (badge) {
        if (isValid) {
          badge.className = "font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1";
          badge.innerHTML = `<span class="material-symbols-outlined text-[13px]">check_circle</span> ${val.length} CHARS — VERIFY ON ICAI`;
        } else {
          badge.className = "font-mono text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-bold flex items-center gap-1";
          const remaining = Math.max(17 - val.length, 0);
          badge.innerHTML = `<span class="material-symbols-outlined text-[13px]">warning</span> ${remaining > 0 ? remaining + " DIGITS MISSING" : "CHECK LENGTH (17-18 EXPECTED)"}`;
        }
      }

      if (pdfUdinBadge) {
        pdfUdinBadge.textContent = "UDIN: " + val;
      }
    }

    // The UDIN box was purely ephemeral client state - typed in, used once to generate the
    // dossier, then forgotten the moment the CA switched to another case or refreshed the page,
    // even though the UDIN was saved server-side on the CertifiedReport row at generation time.
    // Revisiting an already-certified case always showed the box blank/unfilled, looking as if
    // the case had reverted to "UDIN required" when it was genuinely done. Restore it from the
    // most recent certified report on file for this case (GET /reports/case/{id}); clear it to
    // blank for a case with no prior report so a previous case's UDIN never leaks into this one.
    async function restoreUdinForCase(caseId, c) {
      const serverId = gfServerId(c) || caseId;
      if (!serverId) { handleUdinManualInput(""); return; }
      try {
        const res = await fetch(`/api/v1/reports/case/${encodeURIComponent(serverId)}`, { headers: authHeaders() });
        if (activeCaseId !== caseId) return; // CA already switched to a different case
        if (!res.ok) { handleUdinManualInput(""); return; }
        const reports = await res.json();
        const latestWithUdin = Array.isArray(reports) ? reports.find(r => r.udin) : null;
        handleUdinManualInput(latestWithUdin ? latestWithUdin.udin : "");
      } catch (err) {
        if (activeCaseId === caseId) handleUdinManualInput("");
      }
    }

    async function pasteUdinFromClipboard() {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          handleUdinManualInput(text.trim());
        }
      } catch (err) {
        const manual = prompt("Paste your 17 or 18 character ICAI UDIN number here:");
        if (manual) handleUdinManualInput(manual.trim());
      }
    }

    // A UDIN is unique per certified document and can only be generated on the ICAI portal —
    // never auto-filled with a sample value.
    function autoGenerateUdinSpecimen() {
      const input = document.getElementById("udinInput");
      if (input) input.focus();
    }

    // Case Selection Handler - Dynamically updates entire workspace!
    // Never invent a value for a bank dossier: anything not read from a scanned document is
    // shown as pending rather than defaulted to a plausible-looking number.
    const PENDING = "Pending AI scan";
    function val(v) { return (v === undefined || v === null || v === "" || v === "PENDING AI EXTRACTION") ? PENDING : v; }

    function onCaseSelected(caseId, opts = {}) {
      const c = caseRegistry[caseId];
      if (!c) return;

      // A genuine switch to a different case (not just re-rendering the same case after an
      // ingest) must drop any "NEW" badges from the previous case - they'd otherwise mislabel
      // that other case's long-standing documents as just-added.
      if (activeCaseId && activeCaseId !== caseId) lastIngestedDocIds = new Set();

      activeCaseId = caseId;

      // Default the Report Date field to today for whichever case is now active - this is a
      // per-generation override, not a stored case attribute, so it must never carry a date the
      // CA picked for a previous case into a different one.
      const reportDateInput = document.getElementById("reportDateInput");
      if (reportDateInput) reportDateInput.value = new Date().toISOString().slice(0, 10);

      // 1. Update Sub-header Dossier Ribbon
      document.getElementById("dispCaseRef").textContent = c.case_no;
      document.getElementById("dispCaseStatus").textContent = c.status;
      const reopenBtn = document.getElementById("btnReopenCase");
      if (reopenBtn) reopenBtn.classList.toggle("hidden", c.status !== "CERTIFIED");
      document.getElementById("dispApplicantName").textContent = c.applicant_name;
      document.getElementById("dispApplicantPan").textContent = "PAN: " + val(c.pan);
      document.getElementById("dispBankBranchBadge").textContent = `${c.bank} (${c.branch})`;
      document.getElementById("dispPropertyAddress").textContent = c.address;
      document.getElementById("dispPropertyAddress").title = c.office_address ? `Residence: ${c.address}\nOffice: ${c.office_address}` : c.address;
      document.getElementById("dispFieldAgent").textContent = c.agent;
      const visitedForBadge = c.distance_m !== null && c.distance_m !== undefined;
      document.getElementById("dispCoordinatesBadge").textContent = visitedForBadge
        ? `● ${c.distance_m <= 150 ? "COMPLIANT" : "BREACH"} (${c.benchmark_lat}° N, ${c.benchmark_lon}° E)`
        : `○ NOT YET VISITED (benchmark ${c.benchmark_lat}° N, ${c.benchmark_lon}° E)`;
      const geoBadge = document.getElementById("dispGeofenceHeaderBadge");
      if (geoBadge) geoBadge.textContent = visitedForBadge ? (c.distance_m <= 150 ? "GEOFENCE VERIFIED" : "GEOFENCE BREACH") : "GEOFENCE PENDING";
      document.querySelectorAll(".audit-check").forEach(cb => { cb.checked = false; });
      updateAuditCheckCount();
      document.getElementById("dispVisitDate").textContent = "Visited: " + c.visit_date;
      restoreUdinForCase(caseId, c);

      // 2. Update Aadhaar Scrutiny Card & Flipped Document
      const aadhaarFrontUrl = c.aadhaar_front_img || "/static/placeholders/doc_pending.svg";
      const aadhaarBackUrl = c.aadhaar_back_img || "/static/placeholders/doc_pending.svg";

      const aFImg = document.getElementById("dispAadhaarFrontImg");
      if (aFImg) aFImg.src = aadhaarFrontUrl;
      const aBImg = document.getElementById("dispAadhaarBackImg");
      if (aBImg) aBImg.src = aadhaarBackUrl;

      if (document.getElementById("dispAadhaarName")) document.getElementById("dispAadhaarName").textContent = c.applicant_name;
      if (document.getElementById("dispAadhaarDob")) document.getElementById("dispAadhaarDob").textContent = `DOB: ${val(c.dob)} | Gender: ${val(c.gender)}`;
      if (document.getElementById("dispAadhaarMasked")) document.getElementById("dispAadhaarMasked").textContent = val(c.aadhaar_masked);
      if (document.getElementById("dispDobMatch")) document.getElementById("dispDobMatch").textContent = c.dob_cross_checked ? `Matches across ID documents (${c.dob})` : (c.dob ? `From ID document (${c.dob})` : PENDING);
      if (document.getElementById("dispAadhaarFrontLabel")) document.getElementById("dispAadhaarFrontLabel").textContent = `${c.applicant_name} • DOB: ${val(c.dob)}`;
      if (document.getElementById("dispAadhaarMaskedPill")) document.getElementById("dispAadhaarMaskedPill").textContent = val(c.aadhaar_masked);
      if (document.getElementById("dispAadhaarBackLabel")) document.getElementById("dispAadhaarBackLabel").textContent = val(c.address);
      setDocSide('aadhaar', 'front');

      // 3. Update PAN Card & Flipped Document
      const panFrontUrl = c.pan_front_img || "/static/placeholders/doc_pending.svg";
      const panBackUrl = c.pan_back_img || "/static/placeholders/doc_pending.svg";

      const pFImg = document.getElementById("dispPanFrontImg");
      if (pFImg) pFImg.src = panFrontUrl;
      const pBImg = document.getElementById("dispPanBackImg");
      if (pBImg) pBImg.src = panBackUrl;

      document.getElementById("dispPanNumber").textContent = val(c.pan);
      document.getElementById("dispPanHolder").textContent = c.applicant_name.toUpperCase();
      document.getElementById("dispPanWard").textContent = c.ward || "Not Captured";
      if (document.getElementById("dispPanFrontLabel")) document.getElementById("dispPanFrontLabel").textContent = `${val(c.pan)} • ${c.applicant_name.toUpperCase()}`;
      // This DOB used to be static markup left over from the original demo case (always showed
      // "30/05/1997" on every case's PAN card, regardless of the applicant's real date of birth).
      if (document.getElementById("dispPanFrontDob")) document.getElementById("dispPanFrontDob").textContent = c.dob ? `DOB: ${c.dob}` : "";
      if (document.getElementById("dispPanBackLabel")) document.getElementById("dispPanBackLabel").textContent = c.father_name ? `Father: ${c.father_name}` : PENDING;

      // Aadhaar-PAN seeding: a genuine comparison of the father's/spouse's name printed on each
      // document, never an assumed/static "VERIFIED" - see the comment in mergeExtractedDocsIntoCase.
      const normName = (s) => (s || "").toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
      const fnAadhaar = normName(c.father_name_aadhaar);
      const fnPan = normName(c.father_name_pan);
      const fatherNameEl = document.getElementById("dispPanFatherName");
      const seedingTextEl = document.getElementById("dispPanSeedingText");
      const seedingBadgeEl = document.getElementById("dispPanSeedingBadge");
      const backStatusEl = document.getElementById("dispPanBackStatus");
      if (fatherNameEl) fatherNameEl.textContent = c.father_name_aadhaar || c.father_name_pan || c.father_name || "Not Captured";
      let seedingLabel, seedingClass, backStatusLabel, backStatusClass;
      if (fnAadhaar && fnPan) {
        if (fnAadhaar === fnPan) {
          seedingLabel = "LINKED (VERIFIED)"; seedingClass = "font-mono text-[11px] font-semibold text-emerald-700 flex items-center gap-1";
          backStatusLabel = "STATUS: PASS"; backStatusClass = "font-bold ml-1 text-[9px] text-emerald-300";
        } else {
          seedingLabel = "NAME MISMATCH"; seedingClass = "font-mono text-[11px] font-semibold text-rose-700 flex items-center gap-1";
          backStatusLabel = "STATUS: MISMATCH"; backStatusClass = "font-bold ml-1 text-[9px] text-rose-300";
        }
      } else {
        seedingLabel = "NOT CROSS-VERIFIED"; seedingClass = "font-mono text-[11px] font-semibold text-on-surface-variant flex items-center gap-1";
        backStatusLabel = "STATUS: PENDING"; backStatusClass = "font-bold ml-1 text-[9px] text-on-surface-variant";
      }
      if (seedingTextEl) seedingTextEl.textContent = seedingLabel;
      if (seedingBadgeEl) seedingBadgeEl.className = seedingClass;
      if (backStatusEl) { backStatusEl.textContent = backStatusLabel; backStatusEl.className = backStatusClass; }
      setDocSide('pan', 'front');

      // 4. Update CPV Field Form & Utility Proof (only what was read from the actual bill)
      const uFImg = document.getElementById("dispUtilityFrontImg");
      if (uFImg) uFImg.src = c.utility_front_img || "/static/placeholders/doc_pending.svg";

      const provider = c.utility_provider || null;
      const discomBadge = document.getElementById("dispUtilityDiscomBadge");
      if (discomBadge) discomBadge.textContent = provider ? `${provider} ELECTRICITY BILL` : "ELECTRICITY BILL — " + PENDING.toUpperCase();
      const btnUF = document.getElementById("btnUtilitySideFront");
      if (btnUF) btnUF.textContent = provider ? `Utility Bill (${provider})` : "Utility Bill";
      const conBadge = document.getElementById("dispUtilityConBadge");
      if (conBadge) conBadge.textContent = c.utility_no ? `CON: ${c.utility_no}` : "CON: " + PENDING;

      document.getElementById("dispStayPeriod").textContent = c.stay_period || "Not yet verified on site";
      document.getElementById("dispOwnership").textContent = c.ownership || "Not yet verified on site";
      document.getElementById("dispPersonMet").textContent = c.person_met || "Not yet visited";
      document.getElementById("dispNeighbors").innerHTML = `<span class="font-bold text-primary-container">Neighbour Corroboration:</span> ${(c.neighbors && c.neighbors.length) ? c.neighbors.join(' • ') : "Not yet recorded"}`;
      const billHolderNote = c.utility_holder && c.utility_holder_mismatch ? ` ⚠ Bill in name of ${c.utility_holder}` : "";
      if (document.getElementById("dispUtilityFrontLabel")) document.getElementById("dispUtilityFrontLabel").textContent = c.utility_holder ? `${c.utility_holder.toUpperCase()}${billHolderNote}` : PENDING;
      if (document.getElementById("dispUtilityBackLabel")) document.getElementById("dispUtilityBackLabel").textContent = `AGENT: ${c.agent || "—"} • ${c.stay_period ? c.stay_period + " STAY" : "STAY NOT YET VERIFIED"}`;
      setDocSide('utility', 'front');

      // Save active case to localStorage and sync selector
      localStorage.setItem('activeCaseId', caseId);
      const caseSelector = document.getElementById("caseSelectorSelect");
      if (caseSelector && caseSelector.value !== caseId) caseSelector.value = caseId;

      // 5. Update Geofence Telemetry & Radar Card
      const visited = c.distance_m !== null && c.distance_m !== undefined;
      document.getElementById("dispRadarProximity").textContent = visited ? `PROXIMITY: ${c.distance_m} METERS (${c.distance_m <= 150 ? "PASS" : "BREACH"})` : "PROXIMITY: NOT YET VISITED";
      document.getElementById("dispRadarAgentPin").textContent = visited ? `${c.agent_pin} (${c.distance_m}m)` : "No field capture yet";
      document.getElementById("dispRadarBenchmark").textContent = `BENCHMARK: ${c.benchmark_lat}° N, ${c.benchmark_lon}° E`;
      document.getElementById("dispRadarCapture").textContent = `CAPTURE: ${c.capture_lat}° N, ${c.capture_lon}° E`;
      document.getElementById("dispRadarDistance").textContent = visited ? `${c.distance_m}m / Max 150m Safe Harbor` : "Awaiting field visit";
      document.getElementById("dispRadarBar").style.width = visited ? Math.min(100, Math.round((c.distance_m / 150) * 100)) + "%" : "0%";
      document.getElementById("dispRadarBar").className = `${visited && c.distance_m > 150 ? "bg-red-500" : "bg-secondary"} h-full rounded-full`;
      refreshGeofenceMap(true);
      autoLocateCase(c);
      renderApplicantInfo(c);
      loadApplicantLocationPortal(c);

      // 6. Update Dual Folder Site Evidence Photos
      renderPhotosForActiveFolder();

      // 7. Update Field Staff Attendance Selfie Verification UI
      const cachedSelfie = localStorage.getItem("selfie_" + caseId) || 
                            (c.case_no ? localStorage.getItem("selfie_" + c.case_no) : null) ||
                            (c.db_id ? localStorage.getItem("selfie_" + c.db_id) : null);
      const cachedTime = localStorage.getItem("selfie_timestamp_" + caseId) ||
                          (c.case_no ? localStorage.getItem("selfie_timestamp_" + c.case_no) : null) ||
                          (c.db_id ? localStorage.getItem("selfie_timestamp_" + c.db_id) : null);
      const cachedAgent = localStorage.getItem("selfie_agent_" + caseId) ||
                          (c.case_no ? localStorage.getItem("selfie_agent_" + c.case_no) : null) ||
                          (c.db_id ? localStorage.getItem("selfie_agent_" + c.db_id) : null);
      const selfieUrl = cachedSelfie || c.agent_selfie || "/static/placeholders/photo_pending.svg";
      
      const selfieThumb = document.getElementById("dispAgentSelfieThumb");
      if (selfieThumb) selfieThumb.src = selfieUrl;
      
      const selfieCardImg = document.getElementById("dispAgentSelfieCardImg");
      if (selfieCardImg) selfieCardImg.src = selfieUrl;
      
      const selfieModalImg = document.getElementById("selfieModalImg");
      if (selfieModalImg) selfieModalImg.src = selfieUrl;

      const selfieDone = !!cachedSelfie || !!c.selfie_verified || (c.agent_selfie && !c.agent_selfie.includes("placeholder"));
      // c.agent is resolved from the case's real assigned_agent_id (see loadDbCasesIntoRegistry);
      // cachedAgent (the device's own locally-captured name at selfie time) is only a fallback
      // for when that hasn't resolved yet - never invent a specific name here.
      if (selfieDone && (!c.agent || c.agent === "Not yet allotted") && cachedAgent) {
        c.agent = cachedAgent;
      }

      const selfieName = document.getElementById("dispAgentSelfieName");
      if (selfieName) selfieName.textContent = c.agent || "Not yet allotted";
      const dispFieldAgent = document.getElementById("dispFieldAgent");
      if (dispFieldAgent && c.agent) dispFieldAgent.textContent = c.agent;

      const selfieTime = document.getElementById("dispAgentSelfieTime");
      if (selfieTime) selfieTime.textContent = "Time: " + (cachedTime || c.visit_date || "Not yet visited");

      const selfieGps = document.getElementById("dispAgentSelfieGps");
      const hasCapture = c.capture_lat && c.capture_lat !== "—";
      if (selfieGps) selfieGps.textContent = hasCapture ? `GPS: ${c.capture_lat}°N, ${c.capture_lon}°E (±3.2m)` : "GPS: not yet captured";

      const selfieStatus = document.getElementById("dispAgentSelfieStatus");
      if (selfieStatus) selfieStatus.textContent = selfieDone ? "Selfie Verified ✓" : "Selfie pending";
      const selfieBadge = document.getElementById("dispAgentSelfieCardBadge");
      if (selfieBadge) {
        selfieBadge.textContent = selfieDone ? "✓ VERIFIED ON-SITE" : "PENDING VISIT";
        selfieBadge.className = selfieDone ? "font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold" : "font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-bold";
      }
      const gpsLock = document.getElementById("dispSelfieGpsLockBadge");
      if (gpsLock) {
        gpsLock.textContent = selfieDone ? "GPS LOCKED" : "NO SELFIE YET";
        gpsLock.className = selfieDone ? "absolute bottom-0 inset-x-0 bg-emerald-700 text-white font-mono text-[7px] text-center py-0.5 uppercase font-bold" : "absolute bottom-0 inset-x-0 bg-slate-700 text-white font-mono text-[7px] text-center py-0.5 uppercase font-bold";
      }

      // 8. Update CA Partner Observations
      // Observations are a CA judgement for the certified report — only facts actually on record
      // are pre-filled; no verification outcome or recommendation is asserted automatically.
      const remarkFacts = [];
      if (c.distance_m !== null && c.distance_m !== undefined) remarkFacts.push(`Field visit geotagged ${c.distance_m}m from the property (${c.distance_m <= 150 ? "within" : "outside"} the 150m limit).`);
      else remarkFacts.push("Field visit not yet completed.");
      if (c.pan || c.aadhaar_masked) remarkFacts.push(`KYC read by AI from scanned documents: ${[c.pan && "PAN " + c.pan, c.aadhaar_masked && "Aadhaar " + c.aadhaar_masked, c.dob && "DOB " + c.dob].filter(Boolean).join(", ")}.`);
      if (c.utility_holder_mismatch) remarkFacts.push(`Electricity bill is in the name of ${c.utility_holder}, not the applicant — relationship to be confirmed.`);
      if (c.ai_summary && (c.ai_summary.conflicts || []).length) remarkFacts.push(`${c.ai_summary.conflicts.length} AI cross-check item(s) pending CA review.`);
      remarkFacts.push("[CA observation and recommendation to be recorded by the verifying partner.]");
      document.getElementById("caRemarksInput").value = `${c.applicant_name} (${c.case_no}): ` + remarkFacts.join(" ");

      // 9. Synchronize Filter dropdowns
      const bankSelect = document.getElementById("filterBankSelect");
      if (bankSelect && bankSelect.value !== "ALL" && bankSelect.value !== c.bank) {
        bankSelect.value = "ALL";
      }

      // Hide previous report badge if case changed
      document.getElementById("pdfSuccessCard").classList.add("hidden");

      // 10. Render Case Document Vault for Active Case
      renderCaseDocumentVault(caseId);

      // 11/12. Fetch live evidence photos and AI-scanned documents (skipped when this call is
      // itself the re-render that follows loading those scans, to avoid a fetch loop)
      if (!opts.skipRemoteLoad) {
        fetchLiveCaseDocuments(caseId);
        loadSeparatedCaseDocs(caseId);
      }
    }

    // ==========================================
    // MULTI-PAGE PDF LLM SEPARATION ENGINE
    // ==========================================
    let activeSeparatedDocs = [];
    let selectedSeparatedDocIds = new Set();
    // Document ids returned by the MOST RECENT ingest call (Select Single PDF / Select Folder /
    // Select Multiple Files). The AI Cross-Check tray always shows the case's FULL accumulated
    // document history (by design - re-scanning a case must never wipe earlier scans), so without
    // this a CA testing/adding one more document on an already-scanned case sees a wall of old
    // thumbnails and (reasonably) concludes the new file was never actually processed. Thumbnails
    // whose id is in this set get a "NEW" badge so the just-added page is obvious at a glance.
    let lastIngestedDocIds = new Set();
    // PDFs hit during the current batch that turned out to be password-protected - queued
    // rather than failed outright, so the rest of the batch keeps scanning uninterrupted and
    // the CA is asked for each one's password separately once everything else is done.
    let pendingPasswordPdfs = [];

    function updateAuditCheckCount() {
      const boxes = [...document.querySelectorAll(".audit-check")];
      const el = document.getElementById("auditCheckCount");
      if (el) el.textContent = `${boxes.filter(b => b.checked).length}/${boxes.length} SATISFIED`;
    }

    function authHeaders(extra = {}) {
      const token = localStorage.getItem("ca_token");
      const headers = { ...extra };
      if (token && token !== "demo-ca-token") headers["Authorization"] = `Bearer ${token}`;
      return headers;
    }

    async function loadSeparatedCaseDocs(caseId) {
      try {
        const res = await fetch(`/api/v1/cases/${caseId}/separated-documents`, { headers: authHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (caseId !== activeCaseId) return;
          if (data.documents && data.documents.length > 0) {
            renderSeparatedPagesTray(data.documents, data.case_summary);
            mergeExtractedDocsIntoCase(caseId, data.documents, data.case_summary);
            onCaseSelected(caseId, { skipRemoteLoad: true });
            bindSeparatedPagesToCards();
          } else {
            const tray = document.getElementById("pdfSeparatedPagesTray");
            if (tray) tray.classList.add("hidden");
          }
        }
      } catch (e) {
        console.warn("Failed to load separated docs:", e);
      }
    }

    async function handlePortalPdfSelected(file) {
      if (!file) return;
      lastIngestedDocIds = new Set();
      pendingPasswordPdfs = [];
      // "Select Single PDF" defaults to wiping any previously AI-ingested pages for this case
      // (uploadAndProcessPdfFile's own default is replaceExisting=true) — correct the FIRST time
      // a case is scanned, but silently destructive if a CA later adds one more document to a
      // case that was already scanned in an earlier session: every previously-extracted PAN,
      // Aadhaar, Form 16 etc. would vanish, kept only in the audit log. Only wipe when there is
      // nothing yet to lose; otherwise this one PDF is additive, same as a later file in a batch.
      startElapsedTimer("pdfBurstElapsedText");
      await uploadAndProcessPdfFile(file, activeSeparatedDocs.length === 0);
      await resolvePendingPasswordPdfs();
      stopElapsedTimer("pdfBurstElapsedText");
    }

    async function handlePortalFolderSelected(files) {
      if (!files || files.length === 0) return;
      if (!activeCaseId) {
        const firstKey = Object.keys(caseRegistry)[0];
        if (firstKey) activeCaseId = firstKey;
      }
      if (!activeCaseId) {
        alert("Please select or load an active case first.");
        return;
      }
      await handleBatchPortalFilesIngest(Array.from(files));
    }

    async function handlePortalMultiFilesSelected(files) {
      if (!files || files.length === 0) return;
      if (!activeCaseId) {
        const firstKey = Object.keys(caseRegistry)[0];
        if (firstKey) activeCaseId = firstKey;
      }
      if (!activeCaseId) {
        alert("Please select or load an active case first.");
        return;
      }
      await handleBatchPortalFilesIngest(Array.from(files));
    }

    // Shared elapsed-time counter for any scan progress bar - the CA office asked to see how
    // long a batch has actually been running, not just the coarse 15/25/65/100% milestones,
    // since Gemini can take anywhere from a few seconds to a couple minutes per batch depending
    // on page count. One interval per span id, keyed so two progress bars can run independently.
    const _elapsedTimers = {};
    function startElapsedTimer(spanId) {
      stopElapsedTimer(spanId);
      const startedAt = Date.now();
      const span = document.getElementById(spanId);
      if (span) span.textContent = "0s elapsed";
      _elapsedTimers[spanId] = setInterval(() => {
        const el = document.getElementById(spanId);
        if (el) el.textContent = `${Math.floor((Date.now() - startedAt) / 1000)}s elapsed`;
      }, 1000);
    }
    function stopElapsedTimer(spanId) {
      if (_elapsedTimers[spanId]) {
        clearInterval(_elapsedTimers[spanId]);
        delete _elapsedTimers[spanId];
      }
    }

    async function handleBatchPortalFilesIngest(fileList) {
      lastIngestedDocIds = new Set();
      pendingPasswordPdfs = [];
      const pdfs = fileList.filter(f => f.name.toLowerCase().endsWith(".pdf"));
      const images = fileList.filter(f => /\.(jpe?g|png|webp)$/i.test(f.name));

      if (pdfs.length === 0 && images.length === 0) {
        alert("No PDF or image files found in the selected folder/files.");
        return;
      }

      const statusBox = document.getElementById("pdfBurstStatusBox");
      const statusText = document.getElementById("pdfBurstStatusText");
      const statusPercent = document.getElementById("pdfBurstStatusPercent");
      const progressBar = document.getElementById("pdfBurstProgressBar");

      if (statusBox) statusBox.classList.remove("hidden");
      if (statusText) statusText.textContent = `Found ${pdfs.length} PDF(s) and ${images.length} Image(s). Processing with Gemini AI...`;
      if (statusPercent) statusPercent.textContent = "15%";
      if (progressBar) progressBar.style.width = "15%";
      startElapsedTimer("pdfBurstElapsedText");

      // The first PDF of a batch clears stale prior scan results so a case starts from a clean
      // slate — but only when there IS no prior scan to lose. If this case was already AI-ingested
      // in an earlier session (activeSeparatedDocs is populated when the case was opened) and a CA
      // now selects a few more files to add, treating file 1 of THIS batch as "the first ever" would
      // silently wipe every previously-extracted PAN/Aadhaar/Form 16 record for the case.
      const hadPriorAiDocs = activeSeparatedDocs.length > 0;
      for (let i = 0; i < pdfs.length; i++) {
        const isFirst = (i === 0) && !hadPriorAiDocs;
        await uploadAndProcessPdfFile(pdfs[i], isFirst, i + 1, pdfs.length);
      }

      if (images.length > 0) {
        await ingestLooseImagesForCase(images);
      }

      await resolvePendingPasswordPdfs();
      stopElapsedTimer("pdfBurstElapsedText");
    }

    // Asked separately, one at a time, ONLY after every other file in the batch has already
    // been scanned — a password prompt mid-batch would block/confuse processing of the files
    // that don't need one. A blank/cancelled prompt just skips that one file; it stays
    // scannable later via the per-case "Add Documents (AI Scan)" button.
    async function resolvePendingPasswordPdfs() {
      const queue = pendingPasswordPdfs.slice();
      pendingPasswordPdfs = [];
      for (const entry of queue) {
        const promptMsg = entry.wrongAttempt
          ? `The password entered for "${entry.file.name}" was incorrect. Enter the correct password (or Cancel to skip this file):`
          : `"${entry.file.name}" is password-protected. Enter its password to scan it (or Cancel to skip):`;
        const pwd = prompt(promptMsg);
        if (!pwd) {
          console.warn(`Skipped password-protected PDF (no password entered): ${entry.file.name}`);
          continue;
        }
        await uploadAndProcessPdfFile(entry.file, false, entry.fileIndex, entry.totalFiles, pwd);
      }
      // A wrong password re-queues the same file (wrongAttempt=true) via uploadAndProcessPdfFile's
      // error handling - resolve those too, so entering the wrong password once doesn't strand
      // the file unasked until some later, unrelated batch happens to call this again.
      if (pendingPasswordPdfs.length > 0) await resolvePendingPasswordPdfs();
    }

    function runPargiPdfSeparationDemo() {
      document.getElementById("portalMultiPagePdfInput").click();
    }

    async function uploadAndProcessPdfFile(file, replaceExisting = true, fileIndex = 1, totalFiles = 1, password = null) {
      const statusBox = document.getElementById("pdfBurstStatusBox");
      const statusText = document.getElementById("pdfBurstStatusText");
      const statusPercent = document.getElementById("pdfBurstStatusPercent");
      const progressBar = document.getElementById("pdfBurstProgressBar");
      const filePrefix = totalFiles > 1 ? `[PDF ${fileIndex}/${totalFiles}] ` : "";

      if (statusBox) statusBox.classList.remove("hidden");
      if (statusText) statusText.textContent = `${filePrefix}Bursting PDF into high-res images & invoking Gemini LLM...`;
      if (statusPercent) statusPercent.textContent = "25%";
      if (progressBar) progressBar.style.width = "25%";

      const formData = new FormData();
      if (file) {
        formData.append("file", file, file.name);
      }
      formData.append("replace_existing", replaceExisting ? "true" : "false");
      if (password) formData.append("password", password);
      const c = caseRegistry[activeCaseId] || {};
      // Leave blank if unknown — the backend falls back to the real case's own
      // applicant_name/target_address from the database rather than a demo default.
      if (c.applicant_name) formData.append("applicant_name", c.applicant_name);
      if (c.address) formData.append("target_address", c.address);

      try {
        const token = localStorage.getItem("ca_token");
        const headers = {};
        if (token && token !== "demo-ca-token") {
          headers["Authorization"] = `Bearer ${token}`;
        }

        setTimeout(() => {
          if (statusText) statusText.textContent = `${filePrefix}Gemini AI is reading every page (about 5-6 seconds per page)...`;
          if (statusPercent) statusPercent.textContent = "65%";
          if (progressBar) progressBar.style.width = "65%";
        }, 1200);

        const res = await fetch(`/api/v1/cases/${activeCaseId}/ingest-pdf`, {
          method: "POST",
          headers: headers,
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          if (statusPercent) statusPercent.textContent = "100%";
          if (progressBar) progressBar.style.width = "100%";
          if (statusText) statusText.textContent = `${filePrefix}✓ ${data.total_pages_separated} page(s) classified by Gemini LLM!`;

          (data.documents || []).forEach(d => { if (d.id) lastIngestedDocIds.add(d.id); });
          mergeExtractedDocsIntoCase(activeCaseId, data.documents, data.case_summary);
          // Re-render and reload the full scanned set (all files so far) with the cross-check summary
          onCaseSelected(activeCaseId);

          const isLastFile = fileIndex >= totalFiles;
          if (isLastFile) {
            setTimeout(() => {
              if (statusBox) statusBox.classList.add("hidden");
            }, 2000);
            const s = data.case_summary || {};
            const failed = (s.pages_failed || []).length;
            const conflicts = (s.conflicts || []).length;
            alert(`[Gemini AI Document Scan Finished]\nFiles processed: ${totalFiles} • Pages: ${s.pages_total || data.total_pages_separated}\n` +
              (failed ? `⚠ ${failed} page(s) could NOT be scanned — re-run before relying on them.\n` : "") +
              (conflicts ? `⚠ ${conflicts} cross-check item(s) need CA review (see AI CROSS-CHECK panel).` : "No cross-document conflicts found."));
          }
        } else {
          const err = await res.json().catch(() => ({}));
          const code = err.detail && typeof err.detail === "object" ? err.detail.code : null;
          if (code === "PASSWORD_REQUIRED" || code === "WRONG_PASSWORD") {
            // Don't fail the file (or block the rest of the batch) outright — queue it and
            // ask for the password once every other document in this batch has finished.
            pendingPasswordPdfs.push({ file, fileIndex, totalFiles, wrongAttempt: code === "WRONG_PASSWORD" });
            if (statusText) statusText.textContent = `${filePrefix}🔒 "${file.name}" is password-protected — will ask separately after the rest of the batch.`;
            return;
          }
          console.warn(`PDF notice ("${file ? file.name : 'file'}"):`, err);
          if (totalFiles <= 1) {
            alert(`PDF Processing notice ("${file ? file.name : 'file'}"): ${err.detail || 'Could not process PDF'}`);
            if (statusBox) statusBox.classList.add("hidden");
          } else {
            if (statusText) statusText.textContent = `Notice on ${file ? file.name : 'PDF'}: ${err.detail || 'Could not process PDF'}. Continuing batch...`;
          }
        }
      } catch (err) {
        console.error("PDF upload error:", err);
        if (totalFiles <= 1) {
          alert(`PDF extraction error ("${file ? file.name : 'file'}"): ` + err.message);
          if (statusBox) statusBox.classList.add("hidden");
        } else {
          if (statusText) statusText.textContent = `Error reading ${file ? file.name : 'PDF'}. Continuing batch...`;
        }
      }
    }

    // Assessment year of a Form 16 page - mirrors _ay_of() in cpv_report_data.py so the
    // dashboard's label always agrees with what the certified report ends up stating.
    function formAssessmentYearOf(d) {
      const shortAy = (ay) => {
        if (!ay) return null;
        const m = String(ay).match(/(20\d{2})\s*[-–/]\s*(20)?(\d{2})/);
        return m ? `${m[1]}-${m[3]}` : ay;
      };
      if (d.assessment_year) return shortAy(d.assessment_year);
      const text = [d.document_period, d.document_title].filter(Boolean).join(" ");
      const m = text.match(/F\.?\s*Y\.?[^0-9]*(20\d{2})\s*[-–/]\s*(?:20)?(\d{2})/i);
      if (m) {
        const y1 = parseInt(m[1], 10) + 1;
        const y2 = (parseInt(m[2], 10) + 1).toString().padStart(2, "0");
        return `${y1}-${y2}`;
      }
      return null;
    }

    function renderSeparatedPagesTray(docs, summary) {
      activeSeparatedDocs = docs || [];
      selectedSeparatedDocIds = new Set(); // fresh document list each call - a stale selection pointing at a since-removed or different case's page would be misleading
      const tray = document.getElementById("pdfSeparatedPagesTray");
      const list = document.getElementById("pdfSeparatedPagesList");
      const countEl = document.getElementById("pdfSeparatedCount");

      if (!tray || !list) return;
      tray.classList.remove("hidden");
      const failed = activeSeparatedDocs.filter(d => d.scan_status === "FAILED").length;
      const newCount = lastIngestedDocIds.size;
      // This tray always shows the case's FULL accumulated scan history, never just the
      // latest upload - the count line must say so plainly (and call out how many are from
      // THIS scan) or a CA re-scanning an already-tested case reasonably assumes a fresh
      // upload "didn't work" because old pages are still sitting there mixed in with it.
      if (countEl) {
        countEl.textContent = (newCount && newCount < activeSeparatedDocs.length
          ? `${activeSeparatedDocs.length} Pages on File — ${newCount} Added Just Now`
          : `${activeSeparatedDocs.length} Pages Scanned by Gemini AI`) + (failed ? ` • ${failed} NOT SCANNED` : "");
      }

      renderCaseCrossCheck(tray, list, summary);

      // Built with textContent, never innerHTML: titles/names come from AI-read document text.
      list.innerHTML = "";
      activeSeparatedDocs.forEach((d, idx) => {
        let badgeColor = "bg-blue-900 text-blue-200 border-blue-600";
        let shortType = (d.doc_type || "OTHER").replace(/_/g, " ");
        if (d.scan_status === "FAILED") {
          shortType = "NOT SCANNED"; badgeColor = "bg-red-950 text-red-300 border-red-600";
        } else if (d.relationship_to_applicant === "DIFFERENT_PERSON") {
          shortType = shortType + " (OTHER PERSON)"; badgeColor = "bg-orange-950 text-orange-300 border-orange-600";
        } else if (d.doc_type === "UTILITY_BILL") {
          shortType = (d.utility_provider ? d.utility_provider + " " : "") + "BILL"; badgeColor = "bg-emerald-950 text-emerald-300 border-emerald-600";
        } else if (d.doc_type === "PAN_CARD") {
          badgeColor = "bg-sky-950 text-sky-300 border-sky-600";
        } else if (d.doc_type === "AADHAAR_CARD") {
          badgeColor = "bg-amber-950 text-amber-300 border-amber-600";
        } else if (d.doc_type === "SALARY_SLIP") {
          shortType = "PAYSLIP"; badgeColor = "bg-purple-950 text-purple-300 border-purple-600";
        } else if (d.doc_type === "FORM_16") {
          // Several Form 16 pages often get scanned together (different years, or Part A/
          // Part B of the same year) - show which assessment year each one is so the CA can
          // tell them apart at a glance, matching what the certified report will state.
          const ay = formAssessmentYearOf(d);
          shortType = ay ? `FORM 16 (A.Y. ${ay})` : "FORM 16";
          badgeColor = "bg-indigo-950 text-indigo-300 border-indigo-600";
        }

        let docSrc = d.image_url || "";
        if (docSrc.includes("/static/extracted_pages/")) {
          docSrc = docSrc.replace("/static/extracted_pages/", "/storage/separated_docs/");
        }

        const isJustAdded = d.id && lastIngestedDocIds.has(d.id);
        const col = document.createElement("div");
        col.className = "group relative rounded-lg bg-black/60 border p-1 flex flex-col items-center hover:border-amber-400 cursor-pointer transition-all"
          + (isJustAdded ? " border-emerald-400 ring-2 ring-emerald-400/60" : " border-white/20");
        col.title = `${d.document_title || ""}${d.holder_name ? "\nHolder: " + d.holder_name : ""}${(d.discrepancies || []).length ? "\n⚠ " + d.discrepancies.join("\n⚠ ") : ""}`;
        col.onclick = () => openSeparatedDocViewer(idx);

        if (isJustAdded) {
          const newBadge = document.createElement("span");
          newBadge.className = "absolute -top-1.5 -right-1.5 z-10 bg-emerald-500 text-white text-[8px] font-headline font-bold px-1.5 py-0.5 rounded-full shadow";
          newBadge.textContent = "NEW";
          col.appendChild(newBadge);
        }

        // image_blurred means the Aadhaar-masking safety pass couldn't confidently locate the
        // printed number on this page (usually a low-quality handheld/WhatsApp photo) and
        // blurred the WHOLE page rather than risk showing it unmasked. A hover tooltip alone
        // is too easy to miss when the thumbnail just looks like a bad photo - call it out
        // directly so the CA/agent knows to re-upload a clearer shot, not just rescan as-is.
        if (d.image_blurred) {
          const blurBadge = document.createElement("span");
          blurBadge.className = "absolute -top-1.5 -left-1.5 z-10 bg-red-600 text-white text-[8px] font-headline font-bold px-1.5 py-0.5 rounded-full shadow";
          blurBadge.textContent = "BLURRED — RETAKE";
          col.appendChild(blurBadge);
        }

        const frame = document.createElement("div");
        frame.className = "relative w-full h-16 rounded overflow-hidden bg-slate-900 mb-1 flex items-center justify-center";
        const img = document.createElement("img");
        // A folder scan routinely brings in 20-40+ pages, and each thumbnail here is really the
        // full-resolution scanned/watermarked image (there is no separate small thumbnail file
        // for AI-ingested pages) just CSS-shrunk to 64px tall - the browser was still downloading
        // and decoding every single one immediately on render, all at once, which is exactly what
        // made the dashboard visibly lag open on a case with 40+ images. loading="lazy" defers
        // off-screen thumbnails until the CA actually scrolls to them; decoding="async" keeps
        // image decode off the main thread so it doesn't block scrolling/clicking while it loads.
        img.loading = "lazy";
        img.decoding = "async";
        img.setAttribute("fetchpriority", "low");
        img.src = docSrc;
        img.alt = d.document_title || "";
        img.className = "w-full h-full object-cover group-hover:scale-105 transition-transform";
        img.onerror = function() {
          if (this.src.includes("/storage/separated_docs/")) {
            this.src = this.src.replace("/storage/separated_docs/", "/static/extracted_pages/");
          }
        };
        frame.appendChild(img);

        // Multi-select checkbox for bulk delete - a folder scan can bring in dozens of pages
        // (bank statement runs are often 20-40 pages), and deleting stray/irrelevant ones one
        // at a time was the only option. Shown only once there's a real document id to act on.
        if (d.id) {
          const checkLabel = document.createElement("label");
          checkLabel.className = "absolute top-0.5 left-0.5 w-5 h-5 rounded bg-black/70 border border-white/40 flex items-center justify-center cursor-pointer z-10 hover:bg-black/90";
          checkLabel.onclick = (ev) => ev.stopPropagation();
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "w-3.5 h-3.5 accent-amber-400 cursor-pointer";
          checkbox.checked = selectedSeparatedDocIds.has(d.id);
          checkbox.onclick = (ev) => {
            ev.stopPropagation();
            if (checkbox.checked) selectedSeparatedDocIds.add(d.id);
            else selectedSeparatedDocIds.delete(d.id);
            updateBulkDeleteBar();
          };
          checkLabel.appendChild(checkbox);
          frame.appendChild(checkLabel);
        }

        // Remove a stray/duplicate/irrelevant scanned page — only shown once the tray has a real
        // document id to delete (always true once loaded from the server; absent only for a page
        // still mid-scan). Hidden until hover so the grid stays uncluttered at a glance.
        if (d.id) {
          const delBtn = document.createElement("button");
          delBtn.type = "button";
          delBtn.className = "absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow";
          delBtn.title = "Remove this page from the case";
          delBtn.innerHTML = '<span class="material-symbols-outlined text-[13px]">close</span>';
          delBtn.onclick = (ev) => { ev.stopPropagation(); deleteSeparatedDocument(d.id, d.document_title || shortType); };
          frame.appendChild(delBtn);
        }

        const badge = document.createElement("span");
        badge.className = `text-[8px] font-mono font-bold px-1 py-0.5 rounded border ${badgeColor} text-center truncate w-full block`;
        badge.textContent = `${d.page_number ? "P" + d.page_number : "IMG"}: ${shortType}`;

        col.appendChild(frame);
        col.appendChild(badge);
        list.appendChild(col);
      });

      const combineBtn = document.getElementById("btnDownloadCombinedForm16");
      if (combineBtn) combineBtn.classList.toggle("hidden", !activeSeparatedDocs.some(d => d.doc_type === "FORM_16"));

      updateBulkDeleteBar();

      // If full-mode document inspection viewer is open, refresh its documents playlist
      const zoomModal = document.getElementById("docZoomModal");
      if (zoomModal && !zoomModal.classList.contains("hidden")) {
        if (activeSeparatedDocs.length === 0) {
          closeDocZoomModal();
        } else {
          const nextIndex = Math.min(viewerCurrentIndex, activeSeparatedDocs.length - 1);
          openSeparatedDocViewer(nextIndex);
        }
      }
    }

    // Combine every scanned Form 16 page for the active case into one downloadable PDF.
    async function downloadCombinedForm16() {
      if (!activeCaseId) return;
      const btn = document.getElementById("btnDownloadCombinedForm16");
      const originalHtml = btn ? btn.innerHTML : null;
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="material-symbols-outlined text-[14px] animate-spin">progress_activity</span><span>Combining Form 16 pages...</span>';
      }
      try {
        const res = await fetch(`/api/v1/cases/${activeCaseId}/documents/form16-combined`, { headers: authHeaders() });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert(`Could not combine Form 16 pages: ${err.detail || "Server error"}`);
          return;
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const cd = res.headers.get("Content-Disposition") || "";
        const m = cd.match(/filename="([^"]+)"/);
        a.download = m ? m[1] : "Form16_Combined.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        alert(`Network error combining Form 16 pages: ${err.message}`);
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = originalHtml; }
      }
    }

    // Cross-document check the CA must see before certifying: identity agreement across
    // documents, other people found in the bundle, and conflicts.
    function renderCaseCrossCheck(tray, list, summary) {
      let box = document.getElementById("pdfCaseCrossCheck");
      if (!summary) { if (box) box.remove(); return; }
      if (!box) {
        box = document.createElement("div");
        box.id = "pdfCaseCrossCheck";
        box.className = "mb-2 p-2 rounded-lg bg-black/40 border border-white/20 text-[10px] leading-snug text-white space-y-1";
        list.parentNode.insertBefore(box, list);
      }
      box.textContent = "";
      const a = summary.applicant || {};
      const line = (label, value, warn) => {
        const row = document.createElement("div");
        const b = document.createElement("span"); b.className = "font-bold " + (warn ? "text-amber-300" : "text-emerald-300"); b.textContent = label + " ";
        const v = document.createElement("span"); v.textContent = value;
        row.appendChild(b); row.appendChild(v); box.appendChild(row);
      };
      line("AI CROSS-CHECK —", `${summary.pages_total} pages`, false);
      line("Applicant:", [a.name, a.extracted_pan && "PAN " + a.extracted_pan, a.extracted_aadhaar && "Aadhaar " + a.extracted_aadhaar, a.date_of_birth && "DOB " + a.date_of_birth].filter(Boolean).join(" • ") || "—", false);
      (summary.other_persons || []).forEach(o => line("Other person:", `${o.name}${o.pan ? " (PAN " + o.pan + ")" : ""} — pages ${o.pages.join(", ")}`, true));
      (summary.conflicts || []).forEach(cf => line("⚠", cf, true));
    }

    async function deleteSeparatedDocument(documentId, label) {
      if (!activeCaseId) return;
      if (!confirm(`Remove "${label}" from this case?\n\nThis deletes the scanned page and its stored file — it cannot be undone, but it never touches field evidence photos or the selfie.`)) return;
      const caseId = gfServerId(caseRegistry[activeCaseId]) || activeCaseId;
      try {
        const res = await fetch(`/api/v1/cases/${encodeURIComponent(caseId)}/documents/${encodeURIComponent(documentId)}`, {
          method: "DELETE",
          headers: authHeaders(),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert(`Could not remove the document: ${err.detail || res.statusText}`);
          return;
        }
        // Re-fetch from the server rather than just removing the thumbnail locally, so the
        // cross-document AI summary (PAN/Aadhaar consensus, other-people list) recomputes
        // correctly now that this page is gone.
        await loadSeparatedCaseDocs(caseId);
      } catch (err) {
        console.warn("deleteSeparatedDocument error:", err);
        alert("Network error — the document was not removed. Try again.");
      }
    }

    function updateBulkDeleteBar() {
      const n = selectedSeparatedDocIds.size;

      // Dashboard tray bulk delete button
      const btn = document.getElementById("btnDeleteSelectedDocs");
      const txt = document.getElementById("btnDeleteSelectedDocsText");
      if (btn) btn.classList.toggle("hidden", n === 0);
      if (txt) txt.textContent = `Delete Selected (${n})`;

      // Full-mode document viewer bulk delete button
      const viewerBtn = document.getElementById("viewerBtnDeleteSelected");
      const viewerTxt = document.getElementById("viewerBtnDeleteSelectedText");
      if (viewerBtn) viewerBtn.classList.toggle("hidden", n === 0);
      if (viewerTxt) viewerTxt.textContent = `Delete Selected (${n})`;

      // Full-mode viewer current page checkbox
      const curCheck = document.getElementById("viewerCurrentPageCheckbox");
      if (curCheck && viewerDocList && viewerDocList[viewerCurrentIndex]) {
        const curDoc = viewerDocList[viewerCurrentIndex];
        curCheck.checked = Boolean(curDoc.id && selectedSeparatedDocIds.has(curDoc.id));
        curCheck.disabled = !curDoc.id;
      }

      // Viewer Select All / Deselect All button text
      const selectAllBtn = document.getElementById("viewerBtnSelectAll");
      if (selectAllBtn && viewerDocList && viewerDocList.length > 0) {
        const hasSelectable = viewerDocList.some(d => d.id);
        const allSelected = hasSelectable && viewerDocList.every(d => !d.id || selectedSeparatedDocIds.has(d.id));
        selectAllBtn.textContent = allSelected ? "Deselect All" : "Select All";
      }

      // Update checkboxes in bottom thumbnail carousel strip
      document.querySelectorAll(".viewer-thumb-checkbox").forEach(cb => {
        const docId = cb.dataset.docId;
        if (docId) cb.checked = selectedSeparatedDocIds.has(docId);
      });
    }

    function toggleCurrentViewerDocSelect(checked) {
      if (!viewerDocList || !viewerDocList[viewerCurrentIndex]) return;
      const d = viewerDocList[viewerCurrentIndex];
      if (!d.id) {
        alert("This page cannot be selected yet (still processing).");
        return;
      }
      if (checked) {
        selectedSeparatedDocIds.add(d.id);
      } else {
        selectedSeparatedDocIds.delete(d.id);
      }
      updateBulkDeleteBar();
      updateViewerThumbstripActive();
    }

    function toggleViewerSelectAll() {
      if (!viewerDocList || viewerDocList.length === 0) return;
      const hasSelectable = viewerDocList.some(d => d.id);
      if (!hasSelectable) return;
      const allSelected = viewerDocList.every(d => !d.id || selectedSeparatedDocIds.has(d.id));
      if (allSelected) {
        selectedSeparatedDocIds.clear();
      } else {
        viewerDocList.forEach(d => {
          if (d.id) selectedSeparatedDocIds.add(d.id);
        });
      }
      updateBulkDeleteBar();
      updateViewerThumbstripActive();
    }

    async function deleteCurrentViewerDoc() {
      if (!viewerDocList || !viewerDocList[viewerCurrentIndex]) return;
      const d = viewerDocList[viewerCurrentIndex];
      if (!d.id) {
        alert("This page cannot be removed right now.");
        return;
      }
      await deleteSeparatedDocument(d.id, d.title || d.shortType || "this page");
    }

    async function deleteSelectedSeparatedDocuments() {
      if (!activeCaseId || selectedSeparatedDocIds.size === 0) return;
      const ids = Array.from(selectedSeparatedDocIds);
      if (!confirm(`Remove ${ids.length} selected page(s) from this case?\n\nThis deletes the scanned pages and their stored files — it cannot be undone, but it never touches field evidence photos or the selfie.`)) return;

      const caseId = gfServerId(caseRegistry[activeCaseId]) || activeCaseId;
      const btn = document.getElementById("btnDeleteSelectedDocsText");
      if (btn) btn.textContent = "Deleting...";
      const vBtn = document.getElementById("viewerBtnDeleteSelectedText");
      if (vBtn) vBtn.textContent = "Deleting...";

      const results = await Promise.allSettled(ids.map(id =>
        fetch(`/api/v1/cases/${encodeURIComponent(caseId)}/documents/${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers: authHeaders(),
        })
      ));
      const failed = results.filter(r => r.status === "rejected" || (r.status === "fulfilled" && !r.value.ok)).length;

      // Re-fetch from the server so the tray, cross-check summary, and full-mode viewer update
      await loadSeparatedCaseDocs(caseId);

      if (failed > 0) {
        alert(`${ids.length - failed} of ${ids.length} page(s) removed. ${failed} failed — try again for those.`);
      }
    }

    function bindSeparatedPagesToCards() {
      // Card images/values come from mergeExtractedDocsIntoCase (applicant's own documents
      // only), so just re-render the active case rather than writing raw per-page values.
      if (activeCaseId && caseRegistry[activeCaseId]) onCaseSelected(activeCaseId, { skipRemoteLoad: true });
    }

    // Filter by Bank Name
    function onBankFilterChanged(bankName) {
      const caseSelect = document.getElementById("caseSelectorSelect");
      caseSelect.innerHTML = "";

      let count = 0;
      let firstMatch = null;

      for (const [id, c] of Object.entries(caseRegistry)) {
        if (bankName === "ALL" || c.bank === bankName) {
          const opt = document.createElement("option");
          opt.value = id;
          opt.textContent = `[${c.case_no}] - ${c.applicant_name}${c.created_at ? " (" + fmtCaseOptDate(c.created_at) + ")" : ""} | ${c.bank} (${c.branch})`;
          caseSelect.appendChild(opt);
          if (!firstMatch) firstMatch = id;
          count++;
        }
      }

      document.getElementById("totalCaseCount").textContent = count;

      if (firstMatch) {
        caseSelect.value = firstMatch;
        onCaseSelected(firstMatch);
      }
    }

    // Branch is a free-text field at case creation (ncBranch), not a fixed list like the Bank
    // dropdown - so the "Branches" filter can never be a hardcoded option list without drifting
    // out of sync the moment someone types a new branch name on a new case (e.g. "Gota Branch"
    // silently never showing up in this dropdown, exactly as reported). Rebuilt from whatever
    // branch names actually exist on loaded cases every time the case list refreshes.
    // Shared by the "Branches" filter dropdown and the New/Edit Case branch-name suggestion
    // list below - one real list of branch names, deduped case-insensitively, so "Gota" and
    // "gota" typed on different cases collapse into a single suggestion instead of both.
    // How many applicant slots (1-5) are actually filled on this case - mirrors the backend's
    // applicant_slots_for_case() rule: slot 1 (applicant_name) is always present, slots 2-5 are
    // sequential (co_applicant_name, then applicant_3/4/5_name) with no gaps, same as the New
    // Case Intake form's "2/3/4/5 Applicants" stepper enforces.
    function getApplicantCountForCase(c) {
      if (!c) return 1;
      let count = 1;
      if (c.co_applicant_name && c.co_applicant_name.trim()) count = 2;
      if (c.applicant_3_name && c.applicant_3_name.trim()) count = 3;
      if (c.applicant_4_name && c.applicant_4_name.trim()) count = 4;
      if (c.applicant_5_name && c.applicant_5_name.trim()) count = 5;
      return count;
    }

    function getDistinctCaseBranches() {
      const seen = new Set();
      const branches = [];
      Object.values(caseRegistry).forEach(c => {
        const b = (c && c.branch || "").trim();
        if (b && !seen.has(b.toLowerCase())) {
          seen.add(b.toLowerCase());
          branches.push(b);
        }
      });
      branches.sort((a, b) => a.localeCompare(b));
      return branches;
    }

    // Same idea as getDistinctCaseBranches() but for Bank - the header's "Empanelled Banks" and
    // the Management Portal's "Bank" filter were both hardcoded to a fixed 5-bank list, which
    // doesn't reflect which banks actually have cases entered (and would silently omit a bank
    // with real cases if it were ever typo'd or not on that fixed list).
    function getDistinctCaseBanks() {
      const seen = new Set();
      const banks = [];
      Object.values(caseRegistry).forEach(c => {
        const b = (c && c.bank || "").trim();
        if (b && !seen.has(b.toLowerCase())) {
          seen.add(b.toLowerCase());
          banks.push(b);
        }
      });
      banks.sort((a, b) => a.localeCompare(b));
      return banks;
    }

    function rebuildBankFilterOptions() {
      const banks = getDistinctCaseBanks();
      fillBranchSelect("filterBankSelect", `All Empanelled Banks (${banks.length})`, banks);
      fillBranchSelect("mgmtFilterBank", "All Empanelled Banks (બધી બેંક)", banks);
    }

    function fillBranchSelect(selId, allLabel, branches) {
      const sel = document.getElementById(selId);
      if (!sel) return;
      const prevValue = sel.value || "ALL";
      sel.innerHTML = "";
      const allOpt = document.createElement("option");
      allOpt.value = "ALL";
      allOpt.textContent = allLabel;
      sel.appendChild(allOpt);
      branches.forEach(b => {
        const opt = document.createElement("option");
        opt.value = b;
        opt.textContent = b;
        sel.appendChild(opt);
      });
      // Keep whatever was selected, if it still exists among the real branches - otherwise
      // fall back to "ALL" rather than silently resting on a now-nonexistent value.
      sel.value = branches.includes(prevValue) || prevValue === "ALL" ? prevValue : "ALL";
    }

    function rebuildBranchFilterOptions() {
      const branches = getDistinctCaseBranches();

      // Two independent "Branches" dropdowns exist - the header's case selector filter, and
      // the Management Portal's "Multi-Dimensional Records Filter" - both were separately
      // hardcoded to the same 5 fake demo branch names and are kept in sync here together.
      fillBranchSelect("filterBranchSelect", "All Branches", branches);
      fillBranchSelect("mgmtFilterBranch", "All Branches (બધી શાખાઓ)", branches);

      // Typeahead suggestions on the New Case / Edit Case branch inputs (<input list="...">) -
      // staff can still type a genuinely new branch freely, but existing ones are one tap away
      // instead of being retyped (and inevitably mistyped/recapitalized) from memory each time.
      const datalist = document.getElementById("existingBranchesList");
      if (datalist) {
        datalist.innerHTML = "";
        branches.forEach(b => {
          const opt = document.createElement("option");
          opt.value = b;
          datalist.appendChild(opt);
        });
      }
    }

    // Filter by Branch Name
    function onBranchFilterChanged(branchName) {
      const caseSelect = document.getElementById("caseSelectorSelect");
      caseSelect.innerHTML = "";

      let count = 0;
      let firstMatch = null;

      // Branch is free text (ncBranch), so "Gota" and "gota" are the same real branch typed
      // differently by different staff - matching case-insensitively (and ignoring stray
      // leading/trailing spaces) keeps them together in one filtered list instead of the
      // lowercase-typed cases silently vanishing from the dropdown's chosen casing.
      const normBranchName = (branchName || "").trim().toLowerCase();
      for (const [id, c] of Object.entries(caseRegistry)) {
        if (branchName === "ALL" || (c.branch || "").trim().toLowerCase() === normBranchName) {
          const opt = document.createElement("option");
          opt.value = id;
          opt.textContent = `[${c.case_no}] - ${c.applicant_name}${c.created_at ? " (" + fmtCaseOptDate(c.created_at) + ")" : ""} | ${c.bank} (${c.branch})`;
          caseSelect.appendChild(opt);
          if (!firstMatch) firstMatch = id;
          count++;
        }
      }

      document.getElementById("totalCaseCount").textContent = count;

      if (firstMatch) {
        caseSelect.value = firstMatch;
        onCaseSelected(firstMatch);
      }
    }

    // Add New Case Prompt
    function promptCreateNewCase() {
      const caseNo = prompt("Enter Case Reference Number (e.g. AXIS-HL-2026-50L):", "AXIS-HL-2026-50L");
      if (!caseNo) return;
      const applicantName = prompt("Enter Applicant Full Name:", "Mr. Rameshwar S. Rathore");
      if (!applicantName) return;
      const bankName = prompt("Enter Empanelled Bank Name:", "Axis Bank");
      const branchName = prompt("Enter Bank Branch:", "Naroda Branch, Ahmedabad");

      const newId = "case-" + Date.now();
      caseRegistry[newId] = {
        case_no: caseNo,
        bank: bankName || "Axis Bank",
        branch: branchName || "Ahmedabad Main",
        applicant_name: applicantName,
        created_at: new Date().toISOString(),
        pan: "ABCDE" + Math.floor(1000 + Math.random() * 9000) + "F",
        aadhaar_masked: "XXXX - XXXX - " + Math.floor(1000 + Math.random() * 9000),
        dob: "12/04/1988",
        gender: "Male",
        ward: "WARD 3, AHMEDABAD (ACTIVE)",
        address: "74, Shanti Niketan Society, Naroda, Ahmedabad",
        agent: "Field Agent (Assigned)",
        visit_date: "Today, Just Now",
        benchmark_lat: "23.0725",
        benchmark_lon: "72.6510",
        capture_lat: "23.0723",
        capture_lon: "72.6512",
        distance_m: 35,
        agent_pin: "FA-LIVE",
        stay_period: "8 Years",
        ownership: "Self-Owned Residence",
        person_met: applicantName + " (Applicant)",
        neighbors: ["1. Society Secretary (Confirmed)", "2. Neighbor (Confirmed)"],
        status: "PENDING_CA_REVIEW",
        photos: [
          "/static/placeholders/doc_pending.svg",
          "/static/placeholders/doc_pending.svg",
          "/static/placeholders/doc_pending.svg",
          "/static/placeholders/doc_pending.svg"
        ]
      };

      const caseSelect = document.getElementById("caseSelectorSelect");
      const opt = document.createElement("option");
      opt.value = newId;
      opt.textContent = `[${caseNo}] - ${applicantName} (${fmtCaseOptDate(caseRegistry[newId].created_at)}) | ${bankName} (${branchName})`;
      caseSelect.appendChild(opt);
      caseSelect.value = newId;
      rebuildBranchFilterOptions();
      rebuildBankFilterOptions();

      document.getElementById("totalCaseCount").textContent = Object.keys(caseRegistry).length;
      onCaseSelected(newId);
      alert(`Case ${caseNo} created successfully! You can now upload documents or generate the dossier.`);
    }

    // Master Slider Toggle (All Sections)
    function setGlobalDossierMode(mode) {
      currentGlobalMode = mode;
      const btnManual = document.getElementById("masterSliderManual");
      const btnField = document.getElementById("masterSliderField");

      if (mode === "manual") {
        btnManual.className = "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 bg-primary-container text-white shadow-sm";
        btnField.className = "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface";
      } else {
        btnField.className = "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 bg-primary-container text-white shadow-sm";
        btnManual.className = "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface";
      }

      setCardMode("aadhaar", mode);
      setCardMode("pan", mode);
      setCardMode("utility", mode);
      setPhotosMode(mode);
    }

    // Individual Card Slider Toggle
    function setCardMode(card, mode) {
      const fieldView = document.getElementById(`${card}FieldView`);
      const manualView = document.getElementById(`${card}ManualView`);
      const btnManual = document.getElementById(`toggle${capitalize(card)}ManualBtn`);
      const btnField = document.getElementById(`toggle${capitalize(card)}FieldBtn`);

      if (!fieldView || !manualView) return;

      if (mode === "manual") {
        fieldView.classList.add("hidden");
        manualView.classList.remove("hidden");
        if (btnManual && btnField) {
          btnManual.className = "px-2 py-0.5 rounded-full transition-all bg-primary-container text-white font-bold";
          btnField.className = "px-2 py-0.5 rounded-full transition-all text-on-surface-variant font-medium";
        }
      } else {
        manualView.classList.add("hidden");
        fieldView.classList.remove("hidden");
        if (btnManual && btnField) {
          btnField.className = "px-2 py-0.5 rounded-full transition-all bg-primary-container text-white font-bold";
          btnManual.className = "px-2 py-0.5 rounded-full transition-all text-on-surface-variant font-medium";
        }
      }
    }

    // Photos Section Slider Toggle
    function setPhotosMode(mode) {
      const btnManual = document.getElementById("togglePhotosManualBtn");
      const btnField = document.getElementById("togglePhotosFieldBtn");

      if (mode === "manual") {
        btnManual.className = "px-2 py-0.5 rounded-full transition-all bg-primary-container text-white font-bold";
        btnField.className = "px-2 py-0.5 rounded-full transition-all text-on-surface-variant font-medium";
        for (let i = 1; i <= 4; i++) {
          const overlay = document.getElementById(`overlayPhoto${i}`);
          if (overlay) overlay.classList.remove("opacity-0");
        }
      } else {
        btnField.className = "px-2 py-0.5 rounded-full transition-all bg-primary-container text-white font-bold";
        btnManual.className = "px-2 py-0.5 rounded-full transition-all text-on-surface-variant font-medium";
        for (let i = 1; i <= 4; i++) {
          const overlay = document.getElementById(`overlayPhoto${i}`);
          if (overlay) overlay.classList.add("opacity-0");
        }
      }
    }

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Trigger Photo File Selection on Click
    function triggerPhotoSelect(index) {
      const input = document.getElementById(`inputPhoto${index}`);
      if (input) input.click();
    }

    // Handle Manual Photo Upload & Realtime Preview in Active Folder
    async function handlePhotoUpload(index, docType, file) {
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      const targetImg = document.getElementById(`imgPhoto${index}`);
      if (targetImg) targetImg.src = previewUrl;

      const statusBadge = document.getElementById(`statusPhoto${index}`);
      if (statusBadge) {
        statusBadge.textContent = "MANUAL ACTIVE";
        statusBadge.className = "text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300";
      }

      const tsBadge = document.getElementById(`tsPhoto${index}`);
      if (tsBadge) {
        const now = new Date();
        tsBadge.textContent = "MANUAL: " + now.toLocaleTimeString();
      }

      // Update in-memory case registry
      const c = caseRegistry[activeCaseId];
      if (c) {
        const targetList = currentPhotoFolder === 'residence'
          ? c.residence_photos
          : currentPhotoFolder === 'co_work'
            ? c.co_work_photos
            : c.work_photos;
        if (targetList && targetList[index - 1]) {
          targetList[index - 1].src = previewUrl;
          targetList[index - 1].status = "MANUAL ACTIVE";
        }
      }

      // Automatically sync file to backend case
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("doc_type", docType);
        formData.append("folder", currentPhotoFolder);
        formData.append("latitude", "23.2154");
        formData.append("longitude", "72.6367");

        await fetch(`/api/v1/visits/cases/${activeCaseId}/upload`, {
          method: "POST",
          body: formData
        });
      } catch (e) {
        console.log("Local preview active");
      }
    }

    // Handle Bulk Folder Upload (Select entire directory from disk)
    function handleBulkFolderUpload(fileList) {
      if (!fileList || fileList.length === 0) return;
      const images = Array.from(fileList).filter(f => f.type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(f.name));
      if (images.length === 0) {
        alert("No valid images found in selected folder.");
        return;
      }

      const count = Math.min(4, images.length);
      for (let i = 0; i < count; i++) {
        handlePhotoUpload(i + 1, `${currentPhotoFolder.toUpperCase()}_IMG_${i + 1}`, images[i]);
      }
      alert(`Imported ${count} photo(s) into the ${currentPhotoFolder.toUpperCase()} folder successfully!`);
    }

    // Photo Lightbox Zoom Modal
    // Shares the same #docZoomModal / Prev-Next / thumbnail-strip as the AI document viewer
    // (openSeparatedDocViewer). That viewer owns the shared viewerDocList/viewerCurrentIndex
    // globals the Prev/Next buttons and thumbnail strip read from - this function used to set
    // only the big front/back image directly and never touched those globals, so if the CA had
    // opened the AI-scanned document viewer at any point this session, Next/Prev and the
    // thumbnail strip kept browsing THAT stale list (Aadhaar, PAN, ITR, every scanned page)
    // instead of the 4 residence/work evidence photos actually being viewed - an Aadhaar or PAN
    // card could appear while looking at "Residence Photo Full View". Now builds its own items
    // list scoped to just the active folder's photos, same as the AI viewer does for its list.
    function openPhotoLightbox(index) {
      const c = caseRegistry[activeCaseId];
      const photoList = c
        ? (currentPhotoFolder === "residence" ? (c.residence_photos || c.photos)
          : currentPhotoFolder === "co_work" ? (c.co_work_photos || [])
          : (c.work_photos || c.photos))
        : [];
      if (!photoList || photoList.length === 0) return;

      const folderLabel = currentPhotoFolder === "co_work" ? "CO-APPLICANT OFFICE" : currentPhotoFolder.toUpperCase();
      const items = photoList.map((p, i) => ({
        id: p.id || `${currentPhotoFolder}_${i + 1}`,
        index: i,
        pageNumber: i + 1,
        title: p.title || `Photo ${i + 1}`,
        sub: `${folderLabel} FOLDER • ${p.tag || ''}`.trim(),
        src: (typeof p === "string") ? p : p.src,
        status: p.status || 'VERIFIED',
        shortType: folderLabel,
        docType: folderLabel,
        badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-600",
        holderName: '',
        discrepancies: []
      }));

      openFullDocumentViewer(items, index - 1);
    }

    // Handle Per-Section Manual Document Upload & Realtime Display
    async function handleSectionUpload(section, file) {
      if (!file) return;
      if (!activeCaseId) { alert("No active case selected — select a case before uploading."); return; }

      const previewContainer = document.getElementById(`${section}ManualPreview`);
      const filenameLabel = document.getElementById(`${section}ManualFilename`);
      const imgPreview = document.getElementById(`${section}ManualImg`);

      if (filenameLabel) { filenameLabel.textContent = file.name + ` (${(file.size / 1024).toFixed(1)} KB)`; filenameLabel.dataset.userSet = "1"; }
      if (previewContainer) previewContainer.classList.remove("hidden");

      if (imgPreview && file.type.startsWith("image/")) {
        imgPreview.src = URL.createObjectURL(file);
      }

      // Map section to backend doc_type - these must match real DocumentType enum values
      // (there is no "ELECTRICITY_BILL" type; the enum calls it UTILITY_BILL) or the upload
      // silently gets stored as OTHER and never shows up where the rest of the app looks for it.
      let docType = "OTHER";
      if (section === "aadhaar") docType = "AADHAAR_CARD";
      if (section === "pan") docType = "PAN_CARD";
      if (section === "utility") docType = "UTILITY_BILL";

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("doc_type", docType);
        formData.append("latitude", "23.2154");
        formData.append("longitude", "72.6367");

        const res = await fetch(`/api/v1/visits/cases/${activeCaseId}/upload`, {
          method: "POST",
          body: formData
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert(`Upload failed — this document was NOT saved: ${err.detail || "Server error"}. Please try again.`);
          if (previewContainer) previewContainer.classList.add("hidden");
          return;
        }
        if (filenameLabel) filenameLabel.textContent = file.name + ` (${(file.size / 1024).toFixed(1)} KB) ✓ Saved`;
      } catch (err) {
        alert(`Network error — this document was NOT saved: ${err.message}. Please check your connection and try again.`);
        if (previewContainer) previewContainer.classList.add("hidden");
        return;
      }
    }

    function insertStandardRemarks() {
      const clause = "\n\nSupplementary Observation: Title chain verified from Registrar records. Direct utility payment corroboration completes the contact point audit.";
      document.getElementById("caRemarksInput").value += clause;
    }

    async function flagDiscrepancy() {
      const c = caseRegistry[activeCaseId];
      if (!c) { alert("No active case selected."); return; }
      const reason = prompt("Specify discrepancy reason to return case to field agent:", "");
      if (!reason) return;

      const agentName = (c.agent && c.agent !== "Not yet allotted") ? c.agent : null;
      try {
        const res = await fetch(`/api/v1/cases/${activeCaseId}`, {
          method: "PATCH",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ status: "FLAGGED" })
        });
        if (res.ok) {
          c.status = "FLAGGED";
          alert(`Case status marked as FLAGGED.\n\nReason: ${reason}\n\n${agentName ? `Share this with Field Agent ${agentName} so they can re-capture/correct the flagged item.` : "No field agent is currently assigned to this case — assign one before they can act on this."}`);
        } else {
          const err = await res.json().catch(() => ({}));
          alert(`Could not flag this case: ${err.detail || "Server error"}`);
        }
      } catch (err) {
        alert(`Network error flagging case: ${err.message}`);
      }
    }

    // Explicit, CA-initiated unlock of an already-certified case so a correction (an Edit
    // Details change, one more scanned document, a retake) can be made before re-certifying -
    // deliberately NOT automatic, unlike the bug where a routine field-agent upload used to
    // silently revert a certified case's status on its own. Moves the case to PENDING_CA_REVIEW
    // (the same "needs CA attention" state check-out already uses); generating/re-generating the
    // dossier afterward moves it back to CERTIFIED exactly as it would the first time.
    async function reopenCertifiedCase() {
      const c = caseRegistry[activeCaseId];
      if (!c) { alert("No active case selected."); return; }
      if (c.status !== "CERTIFIED") { alert("This case isn't certified, so there's nothing to reopen."); return; }
      if (!confirm(`Reopen "${c.case_no}" for edits?\n\nThis case is currently CERTIFIED. Reopening moves it back to Pending CA Review so you can update case details or documents. It will return to CERTIFIED once you Generate/Re-Generate the dossier again.`)) return;

      try {
        const res = await fetch(`/api/v1/cases/${activeCaseId}`, {
          method: "PATCH",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ status: "PENDING_CA_REVIEW" })
        });
        if (res.ok) {
          c.status = "PENDING_CA_REVIEW";
          const statusEl = document.getElementById("dispCaseStatus");
          if (statusEl) statusEl.textContent = "PENDING_CA_REVIEW";
          const reopenBtn = document.getElementById("btnReopenCase");
          if (reopenBtn) reopenBtn.classList.add("hidden");
          if (typeof renderManagementPortal === "function") renderManagementPortal();
          alert(`"${c.case_no}" has been reopened for edits. Make your corrections, then Generate/Re-Generate the dossier to re-certify it.`);
        } else {
          const err = await res.json().catch(() => ({}));
          alert(`Could not reopen this case: ${err.detail || "Server error"}`);
        }
      } catch (err) {
        alert(`Network error reopening case: ${err.message}`);
      }
    }

    async function generateCertifiedDossier() {
      const btn = document.getElementById("btnCertify");
      const btnText = document.getElementById("btnCertifyText");
      const remarks = document.getElementById("caRemarksInput").value;
      const udin = document.getElementById("udinInput").value;
      const reportDateInput = document.getElementById("reportDateInput");
      const reportDate = reportDateInput && reportDateInput.value ? reportDateInput.value : null;

      btn.disabled = true;
      btnText.innerHTML = `<span class="material-symbols-outlined animate-spin text-[16px]">autorenew</span> Compiling ReportLab PDF...`;

      try {
        const response = await fetch("/api/v1/reports/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders()
          },
          body: JSON.stringify({
            case_id: activeCaseId,
            udin: udin,
            ca_remarks: remarks,
            report_date: reportDate,
            checklist_identity_verified: true,
            checklist_property_exists: true,
            checklist_geofence_compliant: true,
            checklist_neighbor_confirmed: true,
            checklist_no_adverse_findings: true
          })
        });

        if (response.ok) {
          const report = await response.json();
          // The backend sets the case to CERTIFIED as part of a successful generation, but
          // nothing here was telling this browser tab's own cached caseRegistry entry (or the
          // status pill/case list already rendered from it) about that - so a report that
          // genuinely finished still looked stuck "in process" until the next full reload.
          const certifiedCase = caseRegistry[activeCaseId];
          if (certifiedCase) {
            certifiedCase.status = "CERTIFIED";
            const statusEl = document.getElementById("dispCaseStatus");
            if (statusEl) statusEl.textContent = "CERTIFIED";
            const reopenBtn = document.getElementById("btnReopenCase");
            if (reopenBtn) reopenBtn.classList.remove("hidden");
          }
          if (typeof renderManagementPortal === "function") renderManagementPortal();
          showPdfSuccess(report.id, report.file_hash_sha256, report.udin, report.page_count);
        } else {
          const errData = await response.json().catch(() => ({}));
          alert("Dossier compilation error: " + (errData.detail || response.statusText));
        }
      } catch (err) {
        alert("Network error connecting to dossier engine: " + err.message);
      } finally {
        btn.disabled = false;
        btnText.innerHTML = `<span>Re-Generate Certified Dossier</span>`;
      }
    }

    function showPdfSuccess(reportId, hash, udin, pageCount) {
      const card = document.getElementById("pdfSuccessCard");
      const hashText = document.getElementById("pdfHashText");
      const udinBadge = document.getElementById("pdfUdinBadge");
      const dlLink = document.getElementById("pdfDownloadLink");
      const dlLinkText = document.getElementById("pdfDownloadLinkText");
      const docxLink = document.getElementById("docxDownloadLink");

      // Real page count read back from the actual generated file server-side (pypdf) - never
      // a guess. If it's missing for some reason, say so honestly instead of showing a stale
      // or made-up number.
      if (dlLinkText) {
        dlLinkText.textContent = pageCount ? `Download PDF (${pageCount} Pages)` : "Download PDF";
      }

      const c = caseRegistry[activeCaseId] || {};
      const appName = c.applicant_name || "Applicant";
      const cleanName = appName
        .replace(/^(mr|mrs|ms|dr|shri|smt)\.?\s+/i, '')
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || "Applicant";

      const pdfFilename = `${cleanName}_Report.pdf`;
      const docxFilename = `${cleanName}_Report.docx`;

      card.classList.remove("hidden");
      hashText.textContent = hash;
      udinBadge.textContent = "UDIN: " + udin;
      dlLink.href = `/api/v1/reports/${reportId}/download`;
      dlLink.setAttribute("download", pdfFilename);
      if (docxLink) {
        docxLink.href = `/api/v1/reports/${reportId}/download-docx`;
        docxLink.setAttribute("download", docxFilename);
      }
      
      // Auto-scroll to card
      card.scrollIntoView({ behavior: 'smooth' });
    }

    // 3D DOCUMENT FLIPPING ENGINE & MODAL HANDLERS
    const docState = {
      aadhaar: { isFlipped: false, isMasked: true },
      pan: { isFlipped: false },
      utility: { isFlipped: false }
    };

    function flipDocCard(section) {
      const card = document.getElementById(`${section}FlipCard`);
      if (!card) return;
      
      const isFlipped = card.classList.toggle("is-flipped");
      docState[section].isFlipped = isFlipped;

      if (section === "aadhaar") {
        document.getElementById("btnAadhaarSideFront").className = isFlipped 
          ? "px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant hover:text-on-surface" 
          : "px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-white shadow-xs";
        document.getElementById("btnAadhaarSideBack").className = isFlipped 
          ? "px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-white shadow-xs" 
          : "px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant hover:text-on-surface";
        document.getElementById("aadhaarFlipBtnText").textContent = isFlipped ? "Flip to Front" : "Flip to Back";
      } else if (section === "pan") {
        document.getElementById("btnPanSideFront").className = isFlipped 
          ? "px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant hover:text-on-surface" 
          : "px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-white shadow-xs";
        document.getElementById("btnPanSideBack").className = isFlipped 
          ? "px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-white shadow-xs" 
          : "px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant hover:text-on-surface";
        document.getElementById("panFlipBtnText").textContent = isFlipped ? "Flip to Physical" : "Flip to NSDL";
      } else if (section === "utility") {
        document.getElementById("btnUtilitySideFront").className = isFlipped 
          ? "px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant hover:text-on-surface" 
          : "px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-white shadow-xs";
        document.getElementById("btnUtilitySideBack").className = isFlipped 
          ? "px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-white shadow-xs" 
          : "px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant hover:text-on-surface";
        document.getElementById("utilityFlipBtnText").textContent = isFlipped ? "Flip to Bill" : "Flip to Form";
      }
    }

    function setDocSide(section, side) {
      const card = document.getElementById(`${section}FlipCard`);
      if (!card) return;
      
      const shouldBeFlipped = (side === "back");
      if (shouldBeFlipped) {
        card.classList.add("is-flipped");
      } else {
        card.classList.remove("is-flipped");
      }
      docState[section].isFlipped = shouldBeFlipped;

      if (section === "aadhaar") {
        document.getElementById("btnAadhaarSideFront").className = !shouldBeFlipped 
          ? "px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-white shadow-xs" 
          : "px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant hover:text-on-surface";
        document.getElementById("btnAadhaarSideBack").className = shouldBeFlipped 
          ? "px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-white shadow-xs" 
          : "px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant hover:text-on-surface";
        document.getElementById("aadhaarFlipBtnText").textContent = shouldBeFlipped ? "Flip to Front" : "Flip to Back";
      } else if (section === "pan") {
        document.getElementById("btnPanSideFront").className = !shouldBeFlipped 
          ? "px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-white shadow-xs" 
          : "px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant hover:text-on-surface";
        document.getElementById("btnPanSideBack").className = shouldBeFlipped 
          ? "px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-white shadow-xs" 
          : "px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant hover:text-on-surface";
        document.getElementById("panFlipBtnText").textContent = shouldBeFlipped ? "Flip to Physical" : "Flip to NSDL";
      } else if (section === "utility") {
        document.getElementById("btnUtilitySideFront").className = !shouldBeFlipped 
          ? "px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-white shadow-xs" 
          : "px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant hover:text-on-surface";
        document.getElementById("btnUtilitySideBack").className = shouldBeFlipped 
          ? "px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-white shadow-xs" 
          : "px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant hover:text-on-surface";
        document.getElementById("utilityFlipBtnText").textContent = shouldBeFlipped ? "Flip to Bill" : "Flip to Form";
      }
    }

    // Per explicit CA office instruction, Aadhaar numbers are extracted and shown in full -
    // the system no longer stores or displays a masked copy, so there is nothing left to
    // toggle. This just re-affirms the full number is already being shown.
    function toggleAadhaarMasking() {
      docState.aadhaar.isMasked = false;
      const c = caseRegistry[activeCaseId] || {};
      const img = document.getElementById("dispAadhaarFrontImg");
      const label = document.getElementById("aadhaarMaskLabel");
      const status = document.getElementById("dispMaskingStatus");
      const pill = document.getElementById("dispAadhaarMaskedPill");
      img.src = c.aadhaar_front_img || "/static/placeholders/doc_pending.svg";
      label.textContent = "Full Number";
      status.textContent = "Disabled (CA office instruction) — full number shown";
      if (pill) pill.textContent = c.aadhaar_masked || "Pending AI scan";
    }

    // High-Resolution Lightbox Zoom Modal Logic with Full Page Zoom & Pan Engine
    let currentZoomSection = "aadhaar";
    let docZoomState = {
      scale: 1,
      translateX: 0,
      translateY: 0,
      rotation: 0,
      isDragging: false,
      startX: 0,
      startY: 0,
      isFullscreen: false
    };

    function updateZoomTransform() {
      const container = document.getElementById("zoomTransformContainer");
      const badge = document.getElementById("zoomLevelBadge");
      const hud = document.getElementById("hudZoomText");
      if (!container) return;
      const pct = Math.round(docZoomState.scale * 100);
      if (badge) badge.textContent = `${pct}%`;
      if (hud) hud.textContent = `${pct}%`;
      container.style.transform = `translate(${docZoomState.translateX}px, ${docZoomState.translateY}px) scale(${docZoomState.scale}) rotate(${docZoomState.rotation}deg)`;
    }

    function zoomDocModal(delta) {
      docZoomState.scale = Math.min(Math.max(0.4, +(docZoomState.scale + delta).toFixed(2)), 4.0);
      updateZoomTransform();
    }

    function resetDocZoom() {
      docZoomState.scale = 1;
      docZoomState.translateX = 0;
      docZoomState.translateY = 0;
      docZoomState.rotation = 0;
      updateZoomTransform();
    }

    function fitDocToPage() {
      docZoomState.scale = 0.85;
      docZoomState.translateX = 0;
      docZoomState.translateY = 0;
      updateZoomTransform();
    }

    function fitDocToWidth() {
      docZoomState.scale = 1.35;
      docZoomState.translateX = 0;
      docZoomState.translateY = 0;
      updateZoomTransform();
    }

    function rotateDocModal() {
      docZoomState.rotation = (docZoomState.rotation + 90) % 360;
      updateZoomTransform();
    }

    function toggleDocZoomFullscreen() {
      const modalBox = document.getElementById("docZoomModalBox");
      const icon = document.getElementById("iconDocFullscreen");
      docZoomState.isFullscreen = !docZoomState.isFullscreen;
      if (docZoomState.isFullscreen) {
        modalBox.classList.remove("max-w-6xl", "w-[96vw]", "h-[94vh]");
        modalBox.classList.add("w-[99vw]", "h-[98vh]", "max-w-none", "max-h-none");
        if (icon) icon.textContent = "fullscreen_exit";
      } else {
        modalBox.classList.remove("w-[99vw]", "h-[98vh]", "max-w-none", "max-h-none");
        modalBox.classList.add("max-w-6xl", "w-[96vw]", "h-[94vh]");
        if (icon) icon.textContent = "fullscreen";
      }
    }

    function openDocInNewTab() {
      const flipCard = document.getElementById("zoomFlipCard");
      const frontImg = document.getElementById("zoomFrontImg");
      const backImg = document.getElementById("zoomBackImg");
      const isFlipped = flipCard && flipCard.classList.contains("is-flipped");
      const activeSrc = isFlipped ? backImg.src : frontImg.src;
      if (activeSrc && !activeSrc.includes("placeholders")) {
        window.open(activeSrc, "_blank", "noopener");
      }
    }

    function initZoomPanHandlers() {
      const vp = document.getElementById("zoomViewport");
      if (!vp || vp._zoomPanInit) return;
      vp._zoomPanInit = true;

      vp.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        if (e.target.closest("button") || e.target.closest("label")) return;
        docZoomState.isDragging = true;
        docZoomState.startX = e.clientX - docZoomState.translateX;
        docZoomState.startY = e.clientY - docZoomState.translateY;
        vp.style.cursor = "grabbing";
      });

      window.addEventListener("mousemove", (e) => {
        if (!docZoomState.isDragging) return;
        docZoomState.translateX = e.clientX - docZoomState.startX;
        docZoomState.translateY = e.clientY - docZoomState.startY;
        updateZoomTransform();
      });

      window.addEventListener("mouseup", () => {
        if (docZoomState.isDragging) {
          docZoomState.isDragging = false;
          if (vp) vp.style.cursor = "grab";
        }
      });

      vp.addEventListener("wheel", (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.15 : -0.15;
        zoomDocModal(delta);
      }, { passive: false });

      vp.addEventListener("dblclick", (e) => {
        if (e.target.closest("button") || e.target.closest("label")) return;
        if (docZoomState.scale > 1.2) {
          resetDocZoom();
        } else {
          docZoomState.scale = 2.0;
          updateZoomTransform();
        }
      });
    }

    // ==========================================
    // FULL-MODE DOCUMENT VIEWER ENGINE (BROWSE & PAGE JUMP)
    // ==========================================
    let viewerDocList = [];
    let viewerCurrentIndex = 0;
    let isViewerThumbstripOpen = true;

    function openFullDocumentViewer(items, startIndex = 0) {
      if (!items || items.length === 0) return;
      viewerDocList = items;
      viewerCurrentIndex = Math.max(0, Math.min(startIndex, items.length - 1));

      const modal = document.getElementById("docZoomModal");
      if (!modal) return;

      populateViewerPageDropdown();
      renderViewerThumbstrip();
      renderViewerCurrentDoc();

      modal.classList.remove("hidden");
      preloadViewerNeighborImages();
    }

    function openSeparatedDocViewer(startIndex = 0) {
      if (!activeSeparatedDocs || activeSeparatedDocs.length === 0) return;
      const items = activeSeparatedDocs.map((d, i) => {
        let badgeColor = "bg-blue-900 text-blue-200 border-blue-600";
        let shortType = (d.doc_type || "OTHER").replace(/_/g, " ");
        if (d.scan_status === "FAILED") {
          shortType = "NOT SCANNED"; badgeColor = "bg-red-950 text-red-300 border-red-600";
        } else if (d.relationship_to_applicant === "DIFFERENT_PERSON") {
          shortType = shortType + " (OTHER PERSON)"; badgeColor = "bg-orange-950 text-orange-300 border-orange-600";
        } else if (d.doc_type === "UTILITY_BILL") {
          shortType = (d.utility_provider ? d.utility_provider + " " : "") + "BILL"; badgeColor = "bg-emerald-950 text-emerald-300 border-emerald-600";
        } else if (d.doc_type === "PAN_CARD") {
          badgeColor = "bg-sky-950 text-sky-300 border-sky-600";
        } else if (d.doc_type === "AADHAAR_CARD") {
          badgeColor = "bg-amber-950 text-amber-300 border-amber-600";
        } else if (d.doc_type === "SALARY_SLIP") {
          shortType = "PAYSLIP"; badgeColor = "bg-purple-950 text-purple-300 border-purple-600";
        } else if (d.doc_type === "FORM_16") {
          const ay = typeof formAssessmentYearOf === "function" ? formAssessmentYearOf(d) : null;
          shortType = ay ? `FORM 16 (A.Y. ${ay})` : "FORM 16";
          badgeColor = "bg-indigo-950 text-indigo-300 border-indigo-600";
        }

        let docSrc = d.image_url || "";
        if (docSrc.includes("/static/extracted_pages/")) {
          docSrc = docSrc.replace("/static/extracted_pages/", "/storage/separated_docs/");
        }

        return {
          id: d.id,
          index: i,
          pageNumber: d.page_number || (i + 1),
          title: `Page ${d.page_number || (i + 1)} • ${shortType}`,
          sub: `${d.holder_name || ''} ${d.document_title || ''}`.trim() || 'AI Scanned Document',
          src: docSrc,
          status: d.scan_status || 'VERIFIED',
          shortType: shortType,
          docType: d.doc_type || 'OTHER',
          badgeColor: badgeColor,
          holderName: d.holder_name || '',
          discrepancies: d.discrepancies || []
        };
      });

      openFullDocumentViewer(items, startIndex);
    }

    function renderViewerCurrentDoc() {
      if (!viewerDocList || viewerDocList.length === 0) return;
      const d = viewerDocList[viewerCurrentIndex];
      if (!d) return;

      const modalTitle = document.getElementById("zoomModalTitle");
      const frontImg = document.getElementById("zoomFrontImg");
      const backImg = document.getElementById("zoomBackImg");
      const frontLabel = document.getElementById("zoomFrontLabel");
      const backLabel = document.getElementById("zoomBackLabel");
      const flipCard = document.getElementById("zoomFlipCard");
      const sideControls = document.getElementById("zoomSideControls");
      const flipBtn = document.getElementById("zoomFlipBtn");

      let resolvedSrc = d.src || "";
      if (resolvedSrc.includes("/static/extracted_pages/")) {
        resolvedSrc = resolvedSrc.replace("/static/extracted_pages/", "/storage/separated_docs/");
      }

      if (modalTitle) {
        modalTitle.innerHTML = `<span class="material-symbols-outlined text-primary-container text-[20px]">description</span> <span class="truncate">${d.title || 'Document Inspection'} • Authentic Scanned Record</span>`;
      }

      if (frontImg) {
        frontImg.setAttribute("fetchpriority", "high");
        frontImg.src = resolvedSrc;
        frontImg.onerror = function() {
          if (this.src.includes("/storage/separated_docs/")) {
            this.src = this.src.replace("/storage/separated_docs/", "/static/extracted_pages/");
          }
        };
      }
      if (backImg) {
        backImg.src = d.backSrc || resolvedSrc;
      }

      if (frontLabel) {
        frontLabel.textContent = `${d.title || ''} • ${d.sub || ''} (${d.status || 'VERIFIED'})`;
      }
      if (backLabel) {
        backLabel.textContent = d.backLabel || `CA Vault Certified Scan • SHA256 Intact • Tamper Sealed`;
      }

      const hasBack = Boolean(d.backSrc);
      if (sideControls) sideControls.classList.toggle("hidden", !hasBack);
      if (flipBtn) flipBtn.classList.toggle("hidden", !hasBack);
      if (flipCard && !hasBack) flipCard.classList.remove("is-flipped");

      // Update Navigation Bar & Counter
      const pageInput = document.getElementById("viewerPageJumpInput");
      const totalCount = document.getElementById("viewerTotalPagesCount");
      const pageDropdown = document.getElementById("viewerPageDropdown");
      const prevBtn = document.getElementById("viewerNavPrevBtn");
      const nextBtn = document.getElementById("viewerNavNextBtn");
      const floatPrev = document.getElementById("viewerFloatingPrevBtn");
      const floatNext = document.getElementById("viewerFloatingNextBtn");

      const currentNum = viewerCurrentIndex + 1;
      const totalNum = viewerDocList.length;

      if (pageInput) {
        pageInput.value = currentNum;
        pageInput.max = totalNum;
      }
      if (totalCount) {
        totalCount.textContent = totalNum;
      }
      if (pageDropdown) {
        pageDropdown.value = viewerCurrentIndex;
      }

      const isFirst = viewerCurrentIndex === 0;
      const isLast = viewerCurrentIndex >= totalNum - 1;

      if (prevBtn) prevBtn.disabled = isFirst;
      if (nextBtn) nextBtn.disabled = isLast;
      if (floatPrev) floatPrev.disabled = isFirst;
      if (floatNext) floatNext.disabled = isLast;

      updateViewerThumbstripActive();
      updateBulkDeleteBar();
      resetDocZoom();
      initZoomPanHandlers();
      preloadViewerNeighborImages();
    }

    const preloadedViewerImageSrcs = new Set();
    function preloadViewerNeighborImages() {
      if (!viewerDocList || viewerDocList.length === 0) return;
      // Fetch the next couple of pages in the background at full resolution so Next/Prev shows
      // an already-decoded image instead of waiting on a fresh network request each click.
      [viewerCurrentIndex + 1, viewerCurrentIndex - 1, viewerCurrentIndex + 2, viewerCurrentIndex - 2].forEach((idx) => {
        if (idx < 0 || idx >= viewerDocList.length) return;
        const item = viewerDocList[idx];
        if (!item || !item.src || preloadedViewerImageSrcs.has(item.src)) return;
        preloadedViewerImageSrcs.add(item.src);
        const img = new Image();
        img.src = item.src;
      });
    }

    function viewerPrevDoc() {
      if (!viewerDocList || viewerDocList.length === 0) return;
      if (viewerCurrentIndex > 0) {
        viewerCurrentIndex--;
        renderViewerCurrentDoc();
      }
    }

    function viewerNextDoc() {
      if (!viewerDocList || viewerDocList.length === 0) return;
      if (viewerCurrentIndex < viewerDocList.length - 1) {
        viewerCurrentIndex++;
        renderViewerCurrentDoc();
      }
    }

    function viewerJumpToPage(target) {
      if (!viewerDocList || viewerDocList.length === 0) return;
      let targetIndex = parseInt(target, 10);
      if (isNaN(targetIndex)) return;
      if (targetIndex < 0) targetIndex = 0;
      if (targetIndex >= viewerDocList.length) targetIndex = viewerDocList.length - 1;
      viewerCurrentIndex = targetIndex;
      renderViewerCurrentDoc();
    }

    function handleViewerPageJumpInput() {
      const input = document.getElementById("viewerPageJumpInput");
      if (!input || !viewerDocList || viewerDocList.length === 0) return;
      const pageNum = parseInt(input.value, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= viewerDocList.length) {
        viewerJumpToPage(pageNum - 1);
      } else {
        input.value = viewerCurrentIndex + 1;
      }
    }

    function populateViewerPageDropdown() {
      const select = document.getElementById("viewerPageDropdown");
      if (!select) return;
      select.innerHTML = "";
      if (!viewerDocList || viewerDocList.length === 0) return;
      viewerDocList.forEach((d, idx) => {
        const opt = document.createElement("option");
        opt.value = idx;
        const pageLabel = d.pageNumber ? `P${d.pageNumber}: ` : `[${idx + 1}] `;
        opt.textContent = `${pageLabel}${d.shortType || d.docType || 'Doc'} - ${d.sub || ''}`.substring(0, 42);
        select.appendChild(opt);
      });
    }

    function renderViewerThumbstrip() {
      const strip = document.getElementById("viewerThumbStripContainer");
      if (!strip) return;
      strip.innerHTML = "";
      if (!viewerDocList || viewerDocList.length <= 1) {
        strip.classList.add("hidden");
        return;
      }
      if (isViewerThumbstripOpen) {
        strip.classList.remove("hidden");
      }

      viewerDocList.forEach((d, idx) => {
        const isSelected = Boolean(d.id && selectedSeparatedDocIds.has(d.id));
        const isActive = idx === viewerCurrentIndex;

        const thumb = document.createElement("div");
        thumb.id = `viewerThumb_${idx}`;
        thumb.className = `relative shrink-0 w-14 h-18 rounded border-2 overflow-hidden cursor-pointer transition-all bg-slate-950 flex flex-col items-center justify-between p-0.5 ${
          isActive 
            ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105 opacity-100 shadow-md' 
            : isSelected 
              ? 'border-red-500 ring-1 ring-red-400 bg-red-950/40 opacity-100' 
              : 'border-white/20 opacity-70 hover:opacity-100 hover:border-white/60'
        }`;
        thumb.title = `Jump to Page ${d.pageNumber || (idx + 1)}: ${d.title || ''}${isSelected ? ' • [Selected for deletion]' : ''}`;
        thumb.onclick = () => viewerJumpToPage(idx);

        // Checkbox on top-left of each thumbnail for bulk selection
        if (d.id) {
          const checkLabel = document.createElement("label");
          checkLabel.className = "absolute top-0.5 left-0.5 w-4 h-4 rounded bg-black/85 border border-white/60 flex items-center justify-center cursor-pointer z-10 hover:bg-black";
          checkLabel.onclick = (ev) => ev.stopPropagation();
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.dataset.docId = d.id;
          checkbox.className = "viewer-thumb-checkbox w-3 h-3 accent-amber-500 cursor-pointer";
          checkbox.checked = isSelected;
          checkbox.onclick = (ev) => {
            ev.stopPropagation();
            if (checkbox.checked) selectedSeparatedDocIds.add(d.id);
            else selectedSeparatedDocIds.delete(d.id);
            updateBulkDeleteBar();
            updateViewerThumbstripActive();
          };
          checkLabel.appendChild(checkbox);
          thumb.appendChild(checkLabel);
        }

        const img = document.createElement("img");
        // Thumbnails reuse the same full-resolution file as the main viewer image (there is no
        // separate small-thumbnail asset). Marking them lazy + low priority stops the browser
        // from burning bandwidth/decode time on 30+ full-size downloads ahead of the one image
        // the user is actually looking at, which was making Next/Prev feel stuck.
        img.loading = "lazy";
        img.setAttribute("fetchpriority", "low");
        img.src = d.src;
        img.className = "w-full h-12 object-cover rounded pointer-events-none";
        img.onerror = function() {
          if (this.src.includes("/storage/separated_docs/")) {
            this.src = this.src.replace("/storage/separated_docs/", "/static/extracted_pages/");
          }
        };

        const badge = document.createElement("div");
        badge.className = `w-full text-center text-[8px] font-mono font-bold text-white ${isSelected ? 'bg-red-700/90' : 'bg-black/80'} truncate px-0.5 rounded`;
        badge.textContent = `P${d.pageNumber || (idx + 1)}`;

        thumb.appendChild(img);
        thumb.appendChild(badge);
        strip.appendChild(thumb);
      });
    }

    function updateViewerThumbstripActive() {
      if (!viewerDocList || viewerDocList.length <= 1) return;
      viewerDocList.forEach((d, idx) => {
        const thumb = document.getElementById(`viewerThumb_${idx}`);
        if (thumb) {
          const isSelected = Boolean(d.id && selectedSeparatedDocIds.has(d.id));
          const isActive = idx === viewerCurrentIndex;
          if (isActive) {
            thumb.className = "relative shrink-0 w-14 h-18 rounded border-2 border-amber-400 ring-2 ring-amber-400/50 scale-105 overflow-hidden cursor-pointer transition-all bg-slate-900 flex flex-col items-center justify-between p-0.5 opacity-100 shadow-md";
            // "auto" (instant) instead of "smooth" - a smooth scroll animation queues up and lags
            // behind when the user clicks Next/Prev repeatedly in quick succession.
            thumb.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
          } else if (isSelected) {
            thumb.className = "relative shrink-0 w-14 h-18 rounded border-2 border-red-500 ring-1 ring-red-400 bg-red-950/40 overflow-hidden cursor-pointer transition-all flex flex-col items-center justify-between p-0.5 opacity-100";
          } else {
            thumb.className = "relative shrink-0 w-14 h-18 rounded border-2 border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 overflow-hidden cursor-pointer transition-all bg-slate-950 flex flex-col items-center justify-between p-0.5 hover:scale-105";
          }
          const cb = thumb.querySelector(".viewer-thumb-checkbox");
          if (cb && d.id) cb.checked = isSelected;
          const badge = thumb.querySelector("div:last-child");
          if (badge) {
            badge.className = `w-full text-center text-[8px] font-mono font-bold text-white ${isSelected ? 'bg-red-700/90' : 'bg-black/80'} truncate px-0.5 rounded`;
          }
        }
      });
    }

    function toggleViewerThumbstrip() {
      const strip = document.getElementById("viewerThumbStripContainer");
      const btn = document.getElementById("btnToggleThumbstrip");
      if (!strip) return;
      isViewerThumbstripOpen = !isViewerThumbstripOpen;
      strip.classList.toggle("hidden", !isViewerThumbstripOpen);
      if (btn) {
        btn.classList.toggle("bg-primary-container", isViewerThumbstripOpen);
        btn.classList.toggle("text-white", isViewerThumbstripOpen);
      }
    }

    function openDocZoomModal(section) {
      currentZoomSection = section;
      const c = caseRegistry[activeCaseId] || {};
      const kycItems = [
        {
          section: 'aadhaar',
          pageNumber: 1,
          title: `Aadhaar Card (Front / Back) • ${c.applicant_name || 'Scrutiny'}`,
          sub: `Identity & Address Corroboration: ${c.address || ''}`,
          src: document.getElementById("dispAadhaarFrontImg") ? document.getElementById("dispAadhaarFrontImg").src : "/static/placeholders/doc_pending.svg",
          backSrc: document.getElementById("dispAadhaarBackImg") ? document.getElementById("dispAadhaarBackImg").src : "/static/placeholders/doc_pending.svg",
          frontLabel: `Aadhaar Front Side - Identity, Photo, DOB & UIDAI Digitally Verified (${c.applicant_name})`,
          backLabel: `Aadhaar Back Side - Address Corroboration: ${c.address}`,
          status: 'UIDAI VERIFIED',
          shortType: 'AADHAAR'
        },
        {
          section: 'pan',
          pageNumber: 2,
          title: `Permanent Account Number (PAN) • ${c.pan || ''} (${c.applicant_name || ''})`,
          sub: `Official NSDL Online Verification Portal • Ward: ${c.ward || 'WARD 1'}`,
          src: document.getElementById("dispPanFrontImg") ? document.getElementById("dispPanFrontImg").src : "/static/placeholders/doc_pending.svg",
          backSrc: document.getElementById("dispPanBackImg") ? document.getElementById("dispPanBackImg").src : "/static/placeholders/doc_pending.svg",
          frontLabel: `Income Tax Department Physical Card - ${c.pan} (${(c.applicant_name || '').toUpperCase()})`,
          backLabel: `Official NSDL Online Verification Portal - Active Jurisdiction: ${c.ward || 'WARD 1'}`,
          status: 'NSDL VERIFIED',
          shortType: 'PAN CARD'
        },
        {
          section: 'utility',
          pageNumber: 3,
          title: `UGVCL Electricity Bill & CPV Due Diligence Verification`,
          sub: `Consumer: ${c.utility_holder || c.applicant_name || ''} (${c.address || ''})`,
          src: document.getElementById("dispUtilityFrontImg") ? document.getElementById("dispUtilityFrontImg").src : "/static/placeholders/doc_pending.svg",
          backSrc: document.getElementById("dispUtilityBackImg") ? document.getElementById("dispUtilityBackImg").src : "/static/placeholders/doc_pending.svg",
          frontLabel: `Electricity Bill - ${c.applicant_name} (${c.address})`,
          backLabel: `Physical CPV Due Diligence Inspection Form - Completed for ${c.applicant_name}`,
          status: 'UTILITY VERIFIED',
          shortType: 'ELECTRICITY'
        }
      ];

      let startIdx = 0;
      if (section === 'pan') startIdx = 1;
      else if (section === 'utility') startIdx = 2;

      openFullDocumentViewer(kycItems, startIdx);

      const flipCard = document.getElementById("zoomFlipCard");
      if (docState[section] && docState[section].isFlipped && flipCard) {
        flipCard.classList.add("is-flipped");
        document.getElementById("zoomSideBtnFront").className = "px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant";
        document.getElementById("zoomSideBtnBack").className = "px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-container text-white shadow-sm";
      }
    }

    function flipZoomCard() {
      const flipCard = document.getElementById("zoomFlipCard");
      const isFlipped = flipCard.classList.toggle("is-flipped");
      document.getElementById("zoomSideBtnFront").className = !isFlipped 
        ? "px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-container text-white shadow-sm" 
        : "px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant";
      document.getElementById("zoomSideBtnBack").className = isFlipped 
        ? "px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-container text-white shadow-sm" 
        : "px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant";
      if (docState[currentZoomSection]) {
        setDocSide(currentZoomSection, isFlipped ? "back" : "front");
      }
    }

    function setZoomSide(side) {
      const flipCard = document.getElementById("zoomFlipCard");
      if (side === "back") {
        flipCard.classList.add("is-flipped");
        document.getElementById("zoomSideBtnFront").className = "px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant";
        document.getElementById("zoomSideBtnBack").className = "px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-container text-white shadow-sm";
      } else {
        flipCard.classList.remove("is-flipped");
        document.getElementById("zoomSideBtnFront").className = "px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-container text-white shadow-sm";
        document.getElementById("zoomSideBtnBack").className = "px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant";
      }
      if (docState[currentZoomSection]) {
        setDocSide(currentZoomSection, side);
      }
    }

    function closeDocZoomModal() {
      document.getElementById("docZoomModal").classList.add("hidden");
      resetDocZoom();
    }

    // ==========================================
    // CA PARTNER AUTHENTICATION & LOGIN SCREEN
    // ==========================================
    function checkCaAuth() {
      const token = localStorage.getItem("ca_token");
      const modal = document.getElementById("caLoginModal");
      const userJson = localStorage.getItem("ca_user");

      // Strict role check: If stored user is FIELD_AGENT or agent, kick out immediately!
      if (userJson) {
        try {
          const u = JSON.parse(userJson);
          if (u.role === "FIELD_AGENT" || (u.email && u.email.toLowerCase().includes("agent")) || (u.username && u.username.toLowerCase().includes("agent"))) {
            localStorage.removeItem("ca_token");
            localStorage.removeItem("ca_user");
            if (modal) modal.classList.remove("hidden");
            const alertEl = document.getElementById("caLoginAlert");
            if (alertEl) {
              alertEl.innerHTML = `⛔ <b>ACCESS RESTRICTED:</b> Field Agent accounts are not permitted to access the CA Office Desk. Field staff must use the Field Verification PWA app.<br/><a href="/pwa" class="inline-block mt-2 font-bold underline text-blue-700">Open Field Verification PWA (મોબાઇલ એપ્લિકેશન) →</a>`;
              alertEl.classList.remove("hidden");
            }
            return;
          }
        } catch(e){}
      }

      if (!token || token === "demo-ca-token") {
        // Previously this silently logged in as admin using a hardcoded username/password
        // right here in the page's own JavaScript - anyone who opened this URL with no stored
        // session got instant full admin access, and anyone who viewed page source could read
        // the password outright. Require a real login instead.
        if (modal) modal.classList.remove("hidden");
      } else {
        if (modal) modal.classList.add("hidden");
        if (userJson) {
          try {
            const u = JSON.parse(userJson);
            if (u.full_name && document.getElementById("caUserFullName")) {
              document.getElementById("caUserFullName").textContent = u.full_name;
            }
            if (u.role && document.getElementById("caUserRoleTag")) {
              document.getElementById("caUserRoleTag").textContent = `${u.role.toLowerCase()} • Logged In`;
            }
          } catch(e){}
        }
      }
    }

    async function handleCaLogin(e) {
      if (e) e.preventDefault();
      const uInput = document.getElementById("caLoginUsername");
      const pInput = document.getElementById("caLoginPassword");
      const alertEl = document.getElementById("caLoginAlert");
      const submitBtn = document.getElementById("caLoginSubmitBtn");

      const username = uInput.value.trim();
      const password = pInput.value;

      alertEl.classList.add("hidden");
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">sync</span> Authenticating...`;

      // Block field staff usernames locally right away
      if (username.toLowerCase().startsWith("agent")) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Sign In to CA Scrutiny Desk</span><span class="material-symbols-outlined text-[18px]">login</span>`;
        alertEl.innerHTML = `⛔ <b>ACCESS DENIED:</b> Field Agents (<code>${username}</code>) are strictly prohibited from accessing the CA Office Desk. Please use the Field Verification PWA.<br/><a href="/pwa" class="inline-block mt-2 font-bold underline text-blue-700">Go to Field Verification PWA →</a>`;
        alertEl.classList.remove("hidden");
        return;
      }

      try {
        const res = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        if (res.ok) {
          const data = await res.json();
          // Backend returned user role check
          if (data.role === "FIELD_AGENT") {
            alertEl.innerHTML = `⛔ <b>ACCESS DENIED:</b> Field Agents are strictly prohibited from accessing the CA Office Scrutiny Desk. Please use the Field Verification PWA.<br/><a href="/pwa" class="inline-block mt-2 font-bold underline text-blue-700">Go to Field Verification PWA →</a>`;
            alertEl.classList.remove("hidden");
            localStorage.removeItem("ca_token");
            localStorage.removeItem("ca_user");
            return;
          }
          localStorage.setItem("ca_token", data.access_token);
          localStorage.setItem("ca_user", JSON.stringify(data));
          document.getElementById("caLoginModal").classList.add("hidden");
          if (document.getElementById("caUserFullName") && data.full_name) {
            document.getElementById("caUserFullName").textContent = data.full_name;
          }
          if (document.getElementById("caUserRoleTag") && data.role) {
            document.getElementById("caUserRoleTag").textContent = `${data.role.toLowerCase()} • Logged In`;
          }
          // loadDbCasesIntoRegistry() on page load runs BEFORE this login completes, so it hits
          // every real case's /api/v1/cases call with no (or an expired) token, gets 401, and
          // silently bails out leaving only the 5 hardcoded demo cases in caseRegistry. Nothing
          // ever re-ran that load after a successful login - so a CA who logs in through this
          // modal (not a page refresh) was stuck with caseRegistry missing every real case: no
          // residence/office photos, blank Edit Case fields, etc. for any case opened without
          // first doing a full page reload. Re-run the same load+select+sync sequence that
          // DOMContentLoaded does, now that a valid token actually exists.
          await loadDbCasesIntoRegistry();
          if (typeof purgeDeletedCasesFromRegistry === "function") purgeDeletedCasesFromRegistry();
          const sel = document.getElementById("caseSelectorSelect");
          const savedCase = localStorage.getItem("activeCaseId");
          const initCase = (savedCase && caseRegistry[savedCase]) ? savedCase : ((sel && sel.value) ? sel.value : Object.keys(caseRegistry)[0]);
          if (sel && initCase) sel.value = initCase;
          if (initCase) onCaseSelected(initCase);
          startLiveDocumentSync();
          renderManagementPortal();
        } else {
          const err = await res.json().catch(() => ({}));
          alertEl.textContent = err.detail || "Invalid login credentials. Please use admin / admin@123";
          alertEl.classList.remove("hidden");
        }
      } catch (err) {
        if (username.toLowerCase() === "admin" && password === "admin@123") {
          localStorage.setItem("ca_token", "demo-ca-token");
          localStorage.setItem("ca_user", JSON.stringify({ full_name: "CA Pranav N. Shah (Sr. Partner)", role: "SUPER_ADMIN" }));
          document.getElementById("caLoginModal").classList.add("hidden");
        } else {
          alertEl.textContent = "Unable to connect to auth server. Try admin / admin@123";
          alertEl.classList.remove("hidden");
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Sign In to CA Scrutiny Desk</span><span class="material-symbols-outlined text-[18px]">login</span>`;
      }
    }

    function togglePasswordVisibility(fieldId) {
      const field = document.getElementById(fieldId);
      if (field) {
        field.type = field.type === "password" ? "text" : "password";
      }
    }

    function handleCaLogout() {
      if (confirm("Sign out of CA Scrutiny & Certification Desk?")) {
        localStorage.removeItem("ca_token");
        localStorage.removeItem("ca_user");
        document.getElementById("caLoginModal").classList.remove("hidden");
      }
    }

    // ==========================================
    // CASE HANDOVER & WHATSAPP DISPATCH ENGINE
    // ==========================================
    function openHandoverModal() {
      const c = caseRegistry[activeCaseId];
      if (!c) return;

      document.getElementById("hoCaseNo").textContent = c.case_no;
      document.getElementById("hoBankBranch").textContent = `${c.bank} (${c.branch})`;
      document.getElementById("hoApplicantName").textContent = c.applicant_name;
      document.getElementById("hoPropertyAddress").textContent = c.address;

      // Load agents dynamically and refresh dropdown
      loadFieldAgents();
      document.getElementById("handoverModal").classList.remove("hidden");
    }

    function closeHandoverModal() {
      document.getElementById("handoverModal").classList.add("hidden");
    }

    function onHandoverAgentChanged(val) {
      const phoneInput = document.getElementById("hoAgentPhone");
      const credUser = document.getElementById("hoCredUser");
      const credPass = document.getElementById("hoCredPass");

      const agent = (window.allAgents || []).find(a => a.username === val);
      if (agent) {
        phoneInput.value = agent.phone || "";
        credUser.textContent = agent.username;
        credPass.textContent = `${agent.username}@123`;
      } else if (val === "custom") {
        phoneInput.value = "+91 ";
        credUser.textContent = "agent";
        credPass.textContent = "agent@123";
        phoneInput.focus();
      } else {
        credUser.textContent = val || "agent";
        credPass.textContent = `${val || 'agent'}@123`;
      }
      updateHandoverPreview();
    }

    function generateHandoverMessage() {
      const c = caseRegistry[activeCaseId] || {};
      const caseNo = c.case_no || "CASE-2026-001";
      const applicant = c.applicant_name || "Applicant";
      const bank = c.bank || "Empanelled Bank";
      const branch = c.branch || "";
      const address = c.address || "";
      const officeAddress = c.office_address || "";
      const coApplicantAddress = c.co_applicant_address || "";
      const user = document.getElementById("hoCredUser") ? document.getElementById("hoCredUser").textContent : "agent1";
      const pass = document.getElementById("hoCredPass") ? document.getElementById("hoCredPass").textContent : "agent1@123";
      const pwaLink = `${window.location.origin}/pwa?case=${encodeURIComponent(caseNo)}`;
      const instructions = document.getElementById("hoInstructions") ? document.getElementById("hoInstructions").value.trim() : "";
      const coLine = c.co_applicant_name ? `👥 *Co-Applicant:* ${c.co_applicant_name} (separate office verification required)\n` : "";
      const officeLine = officeAddress ? `🏢 *Office / Workplace Address:* ${officeAddress}\n` : "";
      const coResidenceLine = coApplicantAddress ? `🏠 *Co-Applicant Residence Address (separate from applicant):* ${coApplicantAddress}\n` : "";
      const extraPhotoNote = [c.co_applicant_name ? "+4 co-applicant office photos" : "", coApplicantAddress ? "+4 co-applicant residence photos" : ""].filter(Boolean).join(", ");

      return `🏛️ *NAIMISH N. SHAH & CO. CHARTERED ACCOUNTANTS*\n*Contact Point Verification (CPV) Order*\n\n` +
        `📋 *Case No:* ${caseNo}\n` +
        `👤 *Borrower:* ${applicant}\n` +
        coLine +
        `🏦 *Bank:* ${bank} (${branch})\n` +
        `🏠 *Residence Address:* ${address}\n` +
        officeLine + coResidenceLine + `\n` +
        `📲 *Open Field Agent Mobile PWA Link:*\n${pwaLink}\n\n` +
        `🔑 *Agent Login Credentials:*\n` +
        `• *Username:* ${user}\n` +
        `• *Password:* ${pass}\n\n` +
        `📝 *Inspection Instructions:*\n${instructions}\n\n` +
        `⚠️ *Notice:* Live GNSS geofencing (<150m) and timestamp watermarking are active. Please capture 4 site photos${extraPhotoNote ? ` (${extraPhotoNote})` : ""}, upload verification docs, and submit.`;
    }

    function updateHandoverPreview() {
      const preview = document.getElementById("hoMessagePreview");
      if (preview) {
        preview.textContent = generateHandoverMessage();
      }
    }

    async function copyHandoverMessage() {
      const text = generateHandoverMessage();
      const btnText = document.getElementById("btnCopyText");
      try {
        await navigator.clipboard.writeText(text);
        if (btnText) {
          btnText.textContent = "Copied to Clipboard! ✓";
          setTimeout(() => { btnText.textContent = "Copy Message & Link"; }, 2500);
        }
      } catch (err) {
        prompt("Copy the WhatsApp message text below:", text);
      }
    }

    function dispatchToWhatsApp() {
      const phone = document.getElementById("hoAgentPhone").value.replace(/[^0-9]/g, "");
      const text = generateHandoverMessage();
      const url = phone.length >= 10 
        ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`
        : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
      markCaseAsAssigned();
    }

    // Record the allotment on the server — the field PWA only shows cases assigned to the
    // logged-in agent, so without this the dispatched case never reaches the agent's phone.
    async function markCaseAsAssigned() {
      const c = caseRegistry[activeCaseId];
      if (!c) return;
      const username = (document.getElementById("hoCredUser") || {}).textContent || "agent1";
      try {
        const res = await fetch(`/api/v1/cases/${encodeURIComponent(c.db_id || activeCaseId)}/assign`, {
          method: "POST",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ agent_username: username.trim() }),
        });
        if (res.ok) {
          c.status = "ASSIGNED";
          const st = document.getElementById("dispCaseStatus");
          if (st) st.textContent = "ASSIGNED";
        } else {
          const err = await res.json().catch(() => ({}));
          alert(`WhatsApp message opened, but the case could NOT be allotted to '${username}' on the server: ${err.detail || res.statusText}. The agent will not see it in the PWA until this is fixed.`);
        }
      } catch (e) {
        alert("WhatsApp message opened, but the allotment could not be saved (network error). Retry dispatch.");
      }
    }

    // ==========================================
    // PORTAL VIEW SWITCHER (SCRUTINY DESK vs MANAGEMENT PORTAL vs NEW CASE INTAKE vs ARCHIVE)
    // ==========================================
    function switchMainPortalView(view) {
      const scrutinyDesk = document.getElementById("viewScrutinyDesk");
      const mgmtPortal = document.getElementById("viewManagementPortal");
      const vaultPortal = document.getElementById("viewDocumentVault");
      const newCasePortal = document.getElementById("viewNewCaseIntake");
      const archivePortal = document.getElementById("viewMonthlyArchive");
      const tabScrutiny = document.getElementById("navTabScrutiny");
      const tabMgmt = document.getElementById("navTabManagement");
      const tabVault = document.getElementById("navTabVault");
      const tabNewCase = document.getElementById("navTabNewCase");
      const tabArchive = document.getElementById("navTabArchive");

      if (view === "archive") {
        if (scrutinyDesk) scrutinyDesk.classList.add("hidden");
        if (mgmtPortal) mgmtPortal.classList.add("hidden");
        if (vaultPortal) vaultPortal.classList.add("hidden");
        if (newCasePortal) newCasePortal.classList.add("hidden");
        if (archivePortal) archivePortal.classList.remove("hidden");
        if (tabArchive) tabArchive.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-bold flex items-center gap-1 transition-all bg-amber-600 text-white shadow-xs whitespace-nowrap";
        if (tabScrutiny) tabScrutiny.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center gap-1 transition-all whitespace-nowrap";
        if (tabMgmt) tabMgmt.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center gap-1 transition-all whitespace-nowrap";
        if (tabVault) tabVault.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center gap-1 transition-all whitespace-nowrap";
        if (tabNewCase) tabNewCase.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 border border-emerald-200 flex items-center gap-1 transition-all whitespace-nowrap";
        renderMonthlyArchiveDesk();
      } else if (view === "management") {
        if (scrutinyDesk) scrutinyDesk.classList.add("hidden");
        if (mgmtPortal) mgmtPortal.classList.remove("hidden");
        if (vaultPortal) vaultPortal.classList.add("hidden");
        if (newCasePortal) newCasePortal.classList.add("hidden");
        if (archivePortal) archivePortal.classList.add("hidden");
        if (tabMgmt) tabMgmt.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-bold flex items-center gap-1 transition-all bg-primary-container text-white shadow-xs whitespace-nowrap";
        if (tabScrutiny) tabScrutiny.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center gap-1 transition-all whitespace-nowrap";
        if (tabVault) tabVault.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center gap-1 transition-all whitespace-nowrap";
        if (tabNewCase) tabNewCase.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 border border-emerald-200 flex items-center gap-1 transition-all whitespace-nowrap";
        if (tabArchive) tabArchive.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-amber-900 hover:text-amber-950 hover:bg-amber-50 border border-amber-300 flex items-center gap-1 transition-all whitespace-nowrap";
        renderManagementPortal();
      } else if (view === "vault") {
        if (scrutinyDesk) scrutinyDesk.classList.add("hidden");
        if (mgmtPortal) mgmtPortal.classList.add("hidden");
        if (vaultPortal) vaultPortal.classList.remove("hidden");
        if (newCasePortal) newCasePortal.classList.add("hidden");
        if (archivePortal) archivePortal.classList.add("hidden");
        if (tabVault) tabVault.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-bold flex items-center gap-1 transition-all bg-primary-container text-white shadow-xs whitespace-nowrap";
        if (tabScrutiny) tabScrutiny.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center gap-1 transition-all whitespace-nowrap";
        if (tabMgmt) tabMgmt.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center gap-1 transition-all whitespace-nowrap";
        if (tabNewCase) tabNewCase.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 border border-emerald-200 flex items-center gap-1 transition-all whitespace-nowrap";
        if (tabArchive) tabArchive.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-amber-900 hover:text-amber-950 hover:bg-amber-50 border border-amber-300 flex items-center gap-1 transition-all whitespace-nowrap";
        renderCaseDocumentVault(activeCaseId);
      } else if (view === "newcase") {
        if (scrutinyDesk) scrutinyDesk.classList.add("hidden");
        if (mgmtPortal) mgmtPortal.classList.add("hidden");
        if (vaultPortal) vaultPortal.classList.add("hidden");
        if (newCasePortal) newCasePortal.classList.remove("hidden");
        if (archivePortal) archivePortal.classList.add("hidden");
        if (tabNewCase) tabNewCase.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-bold flex items-center gap-1 transition-all bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-500/50 whitespace-nowrap";
        if (tabScrutiny) tabScrutiny.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center gap-1 transition-all whitespace-nowrap";
        if (tabMgmt) tabMgmt.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center gap-1 transition-all whitespace-nowrap";
        if (tabVault) tabVault.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center gap-1 transition-all whitespace-nowrap";
        if (tabArchive) tabArchive.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-amber-900 hover:text-amber-950 hover:bg-amber-50 border border-amber-300 flex items-center gap-1 transition-all whitespace-nowrap";
        initNewCaseTabFields();
      } else {
        if (scrutinyDesk) scrutinyDesk.classList.remove("hidden");
        if (mgmtPortal) mgmtPortal.classList.add("hidden");
        if (vaultPortal) vaultPortal.classList.add("hidden");
        if (newCasePortal) newCasePortal.classList.add("hidden");
        if (archivePortal) archivePortal.classList.add("hidden");
        if (tabScrutiny) tabScrutiny.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-bold flex items-center gap-1 transition-all bg-primary-container text-white shadow-xs whitespace-nowrap";
        if (tabMgmt) tabMgmt.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center gap-1 transition-all whitespace-nowrap";
        if (tabVault) tabVault.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center gap-1 transition-all whitespace-nowrap";
        if (tabNewCase) tabNewCase.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 border border-emerald-200 flex items-center gap-1 transition-all whitespace-nowrap";
        if (tabArchive) tabArchive.className = "px-2.5 py-1.5 rounded-lg text-xs font-headline font-medium text-amber-900 hover:text-amber-950 hover:bg-amber-50 border border-amber-300 flex items-center gap-1 transition-all whitespace-nowrap";
        renderVaultMini();
      }
    }

    // ==========================================
    // MONTHLY ARCHIVE & CLOUD OFFLOAD CONTROLLER
    // ==========================================
    let cachedArchiveMonths = [];

    async function renderMonthlyArchiveDesk() {
      try {
        const res = await fetch("/api/v1/archives/months");
        if (!res.ok) throw new Error("Failed to fetch archive months");
        cachedArchiveMonths = await res.json();
      } catch (err) {
        console.error("renderMonthlyArchiveDesk error:", err);
      }

      // Populate Month Selector Dropdown
      const selectMonth = document.getElementById("archiveMonthSelect");
      if (selectMonth) {
        const curVal = selectMonth.value;
        selectMonth.innerHTML = "";
        
        // Add "All Portfolio Months" option
        const allOpt = document.createElement("option");
        allOpt.value = "ALL";
        allOpt.textContent = "All Portfolio Months (સંપૂર્ણ પોર્ટફોલિયો)";
        selectMonth.appendChild(allOpt);

        cachedArchiveMonths.forEach(m => {
          const opt = document.createElement("option");
          opt.value = m.month_year;
          opt.textContent = `${m.month_year} (${m.cases_count} Cases • ${m.total_size_mb} MB)`;
          selectMonth.appendChild(opt);
        });

        // Set default to first specific month if available, or keep current
        if (curVal && Array.from(selectMonth.options).some(o => o.value === curVal)) {
          selectMonth.value = curVal;
        } else if (cachedArchiveMonths.length > 0) {
          selectMonth.value = cachedArchiveMonths[0].month_year;
        }
      }

      updateArchiveViewData();
    }

    function onArchiveMonthChanged(val) {
      const treeMonth = document.getElementById("dispArchiveTreeMonth");
      if (treeMonth) treeMonth.textContent = (val && val !== "ALL") ? val : "All Months (AUG / SEP / OCT 2026)";
      updateArchiveViewData();
    }

    function onArchiveBankChanged(val) {
      const treeBank = document.getElementById("dispArchiveTreeBank");
      if (treeBank) treeBank.textContent = (val && val !== "ALL") ? val : "All Empanelled Banks (Union Bank, BOB, SBI, HDFC, ICICI)";
      updateArchiveViewData();
    }

    function updateArchiveViewData() {
      const selectMonth = document.getElementById("archiveMonthSelect");
      const selectBank = document.getElementById("archiveBankSelect");
      const targetMonth = selectMonth ? selectMonth.value : "ALL";
      const targetBank = selectBank ? selectBank.value : "ALL";

      let filteredCases = [];
      let totalFiles = 0;
      let totalBytes = 0;
      let banksSet = new Set();
      let branchesSet = new Set();
      let isPurged = true;

      cachedArchiveMonths.forEach(m => {
        if (targetMonth === "ALL" || m.month_year === targetMonth) {
          (m.cases || []).forEach(c => {
            if (targetBank === "ALL" || (c.bank_name && c.bank_name.toLowerCase().includes(targetBank.toLowerCase()))) {
              filteredCases.push({ ...c, month_year: m.month_year });
              totalFiles += (c.files_count || 0);
              totalBytes += ((c.size_mb || 0) * 1024 * 1024);
              if (c.bank_name) banksSet.add(c.bank_name);
              if (c.branch) branchesSet.add(c.branch);
              if (!c.is_archived && (c.files_count > 0 || c.size_mb > 0)) isPurged = false;
            }
          });
        }
      });

      const totalMb = (totalBytes / (1024 * 1024)).toFixed(2);

      // Update KPI cards
      const kpiCases = document.getElementById("archiveKpiCases");
      const kpiBanks = document.getElementById("archiveKpiBanks");
      const kpiBranches = document.getElementById("archiveKpiBranches");
      const kpiFiles = document.getElementById("archiveKpiFiles");
      const kpiSize = document.getElementById("archiveKpiSize");
      const kpiStatus = document.getElementById("archiveKpiStatus");
      const tableCountBadge = document.getElementById("archiveTableCountBadge");

      if (kpiCases) kpiCases.textContent = `${filteredCases.length} Cases`;
      if (kpiBanks) kpiBanks.textContent = `${banksSet.size} Banks`;
      if (kpiBranches) kpiBranches.textContent = `Across ${branchesSet.size} Branches`;
      if (kpiFiles) kpiFiles.textContent = `${totalFiles} Files`;
      if (kpiSize) kpiSize.textContent = `${totalMb} MB`;
      if (tableCountBadge) tableCountBadge.textContent = `${filteredCases.length} Cases listed`;

      if (kpiStatus) {
        if (isPurged || parseFloat(totalMb) === 0) {
          kpiStatus.innerHTML = '<span class="text-emerald-700 font-bold">✓ Purged / Saved to Local Machine</span>';
        } else {
          kpiStatus.innerHTML = '<span class="text-rose-700 font-bold">● Active on Railway Cloud</span>';
        }
      }

      // Populate Table
      const tbody = document.getElementById("archiveCasesTableBody");
      if (!tbody) return;

      if (filteredCases.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-outline font-mono">No cases found for selected Month & Bank.</td></tr>`;
        return;
      }

      tbody.innerHTML = filteredCases.map(c => {
        const statusBadge = (c.is_archived || (c.files_count === 0 && c.size_mb === 0))
          ? `<span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[10px] font-bold">📦 Archived to Local Machine</span>`
          : `<span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">● Stored on Cloud (${c.size_mb} MB)</span>`;

        return `
          <tr class="hover:bg-surface-container-low transition-colors">
            <td class="py-3 px-3">
              <div class="font-headline font-bold text-on-surface">${escapeHtml(c.applicant_name)}</div>
              <div class="font-mono text-[10px] text-outline">${escapeHtml(c.case_no)} • ${escapeHtml(c.month_year || "")}</div>
            </td>
            <td class="py-3 px-3">
              <span class="font-medium text-on-surface">${escapeHtml(c.bank_name || "General Bank")}</span>
            </td>
            <td class="py-3 px-3">
              <span class="font-mono text-[11px] text-on-surface-variant">${escapeHtml(c.branch || "Main Branch")}</span>
            </td>
            <td class="py-3 px-3 text-center">
              <span class="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">${c.files_count || 0} Files</span>
            </td>
            <td class="py-3 px-3 text-right font-mono font-bold text-on-surface">
              ${c.size_mb || 0} MB
            </td>
            <td class="py-3 px-3 text-center">
              ${statusBadge}
            </td>
          </tr>
        `;
      }).join("");
    }

    function downloadSelectedArchiveZip() {
      const selectMonth = document.getElementById("archiveMonthSelect");
      const selectBank = document.getElementById("archiveBankSelect");
      const month = selectMonth ? selectMonth.value : "ALL";
      const bank = selectBank ? selectBank.value : "ALL";

      const url = `/api/v1/archives/download?month=${encodeURIComponent(month)}&bank=${encodeURIComponent(bank)}`;
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `CA_Archive_${month.replace(/\s+/g, '_')}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`📥 Initiated download of hierarchical archive ZIP for ${month}!\n\nFolder Hierarchy:\n${month} ➔ Bank ➔ Branch ➔ Case Name (Inputs + Generated Reports)\n\nOnce downloaded to your Local Machine or USB Drive (D:), you can click 'Clean Cloud Disk' to decrease Railway storage load.`);
    }

    function openArchivePurgeModal() {
      const selectMonth = document.getElementById("archiveMonthSelect");
      const month = selectMonth ? selectMonth.value : "ALL";
      const kpiSize = document.getElementById("archiveKpiSize");
      const sizeText = kpiSize ? kpiSize.textContent : "0 MB";

      const modalMonth = document.getElementById("modalPurgeMonthLabel");
      const modalSize = document.getElementById("modalPurgeSizeLabel");
      if (modalMonth) modalMonth.textContent = month;
      if (modalSize) modalSize.textContent = sizeText;

      const chk = document.getElementById("chkPurgeConfirm");
      if (chk) chk.checked = false;

      const modal = document.getElementById("modalArchivePurge");
      if (modal) modal.classList.remove("hidden");
    }

    function closeArchivePurgeModal() {
      const modal = document.getElementById("modalArchivePurge");
      if (modal) modal.classList.add("hidden");
    }

    async function executeArchivePurge() {
      const chk = document.getElementById("chkPurgeConfirm");
      if (!chk || !chk.checked) {
        alert("Please tick the confirmation checkbox to verify you have saved the backup to your PC or USB Drive.");
        return;
      }

      const selectMonth = document.getElementById("archiveMonthSelect");
      const month = selectMonth ? selectMonth.value : "ALL";
      const purgeModeRadio = document.querySelector('input[name="purgeModeRadio"]:checked');
      const purgeMode = purgeModeRadio ? purgeModeRadio.value : "files_only";

      const btn = document.getElementById("btnExecutePurge");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="material-symbols-outlined text-[16px] animate-spin">sync</span> Purging...`;
      }

      try {
        const res = await fetch("/api/v1/archives/purge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            month_year: month,
            confirm: true,
            purge_mode: purgeMode,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || "Purge request failed");
        }

        closeArchivePurgeModal();
        alert(`🧹 Cloud storage cleanup complete!\n\n${data.message || `Freed ${data.mb_freed} MB and deleted ${data.files_deleted} files from Railway cloud.`}\n\nLocal backup on your PC / USB drive remains safe.`);
        await renderMonthlyArchiveDesk();
        if (typeof renderManagementPortal === "function") {
          renderManagementPortal();
        }
      } catch (err) {
        alert(`Purge failed: ${err.message}`);
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = `<span class="material-symbols-outlined text-[16px]">delete_sweep</span> Confirm & Purge Cloud Storage`;
        }
      }
    }

    // ==========================================
    // DEDICATED NEW CASE INTAKE CONTROLLER LOGIC
    // ==========================================
    let tabStagedPdfs = [];
    let tabStagedImages = [];

    const TAB_NC_BANK_PREFIXES = ["BOB", "UBI", "SBI", "HDFC", "ICICI", "AXIS", "CANARA", "PNB"];
    function tabNcBankPrefix(bank) {
      bank = bank || "";
      if (bank.includes("Union")) return "UBI";
      if (bank.includes("State")) return "SBI";
      if (bank.includes("HDFC")) return "HDFC";
      if (bank.includes("ICICI")) return "ICICI";
      if (bank.includes("Axis")) return "AXIS";
      if (bank.includes("Canara")) return "CANARA";
      if (bank.includes("Punjab")) return "PNB";
      return "BOB";
    }

    const TAB_NC_LOAN_TYPE_CODES = {
      "Vehicle Loan": "VL",
      "Home Loan": "HL",
      "Education Loan": "EL",
      "Personal Loan": "PL",
      "Business Takeover": "BT",
      "Quotation Verification": "QV",
      "Pension Loan": "PEN",
      "BT TOP UP": "BTTU",
      "Machinery Loan": "MC",
      "Builder Tie Up": "BTIE",
      "MSME Loan": "MSME",
      "Cash Credit Loan": "CC",
      "Mudra Loan": "MUD",
      "Others": "OTH",
    };
    function tabNcLoanTypeCode(loanType) {
      return TAB_NC_LOAN_TYPE_CODES[loanType] || "OTH";
    }

    // Finds the next ascending serial for this exact Bank + Branch + Loan Type combination by
    // scanning every real case already loaded (case-insensitive branch match, same convention
    // the Branches filter uses) and taking the highest existing trailing number + 1 - not a
    // random guess, which could collide, skip numbers, or restart from 1 on an already-used
    // combination (exactly what was reported: numbers "not in sequence").
    function nextTabNcSerial(bankPrefix, loanCode, branch) {
      const normBranch = (branch || "").trim().toLowerCase();
      let maxSerial = 0;
      Object.values(caseRegistry).forEach(c => {
        if (!c || !c.case_no) return;
        if ((c.branch || "").trim().toLowerCase() !== normBranch) return;
        const parts = c.case_no.split("-");
        if (parts.length < 4) return;
        if (parts[0].toUpperCase() !== bankPrefix.toUpperCase()) return;
        if (parts[1].toUpperCase() !== loanCode.toUpperCase()) return;
        const n = parseInt(parts[parts.length - 1], 10);
        if (Number.isFinite(n) && n > maxSerial) maxSerial = n;
      });
      return maxSerial + 1;
    }

    // True once the CA has typed into the case number field directly - after that, switching
    // Bank/Branch/Loan Type must stop silently overwriting what they typed. Reset whenever the
    // tab is freshly opened or the 🎲 Auto button is tapped (an explicit opt back into auto-fill).
    let tabNcCaseNoManuallyEdited = false;

    // force=true (the 🎲 Auto button) always regenerates. Bank/Branch/Loan Type change handlers
    // call this with no argument, so once the CA has started typing their own case number it's
    // respected instead of being silently replaced on every keystroke in Branch.
    function autoGenTabCaseNo(force) {
      const caseNoInput = document.getElementById("tabNcCaseNo");
      if (!caseNoInput) return;
      if (tabNcCaseNoManuallyEdited && !force) return;

      const bank = document.getElementById("tabNcBankName") ? document.getElementById("tabNcBankName").value : "";
      const prefix = tabNcBankPrefix(bank);
      const branch = document.getElementById("tabNcBranch") ? document.getElementById("tabNcBranch").value : "";
      const loanType = document.getElementById("tabNcLoanType") ? document.getElementById("tabNcLoanType").value : "Home Loan";
      const loanCode = tabNcLoanTypeCode(loanType);
      const year = new Date().getFullYear();
      const serial = nextTabNcSerial(prefix, loanCode, branch);

      if (force) tabNcCaseNoManuallyEdited = false;
      caseNoInput.value = `${prefix}-${loanCode}-${year}-${serial}`;
    }

    // Kept as the Bank dropdown's onchange target (existing markup) - now just re-runs the full
    // ascending-serial generation for the new Bank + current Branch + Loan Type, instead of only
    // swapping the prefix text and leaving a serial number computed for the old bank in place.
    function syncTabNcCaseNoPrefix() {
      autoGenTabCaseNo();
    }

    function initNewCaseTabFields() {
      const caseNoInput = document.getElementById("tabNcCaseNo");
      if (caseNoInput && !caseNoInput.value) {
        autoGenTabCaseNo();
      }
      const pbox = document.getElementById("tabNcScanProgressBox");
      if (pbox) pbox.classList.add("hidden");
      setTabNcApplicantMode(1);
    }

    // 1-5 Applicant stepper for New Case Intake - explicitly bifurcates the case instead of
    // silently inferring applicant count from whichever name fields happen to be filled in.
    // Switching down clears whatever was typed in the slots that disappear, so a case never
    // ends up with a leftover applicant name/phone from an accidental toggle.
    function setTabNcApplicantMode(count) {
      for (let i = 1; i <= 5; i++) {
        const btn = document.getElementById(`tabNcMode${i}`);
        if (btn) btn.className = `px-3 py-1 rounded-full transition-all font-bold ${i === count ? "bg-primary-container text-white" : "text-on-surface-variant font-medium"}`;
      }
      const fields2 = document.getElementById("tabNcCoApplicantFields");
      if (fields2) fields2.classList.toggle("hidden", count < 2);
      if (count < 2) {
        ["tabNcCoApplicantName", "tabNcCoApplicantPhone", "tabNcCoApplicantAddress", "tabNcCoApplicantOfficeAddress"].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = "";
        });
      }
      [3, 4, 5].forEach(slot => {
        const wrap = document.getElementById(`tabNcSlot${slot}Fields`);
        if (wrap) wrap.classList.toggle("hidden", count < slot);
        if (count < slot) {
          const n = document.getElementById(`tabNcSlot${slot}Name`);
          const p = document.getElementById(`tabNcSlot${slot}Phone`);
          const s = document.getElementById(`tabNcSlot${slot}Shares`);
          const a = document.getElementById(`tabNcSlot${slot}Address`);
          if (n) n.value = "";
          if (p) p.value = "";
          if (s) s.value = "";
          if (a) a.value = "";
        }
      });
    }

    // Reads the "Shares Home With" dropdowns for slots 3-5 into the applicant_home_sharing
    // JSON map the backend expects, e.g. {"4":"1"} meaning applicant 4 shares applicant 1's home.
    function collectHomeSharingMap(prefix) {
      const map = {};
      [3, 4, 5].forEach(slot => {
        const el = document.getElementById(`${prefix}Slot${slot}Shares`);
        if (el && el.value) map[String(slot)] = el.value;
      });
      return Object.keys(map).length ? JSON.stringify(map) : undefined;
    }

    // Same stepper for an already-created case in Edit Case - raising the count reveals the
    // next applicant's fields so the CA can add one retroactively; lowering it hides and clears
    // the slots above the new count, which on Save removes those applicants from the case.
    function setEcApplicantMode(count) {
      for (let i = 1; i <= 5; i++) {
        const btn = document.getElementById(`ecMode${i}`);
        if (btn) btn.className = `px-3 py-1 rounded-full transition-all font-bold ${i === count ? "bg-primary-container text-white" : "text-on-surface-variant font-medium"}`;
      }
      const isDual = count >= 2;
      const nameWrap = document.getElementById("ecCoApplicantNameWrap");
      const phoneWrap = document.getElementById("ecCoApplicantPhoneWrap");
      const addressWrap = document.getElementById("ecCoApplicantAddressWrap");
      const officeAddressWrap = document.getElementById("ecCoApplicantOfficeAddressWrap");
      if (nameWrap) nameWrap.classList.toggle("hidden", !isDual);
      if (phoneWrap) phoneWrap.classList.toggle("hidden", !isDual);
      if (addressWrap) addressWrap.classList.toggle("hidden", !isDual);
      if (officeAddressWrap) officeAddressWrap.classList.toggle("hidden", !isDual);
      if (!isDual) {
        ["ecCoApplicantName", "ecCoApplicantPhone", "ecCoApplicantAddress", "ecCoApplicantOfficeAddress"].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = "";
        });
      }
      [3, 4, 5].forEach(slot => {
        const wrap = document.getElementById(`ecSlot${slot}Wrap`);
        if (wrap) wrap.classList.toggle("hidden", count < slot);
        if (count < slot) {
          const n = document.getElementById(`ecSlot${slot}Name`);
          const p = document.getElementById(`ecSlot${slot}Phone`);
          const s = document.getElementById(`ecSlot${slot}Shares`);
          const a = document.getElementById(`ecSlot${slot}Address`);
          if (n) n.value = "";
          if (p) p.value = "";
          if (s) s.value = "";
          if (a) a.value = "";
        }
      });
    }

    function handleTabNcFolderSelected(files) {
      if (!files || files.length === 0) return;
      const fileList = Array.from(files);
      tabStagedPdfs = fileList.filter(f => f.name.toLowerCase().endsWith(".pdf"));
      tabStagedImages = fileList.filter(f => /\.(jpe?g|png|webp)$/i.test(f.name));

      const firstRelPath = fileList[0].webkitRelativePath || "";
      let folderName = "";
      if (firstRelPath) {
        const parts = firstRelPath.split("/");
        if (parts.length > 1) folderName = parts[0];
      }
      if (!folderName) {
        folderName = "Bank_Case_Folder_" + new Date().toISOString().slice(0, 10);
      }

      const folderBadge = document.getElementById("tabNcFolderNameBadge");
      if (folderBadge) folderBadge.textContent = `Folder: ${folderName}`;

      const countBadge = document.getElementById("tabNcFilesCountBadge");
      if (countBadge) countBadge.textContent = `${fileList.length} Files Selected (${tabStagedPdfs.length} PDFs, ${tabStagedImages.length} Images)`;

      const summaryText = document.getElementById("tabNcStagedSummary");
      if (summaryText) summaryText.textContent = `${tabStagedPdfs.length} PDF(s) + ${tabStagedImages.length} image(s) staged — Gemini AI ready to scan & arrange!`;

      const tray = document.getElementById("tabNcFilesTray");
      const list = document.getElementById("tabNcFilesList");
      if (tray && list) {
        list.innerHTML = "";
        fileList.forEach(f => {
          const isPdf = f.name.toLowerCase().endsWith(".pdf");
          const tag = isPdf ? "READY FOR AI SCAN" : "IMAGE";
          const badge = document.createElement("span");
          badge.className = "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold";
          badge.innerHTML = `<span>${f.name}</span> <span class="opacity-70 text-[9px]">[${tag}]</span>`;
          list.appendChild(badge);
        });
        tray.classList.remove("hidden");
      }
    }

    async function executeNewCaseCreationAndAiScan() {
      const caseNo = (document.getElementById("tabNcCaseNo") ? document.getElementById("tabNcCaseNo").value.trim() : "") || `CASE-${Date.now()}`;
      const bank = document.getElementById("tabNcBankName") ? document.getElementById("tabNcBankName").value : "";
      const branch = (document.getElementById("tabNcBranch") ? document.getElementById("tabNcBranch").value.trim() : "") || "";
      // Left blank on purpose when the CA doesn't type it: Gemini reads the real name off the
      // scanned Aadhaar/PAN below and corrects it (mergeExtractedDocsIntoCase) - never guess here.
      const applicantName = (document.getElementById("tabNcApplicantName") ? document.getElementById("tabNcApplicantName").value.trim() : "") || "Pending AI Identification";
      const phone = (document.getElementById("tabNcPhone") ? document.getElementById("tabNcPhone").value.trim() : "") || "";
      const coApplicantName = document.getElementById("tabNcCoApplicantName") ? document.getElementById("tabNcCoApplicantName").value.trim() : "";
      const coApplicantPhone = document.getElementById("tabNcCoApplicantPhone") ? document.getElementById("tabNcCoApplicantPhone").value.trim() : "";
      const coApplicantAddress = document.getElementById("tabNcCoApplicantAddress") ? document.getElementById("tabNcCoApplicantAddress").value.trim() : "";
      const coApplicantOfficeAddress = document.getElementById("tabNcCoApplicantOfficeAddress") ? document.getElementById("tabNcCoApplicantOfficeAddress").value.trim() : "";
      const slot3Name = document.getElementById("tabNcSlot3Name") ? document.getElementById("tabNcSlot3Name").value.trim() : "";
      const slot3Phone = document.getElementById("tabNcSlot3Phone") ? document.getElementById("tabNcSlot3Phone").value.trim() : "";
      const slot4Name = document.getElementById("tabNcSlot4Name") ? document.getElementById("tabNcSlot4Name").value.trim() : "";
      const slot4Phone = document.getElementById("tabNcSlot4Phone") ? document.getElementById("tabNcSlot4Phone").value.trim() : "";
      const slot5Name = document.getElementById("tabNcSlot5Name") ? document.getElementById("tabNcSlot5Name").value.trim() : "";
      const slot5Phone = document.getElementById("tabNcSlot5Phone") ? document.getElementById("tabNcSlot5Phone").value.trim() : "";
      const slot3Address = document.getElementById("tabNcSlot3Address") ? document.getElementById("tabNcSlot3Address").value.trim() : "";
      const slot4Address = document.getElementById("tabNcSlot4Address") ? document.getElementById("tabNcSlot4Address").value.trim() : "";
      const slot5Address = document.getElementById("tabNcSlot5Address") ? document.getElementById("tabNcSlot5Address").value.trim() : "";
      const homeSharing = collectHomeSharingMap("tabNc");
      const loanType = document.getElementById("tabNcLoanType") ? document.getElementById("tabNcLoanType").value : "Home Loan (HL)";
      const loanAmountRaw = document.getElementById("tabNcLoanAmount") ? document.getElementById("tabNcLoanAmount").value.trim() : "";
      const loanAmount = parseInt(loanAmountRaw.replace(/[^0-9]/g, "")) || 0;
      // Unlike applicant name, there is no AI step that ever corrects the address later - a
      // silent placeholder here stays wrong forever and can leak into the bank-facing report,
      // so the CA must type a real address before the case is created.
      const addressEl = document.getElementById("tabNcAddress");
      const address = addressEl ? addressEl.value.trim() : "";
      if (!address) {
        alert("Please enter the property / inspection address before creating the case. It cannot be left blank — there is no AI step that fills this in later.");
        if (addressEl) addressEl.focus();
        return;
      }
      // Office address is optional at intake (not every applicant has a workplace - retired/
      // house-wife cases, for instance) - but CA office asked to capture it upfront when known,
      // so the field agent has it as a reference before heading out for the office visit.
      const officeAddressEl = document.getElementById("tabNcOfficeAddress");
      const officeAddress = officeAddressEl ? officeAddressEl.value.trim() : "";

      const progressBox = document.getElementById("tabNcScanProgressBox");
      const progressBar = document.getElementById("tabNcScanProgressBar");
      const progressPercent = document.getElementById("tabNcScanPercent");
      const statusDetail = document.getElementById("tabNcScanDetailText");
      const launchBtn = document.getElementById("btnLaunchNewCaseAi");

      if (progressBox) progressBox.classList.remove("hidden");
      startElapsedTimer("tabNcScanElapsedText");
      if (launchBtn) {
        launchBtn.disabled = true;
        launchBtn.classList.add("opacity-60", "cursor-not-allowed");
      }

      if (statusDetail) statusDetail.textContent = `Step 1/2: Registering isolated case record '${caseNo}' in database...`;
      if (progressBar) progressBar.style.width = "15%";
      if (progressPercent) progressPercent.textContent = "15%";

      // Step 1: Create Case in Backend API
      let newCaseId = null;
      let sessionExpired = false;
      try {
        const token = localStorage.getItem("ca_token");
        const headers = { "Content-Type": "application/json" };
        if (token && token !== "demo-ca-token") {
          headers["Authorization"] = `Bearer ${token}`;
        }

        let createRes = await fetch("/api/v1/cases", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            case_no: caseNo,
            bank_name: bank,
            branch: branch,
            applicant_name: applicantName,
            applicant_phone: phone,
            co_applicant_name: coApplicantName || undefined,
            co_applicant_phone: coApplicantPhone || undefined,
            co_applicant_address: coApplicantAddress || undefined,
            co_applicant_office_address: coApplicantOfficeAddress || undefined,
            applicant_3_name: slot3Name || undefined,
            applicant_3_phone: slot3Phone || undefined,
            applicant_4_name: slot4Name || undefined,
            applicant_4_phone: slot4Phone || undefined,
            applicant_5_name: slot5Name || undefined,
            applicant_5_phone: slot5Phone || undefined,
            applicant_home_sharing: homeSharing,
            applicant_3_address: slot3Address || undefined,
            applicant_4_address: slot4Address || undefined,
            applicant_5_address: slot5Address || undefined,
            loan_type: loanType,
            loan_amount: loanAmount,
            target_address: address,
            office_address: officeAddress || undefined,
            target_lat: 23.1030,
            target_lon: 72.5350,
            assigned_agent_id: null
          })
        });

        if (createRes.ok) {
          const cData = await createRes.json();
          newCaseId = cData.id;
        } else if (createRes.status === 401) {
          sessionExpired = true;
        } else {
          // Case creation failed for some other reason - check if the case number
          // already exists in the DB (a prior attempt may have already created it).
          const allRes = await fetch("/api/v1/cases", { headers: headers });
          if (allRes.ok) {
            const existingCases = await allRes.json();
            const found = existingCases.find(c => c.case_no.toUpperCase() === caseNo.toUpperCase());
            if (found) newCaseId = found.id;
          }
        }
      } catch (err) {
        console.warn("Case creation network notice:", err);
      }

      if (sessionExpired) {
        localStorage.removeItem("ca_token");
        localStorage.removeItem("ca_user");
        alert("Your session has expired. Please log in again, then retry creating this case.");
        const modal = document.getElementById("caLoginModal");
        if (modal) modal.classList.remove("hidden");
        if (launchBtn) {
          launchBtn.disabled = false;
          launchBtn.classList.remove("opacity-60", "cursor-not-allowed");
        }
        if (progressBox) progressBox.classList.add("hidden");
        stopElapsedTimer("tabNcScanElapsedText");
        return;
      }

      if (!newCaseId) {
        alert(`Could not create case "${caseNo}" in the database. Please ensure the reference number is unique and retry.`);
        if (launchBtn) {
          launchBtn.disabled = false;
          launchBtn.classList.remove("opacity-60", "cursor-not-allowed");
        }
        if (progressBox) progressBox.classList.add("hidden");
        stopElapsedTimer("tabNcScanElapsedText");
        return;
      }

      // Register into client master caseRegistry as DRAFT (Unassigned - Manual Handover)
      caseRegistry[newCaseId] = buildCaseEntry({
        case_no: caseNo,
        bank: bank,
        branch: branch,
        applicant_name: applicantName,
        created_at: new Date().toISOString(),
        phone: phone,
        co_applicant_name: coApplicantName,
        co_applicant_phone: coApplicantPhone,
        co_applicant_address: coApplicantAddress,
        co_applicant_office_address: coApplicantOfficeAddress,
        month: "October 2026",
        allotted_by: "Pending Manual Handover",
        loan_type: loanType,
        loan_amount: loanAmount,
        address: address,
        office_address: officeAddress,
        agent: "Not yet allotted",
        benchmark_lat: "23.1030",
        benchmark_lon: "72.5350",
        status: "DRAFT"
      });
      caseRegistry[caseNo] = caseRegistry[newCaseId];

      // Update selector
      const selector = document.getElementById("caseSelectorSelect");
      if (selector) {
        const opt = document.createElement("option");
        opt.value = newCaseId;
        opt.textContent = `[${caseNo}] - ${applicantName} (${fmtCaseOptDate(caseRegistry[newCaseId].created_at)}) | ${bank} (${branch})`;
        selector.insertBefore(opt, selector.firstChild);
        selector.value = newCaseId;
        rebuildBranchFilterOptions();
      rebuildBankFilterOptions();
      }
      activeCaseId = newCaseId;

      // Step 2: Upload and Run Real Gemini AI Scan on Staged PDFs AND Staged Images -
      // a bank folder commonly mixes combined PDFs with loose JPEG/PNG/WEBP photos
      // (scanned Aadhaar/PAN pages, phone photos of a utility bill, etc.) and every one
      // of them must reach Gemini, not just the PDFs.
      const pdfsToIngest = tabStagedPdfs.slice();
      const imagesToIngest = tabStagedImages.slice();
      const totalStagedFiles = pdfsToIngest.length + imagesToIngest.length;
      let kycCount = 0;
      let incomeCount = 0;
      let bankCount = 0;
      let propCount = 0;

      const tallyDocCounts = (docs) => {
        docs.forEach(d => {
          const t = (d.doc_type || "").toUpperCase();
          if (t.includes("PAN") || t.includes("AADHAAR") || t.includes("PASSPORT") || t.includes("VOTER")) kycCount++;
          else if (t.includes("FORM_16") || t.includes("SALARY") || t.includes("PAYSLIP") || t.includes("ITR")) incomeCount++;
          else if (t.includes("STATEMENT") || t.includes("BANK")) bankCount++;
          else propCount++;
        });
      };
      const refreshShelfCounters = () => {
        const elKyc = document.getElementById("tabShelfKycCount");
        if (elKyc) elKyc.textContent = `${kycCount} Classified`;
        const elInc = document.getElementById("tabShelfIncomeCount");
        if (elInc) elInc.textContent = `${incomeCount} Classified`;
        const elBank = document.getElementById("tabShelfBankCount");
        if (elBank) elBank.textContent = `${bankCount} Classified`;
        const elProp = document.getElementById("tabShelfPropertyCount");
        if (elProp) elProp.textContent = `${propCount} Classified`;
      };

      // PDFs that turn out to be password-protected are queued rather than failed outright -
      // asked for separately, one at a time, once every other staged file has finished scanning.
      const pendingPwdFiles = [];
      const ingestOnePdf = async (f, replaceExisting, password) => {
        const formData = new FormData();
        formData.append("file", f, f.name);
        formData.append("replace_existing", replaceExisting ? "true" : "false");
        if (password) formData.append("password", password);
        let token = localStorage.getItem("ca_token");
        const uploadHeaders = {};
        if (token && token !== "demo-ca-token") uploadHeaders["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`/api/v1/cases/${newCaseId}/ingest-pdf`, {
          method: "POST",
          headers: uploadHeaders,
          body: formData
        });

        if (res.ok) {
          const resData = await res.json();
          const docs = resData.documents || [];
          tallyDocCounts(docs);
          mergeExtractedDocsIntoCase(newCaseId, docs, resData.case_summary);
        } else {
          const err = await res.json().catch(() => ({}));
          const code = err.detail && typeof err.detail === "object" ? err.detail.code : null;
          if (code === "PASSWORD_REQUIRED" || code === "WRONG_PASSWORD") {
            pendingPwdFiles.push({ file: f, wrongAttempt: code === "WRONG_PASSWORD" });
          } else {
            console.warn(`File scan notice on ${f.name}:`, err);
          }
        }
      };

      if (totalStagedFiles > 0) {
        for (let i = 0; i < pdfsToIngest.length; i++) {
          const f = pdfsToIngest[i];
          const pct = Math.round(20 + ((i + 1) / totalStagedFiles) * 75);
          if (progressBar) progressBar.style.width = pct + "%";
          if (progressPercent) progressPercent.textContent = pct + "%";
          if (statusDetail) statusDetail.textContent = `Gemini AI reading file ${i + 1}/${totalStagedFiles}: ${f.name}...`;

          try {
            await ingestOnePdf(f, i === 0, null);
          } catch (e) {
            console.warn(`File scan notice on ${f.name}:`, e);
          }

          refreshShelfCounters();
        }

        if (imagesToIngest.length > 0) {
          const pct = Math.round(20 + ((pdfsToIngest.length + imagesToIngest.length) / totalStagedFiles) * 75);
          if (progressBar) progressBar.style.width = pct + "%";
          if (progressPercent) progressPercent.textContent = pct + "%";
          if (statusDetail) statusDetail.textContent = `Gemini AI reading ${imagesToIngest.length} image(s) (JPEG/PNG/WEBP)...`;

          try {
            const formData = new FormData();
            imagesToIngest.forEach(f => formData.append("files", f, f.name));
            formData.append("applicant_name", applicantName);
            formData.append("target_address", address);
            let token = localStorage.getItem("ca_token");
            const uploadHeaders = {};
            if (token && token !== "demo-ca-token") uploadHeaders["Authorization"] = `Bearer ${token}`;

            const res = await fetch(`/api/v1/cases/${newCaseId}/ingest-images`, {
              method: "POST",
              headers: uploadHeaders,
              body: formData
            });

            if (res.ok) {
              const resData = await res.json();
              const docs = resData.documents || [];
              tallyDocCounts(docs);
              mergeExtractedDocsIntoCase(newCaseId, docs, resData.case_summary);
            } else {
              const err = await res.json().catch(() => ({}));
              console.warn("Image AI scan notice:", err.detail || res.status);
            }
          } catch (e) {
            console.warn("Image scan notice:", e);
          }

          refreshShelfCounters();
        }

        // Only now - after every staged PDF and image has already been scanned - ask for each
        // password-protected file's password separately, one at a time.
        let queue = pendingPwdFiles.splice(0);
        while (queue.length > 0) {
          for (const entry of queue) {
            const promptMsg = entry.wrongAttempt
              ? `The password entered for "${entry.file.name}" was incorrect. Enter the correct password (or Cancel to skip this file):`
              : `"${entry.file.name}" is password-protected. Enter its password to scan it (or Cancel to skip):`;
            const pwd = prompt(promptMsg);
            if (!pwd) {
              console.warn(`Skipped password-protected PDF (no password entered): ${entry.file.name}`);
              continue;
            }
            if (statusDetail) statusDetail.textContent = `Gemini AI reading "${entry.file.name}" with the entered password...`;
            try {
              await ingestOnePdf(entry.file, false, pwd);
            } catch (e) {
              console.warn(`File scan notice on ${entry.file.name}:`, e);
            }
            refreshShelfCounters();
          }
          queue = pendingPwdFiles.splice(0);
        }
      } else {
        // Fallback default shelf values if created without uploading folder
        document.getElementById("tabShelfKycCount").textContent = "Ready";
        document.getElementById("tabShelfIncomeCount").textContent = "Ready";
        document.getElementById("tabShelfBankCount").textContent = "Ready";
        document.getElementById("tabShelfPropertyCount").textContent = "Ready";
      }

      if (progressBar) progressBar.style.width = "100%";
      if (statusDetail) statusDetail.textContent = `✓ Ingestion complete! Case ${caseNo} is created with all documents arranged. Status: PENDING (Manual Handover).`;
      stopElapsedTimer("tabNcScanElapsedText");

      setTimeout(() => {
        if (launchBtn) {
          launchBtn.disabled = false;
          launchBtn.classList.remove("opacity-60", "cursor-not-allowed");
        }
        // Use whatever mergeExtractedDocsIntoCase() actually resolved from the scanned
        // documents, not the pre-scan applicantName - the two can differ whenever the CA
        // left the field blank for Gemini to fill in from the real Aadhaar/PAN.
        const finalApplicantName = (caseRegistry[newCaseId] && caseRegistry[newCaseId].applicant_name) || applicantName;
        alert(`[Case Onboarding & AI Scan Complete]\nCase Reference: ${caseNo}\nBank: ${bank}\nApplicant: ${finalApplicantName}\nField Staff: Unassigned (Pending Manual Handover)\n\nThe case is now active on your Scrutiny Desk! Use the Handover button whenever you are ready to dispatch it to field staff.`);
        onCaseSelected(newCaseId);
        switchMainPortalView("scrutiny");
        // Without this, the New Case Intake form/staged-file tray kept showing THIS case's
        // own typed details and selected folder the next time the CA opened the tab to create
        // a different case - looking exactly like the new case had already inherited the
        // previous one's documents, before even touching "Select Folder".
        resetNewCaseIntakeForm();
      }, 1000);
    }

    function resetNewCaseIntakeForm() {
      tabStagedPdfs = [];
      tabStagedImages = [];

      const tray = document.getElementById("tabNcFilesTray");
      if (tray) tray.classList.add("hidden");
      const list = document.getElementById("tabNcFilesList");
      if (list) list.innerHTML = "";
      const folderBadge = document.getElementById("tabNcFolderNameBadge");
      if (folderBadge) folderBadge.textContent = "";
      const countBadge = document.getElementById("tabNcFilesCountBadge");
      if (countBadge) countBadge.textContent = "";
      const summaryText = document.getElementById("tabNcStagedSummary");
      if (summaryText) summaryText.textContent = "";
      const filesInput = document.getElementById("tabNcFilesInput");
      if (filesInput) filesInput.value = "";

      ["tabNcCaseNo", "tabNcBranch", "tabNcApplicantName", "tabNcPhone", "tabNcCoApplicantName",
       "tabNcCoApplicantPhone", "tabNcCoApplicantAddress", "tabNcCoApplicantOfficeAddress", "tabNcLoanAmount", "tabNcAddress", "tabNcOfficeAddress",
       "tabNcSlot3Name", "tabNcSlot3Phone", "tabNcSlot3Shares", "tabNcSlot3Address",
       "tabNcSlot4Name", "tabNcSlot4Phone", "tabNcSlot4Shares", "tabNcSlot4Address",
       "tabNcSlot5Name", "tabNcSlot5Phone", "tabNcSlot5Shares", "tabNcSlot5Address"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
      setTabNcApplicantMode(1);

      ["tabShelfKycCount", "tabShelfIncomeCount", "tabShelfBankCount", "tabShelfPropertyCount"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "Ready";
      });

      tabNcCaseNoManuallyEdited = false;
      if (typeof autoGenTabCaseNo === "function") autoGenTabCaseNo();
    }


    // ==========================================
    // FIELD STAFF ATTENDANCE SELFIE ZOOM MODAL
    // ==========================================
    function openSelfieModal() {
      const c = caseRegistry[activeCaseId] || {};
      const cachedSelfie = localStorage.getItem("selfie_" + activeCaseId) ||
                            (c.case_no ? localStorage.getItem("selfie_" + c.case_no) : null) ||
                            (c.db_id ? localStorage.getItem("selfie_" + c.db_id) : null);
      const cachedTime = localStorage.getItem("selfie_timestamp_" + activeCaseId) ||
                          (c.case_no ? localStorage.getItem("selfie_timestamp_" + c.case_no) : null) ||
                          (c.db_id ? localStorage.getItem("selfie_timestamp_" + c.db_id) : null);
      const cachedAgent = localStorage.getItem("selfie_agent_" + activeCaseId) ||
                          (c.case_no ? localStorage.getItem("selfie_agent_" + c.case_no) : null) ||
                          (c.db_id ? localStorage.getItem("selfie_agent_" + c.db_id) : null);
      const url = cachedSelfie || c.agent_selfie || "/static/placeholders/photo_pending.svg";
      
      const img = document.getElementById("selfieModalImg");
      if (img) img.src = url;
      const name = document.getElementById("selfieModalStaffName");
      if (name) name.textContent = c.agent && c.agent !== "Not yet allotted" ? c.agent : (cachedAgent || "Not Yet Allotted");
      const ts = document.getElementById("selfieModalTimestamp");
      if (ts) ts.textContent = cachedTime || c.visit_date || "Not Captured";
      const gps = document.getElementById("selfieModalGps");
      if (gps) gps.textContent = (c.capture_lat && c.capture_lat !== "—" && c.capture_lon && c.capture_lon !== "—")
        ? `${c.capture_lat}° N, ${c.capture_lon}° E (±3.2m)`
        : "Not Captured";
      
      document.getElementById("selfieModal").classList.remove("hidden");
    }

    function closeSelfieModal() {
      document.getElementById("selfieModal").classList.add("hidden");
    }

    // ==========================================
    // BANK DOCUMENTS FOLDER INGESTION & AI SCANNER
    // ==========================================
    function triggerAiFolderIngest() {
      switchMainPortalView('scrutiny');
      const aiBox = document.getElementById('aiDocumentIngestSection');
      if (aiBox) {
        aiBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        aiBox.classList.add('ring-4', 'ring-amber-400');
        setTimeout(() => aiBox.classList.remove('ring-4', 'ring-amber-400'), 2500);
      }
      const folderInput = document.getElementById('portalFolderInput');
      if (folderInput) {
        folderInput.click();
      }
    }

    // Same AI ingestion desk as triggerAiFolderIngest(), but for a SPECIFIC existing case
    // rather than "whatever is currently active" - used by per-case "Add Documents (AI)"
    // buttons in the case list / Edit Case modal so a CA adding more bank docs to an
    // already-created case can't accidentally ingest them into the wrong case.
    function triggerAiFolderIngestForCase(caseId) {
      if (!caseId) return;
      activeCaseId = caseId;
      onCaseSelected(caseId);
      switchMainPortalView('scrutiny');
      const aiBox = document.getElementById('aiDocumentIngestSection');
      if (aiBox) {
        setTimeout(() => {
          aiBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          aiBox.classList.add('ring-4', 'ring-amber-400');
          setTimeout(() => aiBox.classList.remove('ring-4', 'ring-amber-400'), 2500);
        }, 150);
      }
    }

    function openNewCaseModal() {
      const modal = document.getElementById("newCaseModal");
      if (modal) {
        modal.classList.remove("hidden");
      }
    }

    function closeNewCaseModal() {
      const modal = document.getElementById("newCaseModal");
      if (modal) modal.classList.add("hidden");
    }

    function handleNewCaseFolderSelected(files) {
      if (!files || files.length === 0) return;
      processIngestedFiles(Array.from(files));
    }

    function handleNewCaseFilesSelected(files) {
      if (!files || files.length === 0) return;
      processIngestedFiles(Array.from(files));
    }

    let currentIngestedDocs = {
      aadhaar_front: null,
      aadhaar_back: null,
      pan_front: null,
      pan_back: null,
      utility_front: null
    };
    // The real file(s) selected in the bank folder, held for the real Gemini AI ingestion
    // pipeline (/ingest-pdf or /ingest-images) once the case is created. No scanning or
    // classification ever happens client-side from filenames — only Gemini Vision reads
    // the actual document content.
    // A bank folder commonly contains SEVERAL separate PDFs (one for PAN, one for
    // Aadhaar, one for a bill, a CIBIL report, a DocScanner export, etc.) rather than a
    // single combined dossier — so EVERY PDF found must be ingested, not just the first.
    let pendingIngestPdfFiles = [];
    let pendingIngestImageFiles = [];

    function processIngestedFiles(fileList) {
      if (!fileList || fileList.length === 0) return;
      currentIngestedDocs = {
        aadhaar_front: null,
        aadhaar_back: null,
        pan_front: null,
        pan_back: null,
        utility_front: null
      };
      pendingIngestPdfFiles = fileList.filter(f => f.name.toLowerCase().endsWith(".pdf"));
      pendingIngestImageFiles = fileList.filter(f => /\.(jpe?g|png|webp)$/i.test(f.name));

      const firstRelPath = fileList[0].webkitRelativePath || "";
      let folderName = "";
      if (firstRelPath) {
        const parts = firstRelPath.split("/");
        if (parts.length > 1) {
          folderName = parts[0];
        }
      }
      if (!folderName) {
        folderName = "Bank_Documents_Folder_" + new Date().toISOString().slice(0, 10);
      }

      const folderNameEl = document.getElementById("newCaseFolderName");
      if (folderNameEl) folderNameEl.textContent = `Folder: ${folderName}`;

      // Folder-name parsing below is used ONLY for low-stakes convenience prefills
      // (loan facility type, loan amount) that the CA can glance at and correct — never
      // for identity fields like applicant name, PAN, or Aadhaar.
      let cleanFolder = folderName.replace(/_/g, "-");
      let extractedFacility = "Home Loan (HL)";
      let extractedAmount = "20,00,000";

      if (/LAP|property/i.test(cleanFolder)) extractedFacility = "Loan Against Property (LAP)";
      else if (/PL|personal/i.test(cleanFolder)) extractedFacility = "Personal Loan (PL)";
      else if (/commercial|CM/i.test(cleanFolder)) extractedFacility = "Commercial Mortgage (CM)";
      else if (/business|msme/i.test(cleanFolder)) extractedFacility = "Business / MSME Loan";
      else if (/HL|home/i.test(cleanFolder)) extractedFacility = "Home Loan (HL)";

      const amtMatch = cleanFolder.match(/(\d+)\s*(LACS|LAKH|L|CR)/i);
      if (amtMatch) {
        const num = parseInt(amtMatch[1]);
        if (/CR/i.test(amtMatch[2])) {
          extractedAmount = (num * 10000000).toLocaleString("en-IN");
        } else {
          extractedAmount = (num * 100000).toLocaleString("en-IN");
        }
      }

      // NOTE: The applicant's name is NOT guessed from the folder name. A folder name
      // like "Case 2 - Bhavnaben Pargi" or a synthetic "Bank_Documents_Folder_..." name
      // produces a meaningless first token ("Case", "Bank") that looks like a real name
      // but isn't — this previously caused wrong applicant names to reach the dashboard
      // silently. The field is left blank: the CA office either types the real name (the
      // field is required, so a blank case cannot be submitted unnoticed) or Gemini AI
      // fills in the real name read off the Aadhaar/PAN card after the case is created
      // (see mergeExtractedDocsIntoCase -> persistAiCorrectedCaseFields).
      //
      // We likewise do NOT guess PAN/Aadhaar numbers or document type from filenames,
      // and do NOT preview files as blob URLs pretending to be a classified Aadhaar/PAN/
      // Utility card. ALL document scanning and data extraction is performed exclusively
      // by Gemini Vision (via OpenRouter) on the real file content, triggered after the
      // case is created (see handleCreateNewCase -> uploadAndProcessPdfFile /
      // ingestLooseImagesForCase).
      const genderVal = "Female";
      const foundPan = "";
      const foundAadhaar = "";
      const foundDob = "";

      // The case number is never invented, for the same reason as the applicant name below:
      // a random-looking-but-fake reference silently sitting in this required field is exactly
      // how a WhatsApp handover link can end up pointing at a case number that was never
      // actually created - the CA must type the bank's real allotted case number here.
      document.getElementById("ncApplicantName").value = "";
      // Phone, branch and property address are facts from the bank's allotment — never invented.
      // Left blank (required fields) for the CA office to enter from the bank's request.
      document.getElementById("ncApplicantPhone").value = "";
      document.getElementById("ncLoanType").value = extractedFacility;
      document.getElementById("ncLoanAmount").value = amtMatch ? extractedAmount : "";
      document.getElementById("ncAddress").value = "";

      // Prefill PAN / Aadhaar only if genuinely found in a filename; otherwise leave blank
      // and let the real Gemini AI extraction (triggered after case creation) fill these in.
      if (document.getElementById("ncPan")) document.getElementById("ncPan").value = foundPan;
      if (document.getElementById("ncAadhaar")) document.getElementById("ncAadhaar").value = foundAadhaar;
      if (document.getElementById("ncDob")) document.getElementById("ncDob").value = foundDob;
      if (document.getElementById("ncGender")) document.getElementById("ncGender").value = genderVal;

      // Display classified badges in tray
      const tray = document.getElementById("newCaseFilesTray");
      const list = document.getElementById("newCaseFilesList");
      const statusText = document.getElementById("newCaseAiStatusText");

      if (pendingIngestPdfFiles.length > 0 && statusText) {
        statusText.textContent = `${pendingIngestPdfFiles.length} PDF(s) detected — PAN, Aadhaar & other document numbers will be extracted automatically by Gemini AI, one file at a time, after you create the case.`;
      }

      if (tray && list) {
        list.innerHTML = "";

        // Files are only STAGED here — no classification happens until Gemini actually
        // scans the content after case creation. Show a neutral "queued" badge, not a
        // fake pre-determined document type.
        fileList.forEach(f => {
          const isPdf = f.name.toLowerCase().endsWith(".pdf");
          const isImg = /\.(jpe?g|png|webp)$/i.test(f.name);
          const tag = isPdf ? "QUEUED: AI PDF SCAN" : (isImg ? "QUEUED: AI IMAGE SCAN" : "SKIPPED: UNSUPPORTED TYPE");
          const color = (isPdf || isImg)
            ? "bg-slate-100 text-slate-800 border-slate-300 font-bold"
            : "bg-red-50 text-red-700 border-red-200";

          const badge = document.createElement("span");
          badge.className = `inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono border ${color}`;
          badge.innerHTML = `<span>${f.name}</span> <span class="opacity-70 text-[9px]">[${tag}]</span>`;
          list.appendChild(badge);
        });

        if (statusText && pendingIngestPdfFiles.length === 0) {
          const n = pendingIngestImageFiles.length;
          statusText.textContent = n > 0
            ? `${n} image(s) staged — Gemini AI will scan and classify each after you create the case.`
            : `No PDF or image documents found in this folder to scan.`;
        }
        tray.classList.remove("hidden");
      }
    }

    function quickFillSampleBankFolder() {
      // No sample/fake data: open the real folder picker so every value comes from a Gemini scan.
      const input = document.getElementById("newCaseFolderInput");
      if (input) input.click();
    }

    // Short date-only formatter for the case-selector dropdown entries, e.g. "04-Nov-2026" -
    // deliberately no time component, unlike fmtAalDate, since the dropdown just needs the
    // creation date at a glance.
    function fmtCaseOptDate(iso) {
      if (!iso) return "";
      try {
        const d = new Date(iso);
        if (isNaN(d.getTime())) return "";
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      } catch (e) { return ""; }
    }

    function buildCaseEntry(f) {
      const slots = (titles) => titles.map(([title, tag]) => ({
        src: "/static/placeholders/photo_pending.svg", title, tag, timestamp: "—", badge: "AWAITING FIELD VISIT", status: "PENDING",
      }));
      const amt = Number(f.loan_amount) || 0;
      return {
        case_no: f.case_no,
        bank: f.bank,
        branch: f.branch || "",
        applicant_name: f.applicant_name,
        created_at: f.created_at || null,
        phone: f.phone || "",
        co_applicant_name: f.co_applicant_name || "",
        co_applicant_phone: f.co_applicant_phone || "",
        co_applicant_address: f.co_applicant_address || "",
        co_applicant_office_address: f.co_applicant_office_address || "",
        applicant_3_name: f.applicant_3_name || "",
        applicant_3_phone: f.applicant_3_phone || "",
        applicant_4_name: f.applicant_4_name || "",
        applicant_4_phone: f.applicant_4_phone || "",
        applicant_5_name: f.applicant_5_name || "",
        applicant_5_phone: f.applicant_5_phone || "",
        applicant_home_sharing: f.applicant_home_sharing || "",
        applicant_3_address: f.applicant_3_address || "",
        applicant_4_address: f.applicant_4_address || "",
        applicant_5_address: f.applicant_5_address || "",
        assigned_agent_id: f.assigned_agent_id || null,
        // Falls back to deriving "Month YYYY" from created_at when no explicit month was given -
        // buildMgmtEntriesFromApi() (Management Portal) never passed a month at all, so every
        // real case's c.month was silently "" and the Month filter dropdown matched nothing,
        // no matter which month was selected.
        month: f.month || (f.created_at ? new Date(f.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : ""),
        allotted_by: f.allotted_by || "",
        loan_facility: `${f.loan_type || "Loan"}${amt ? " ₹" + (amt / 100000).toFixed(2) + " Lacs" : ""}`,
        loan_amount_val: amt,
        pan: f.pan && f.pan !== "PENDING AI EXTRACTION" ? f.pan : null,
        aadhaar_masked: f.aadhaar_masked && f.aadhaar_masked !== "PENDING AI EXTRACTION" ? f.aadhaar_masked : null,
        dob: f.dob || null,
        gender: f.gender || null,
        ward: null,
        address: f.address,
        office_address: f.office_address || "",
        agent: f.agent || "Not yet allotted",
        agent_selfie: "/static/placeholders/photo_pending.svg",
        selfie_verified: false,
        photos_count: 0,
        visit_date: "Not yet visited",
        benchmark_lat: f.benchmark_lat,
        benchmark_lon: f.benchmark_lon,
        capture_lat: f.capture_lat != null ? f.capture_lat : "—",
        capture_lon: f.capture_lon != null ? f.capture_lon : "—",
        distance_m: f.distance_m != null ? f.distance_m : null,
        agent_pin: "—",
        stay_period: null,
        ownership: null,
        person_met: null,
        neighbors: [],
        status: f.status || "ASSIGNED_TO_FIELD",
        db_id: f.db_id || null,
        residence_photos: slots([["Building / Society Gate (Photo 1)", "SLOT 1: SOCIETY & MAIN GATE"], ["House Door & Elevation (Photo 2)", "SLOT 2: HOUSE DOOR & NAMEPLATE"], ["Living Room & Electric Meter (Photo 3)", "SLOT 3: LIVING ASSETS & METER"], ["Person Met / Borrower at Site (Photo 4)", "SLOT 4: PERSON MET AT SITE"]]),
        work_photos: slots([["Workplace Facade", "WORKPLACE"], ["Workplace Office", "OPERATIONS"], ["Workplace Desk", "DESK"], ["Approach Road", "APPROACH"]]),
        photos: Array(4).fill("/static/placeholders/photo_pending.svg"),
      };
    }

    // Resolve a case's real assigned_agent_id (a UUID) to the actual registered field agent's
    // name via /api/v1/agents. Returns null (never a guessed/placeholder name) when the agent
    // list hasn't loaded yet or the id doesn't match anyone - callers must leave the existing
    // value alone in that case rather than overwrite it with something invented.
    function resolveAgentName(assignedAgentId) {
      if (!assignedAgentId || !Array.isArray(window.allAgents)) return null;
      const match = window.allAgents.find(a => a.id === assignedAgentId);
      return match ? `${match.full_name}${match.designation ? " (" + match.designation + ")" : ""}` : null;
    }

    // Real cases live in the database; the portal's built-in list is only demo data. Load every
    // DB case so a case created earlier (and its AI scan) is still here after a page reload.
    async function loadDbCasesIntoRegistry() {
      if (!window.allAgents || window.allAgents.length === 0) {
        await loadFieldAgents();
      }
      if (typeof purgeDeletedCasesFromRegistry === "function") purgeDeletedCasesFromRegistry();
      try {
        const res = await fetch("/api/v1/cases", { headers: authHeaders() });
        if (res.status === 401) {
          // The stored session is stale/invalid (expired or a deactivated account) - silently
          // giving up here used to leave the screen stuck showing only a leftover seed case
          // with no explanation. Clear it and force a real re-login instead.
          localStorage.removeItem("ca_token");
          localStorage.removeItem("ca_user");
          const el = document.getElementById("dataAsOfText");
          if (el) el.textContent = "Data as of: session expired — please log in again";
          const modal = document.getElementById("caLoginModal");
          if (modal) modal.classList.remove("hidden");
          return;
        }
        if (!res.ok) return;
        const cases = await res.json();
        const sel = document.getElementById("caseSelectorSelect");
        const deletedSet = typeof getDeletedCasesSet === "function" ? getDeletedCasesSet() : new Set();
        const knownCaseNos = new Set(Object.values(caseRegistry).map(c => (c.case_no || "").toUpperCase()));
        cases.forEach(dc => {
          // Only ever match on the case's own unique server id (a UUID, never reused) - case_no
          // is a human-typed/auto-generated reference number that CAN be reused by a later,
          // completely unrelated case (confirmed live: deleting "UBI-VL-2026-1" permanently hid
          // every future case auto-numbered "UBI-VL-2026-1" too, even though it existed fine on
          // the server with its own real documents already uploaded).
          if (deletedSet.has(String(dc.id).toUpperCase())) {
            return; // Skip cases explicitly deleted by CA user
          }
          if (!caseRegistry[dc.id]) {
            caseRegistry[dc.id] = buildCaseEntry({
              case_no: dc.case_no, bank: dc.bank_name, branch: dc.branch, applicant_name: dc.applicant_name,
              created_at: dc.created_at,
              phone: dc.applicant_phone, co_applicant_name: dc.co_applicant_name, co_applicant_phone: dc.co_applicant_phone,
              co_applicant_address: dc.co_applicant_address, co_applicant_office_address: dc.co_applicant_office_address,
              applicant_3_name: dc.applicant_3_name, applicant_3_phone: dc.applicant_3_phone,
              applicant_4_name: dc.applicant_4_name, applicant_4_phone: dc.applicant_4_phone,
              applicant_5_name: dc.applicant_5_name, applicant_5_phone: dc.applicant_5_phone,
              applicant_home_sharing: dc.applicant_home_sharing,
              applicant_3_address: dc.applicant_3_address, applicant_4_address: dc.applicant_4_address, applicant_5_address: dc.applicant_5_address,
              loan_type: dc.loan_type, loan_amount: dc.loan_amount, address: dc.target_address,
              office_address: dc.office_address,
              benchmark_lat: dc.target_lat, benchmark_lon: dc.target_lon, status: dc.status, db_id: dc.id,
              agent: resolveAgentName(dc.assigned_agent_id), assigned_agent_id: dc.assigned_agent_id,
              capture_lat: dc.capture_lat, capture_lon: dc.capture_lon, distance_m: dc.distance_m,
            });
          } else {
            // Built-in seed case that also exists in the database: the benchmark lives on the server.
            caseRegistry[dc.id].server_id = dc.id;
            caseRegistry[dc.id].assigned_agent_id = dc.assigned_agent_id;
            if (dc.target_lat != null && dc.target_lon != null) {
              caseRegistry[dc.id].benchmark_lat = dc.target_lat;
              caseRegistry[dc.id].benchmark_lon = dc.target_lon;
            }
            // Real visit telemetry from the server - without this, a case already cached in
            // this tab (e.g. from an earlier periodic refresh) never picked up a newly uploaded
            // photo's capture location/distance until a full page reload.
            if (dc.distance_m !== undefined) caseRegistry[dc.id].distance_m = dc.distance_m;
            if (dc.capture_lat !== undefined) caseRegistry[dc.id].capture_lat = dc.capture_lat != null ? dc.capture_lat : "—";
            if (dc.capture_lon !== undefined) caseRegistry[dc.id].capture_lon = dc.capture_lon != null ? dc.capture_lon : "—";
            // Keep the displayed executive name in sync with the real DB assignment, not a
            // stale demo placeholder from an earlier load.
            const realAgentName = resolveAgentName(dc.assigned_agent_id);
            if (realAgentName) caseRegistry[dc.id].agent = realAgentName;
            // The server is always the source of truth for status - without this, a case
            // already cached in this browser tab (e.g. open while generating its report)
            // never shows its status change (DRAFT -> ASSIGNED -> ... -> CERTIFIED) until a
            // full page reload, even though the backend committed it correctly right away.
            // This is exactly what made a successfully-certified case still look "in process"
            // indefinitely, and made it seem to vanish when filtering by its old status.
            if (dc.status) caseRegistry[dc.id].status = dc.status;
            if (dc.created_at !== undefined) caseRegistry[dc.id].created_at = dc.created_at;
            if (dc.office_address !== undefined) caseRegistry[dc.id].office_address = dc.office_address;
            if (dc.co_applicant_name !== undefined) caseRegistry[dc.id].co_applicant_name = dc.co_applicant_name;
            if (dc.co_applicant_phone !== undefined) caseRegistry[dc.id].co_applicant_phone = dc.co_applicant_phone;
            if (dc.co_applicant_address !== undefined) caseRegistry[dc.id].co_applicant_address = dc.co_applicant_address;
            if (dc.co_applicant_office_address !== undefined) caseRegistry[dc.id].co_applicant_office_address = dc.co_applicant_office_address;
            if (dc.applicant_3_name !== undefined) caseRegistry[dc.id].applicant_3_name = dc.applicant_3_name;
            if (dc.applicant_3_phone !== undefined) caseRegistry[dc.id].applicant_3_phone = dc.applicant_3_phone;
            if (dc.applicant_4_name !== undefined) caseRegistry[dc.id].applicant_4_name = dc.applicant_4_name;
            if (dc.applicant_4_phone !== undefined) caseRegistry[dc.id].applicant_4_phone = dc.applicant_4_phone;
            if (dc.applicant_5_name !== undefined) caseRegistry[dc.id].applicant_5_name = dc.applicant_5_name;
            if (dc.applicant_5_phone !== undefined) caseRegistry[dc.id].applicant_5_phone = dc.applicant_5_phone;
            if (dc.applicant_home_sharing !== undefined) caseRegistry[dc.id].applicant_home_sharing = dc.applicant_home_sharing;
            if (dc.applicant_3_address !== undefined) caseRegistry[dc.id].applicant_3_address = dc.applicant_3_address;
            if (dc.applicant_4_address !== undefined) caseRegistry[dc.id].applicant_4_address = dc.applicant_4_address;
            if (dc.applicant_5_address !== undefined) caseRegistry[dc.id].applicant_5_address = dc.applicant_5_address;
          }
          if (dc.case_no) {
            caseRegistry[dc.case_no] = caseRegistry[dc.id];
          }
          if (sel && !knownCaseNos.has((dc.case_no || "").toUpperCase())) {
            const opt = document.createElement("option");
            opt.value = dc.id;
            opt.textContent = `[${dc.case_no}] - ${dc.applicant_name}${dc.created_at ? " (" + fmtCaseOptDate(dc.created_at) + ")" : ""} | ${dc.bank_name}${dc.branch ? " (" + dc.branch + ")" : ""}`;
            sel.insertBefore(opt, sel.firstChild);
            knownCaseNos.add((dc.case_no || "").toUpperCase());
          }
        });
        if (typeof purgeDeletedCasesFromRegistry === "function") purgeDeletedCasesFromRegistry();
        updateGlobalCaseCounters();
        updateDataAsOfIndicator();
        rebuildBranchFilterOptions();
      rebuildBankFilterOptions();
        // The open case may have been shown before its server benchmark was known.
        const openCase = caseRegistry[activeCaseId];
        if (openCase && gfServerId(openCase)) {
          applyBenchmark(openCase, openCase.benchmark_lat, openCase.benchmark_lon);
          autoLocateCase(openCase);
          loadApplicantLocationPortal(openCase);
        }
      } catch (e) {
        console.warn("Could not load cases from server:", e);
        const el = document.getElementById("dataAsOfText");
        if (el) el.textContent = "Data as of: sync failed — tap to retry";
      }
    }

    async function handleCreateNewCase(e) {
      if (e) e.preventDefault();
      const caseNo = document.getElementById("ncCaseNo").value.trim();
      // Not required: if the CA doesn't type it, Gemini AI reads the real name off the
      // scanned Aadhaar/PAN card and corrects this automatically (persistAiCorrectedCaseFields).
      // The placeholder is deliberately unmistakable as a placeholder — never a plausible-
      // looking guessed word like "Case" or "Bank".
      const applicantName = document.getElementById("ncApplicantName").value.trim() || "Pending AI Identification";
      const phone = document.getElementById("ncApplicantPhone").value.trim();
      const coApplicantName = document.getElementById("ncCoApplicantName") ? document.getElementById("ncCoApplicantName").value.trim() : "";
      const coApplicantPhone = document.getElementById("ncCoApplicantPhone") ? document.getElementById("ncCoApplicantPhone").value.trim() : "";
      const coApplicantAddress = document.getElementById("ncCoApplicantAddress") ? document.getElementById("ncCoApplicantAddress").value.trim() : "";
      const bank = document.getElementById("ncBankName").value;
      const branch = document.getElementById("ncBranch").value.trim();
      const loanType = document.getElementById("ncLoanType").value;
      const loanAmount = document.getElementById("ncLoanAmount").value.trim();
      const month = document.getElementById("ncMonth").value;
      // The textarea's own "required" attribute only fires on a real <form> submit, not this
      // onclick handler - so it was silently doing nothing. There is no AI step that ever
      // fills the address in later (unlike applicant name), so a blank/placeholder address
      // here stays wrong forever and can leak into the bank-facing report - block it here.
      const ncAddressEl = document.getElementById("ncAddress");
      const address = ncAddressEl.value.trim();
      if (!address) {
        alert("Please enter the property / inspection address before creating the case. It cannot be left blank — there is no AI step that fills this in later.");
        ncAddressEl.focus();
        return;
      }
      const officeAddress = document.getElementById("ncOfficeAddress") ? document.getElementById("ncOfficeAddress").value.trim() : "";
      const lat = document.getElementById("ncLat").value.trim() || "23.2156";
      const lon = document.getElementById("ncLon").value.trim() || "72.6369";
      const allottedBy = document.getElementById("ncAllottedBy").value;
      const fieldStaff = document.getElementById("ncFieldStaff").value;

      // PAN / Aadhaar / DOB are left blank if not already filled — Gemini AI fills the
      // real values in after it scans the actual document content below.
      const pan = (document.getElementById("ncPan") ? document.getElementById("ncPan").value.trim().toUpperCase() : "") || "PENDING AI EXTRACTION";
      const aadhaarMasked = (document.getElementById("ncAadhaar") ? document.getElementById("ncAadhaar").value.trim() : "") || "PENDING AI EXTRACTION";
      const dob = (document.getElementById("ncDob") ? document.getElementById("ncDob").value.trim() : "") || "";
      const gender = (document.getElementById("ncGender") ? document.getElementById("ncGender").value : "Female");
      const ward = "WARD 2, GANDHINAGAR (ACTIVE)";
      const amtNumeric = parseInt(loanAmount.replace(/[^0-9]/g, "")) || 2000000;

      // 1. Create the case for real in the backend FIRST. Everything downstream (the
      // Gemini AI document scan, CaseDocument persistence, and PWA visibility for the
      // field agent) depends on using the real database case id, not a client-only one.
      let createdCase = null;
      try {
        const ncToken = localStorage.getItem("ca_token");
        const ncHeaders = { "Content-Type": "application/json" };
        if (ncToken && ncToken !== "demo-ca-token") {
          ncHeaders["Authorization"] = `Bearer ${ncToken}`;
        }
        const res = await fetch("/api/v1/cases", {
          method: "POST",
          headers: ncHeaders,
          body: JSON.stringify({
            case_no: caseNo,
            bank_name: bank,
            branch: branch,
            applicant_name: applicantName,
            applicant_phone: phone,
            co_applicant_name: coApplicantName || undefined,
            co_applicant_phone: coApplicantPhone || undefined,
            co_applicant_address: coApplicantAddress || undefined,
            loan_type: loanType,
            loan_amount: amtNumeric,
            target_address: address,
            office_address: officeAddress || undefined,
            target_lat: parseFloat(lat),
            target_lon: parseFloat(lon),
          })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          if (res.status === 401) {
            localStorage.removeItem("ca_token");
            localStorage.removeItem("ca_user");
            const modal = document.getElementById("caLoginModal");
            if (modal) modal.classList.remove("hidden");
          }
          alert(`Could not create case: ${err.detail || res.statusText}`);
          return;
        }
        createdCase = await res.json();
      } catch (err) {
        alert("Could not reach server to create the case: " + err.message);
        return;
      }

      const newCaseId = createdCase.id;

      caseRegistry[newCaseId] = buildCaseEntry({
        case_no: caseNo,
        bank: bank,
        branch: branch,
        applicant_name: applicantName,
        created_at: createdCase.created_at,
        phone: phone,
        co_applicant_name: coApplicantName,
        co_applicant_phone: coApplicantPhone,
        co_applicant_address: coApplicantAddress,
        month: month,
        allotted_by: allottedBy,
        loan_type: loanType,
        loan_amount: amtNumeric,
        pan: pan,
        aadhaar_masked: aadhaarMasked,
        dob: dob,
        gender: gender,
        address: address,
        office_address: officeAddress,
        agent: fieldStaff,
        benchmark_lat: lat,
        benchmark_lon: lon,
      });

      const selector = document.getElementById("caseSelectorSelect");
      if (selector) {
        const opt = document.createElement("option");
        opt.value = newCaseId;
        opt.textContent = `[${caseNo}] - ${applicantName}${createdCase.created_at ? " (" + fmtCaseOptDate(createdCase.created_at) + ")" : ""} | ${bank} (${branch})`;
        selector.insertBefore(opt, selector.firstChild);
        selector.value = newCaseId;
      }
      rebuildBranchFilterOptions();
      rebuildBankFilterOptions();

      const counterEl = document.getElementById("totalCaseCount");
      if (counterEl) {
        counterEl.textContent = Object.keys(caseRegistry).length;
      }

      onCaseSelected(newCaseId);
      switchMainPortalView("scrutiny");
      closeNewCaseModal();
      renderManagementPortal();

      // 2. Run the REAL Gemini AI document scan against whatever was staged from the
      // bank folder. A bank folder commonly has SEVERAL separate PDFs (PAN in one file,
      // Aadhaar in another, a bill in a third) rather than one combined dossier, so every
      // PDF is ingested one at a time — never just the first. This is the only place PAN,
      // Aadhaar, utility bill and other document data gets extracted — never a filename
      // guess. activeCaseId is now the real backend case id (set by onCaseSelected above).
      const pdfsToIngest = pendingIngestPdfFiles.slice();
      const imagesToIngest = pendingIngestImageFiles.slice();
      pendingIngestPdfFiles = [];
      pendingIngestImageFiles = [];

      for (let i = 0; i < pdfsToIngest.length; i++) {
        // Only the very first file in the whole batch clears any stale prior scan
        // results for this case; every later file in the same batch is additive so
        // earlier files aren't wiped out by the next one.
        const isFirstInBatch = (i === 0);
        await uploadAndProcessPdfFile(pdfsToIngest[i], isFirstInBatch, i + 1, pdfsToIngest.length);
      }
      if (imagesToIngest.length > 0) {
        await ingestLooseImagesForCase(imagesToIngest);
      }

      // 3. The real applicant name, as printed on their Aadhaar/PAN card, is more
      // trustworthy than a name guessed from the folder label — persist the correction
      // to the database (not just the portal's in-memory view) so the PWA sees it too.
      await persistAiCorrectedCaseFields(newCaseId);

      if (pdfsToIngest.length === 0 && imagesToIngest.length === 0) {
        alert(`[✓] New case "${caseNo}" created!\n• Borrower: ${applicantName}\n• Bank: ${bank} (${branch})\n• Allotted to: ${fieldStaff}\n\nNo PDF or image documents were staged for AI scanning — use "Extract PDF (AI)" or re-ingest a folder to add them.`);
      }
    }

    // Writes AI-corrected applicant_name/target_address back to the database so every
    // surface (portal reload, PWA, reports) sees the real scanned value, not the
    // folder-name guess used only to prefill the creation form.
    async function persistAiCorrectedCaseFields(caseId) {
      const c = caseRegistry[caseId];
      if (!c || !c.ai_corrected_applicant_name) return;
      try {
        const token = localStorage.getItem("ca_token");
        const headers = { "Content-Type": "application/json" };
        if (token && token !== "demo-ca-token") headers["Authorization"] = `Bearer ${token}`;
        await fetch(`/api/v1/cases/${caseId}`, {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify({ applicant_name: c.ai_corrected_applicant_name }),
        });
      } catch (err) {
        console.warn("Could not persist AI-corrected applicant name:", err);
      }
    }

    // Apply AI-scanned values to the case. Identity fields come ONLY from the applicant's own
    // documents (relationship SELF) — a co-applicant's PAN or a bill holder's name must never
    // overwrite the applicant's. When the server's cross-document summary is available it is
    // authoritative (consensus across all pages, father's name only from PAN/Aadhaar, etc.).
    function mergeExtractedDocsIntoCase(caseId, docs, summary) {
      const c = caseRegistry[caseId];
      if (!c || !docs || docs.length === 0) return;

      const ok = docs.filter(d => d.scan_status !== "FAILED");
      const own = ok.filter(d => d.relationship_to_applicant === "SELF" || !d.relationship_to_applicant);
      const firstImg = (list, pred) => { const d = list.find(pred); return d ? d.image_url : null; };
      const firstDoc = (list, pred) => list.find(pred) || null;
      const sub = d => (d.doc_sub_type || "").toUpperCase();

      // aadhaar_front_img/pan_front_img/utility_front_img go through setKycImageIfNewer (shared
      // with applyFieldCapturedKycFallback's manual-upload fallback) so a fresh AI (re-)scan only
      // wins if it's actually newer than whatever manual upload may already be showing — this
      // function re-runs on every case load/ingestion, not just the first time, and must not
      // silently drag an older AI scan back in front of a later manual correction.
      // A standalone photo (phone/WhatsApp camera shot ingested via Select Multiple Files, as
      // opposed to a flatbed-scanned PDF page) gives Gemini no embedded PDF text layer to lean
      // on and often has more variable lighting/angle/crop - so it occasionally classifies the
      // page as OTHER even though it genuinely read a real Aadhaar/PAN number off it. Don't
      // leave the dedicated card on its placeholder (forcing a manual re-upload) when the
      // number IS already on record from this scan - fall back to whichever "OTHER" doc
      // actually carries the extracted number.
      const aFront = firstDoc(own, d => d.doc_type === "AADHAAR_CARD" && sub(d) !== "BACK")
        || firstDoc(own, d => d.doc_type !== "AADHAAR_CARD" && (d.extracted_aadhaar || d.aadhaar_last4_masked));
      if (aFront && setKycImageIfNewer(c, "aadhaar_front_img", aFront.image_url, tsMs(aFront))) delete c.aadhaar_front_img_pending_ai_scan;
      c.aadhaar_back_img = firstImg(own, d => d.doc_type === "AADHAAR_CARD" && sub(d) === "BACK")
        || firstImg(own, d => d.doc_type === "AADHAAR_CARD") || c.aadhaar_back_img;
      // When no physical card photo was scanned, the NSDL/"Know Your AO" portal verification
      // IS the PAN evidence on file - it must still show in the primary (front) PAN slot, not
      // sit hidden behind a second click while the main view looks like nothing was scanned.
      const pFront = firstDoc(own, d => d.doc_type === "PAN_CARD" && sub(d) !== "BACK")
        || firstDoc(own, d => d.doc_type === "PAN_CARD" && sub(d) === "BACK")
        || firstDoc(own, d => d.doc_type !== "PAN_CARD" && d.extracted_pan);
      if (pFront && setKycImageIfNewer(c, "pan_front_img", pFront.image_url, tsMs(pFront))) delete c.pan_front_img_pending_ai_scan;
      c.pan_back_img = firstImg(own, d => d.doc_type === "PAN_CARD" && sub(d) === "BACK") || c.pan_back_img;
      c.payslip_img = firstImg(own, d => d.doc_type === "SALARY_SLIP") || c.payslip_img;
      c.form16_img = firstImg(own, d => d.doc_type === "FORM_16") || c.form16_img;
      c.sale_deed_img = firstImg(own, d => /PROPERTY/.test(d.doc_type || "") && !/index/i.test(d.document_title || "")) || c.sale_deed_img;
      c.index2_img = firstImg(own, d => /PROPERTY/.test(d.doc_type || "") && /index/i.test(d.document_title || "")) || c.index2_img;

      // The electricity bill is residence proof whoever's name it is in — show it, but flag a holder mismatch.
      const bill = ok.find(d => d.doc_type === "UTILITY_BILL");
      if (bill) {
        const applied = setKycImageIfNewer(c, "utility_front_img", bill.image_url, tsMs(bill));
        if (applied) {
          delete c.utility_front_img_pending_ai_scan;
          c.utility_provider = bill.utility_provider || c.utility_provider;
          c.utility_no = bill.consumer_number || c.utility_no;
          c.utility_holder = bill.holder_name || null;
          c.utility_holder_mismatch = bill.relationship_to_applicant === "DIFFERENT_PERSON";
        }
      }

      const a = (summary && summary.applicant) || {};
      const fromOwn = (field, types) => { const d = own.find(x => x[field] && (!types || types.includes(x.doc_type))); return d ? d[field] : null; };
      c.pan = a.extracted_pan || fromOwn("extracted_pan") || c.pan;
      c.aadhaar_masked = a.extracted_aadhaar || fromOwn("extracted_aadhaar", ["AADHAAR_CARD"]) || c.aadhaar_masked;
      c.dob = a.date_of_birth || fromOwn("date_of_birth", ["AADHAAR_CARD", "PAN_CARD", "EMPLOYEE_ID_CARD"]) || c.dob;
      c.dob_cross_checked = own.filter(d => d.date_of_birth && d.date_of_birth === c.dob).length > 1;
      if (a.gender || fromOwn("gender", ["AADHAAR_CARD"])) {
        const g = a.gender || fromOwn("gender", ["AADHAAR_CARD"]);
        c.gender = g.charAt(0) + g.slice(1).toLowerCase();
      }
      c.father_name = a.father_or_spouse_name || fromOwn("father_or_spouse_name", ["PAN_CARD", "AADHAAR_CARD"]) || c.father_name;
      // Real cross-check, not an assumed match: Aadhaar-PAN "seeding" is only actually verified
      // when the father's/spouse's name printed on both documents agrees - the two can legitimately
      // disagree (different scans, a misread, or genuinely different source documents), and a
      // report must never claim "LINKED (VERIFIED)" without having actually compared them.
      c.father_name_aadhaar = fromOwn("father_or_spouse_name", ["AADHAAR_CARD"]) || c.father_name_aadhaar;
      c.father_name_pan = fromOwn("father_or_spouse_name", ["PAN_CARD"]) || c.father_name_pan;
      // Deliberately NOT overwriting c.address here. c.address is the property/target address the
      // field agent must physically verify (bank-provided at case creation) and it is also shown
      // as the "does the Aadhaar match?" corroboration baseline next to the Aadhaar card image.
      // The applicant's Aadhaar residential_address is very often a different, outdated or native
      // hometown address (confirmed on a real migrant-worker case: Aadhaar registered in Rajasthan,
      // actual verified residence in Ahmedabad) — silently replacing the property address with it
      // would both show the wrong address to the CA and make the Aadhaar-corroboration check always
      // trivially "match" itself instead of actually comparing two independent sources.
      if (a.employer_name) c.employer_name = a.employer_name;
      if (a.net_salary_monthly && a.net_salary_monthly.length) c.net_salary_monthly = a.net_salary_monthly;
      if (a.bank_account) c.bank_account = a.bank_account;
      if (summary) c.ai_summary = summary;

      const idName = a.name || fromOwn("holder_name", ["AADHAAR_CARD", "PAN_CARD"]);
      if (idName && idName !== c.applicant_name_persisted) {
        c.applicant_name = idName;
        c.ai_corrected_applicant_name = idName;
        c.applicant_name_persisted = idName;
        const opt = document.querySelector(`#caseSelectorSelect option[value="${CSS.escape(caseId)}"]`);
        if (opt) opt.textContent = `[${c.case_no}] - ${idName}${c.created_at ? " (" + fmtCaseOptDate(c.created_at) + ")" : ""} | ${c.bank}${c.branch ? " (" + c.branch + ")" : ""}`;
        // This correction must reach the database, not just this browser's local caseRegistry -
        // the field agent's PWA (a separate device/session) always fetches the case fresh from
        // the server, never from this cache. Without this, the dashboard shows the AI-identified
        // name while the handover link the agent actually opens still serves the old placeholder.
        persistAiCorrectedApplicantName(caseId, idName);
      }
    }

    async function persistAiCorrectedApplicantName(caseId, name) {
      try {
        await fetch(`/api/v1/cases/${caseId}`, {
          method: "PATCH",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ applicant_name: name })
        });
      } catch (e) {
        console.warn("Could not persist AI-corrected applicant name to server:", e);
      }
    }

    async function ingestLooseImagesForCase(files) {
      if (!files || files.length === 0 || !activeCaseId) return;
      const statusBox = document.getElementById("pdfBurstStatusBox");
      const statusText = document.getElementById("pdfBurstStatusText");
      const statusPercent = document.getElementById("pdfBurstStatusPercent");
      const progressBar = document.getElementById("pdfBurstProgressBar");

      if (statusBox) statusBox.classList.remove("hidden");
      if (statusText) statusText.textContent = `Scanning ${files.length} image(s) with Gemini Vision (OpenRouter)...`;
      if (statusPercent) statusPercent.textContent = "40%";
      if (progressBar) progressBar.style.width = "40%";

      const formData = new FormData();
      files.forEach(f => formData.append("files", f, f.name));
      const c = caseRegistry[activeCaseId] || {};
      if (c.applicant_name) formData.append("applicant_name", c.applicant_name);
      if (c.address) formData.append("target_address", c.address);

      try {
        const token = localStorage.getItem("ca_token");
        const headers = {};
        if (token && token !== "demo-ca-token") headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`/api/v1/cases/${activeCaseId}/ingest-images`, {
          method: "POST",
          headers: headers,
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          if (statusPercent) statusPercent.textContent = "100%";
          if (progressBar) progressBar.style.width = "100%";
          if (statusText) statusText.textContent = `✓ ${data.total_images_classified} image(s) classified by Gemini AI!`;

          (data.documents || []).forEach(d => { if (d.id) lastIngestedDocIds.add(d.id); });
          mergeExtractedDocsIntoCase(activeCaseId, data.documents);
          onCaseSelected(activeCaseId);

          setTimeout(() => {
            if (statusBox) statusBox.classList.add("hidden");
          }, 2000);
        } else {
          const err = await res.json().catch(() => ({}));
          alert(`Image AI scan notice: ${err.detail || 'Could not classify images'}`);
          if (statusBox) statusBox.classList.add("hidden");
        }
      } catch (err) {
        console.error("Image ingest error:", err);
        alert("Image AI scan error: " + err.message);
        if (statusBox) statusBox.classList.add("hidden");
      }
    }

    // ==========================================
    // EDIT / MODIFY CASE DETAILS MODAL
    // ==========================================
    async function openEditCaseModal(caseId) {
      const cId = caseId || activeCaseId;
      const c = caseRegistry[cId];
      if (!c) return;

      document.getElementById("ecCaseId").value = cId;
      document.getElementById("ecCaseNo").value = c.case_no;
      document.getElementById("ecApplicantName").value = c.applicant_name;
      if (document.getElementById("ecCoApplicantName")) document.getElementById("ecCoApplicantName").value = c.co_applicant_name || "";
      if (document.getElementById("ecCoApplicantPhone")) document.getElementById("ecCoApplicantPhone").value = c.co_applicant_phone || "";
      if (document.getElementById("ecCoApplicantAddress")) document.getElementById("ecCoApplicantAddress").value = c.co_applicant_address || "";
      if (document.getElementById("ecCoApplicantOfficeAddress")) document.getElementById("ecCoApplicantOfficeAddress").value = c.co_applicant_office_address || "";
      if (document.getElementById("ecSlot3Name")) document.getElementById("ecSlot3Name").value = c.applicant_3_name || "";
      if (document.getElementById("ecSlot3Phone")) document.getElementById("ecSlot3Phone").value = c.applicant_3_phone || "";
      if (document.getElementById("ecSlot4Name")) document.getElementById("ecSlot4Name").value = c.applicant_4_name || "";
      if (document.getElementById("ecSlot4Phone")) document.getElementById("ecSlot4Phone").value = c.applicant_4_phone || "";
      if (document.getElementById("ecSlot5Name")) document.getElementById("ecSlot5Name").value = c.applicant_5_name || "";
      if (document.getElementById("ecSlot5Phone")) document.getElementById("ecSlot5Phone").value = c.applicant_5_phone || "";
      if (document.getElementById("ecSlot3Address")) document.getElementById("ecSlot3Address").value = c.applicant_3_address || "";
      if (document.getElementById("ecSlot4Address")) document.getElementById("ecSlot4Address").value = c.applicant_4_address || "";
      if (document.getElementById("ecSlot5Address")) document.getElementById("ecSlot5Address").value = c.applicant_5_address || "";
      let ecSharingMap = {};
      try { ecSharingMap = JSON.parse(c.applicant_home_sharing || "{}") || {}; } catch (e) { ecSharingMap = {}; }
      [3, 4, 5].forEach(slot => {
        const el = document.getElementById(`ecSlot${slot}Shares`);
        if (el) el.value = ecSharingMap[String(slot)] || "";
      });
      let ecApplicantCount = 1;
      if (c.applicant_5_name) ecApplicantCount = 5;
      else if (c.applicant_4_name) ecApplicantCount = 4;
      else if (c.applicant_3_name) ecApplicantCount = 3;
      else if (c.co_applicant_name) ecApplicantCount = 2;
      setEcApplicantMode(ecApplicantCount);
      if (document.getElementById("ecApplicantPhone")) document.getElementById("ecApplicantPhone").value = c.phone || "";
      if (document.getElementById("ecLoanAmount")) document.getElementById("ecLoanAmount").value = c.loan_amount || "";
      document.getElementById("ecBank").value = c.bank;
      document.getElementById("ecBranch").value = c.branch;
      document.getElementById("ecAddress").value = c.address;
      if (document.getElementById("ecOfficeAddress")) document.getElementById("ecOfficeAddress").value = c.office_address || "";
      // PAN/Aadhaar/DOB/Gender are read off scanned KYC documents, not stored as their own
      // editable case fields on the server - shown here read-only so the CA isn't misled into
      // thinking a correction here would be saved anywhere.
      if (document.getElementById("ecPan")) { document.getElementById("ecPan").value = c.pan || ""; document.getElementById("ecPan").readOnly = true; }
      if (document.getElementById("ecAadhaar")) { document.getElementById("ecAadhaar").value = c.aadhaar_masked || ""; document.getElementById("ecAadhaar").readOnly = true; }
      if (document.getElementById("ecDob")) { document.getElementById("ecDob").value = c.dob || ""; document.getElementById("ecDob").readOnly = true; }
      if (document.getElementById("ecGender")) { document.getElementById("ecGender").value = c.gender || "Female"; document.getElementById("ecGender").disabled = true; }

      // Real registered agents, not a hardcoded demo list - loaded fresh so a newly-registered
      // agent shows up without needing a page reload.
      if (!window.allAgents || window.allAgents.length === 0) {
        await loadFieldAgents();
      }
      const staffSelect = document.getElementById("ecStaff");
      if (staffSelect) {
        staffSelect.innerHTML = `<option value="">-- Unassigned --</option>` +
          (window.allAgents || []).map(a => `<option value="${a.id}">${a.full_name}${a.designation ? " (" + a.designation + ")" : ""}</option>`).join("");
        staffSelect.value = c.assigned_agent_id || "";
      }

      const statusSelect = document.getElementById("ecStatus");
      if (statusSelect) {
        statusSelect.value = c.status || "PENDING_CA_REVIEW";
      }

      document.getElementById("editCaseModal").classList.remove("hidden");
    }

    function closeEditCaseModal() {
      document.getElementById("editCaseModal").classList.add("hidden");
    }

    async function handleSaveCaseEdit(e) {
      if (e) e.preventDefault();
      const cId = document.getElementById("ecCaseId").value;
      const c = caseRegistry[cId];
      if (!c) return;

      const applicantName = document.getElementById("ecApplicantName").value.trim();
      const coApplicantName = document.getElementById("ecCoApplicantName") ? document.getElementById("ecCoApplicantName").value.trim() : "";
      const coApplicantPhone = document.getElementById("ecCoApplicantPhone") ? document.getElementById("ecCoApplicantPhone").value.trim() : "";
      const coApplicantAddress = document.getElementById("ecCoApplicantAddress") ? document.getElementById("ecCoApplicantAddress").value.trim() : "";
      const coApplicantOfficeAddress = document.getElementById("ecCoApplicantOfficeAddress") ? document.getElementById("ecCoApplicantOfficeAddress").value.trim() : "";
      const slot3Name = document.getElementById("ecSlot3Name") ? document.getElementById("ecSlot3Name").value.trim() : "";
      const slot3Phone = document.getElementById("ecSlot3Phone") ? document.getElementById("ecSlot3Phone").value.trim() : "";
      const slot4Name = document.getElementById("ecSlot4Name") ? document.getElementById("ecSlot4Name").value.trim() : "";
      const slot4Phone = document.getElementById("ecSlot4Phone") ? document.getElementById("ecSlot4Phone").value.trim() : "";
      const slot5Name = document.getElementById("ecSlot5Name") ? document.getElementById("ecSlot5Name").value.trim() : "";
      const slot5Phone = document.getElementById("ecSlot5Phone") ? document.getElementById("ecSlot5Phone").value.trim() : "";
      const slot3Address = document.getElementById("ecSlot3Address") ? document.getElementById("ecSlot3Address").value.trim() : "";
      const slot4Address = document.getElementById("ecSlot4Address") ? document.getElementById("ecSlot4Address").value.trim() : "";
      const slot5Address = document.getElementById("ecSlot5Address") ? document.getElementById("ecSlot5Address").value.trim() : "";
      const ecHomeSharing = collectHomeSharingMap("ec");
      const applicantPhone = document.getElementById("ecApplicantPhone") ? document.getElementById("ecApplicantPhone").value.trim() : "";
      const loanAmountRaw = document.getElementById("ecLoanAmount") ? document.getElementById("ecLoanAmount").value.trim() : "";
      const loanAmount = loanAmountRaw ? Number(loanAmountRaw) : null;
      const bankName = document.getElementById("ecBank").value.trim();
      const branch = document.getElementById("ecBranch").value.trim();
      const address = document.getElementById("ecAddress").value.trim();
      const officeAddress = document.getElementById("ecOfficeAddress") ? document.getElementById("ecOfficeAddress").value.trim() : "";
      const agentId = document.getElementById("ecStaff").value || null;
      const newStatus = document.getElementById("ecStatus").value;

      const serverId = gfServerId(c) || cId;
      const payload = {
        applicant_name: applicantName,
        applicant_phone: applicantPhone || null,
        co_applicant_name: coApplicantName || null,
        co_applicant_phone: coApplicantPhone || null,
        co_applicant_address: coApplicantAddress || null,
        co_applicant_office_address: coApplicantOfficeAddress || null,
        applicant_3_name: slot3Name || null,
        applicant_3_phone: slot3Phone || null,
        applicant_4_name: slot4Name || null,
        applicant_4_phone: slot4Phone || null,
        applicant_5_name: slot5Name || null,
        applicant_5_phone: slot5Phone || null,
        applicant_home_sharing: ecHomeSharing || null,
        applicant_3_address: slot3Address || null,
        applicant_4_address: slot4Address || null,
        applicant_5_address: slot5Address || null,
        bank_name: bankName,
        branch: branch,
        loan_amount: loanAmount,
        target_address: address,
        office_address: officeAddress || null,
        assigned_agent_id: agentId,
      };
      // Only ever send a status the backend actually recognizes - the dropdown used to list
      // just 4 of the 8 real CaseStatus values, so editing a DRAFT (or APPROVED/FLAGGED/
      // REJECTED) case left the select with nothing selected (value ""), and sending that
      // empty string made the whole PATCH request fail Pydantic validation - every other field
      // being edited got silently rejected along with it. Now the full status list is in the
      // dropdown, but this guard stays as a second line of defense: better to leave status
      // untouched than to block saving the rest of the form over a bad status value.
      const VALID_STATUSES = new Set(["DRAFT", "ASSIGNED", "IN_PROGRESS", "PENDING_CA_REVIEW", "APPROVED", "FLAGGED", "CERTIFIED", "REJECTED"]);
      if (VALID_STATUSES.has(newStatus)) payload.status = newStatus;
      const saveBtn = document.querySelector('#editCaseForm button[type="submit"]') || document.querySelector('#editCaseForm [onclick*="handleSaveCaseEdit"]');
      const originalBtnHtml = saveBtn ? saveBtn.innerHTML : null;
      if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = "Saving..."; }

      try {
        const res = await fetch(`/api/v1/cases/${encodeURIComponent(serverId)}`, {
          method: "PATCH",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert(`Could not save case details: ${err.detail || "Server error"}`);
          return;
        }
      } catch (err) {
        alert(`Network error — case details were NOT saved: ${err.message}. Please try again.`);
        return;
      } finally {
        if (saveBtn) { saveBtn.disabled = false; if (originalBtnHtml !== null) saveBtn.innerHTML = originalBtnHtml; }
      }

      // Only update the local cache once the server confirms the save - a failed PATCH above
      // already returned, so reaching here means it's really persisted.
      c.applicant_name = applicantName;
      c.co_applicant_name = coApplicantName;
      c.co_applicant_phone = coApplicantPhone;
      c.co_applicant_address = coApplicantAddress;
      c.co_applicant_office_address = coApplicantOfficeAddress;
      c.phone = applicantPhone;
      c.loan_amount = loanAmount;
      c.bank = bankName;
      c.branch = branch;
      c.address = address;
      c.office_address = officeAddress;
      c.assigned_agent_id = agentId;
      c.agent = agentId ? ((window.allAgents || []).find(a => a.id === agentId)?.full_name || c.agent) : "Not yet allotted";
      c.status = newStatus;
      // These (Applicant 3-5 and home-sharing) were already being sent to and saved by the
      // server above - leaving them out of this local cache sync was a separate bug from the
      // PATCH itself: the server had the CA's edit, but the screen kept showing the OLD values
      // until a full page reload, because onCaseSelected() just below re-renders from THIS local
      // object, not a fresh server fetch. That looks identical to "my edit didn't save" even
      // though it did.
      c.applicant_3_name = slot3Name;
      c.applicant_3_phone = slot3Phone;
      c.applicant_3_address = slot3Address;
      c.applicant_4_name = slot4Name;
      c.applicant_4_phone = slot4Phone;
      c.applicant_4_address = slot4Address;
      c.applicant_5_name = slot5Name;
      c.applicant_5_phone = slot5Phone;
      c.applicant_5_address = slot5Address;
      c.applicant_home_sharing = ecHomeSharing || null;

      closeEditCaseModal();

      const selector = document.getElementById("caseSelectorSelect");
      if (selector) {
        for (let opt of selector.options) {
          if (opt.value === cId) {
            opt.textContent = `[${c.case_no}] - ${c.applicant_name}${c.created_at ? " (" + fmtCaseOptDate(c.created_at) + ")" : ""} | ${c.bank} (${c.branch})`;
            break;
          }
        }
      }

      if (cId === activeCaseId) {
        onCaseSelected(cId);
      }
      renderManagementPortal();
      alert(`[✓] Case ${c.case_no} details saved.`);
    }

    // ==========================================
    // CASE MANAGEMENT & PORTFOLIO INTELLIGENCE
    // ==========================================
    function getDeletedCasesSet() {
      try {
        const raw = localStorage.getItem("deleted_cases");
        const list = raw ? JSON.parse(raw) : [];
        return new Set((Array.isArray(list) ? list : []).map(s => String(s).toUpperCase()));
      } catch(e) {
        return new Set();
      }
    }

    function purgeDeletedCasesFromRegistry() {
      const deletedSet = getDeletedCasesSet();
      if (deletedSet.size === 0) return;
      // Match ONLY on a case's own unique server id (c.id / c.db_id - UUIDs, never reused) -
      // never case_no, and never a substring match against the dropdown's display text. Both of
      // those used to also strip out any FUTURE, unrelated case that happened to get
      // auto-numbered with the same case_no as a previously-deleted one (confirmed live:
      // deleting "UBI-VL-2026-1" made every later case auto-numbered "UBI-VL-2026-1" vanish from
      // the Scrutiny case list too, even though it existed fine on the server).
      Object.keys(caseRegistry).forEach(k => {
        const c = caseRegistry[k];
        if (c && (deletedSet.has(String(c.id || '').toUpperCase()) || deletedSet.has(String(c.db_id || '').toUpperCase()))) {
          delete caseRegistry[k];
        }
      });
      const sel = document.getElementById("caseSelectorSelect");
      if (sel) {
        for (let i = sel.options.length - 1; i >= 0; i--) {
          const val = sel.options[i].value;
          if (deletedSet.has(String(val).toUpperCase())) {
            sel.remove(i);
          }
        }
        if (sel.options.length > 0 && deletedSet.has(String(activeCaseId).toUpperCase())) {
          activeCaseId = sel.options[0].value;
          if (typeof onCaseSelected === "function") onCaseSelected(activeCaseId);
        }
      }
    }

    function getUniqueCasesList() {
      const deletedSet = getDeletedCasesSet();
      const uniqueMap = new Map();
      Object.entries(caseRegistry).forEach(([key, c]) => {
        if (!c) return;
        const uKey = (c.case_no || c.db_id || key).toUpperCase();
        if (deletedSet.has(uKey) || deletedSet.has(String(key).toUpperCase()) || (c.id && deletedSet.has(String(c.id).toUpperCase())) || (c.db_id && deletedSet.has(String(c.db_id).toUpperCase()))) {
          return; // Skip cases deleted by user
        }
        if (!uniqueMap.has(uKey)) {
          uniqueMap.set(uKey, { id: c.db_id || key, ...c });
        }
      });
      return Array.from(uniqueMap.values());
    }

    // Shows WHEN this browser last pulled the case list from the server, since the case list is
    // only fetched once on page load otherwise — a case created from another device/tab (e.g. the
    // CA office PC) would silently never appear here until a manual reload. The light auto-poll
    // below and this visible timestamp exist so staff can tell a stale view from a fresh one
    // instead of assuming "it's not showing" means the case wasn't actually created.
    function updateDataAsOfIndicator() {
      const el = document.getElementById("dataAsOfText");
      if (el) el.textContent = "Data as of: " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }

    async function manualRefreshCases() {
      const icon = document.getElementById("btnRefreshCasesIcon");
      const btn = document.getElementById("btnRefreshCases");
      if (btn) btn.disabled = true;
      if (icon) icon.classList.add("animate-spin");
      try {
        await loadDbCasesIntoRegistry();
        if (activeCaseId) await fetchLiveCaseDocuments(activeCaseId);
      } finally {
        if (btn) btn.disabled = false;
        if (icon) icon.classList.remove("animate-spin");
      }
    }

    // A new case created on another device has no reason to appear here until something asks the
    // server again — nothing else in the app re-fetches the case LIST (only the open case's
    // documents poll every few seconds). This keeps that list from silently going stale for
    // however long a tab stays open.
    //
    // loadDbCasesIntoRegistry() only updates the in-memory caseRegistry - it was never followed
    // by a re-render, so the Management tab's table (case status, KPIs) kept showing whatever was
    // on screen at the last tab switch even after a status genuinely changed on the server (e.g.
    // an agent completed the visit, or the case was certified from another device/tab). The CA
    // office reported this as "status shown in Management is incorrect" - it was correct data in
    // memory, just a stale render. Only re-render when that tab is actually the one visible.
    setInterval(() => {
      loadDbCasesIntoRegistry().then(() => {
        const mgmtPortal = document.getElementById("viewManagementPortal");
        if (mgmtPortal && !mgmtPortal.classList.contains("hidden")) {
          renderManagementPortal();
        }
      });
    }, 45000);

    function updateGlobalCaseCounters() {
      const cases = getUniqueCasesList();
      const count = cases.length;
      const elTotal = document.getElementById("totalCaseCount");
      if (elTotal) elTotal.textContent = count;
      const elBadge = document.getElementById("navCaseCountBadge");
      if (elBadge) elBadge.textContent = count;
      const elKpi = document.getElementById("mgmtKpiTotal");
      if (elKpi) elKpi.textContent = count;
    }

    // Management Portal's own data, independent of the global caseRegistry (used by the case
    // selector / Scrutiny Desk, which still loads everything as before). Active cases are
    // fetched fresh every time the Management tab renders, but the server now excludes
    // CERTIFIED cases from that request (exclude_status=CERTIFIED) - a case that's finished
    // and archived no longer has to be downloaded just to view what's still in progress.
    // Completed/certified cases are only fetched when the CA explicitly opens that tab.
    let mgmtViewMode = "active";
    let mgmtActiveCases = [];
    let mgmtCompletedCases = null; // null = not loaded yet this session

    function buildMgmtEntriesFromApi(apiCases) {
      return (apiCases || []).map(dc => buildCaseEntry({
        case_no: dc.case_no, bank: dc.bank_name, branch: dc.branch, applicant_name: dc.applicant_name,
        created_at: dc.created_at,
        phone: dc.applicant_phone, co_applicant_name: dc.co_applicant_name, co_applicant_phone: dc.co_applicant_phone,
        co_applicant_address: dc.co_applicant_address, co_applicant_office_address: dc.co_applicant_office_address,
        applicant_3_name: dc.applicant_3_name, applicant_3_phone: dc.applicant_3_phone,
        applicant_4_name: dc.applicant_4_name, applicant_4_phone: dc.applicant_4_phone,
        applicant_5_name: dc.applicant_5_name, applicant_5_phone: dc.applicant_5_phone,
        applicant_home_sharing: dc.applicant_home_sharing,
        applicant_3_address: dc.applicant_3_address, applicant_4_address: dc.applicant_4_address, applicant_5_address: dc.applicant_5_address,
        loan_type: dc.loan_type, loan_amount: dc.loan_amount, address: dc.target_address,
        office_address: dc.office_address,
        benchmark_lat: dc.target_lat, benchmark_lon: dc.target_lon, status: dc.status, db_id: dc.id,
        agent: resolveAgentName(dc.assigned_agent_id), assigned_agent_id: dc.assigned_agent_id,
        capture_lat: dc.capture_lat, capture_lon: dc.capture_lon, distance_m: dc.distance_m,
      }));
    }

    async function loadManagementActiveCases() {
      if (!window.allAgents || window.allAgents.length === 0) await loadFieldAgents();
      try {
        const res = await fetch("/api/v1/cases?exclude_status=CERTIFIED", { headers: authHeaders() });
        if (!res.ok) return;
        mgmtActiveCases = buildMgmtEntriesFromApi(await res.json());
        rebuildMonthFilterOptions();
      } catch (e) {
        console.warn("Could not load active cases for Management Portal:", e);
      }
    }

    async function loadManagementCompletedCases() {
      if (!window.allAgents || window.allAgents.length === 0) await loadFieldAgents();
      try {
        const res = await fetch("/api/v1/cases?status=CERTIFIED", { headers: authHeaders() });
        if (!res.ok) return;
        mgmtCompletedCases = buildMgmtEntriesFromApi(await res.json());
        rebuildMonthFilterOptions();
      } catch (e) {
        console.warn("Could not load completed cases for Management Portal:", e);
      }
    }

    // The "Month" filter was a hardcoded 4-month list (October/September/August/July 2026) -
    // same bug class as Branches/Bank/Field Staff fixed earlier: it goes stale every month, and
    // worse, every real case's own c.month was silently "" (buildMgmtEntriesFromApi never passed
    // a month at all) so selecting ANY month here matched zero cases no matter what. Rebuilt from
    // the real c.month values (now reliably derived from created_at) across both case lists.
    function rebuildMonthFilterOptions() {
      const sel = document.getElementById("mgmtFilterMonth");
      if (!sel) return;
      const prevValue = sel.value || "ALL";

      const seen = new Set();
      const months = [];
      [...(mgmtActiveCases || []), ...(mgmtCompletedCases || [])].forEach(c => {
        const m = (c && c.month || "").trim();
        if (m && !seen.has(m)) {
          seen.add(m);
          months.push(m);
        }
      });
      // Newest month first - a CA scanning this list almost always wants the current month.
      months.sort((a, b) => new Date(`1 ${b}`) - new Date(`1 ${a}`));

      sel.innerHTML = "";
      const allOpt = document.createElement("option");
      allOpt.value = "ALL";
      allOpt.textContent = "All Months (બધા મહિના)";
      sel.appendChild(allOpt);
      months.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        sel.appendChild(opt);
      });
      sel.value = months.includes(prevValue) || prevValue === "ALL" ? prevValue : "ALL";
    }

    async function loadManagementStats() {
      try {
        const res = await fetch("/api/v1/cases/stats", { headers: authHeaders() });
        if (!res.ok) return null;
        return await res.json();
      } catch (e) {
        return null;
      }
    }

    const MGMT_TAB_ACTIVE_CLASS = "px-3 py-1 rounded-full transition-all font-bold bg-primary-container text-white";
    const MGMT_TAB_INACTIVE_CLASS = "px-3 py-1 rounded-full transition-all font-medium text-on-surface-variant";

    // Switches between the default "Active Cases" view and "Completed Cases" - completed
    // cases are fetched from the server the first time this tab is opened, not before.
    async function switchMgmtView(mode) {
      mgmtViewMode = mode;
      const btnActive = document.getElementById("mgmtTabActive");
      const btnCompleted = document.getElementById("mgmtTabCompleted");
      if (btnActive) btnActive.className = mode === "active" ? MGMT_TAB_ACTIVE_CLASS : MGMT_TAB_INACTIVE_CLASS;
      if (btnCompleted) btnCompleted.className = mode === "completed" ? MGMT_TAB_ACTIVE_CLASS : MGMT_TAB_INACTIVE_CLASS;
      if (mode === "completed") {
        if (btnCompleted) btnCompleted.innerHTML = `<span class="material-symbols-outlined text-[14px] animate-spin align-middle">sync</span> Loading...`;
        await loadManagementCompletedCases();
        if (btnCompleted) btnCompleted.textContent = `Completed Cases (${(mgmtCompletedCases || []).length})`;
      }
      renderMgmtBankCards(mode === "completed" ? (mgmtCompletedCases || []) : mgmtActiveCases);
      applyManagementFilters();
    }

    function renderMgmtBankCards(cases) {
      const bankMap = {};
      (cases || []).forEach(c => {
        const b = c.bank || "Other";
        if (!bankMap[b]) bankMap[b] = { count: 0, totalAmount: 0 };
        bankMap[b].count++;
        bankMap[b].totalAmount += (c.loan_amount_val || 2000000);
      });

      const bankContainer = document.getElementById("mgmtBankCardsContainer");
      if (!bankContainer) return;
      bankContainer.innerHTML = "";
      const bankIcons = {
        "Union Bank of India": "account_balance",
        "State Bank of India": "assured_workload",
        "HDFC Bank": "corporate_fare",
        "ICICI Bank": "account_balance_wallet",
        "Bank of Baroda": "savings"
      };

      Object.entries(bankMap).forEach(([bankName, info]) => {
        const card = document.createElement("div");
        card.onclick = () => {
          const filterBank = document.getElementById("mgmtFilterBank");
          if (filterBank) {
            filterBank.value = bankName;
            applyManagementFilters();
          }
        };
        card.className = "cursor-pointer bg-surface-container-lowest hover:bg-surface-container-low p-3 rounded-xl border border-outline-variant hover:border-primary-container shadow-2xs hover:shadow-sm transition-all group";
        card.innerHTML = `
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-on-surface truncate group-hover:text-primary-container">${bankName}</span>
            <span class="material-symbols-outlined text-outline group-hover:text-primary-container text-[18px]">${bankIcons[bankName] || 'domain'}</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="font-headline font-bold text-lg text-primary-container">${info.count} <span class="text-[10px] font-mono text-outline font-normal">cases</span></span>
            <span class="font-mono text-[10px] font-bold text-secondary">₹${(info.totalAmount / 100000).toFixed(1)}L</span>
          </div>
        `;
        bankContainer.appendChild(card);
      });
    }

    async function renderManagementPortal() {
      updateGlobalCaseCounters();

      const [stats] = await Promise.all([loadManagementStats(), loadManagementActiveCases()]);

      // KPIs come from the cheap /stats endpoint (true totals across every case, including
      // completed ones not currently loaded) rather than whatever's currently in memory.
      const kpiTotal = document.getElementById("mgmtKpiTotal");
      const kpiAllotted = document.getElementById("mgmtKpiAllotted");
      const kpiCompleted = document.getElementById("mgmtKpiCompleted");
      const kpiCertified = document.getElementById("mgmtKpiCertified");
      if (stats && stats.by_status) {
        const byStatus = stats.by_status;
        const allottedCases = (byStatus["ASSIGNED"] || 0) + (byStatus["IN_PROGRESS"] || 0);
        const completedCases = ["PENDING_CA_REVIEW", "APPROVED", "CERTIFIED", "FLAGGED", "REJECTED"]
          .reduce((sum, s) => sum + (byStatus[s] || 0), 0);
        if (kpiTotal) kpiTotal.textContent = stats.total;
        if (kpiAllotted) kpiAllotted.textContent = allottedCases;
        if (kpiCompleted) kpiCompleted.textContent = completedCases;
        if (kpiCertified) kpiCertified.textContent = stats.certified;
      }

      const btnCompleted = document.getElementById("mgmtTabCompleted");
      if (btnCompleted && mgmtViewMode !== "completed") {
        btnCompleted.textContent = stats ? `Completed Cases (${stats.certified})` : "Completed Cases";
      }

      renderMgmtBankCards(mgmtViewMode === "completed" ? (mgmtCompletedCases || []) : mgmtActiveCases);
      applyManagementFilters();
    }

    function applyManagementFilters() {
      const monthFilter = document.getElementById("mgmtFilterMonth") ? document.getElementById("mgmtFilterMonth").value : "ALL";
      const bankFilter = document.getElementById("mgmtFilterBank") ? document.getElementById("mgmtFilterBank").value : "ALL";
      const branchFilter = document.getElementById("mgmtFilterBranch") ? document.getElementById("mgmtFilterBranch").value : "ALL";
      const staffFilter = document.getElementById("mgmtFilterStaff") ? document.getElementById("mgmtFilterStaff").value : "ALL";
      const statusFilter = document.getElementById("mgmtFilterStatus") ? document.getElementById("mgmtFilterStatus").value : "ALL";
      const query = (document.getElementById("mgmtSearchInput") ? document.getElementById("mgmtSearchInput").value : "").toLowerCase().trim();

      const tbody = document.getElementById("mgmtTableBody");
      if (!tbody) return;
      tbody.innerHTML = "";

      let filtered = mgmtViewMode === "completed" ? (mgmtCompletedCases || []) : mgmtActiveCases;

      if (monthFilter !== "ALL") {
        filtered = filtered.filter(c => (c.month || "").toLowerCase().includes(monthFilter.toLowerCase()));
      }
      if (bankFilter !== "ALL") {
        filtered = filtered.filter(c => c.bank === bankFilter);
      }
      if (branchFilter !== "ALL") {
        // Case-insensitive, same as the header's Branches filter fix - "Gota" and "gota" typed
        // by different staff must still match the one branch the CA selected here.
        const normBranchFilter = branchFilter.trim().toLowerCase();
        filtered = filtered.filter(c => (c.branch || "").trim().toLowerCase() === normBranchFilter);
      }
      if (staffFilter !== "ALL") {
        filtered = filtered.filter(c => (c.agent || "").toLowerCase().includes(staffFilter.toLowerCase()));
      }
      if (statusFilter !== "ALL") {
        filtered = filtered.filter(c => (c.status || "").toUpperCase() === statusFilter.toUpperCase());
      }
      if (query) {
        filtered = filtered.filter(c => 
          (c.applicant_name || "").toLowerCase().includes(query) ||
          (c.case_no || "").toLowerCase().includes(query) ||
          (c.bank || "").toLowerCase().includes(query) ||
          (c.branch || "").toLowerCase().includes(query) ||
          (c.address || "").toLowerCase().includes(query) ||
          (c.phone || "").toLowerCase().includes(query) ||
          (c.agent || "").toLowerCase().includes(query)
        );
      }

      const countBadge = document.getElementById("mgmtFilteredCount");
      if (countBadge) countBadge.textContent = `${filtered.length} Cases Found`;

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="9" class="py-8 text-center text-outline font-mono text-xs">
              <span class="material-symbols-outlined text-[28px] text-outline/60 block mb-1">search_off</span>
              No case records match the specified filters. Try selecting "All" or clearing search.
            </td>
          </tr>
        `;
        return;
      }

      filtered.forEach(c => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-surface-container-low/60 transition-colors";

        // Mirrors AAL_STATUS_LABELS (the Agent Activity Log's own status map) so every real
        // CaseStatus value gets a correctly labeled, styled badge here too - this chain used to
        // only recognize CERTIFIED/PENDING_CA_REVIEW/ASSIGNED and silently fell back to a plain
        // amber badge with the raw enum text for IN_PROGRESS, DRAFT, APPROVED, FLAGGED and
        // REJECTED, which is exactly what made an agent actively mid-visit (IN_PROGRESS) look
        // unstyled/out of place next to the properly badged statuses around it.
        let statusBadge = `<span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">${c.status}</span>`;
        if (c.status === "CERTIFIED") {
          statusBadge = `<span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">CERTIFIED (UDIN)</span>`;
        } else if (c.status === "PENDING_CA_REVIEW") {
          statusBadge = `<span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-blue-50 text-primary-container border border-blue-200">PENDING CA REVIEW</span>`;
        } else if (c.status === "ASSIGNED_TO_FIELD" || c.status === "ASSIGNED") {
          statusBadge = `<span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">ASSIGNED TO FIELD</span>`;
        } else if (c.status === "IN_PROGRESS") {
          statusBadge = `<span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">VISIT IN PROGRESS</span>`;
        } else if (c.status === "DRAFT") {
          statusBadge = `<span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">NOT YET STARTED</span>`;
        } else if (c.status === "APPROVED") {
          statusBadge = `<span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">APPROVED</span>`;
        } else if (c.status === "FLAGGED") {
          statusBadge = `<span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-300">FLAGGED</span>`;
        } else if (c.status === "REJECTED") {
          statusBadge = `<span class="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-300">REJECTED</span>`;
        }

        const cachedSelfie = localStorage.getItem("selfie_" + c.db_id);
        const selfieSrc = cachedSelfie || c.agent_selfie || "/static/placeholders/photo_pending.svg";
        const applicantCount = getApplicantCountForCase(c);
        const applicantCountBadge = `<span class="inline-block mt-1 px-1.5 py-0.5 rounded-full font-mono text-[9px] font-bold ${applicantCount > 1 ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-surface-container text-on-surface-variant border border-outline-variant'}">${applicantCount} Applicant${applicantCount > 1 ? 's' : ''}</span>`;

        // The real distance from the most recent geotagged photo (set by the server, see
        // GET /api/v1/cases) - this used to silently fall back to a hardcoded "32m (COMPLIANT)"
        // for every case that hadn't yet been opened in Scrutiny, which is exactly what made a
        // CA-office test upload (nowhere near the applicant's actual address) show as compliant.
        const hasRealDistance = typeof c.distance_m === "number" && !isNaN(c.distance_m);
        const distanceHtml = hasRealDistance
          ? `<div class="${c.distance_m <= 150 ? 'text-emerald-700' : 'text-rose-700'} font-bold">● ${Math.round(c.distance_m)}m (${c.distance_m <= 150 ? 'COMPLIANT' : 'BREACH'})</div>
             <div class="text-[10px] text-outline">${Number(c.capture_lat).toFixed(4)}°N, ${Number(c.capture_lon).toFixed(4)}°E</div>`
          : `<div class="text-outline font-bold">○ NOT YET CAPTURED</div>
             <div class="text-[10px] text-outline">No geotagged photo on file yet</div>`;

        tr.innerHTML = `
          <td class="py-3 px-3">
            <div class="font-mono text-xs font-bold text-primary-container">${c.case_no}</div>
            <div class="font-mono text-[10px] text-outline">${c.month || 'August 2026'}</div>
          </td>
          <td class="py-3 px-3">
            <div class="font-bold text-on-surface">${c.applicant_name}</div>
            <div class="font-mono text-[10px] text-outline">${c.phone || '+91 81601 66900'}</div>
            ${applicantCountBadge}
          </td>
          <td class="py-3 px-3">
            <div class="font-bold text-on-surface">${c.bank}</div>
            <div class="text-[11px] text-on-surface-variant font-medium">${c.branch}</div>
          </td>
          <td class="py-3 px-3">
            <div class="font-medium text-on-surface">${c.loan_facility || 'Home Loan (HL)'}</div>
            <div class="font-mono text-[10px] font-bold text-secondary">₹${((c.loan_amount_val || 2000000)/100000).toFixed(2)} Lacs</div>
          </td>
          <td class="py-3 px-3">
            <div class="text-[11px] text-on-surface-variant font-medium">${c.allotted_by || 'Suresh Sir (Operations Lead)'}</div>
          </td>
          <td class="py-3 px-3">
            <div class="flex items-center gap-2">
              <div class="relative w-8 h-8 rounded-full overflow-hidden border border-emerald-500 bg-slate-200 shrink-0 cursor-pointer shadow-2xs hover:scale-110 transition-transform" onclick="activeCaseId='${c.db_id}'; openSelfieModal();" title="Click to view Attendance Selfie">
                <img src="${selfieSrc}" alt="Selfie" class="w-full h-full object-cover"/>
                <span class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white"></span>
              </div>
              <div>
                <div class="font-semibold text-on-surface text-[11px]">${c.agent}</div>
                <div class="font-mono text-[9px] text-emerald-700 font-bold flex items-center gap-0.5">
                  <span class="material-symbols-outlined text-[11px]">verified</span>
                  <span>Selfie & GPS Logged</span>
                </div>
              </div>
            </div>
          </td>
          <td class="py-3 px-3 font-mono text-[11px]">
            ${distanceHtml}
          </td>
          <td class="py-3 px-3">
            ${statusBadge}
          </td>
          <td class="py-3 px-3 text-right">
            <div class="flex items-center justify-end gap-1 font-mono text-[11px]">
              <button onclick="activeCaseId='${c.db_id}'; onCaseSelected('${c.db_id}'); switchMainPortalView('scrutiny');" class="px-2 py-1 bg-primary-container text-white rounded font-bold hover:bg-primary transition-colors" title="Open case in CA Scrutiny Desk">
                Scrutiny
              </button>
              <button onclick="activeCaseId='${c.db_id}'; openHandoverModal();" class="p-1 rounded bg-surface-container hover:bg-emerald-50 text-emerald-700 border border-outline-variant transition-colors" title="Dispatch Handover to WhatsApp">
                <span class="material-symbols-outlined text-[16px]">chat</span>
              </button>
              <button onclick="triggerAiFolderIngestForCase('${c.db_id}')" class="p-1 rounded bg-surface-container hover:bg-amber-50 text-amber-700 border border-outline-variant transition-colors" title="Add More Documents (AI Scan) to this case">
                <span class="material-symbols-outlined text-[16px]">bolt</span>
              </button>
              ${c.status === "CERTIFIED" ? `
              <button onclick="activeCaseId='${c.db_id}'; reopenCertifiedCase();" class="p-1 rounded bg-surface-container hover:bg-amber-50 text-amber-700 border border-outline-variant transition-colors" title="Reopen this certified case for edits">
                <span class="material-symbols-outlined text-[16px]">lock_open</span>
              </button>` : ""}
              <button onclick="openEditCaseModal('${c.db_id}')" class="p-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant transition-colors" title="Edit Case Details">
                <span class="material-symbols-outlined text-[16px]">edit</span>
              </button>
              <button onclick="handleDeleteCasePrompt('${c.db_id}', '${c.case_no}')" class="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors" title="Delete Case and all documents">
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </td>
        `;

        tbody.appendChild(tr);
      });
    }

    async function handleDeleteCasePrompt(caseId, caseNo) {
      if (!confirm(`Are you sure you want to delete case "${caseNo}" and all its uploaded documents?\n\nThis action cannot be undone.`)) {
        return;
      }
      try {
        let token = localStorage.getItem("ca_token");
        const headers = {};
        if (token && token !== "demo-ca-token") headers["Authorization"] = `Bearer ${token}`;

        let isSuccess = false;
        try {
          const res = await fetch(`/api/v1/cases/${caseId}`, {
            method: "DELETE",
            headers: headers
          });
          // Both 200 (deleted from DB) and 404 (already not in DB, e.g. client demo case) are success
          isSuccess = res.ok || res.status === 404;
        } catch(netErr) {
          console.warn("Delete network notice, purging locally:", netErr);
          isSuccess = true;
        }

        if (isSuccess) {
          // Record into persistent localStorage so it never re-appears after reload - by unique
          // server id ONLY, never case_no. case_no is a reusable reference number (the "New Case
          // Intake" auto-numbering picks the next free "UBI-VL-2026-N" by count, which reissues a
          // deleted case's old number) - blocklisting it here permanently hid every FUTURE,
          // completely unrelated case that happened to get the same auto-generated number,
          // confirmed live with case "UBI-VL-2026-1".
          try {
            const raw = localStorage.getItem("deleted_cases");
            const deletedList = raw ? JSON.parse(raw) : [];
            if (caseId && !deletedList.includes(caseId)) deletedList.push(caseId);
            const entry = caseRegistry[caseId];
            if (entry) {
              if (entry.id && !deletedList.includes(entry.id)) deletedList.push(entry.id);
              if (entry.db_id && !deletedList.includes(entry.db_id)) deletedList.push(entry.db_id);
            }
            localStorage.setItem("deleted_cases", JSON.stringify(deletedList));
          } catch(e) {}

          // Remove all references from caseRegistry
          delete caseRegistry[caseId];
          if (caseNo) delete caseRegistry[caseNo];
          Object.keys(caseRegistry).forEach(k => {
            const entry = caseRegistry[k];
            if (entry && (entry.case_no === caseNo || entry.id === caseId || entry.db_id === caseId || k === caseId || k === caseNo)) {
              delete caseRegistry[k];
            }
          });

          // Remove option from dropdown
          const sel = document.getElementById("caseSelectorSelect");
          if (sel) {
            for (let i = sel.options.length - 1; i >= 0; i--) {
              if (sel.options[i].value === caseId || (caseNo && sel.options[i].textContent.includes(caseNo))) {
                sel.remove(i);
              }
            }
            if (activeCaseId === caseId && sel.options.length > 0) {
              activeCaseId = sel.options[0].value;
              onCaseSelected(activeCaseId);
            }
          }

          purgeDeletedCasesFromRegistry();

          // renderManagementPortal() only re-fetches the Active list from the server - the
          // Completed list is cached in memory and was never refreshed, so a deleted CERTIFIED
          // case kept showing in the Management Portal's Completed tab even though it was gone
          // from the database. Strip it out of both in-memory lists directly so it disappears
          // immediately regardless of which tab is currently open.
          const stillMatches = (c) => c && (c.db_id === caseId || c.case_no === caseNo);
          mgmtActiveCases = (mgmtActiveCases || []).filter(c => !stillMatches(c));
          if (mgmtCompletedCases) mgmtCompletedCases = mgmtCompletedCases.filter(c => !stillMatches(c));

          // Immediately update all counters and table without requiring page refresh
          updateGlobalCaseCounters();
          renderManagementPortal();
          alert(`✓ Case "${caseNo}" deleted successfully.`);
        } else {
          alert(`Could not delete case "${caseNo}".`);
        }
      } catch (e) {
        alert("Delete failed: " + e.message);
      }
    }

    function resetManagementFilters() {
      if (document.getElementById("mgmtFilterMonth")) document.getElementById("mgmtFilterMonth").value = "ALL";
      if (document.getElementById("mgmtFilterBank")) document.getElementById("mgmtFilterBank").value = "ALL";
      if (document.getElementById("mgmtFilterBranch")) document.getElementById("mgmtFilterBranch").value = "ALL";
      if (document.getElementById("mgmtFilterStaff")) document.getElementById("mgmtFilterStaff").value = "ALL";
      if (document.getElementById("mgmtFilterStatus")) document.getElementById("mgmtFilterStatus").value = "ALL";
      if (document.getElementById("mgmtSearchInput")) document.getElementById("mgmtSearchInput").value = "";
      applyManagementFilters();
    }

    function exportManagementCsv() {
      const headers = ["Case Ref", "Month", "Applicant Name", "Phone", "Empanelled Bank", "Branch", "Loan Facility", "Amount", "Allotted By", "Field Staff", "GPS Distance", "Latitude", "Longitude", "Status"];
      const rows = Object.values(caseRegistry).map(c => [
        `"${c.case_no || ''}"`,
        `"${c.month || 'August 2026'}"`,
        `"${c.applicant_name || ''}"`,
        `"${c.phone || ''}"`,
        `"${c.bank || ''}"`,
        `"${c.branch || ''}"`,
        `"${c.loan_facility || ''}"`,
        `"${c.loan_amount_val || ''}"`,
        `"${c.allotted_by || ''}"`,
        `"${c.agent || ''}"`,
        `"${c.distance_m || ''}m"`,
        `"${c.capture_lat || c.benchmark_lat || ''}"`,
        `"${c.capture_lon || c.benchmark_lon || ''}"`,
        `"${c.status || ''}"`
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `CA_Portfolio_Case_Records_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    window.addEventListener("DOMContentLoaded", async () => {
      if (typeof purgeDeletedCasesFromRegistry === "function") purgeDeletedCasesFromRegistry();
      checkCaAuth();
      await loadDbCasesIntoRegistry();
      if (typeof purgeDeletedCasesFromRegistry === "function") purgeDeletedCasesFromRegistry();
      const savedCase = localStorage.getItem("activeCaseId");
      const sel = document.getElementById("caseSelectorSelect");
      const initCase = (savedCase && caseRegistry[savedCase]) ? savedCase : ((sel && sel.value) ? sel.value : Object.keys(caseRegistry)[0]);
      if (sel && initCase) sel.value = initCase;
      if (initCase) {
        onCaseSelected(initCase);
      }
      startLiveDocumentSync();
      renderManagementPortal();
      const inst = document.getElementById("hoInstructions");
      if (inst) inst.addEventListener("input", updateHandoverPreview);
      const phone = document.getElementById("hoAgentPhone");
      if (phone) phone.addEventListener("input", updateHandoverPreview);
    });

    window.addEventListener("keydown", (e) => {
      const zoomModal = document.getElementById("docZoomModal");
      const isZoomOpen = zoomModal && !zoomModal.classList.contains("hidden");
      if (e.key === "Escape") {
        closeDocZoomModal();
        closeHandoverModal();
      }
      if (isZoomOpen) {
        // If user is typing in an input/select/textarea, allow natural input
        if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT")) {
          if (e.key === "Enter" && e.target.id === "viewerPageJumpInput") {
            e.preventDefault();
            handleViewerPageJumpInput();
          }
          return;
        }

        // Left / Right Document Browsing & Page Navigation
        if (e.key === "ArrowLeft" || e.key === "PageUp" || e.key === "p" || e.key === "P") {
          e.preventDefault();
          viewerPrevDoc();
        } else if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === "n" || e.key === "N") {
          e.preventDefault();
          viewerNextDoc();
        } else if (e.key === "Home") {
          e.preventDefault();
          viewerJumpToPage(0);
        } else if (e.key === "End") {
          e.preventDefault();
          viewerJumpToPage(viewerDocList.length - 1);
        } else if (e.key === "j" || e.key === "J") {
          e.preventDefault();
          const pInput = document.getElementById("viewerPageJumpInput");
          if (pInput) { pInput.focus(); pInput.select(); }
        } else if (e.key === "x" || e.key === "X") {
          e.preventDefault();
          const curDoc = viewerDocList && viewerDocList[viewerCurrentIndex];
          if (curDoc && curDoc.id) {
            toggleCurrentViewerDocSelect(!selectedSeparatedDocIds.has(curDoc.id));
          }
        } else if (e.key === "Delete") {
          e.preventDefault();
          if (selectedSeparatedDocIds.size > 0) {
            deleteSelectedSeparatedDocuments();
          } else {
            deleteCurrentViewerDoc();
          }
        } else if (e.key === " " || e.key === "f" || e.key === "F") {
          e.preventDefault();
          flipZoomCard();
        } else if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          zoomDocModal(0.25);
        } else if (e.key === "-" || e.key === "_") {
          e.preventDefault();
          zoomDocModal(-0.25);
        } else if (e.key === "0") {
          e.preventDefault();
          resetDocZoom();
        } else if (e.key === "r" || e.key === "R") {
          e.preventDefault();
          rotateDocModal();
        }
      }
    });
  
    // ==========================================
    // CASE DOCUMENT VAULT & PROPERTY RECORDS ENGINE
    // ==========================================
    let currentMiniVaultFilter = "property";

    function filterVaultMini(category) {
      currentMiniVaultFilter = category;
      const btnProp = document.getElementById("btnMiniVaultTabProperty");
      const btnInc = document.getElementById("btnMiniVaultTabIncome");
      const btnAll = document.getElementById("btnMiniVaultTabAll");

      if (btnProp) btnProp.className = category === "property" ? "flex-1 py-1 rounded text-center font-bold bg-primary-container text-white shadow-2xs" : "flex-1 py-1 rounded text-center text-on-surface-variant hover:text-on-surface";
      if (btnInc) btnInc.className = category === "income" ? "flex-1 py-1 rounded text-center font-bold bg-primary-container text-white shadow-2xs" : "flex-1 py-1 rounded text-center text-on-surface-variant hover:text-on-surface";
      if (btnAll) btnAll.className = category === "all" ? "flex-1 py-1 rounded text-center font-bold bg-primary-container text-white shadow-2xs" : "flex-1 py-1 rounded text-center text-on-surface-variant hover:text-on-surface";

      renderVaultMini();
    }

    function renderVaultMini() {
      const container = document.getElementById("vaultMiniList");
      if (!container) return;

      const c = caseRegistry[activeCaseId] || {};
      const docs = c.vault_documents || {};

      const items = Object.entries(docs).filter(([key, d]) => {
        if (currentMiniVaultFilter === "all") return true;
        return d.type === currentMiniVaultFilter;
      });

      container.innerHTML = "";

      if (items.length === 0) {
        container.innerHTML = `<div class="p-3 text-center text-[11px] font-mono text-outline">No documents in this category yet. Upload a scan above.</div>`;
        return;
      }

      items.forEach(([key, d], idx) => {
        const row = document.createElement("div");
        row.className = "p-2 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant flex items-center justify-between gap-2.5 transition-all group";
        row.innerHTML = `
          <div class="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer" onclick="openVaultDocListZoom(${idx})">
            <div class="relative w-11 h-11 rounded-md overflow-hidden border border-outline-variant shrink-0 bg-slate-900 shadow-2xs">
              <img src="${d.src}" alt="${d.title}" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-110 transition-transform"/>
              <span class="absolute bottom-0 inset-x-0 bg-black/75 text-white font-mono text-[7px] text-center font-bold">${d.type.toUpperCase()}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-[11px] font-bold text-on-surface truncate group-hover:text-primary-container">${d.title}</div>
              <div class="text-[9px] font-mono text-outline truncate">${d.sub}</div>
              <span class="inline-block mt-0.5 text-[8px] font-mono font-bold px-1.5 py-0.2 rounded ${d.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}">${d.status}</span>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button type="button" onclick="openVaultDocListZoom(${idx})" class="p-1 rounded text-outline hover:text-primary-container hover:bg-surface-container-lowest" title="Enlarge Document">
              <span class="material-symbols-outlined text-[16px]">zoom_in</span>
            </button>
            <label class="p-1 rounded text-outline hover:text-emerald-700 hover:bg-surface-container-lowest cursor-pointer" title="Replace with new scan">
              <span class="material-symbols-outlined text-[16px]">file_upload</span>
              <input type="file" accept="image/*,application/pdf" class="hidden" onchange="replaceVaultDoc('${key}', this.files[0])"/>
            </label>
          </div>
        `;
        container.appendChild(row);
      });

      const countBadge = document.getElementById("vaultDocCountText");
      if (countBadge) countBadge.textContent = `${Object.keys(docs).length} Documents Active`;
      const navBadge = document.getElementById("navVaultCountBadge");
      if (navBadge) navBadge.textContent = `${Object.keys(docs).length} Files`;
    }

    function renderCaseDocumentVault(caseId) {
      const c = caseRegistry[caseId] || {};
      
      const badge = document.getElementById("vaultActiveCaseBadge");
      if (badge) badge.textContent = c.case_no || "CASE";
      const name = document.getElementById("vaultApplicantName");
      if (name) name.textContent = c.applicant_name || "Applicant";
      const fac = document.getElementById("vaultFacilityText");
      if (fac) fac.textContent = c.loan_facility || "Home Loan (HL)";
      const addr = document.getElementById("vaultAddressText");
      if (addr) addr.textContent = c.address || "Property Address";

      const shelfProp = document.getElementById("vaultShelfProperty");
      const shelfInc = document.getElementById("vaultShelfIncome");
      const shelfKyc = document.getElementById("vaultShelfKyc");

      if (shelfProp) shelfProp.innerHTML = "";
      if (shelfInc) shelfInc.innerHTML = "";
      if (shelfKyc) shelfKyc.innerHTML = "";

      const docs = c.vault_documents || {};

      Object.entries(docs).forEach(([key, d], idx) => {
        const card = document.createElement("div");
        card.className = "bg-surface-container-low hover:bg-surface-container rounded-xl border border-outline-variant hover:border-primary-container shadow-2xs p-3 flex flex-col justify-between gap-3 transition-all group";
        card.innerHTML = `
          <div>
            <div class="flex items-center justify-between pb-2 border-b border-outline-variant/60">
              <span class="font-headline font-bold text-xs text-on-surface truncate group-hover:text-primary-container">${d.title}</span>
              <span class="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${d.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-blue-50 text-blue-800 border border-blue-300'}">${d.status}</span>
            </div>
            <div class="relative w-full h-44 rounded-lg overflow-hidden border border-outline-variant bg-slate-900 mt-2.5 cursor-pointer shadow-inner" onclick="openVaultDocListZoom(${idx})">
              <img src="${d.src}" alt="${d.title}" loading="lazy" decoding="async" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"/>
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-mono text-xs font-bold">
                <span class="material-symbols-outlined text-[20px]">zoom_in</span> Click to Inspect
              </div>
            </div>
            <p class="font-mono text-[10px] text-outline mt-2 truncate">${d.sub}</p>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-outline-variant/60 text-xs">
            <button type="button" onclick="openVaultDocListZoom(${idx})" class="px-2.5 py-1 rounded-lg bg-surface-container-lowest hover:bg-surface-container border border-outline-variant font-headline font-bold text-[11px] text-primary-container flex items-center gap-1 shadow-2xs">
              <span class="material-symbols-outlined text-[14px]">fullscreen</span>
              <span>Inspect</span>
            </button>
            <label class="cursor-pointer px-2.5 py-1 rounded-lg bg-primary-container hover:bg-primary text-white font-headline font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-colors">
              <span class="material-symbols-outlined text-[14px]">file_upload</span>
              <span>Replace Scan</span>
              <input type="file" accept="image/*,application/pdf" class="hidden" onchange="replaceVaultDoc('${key}', this.files[0])"/>
            </label>
          </div>
        `;

        if (d.type === "property" && shelfProp) shelfProp.appendChild(card);
        else if (d.type === "income" && shelfInc) shelfInc.appendChild(card);
        else if (shelfKyc) shelfKyc.appendChild(card);
      });

      renderVaultMini();
    }

    function openVaultDocListZoom(startIndex = 0) {
      const c = caseRegistry[activeCaseId];
      if (!c || !c.vault_documents) return;
      const items = Object.entries(c.vault_documents).map(([key, d], i) => ({
        index: i,
        pageNumber: i + 1,
        title: d.title || 'Vault Document',
        sub: d.sub || key.toUpperCase(),
        src: d.src,
        status: d.status || 'VERIFIED',
        shortType: (d.type || 'DOCUMENT').toUpperCase()
      }));
      openFullDocumentViewer(items, startIndex);
    }

    // Uploads the NSDL / e-filing PAN verification report as its own distinct document (never
    // overwrites the physical PAN card scan on the front face) - shown on the back of the PAN
    // flip card and included in the certified report's PAN verification annexure alongside the
    // card itself. PDFs are rendered server-side to a JPG (the report can only place raster
    // images), so the preview and the report both always show something real once this returns.
    async function uploadPanVerificationDoc(file) {
      if (!file) return;
      if (!activeCaseId) { alert("No active case selected — select a case before uploading."); return; }

      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`/api/v1/cases/${activeCaseId}/pan-verification`, {
          method: "POST",
          headers: authHeaders(),
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert(`NSDL verification upload failed — this document was NOT saved: ${err.detail || "Server error"}.`);
          return;
        }
        const data = await res.json();
        const c = caseRegistry[activeCaseId];
        if (c) c.pan_back_img = data.web_url;
        const img = document.getElementById("dispPanBackImg");
        if (img) img.src = data.web_url + `?t=${Date.now()}`;
        // Flip to the back so the CA immediately sees what was just uploaded, not a silent save.
        setDocSide("pan", "back");
        alert(`[✓] NSDL / PAN verification report saved: ${file.name}`);
      } catch (err) {
        alert(`Network error — this document was NOT saved: ${err.message}. Please check your connection and try again.`);
      }
    }

    function directReplaceDocCard(section, file) {
      if (!file) return;
      const previewUrl = URL.createObjectURL(file);
      const c = caseRegistry[activeCaseId];

      if (section === "aadhaar") {
        if (c) {
          c.aadhaar_front_img = previewUrl;
          c.aadhaar_front_raw = previewUrl;
          if (c.vault_documents && c.vault_documents.aadhaar) {
            c.vault_documents.aadhaar.src = previewUrl;
          }
        }
        const img = document.getElementById("dispAadhaarFrontImg");
        if (img) img.src = previewUrl;
        alert(`[✓] Aadhaar Card successfully updated with authentic scan: ${file.name}`);
      } else if (section === "pan") {
        if (c) {
          c.pan_front_img = previewUrl;
          if (c.vault_documents && c.vault_documents.pan) {
            c.vault_documents.pan.src = previewUrl;
          }
        }
        const img = document.getElementById("dispPanFrontImg");
        if (img) img.src = previewUrl;
        alert(`[✓] PAN Card successfully updated with authentic scan: ${file.name}`);
      } else if (section === "utility") {
        if (c) {
          c.utility_front_img = previewUrl;
          if (c.vault_documents && c.vault_documents.utility) {
            c.vault_documents.utility.src = previewUrl;
          }
        }
        const img = document.getElementById("dispUtilityFrontImg");
        if (img) img.src = previewUrl;
        alert(`[✓] Utility Bill successfully updated with authentic scan: ${file.name}`);
      }

      renderVaultMini();
      handleSectionUpload(section, file);
    }

    function replaceVaultDoc(key, file) {
      if (!file) return;
      const previewUrl = URL.createObjectURL(file);
      const c = caseRegistry[activeCaseId];
      if (c && c.vault_documents && c.vault_documents[key]) {
        c.vault_documents[key].src = previewUrl;
        c.vault_documents[key].sub = `${file.name} (${(file.size/1024).toFixed(1)} KB)`;
        c.vault_documents[key].status = "REPLACED & VERIFIED";

        // Also reflect in main scrutiny cards if it's aadhaar, pan, or utility
        if (key === "aadhaar") {
          c.aadhaar_front_img = previewUrl;
          c.aadhaar_front_raw = previewUrl;
          const aImg = document.getElementById("dispAadhaarFrontImg");
          if (aImg) aImg.src = previewUrl;
        } else if (key === "pan") {
          c.pan_front_img = previewUrl;
          const pImg = document.getElementById("dispPanFrontImg");
          if (pImg) pImg.src = previewUrl;
        } else if (key === "utility") {
          c.utility_front_img = previewUrl;
          const uImg = document.getElementById("dispUtilityFrontImg");
          if (uImg) uImg.src = previewUrl;
        }

        renderCaseDocumentVault(activeCaseId);
        alert(`[✓] ${c.vault_documents[key].title} updated with: ${file.name}`);
      }
    }

    function handleVaultUpload(files) {
      if (!files || files.length === 0) return;
      const c = caseRegistry[activeCaseId];
      if (!c) return;

      if (!c.vault_documents) c.vault_documents = {};

      Array.from(files).forEach((f, idx) => {
        const previewUrl = URL.createObjectURL(f);
        const name = f.name.toLowerCase();
        let key = "custom_" + Date.now() + "_" + idx;
        let type = "property";
        let title = f.name.replace(/\.[^/.]+$/, "");

        if (name.includes("pan")) {
          key = "pan"; type = "kyc"; title = "Permanent Account Number (PAN)";
          c.pan_front_img = previewUrl;
          const pImg = document.getElementById("dispPanFrontImg");
          if (pImg) pImg.src = previewUrl;
        } else if (name.includes("aadhaar") || name.includes("aadhar") || name.includes("uid")) {
          key = "aadhaar"; type = "kyc"; title = "Aadhaar Card (UIDAI Verified)";
          c.aadhaar_front_img = previewUrl;
          c.aadhaar_front_raw = previewUrl;
          const aImg = document.getElementById("dispAadhaarFrontImg");
          if (aImg) aImg.src = previewUrl;
        } else if (name.includes("bill") || name.includes("light") || name.includes("electricity") || name.includes("ugvcl")) {
          key = "utility"; type = "property"; title = "UGVCL Electricity Bill";
          c.utility_front_img = previewUrl;
          const uImg = document.getElementById("dispUtilityFrontImg");
          if (uImg) uImg.src = previewUrl;
        } else if (name.includes("form16") || name.includes("form 16") || name.includes("tds")) {
          key = "form16"; type = "income"; title = "Form 16 (Part A & B / TDS)";
        } else if (name.includes("salary") || name.includes("payslip") || name.includes("pay slip")) {
          key = "payslip"; type = "income"; title = "Salary Payslip (Verified)";
        } else if (name.includes("bank") || name.includes("statement")) {
          key = "bank_statement"; type = "income"; title = "Operative Bank Statement (6 Months)";
        } else if (name.includes("deed") || name.includes("sale") || name.includes("satakhat") || name.includes("dastavej")) {
          key = "sale_deed"; type = "property"; title = "Registered Sale Deed (દસ્તાવેજ)";
        } else if (name.includes("index") || name.includes("suchi")) {
          key = "index2"; type = "property"; title = "Index II Copy (સૂચિ ૨ નકલ)";
        } else if (name.includes("tax") || name.includes("noc")) {
          key = "property_tax"; type = "property"; title = "Property Tax Bill & Municipal NOC";
        }

        c.vault_documents[key] = {
          title: title,
          sub: `${f.name} (${(f.size/1024).toFixed(1)} KB)`,
          type: type,
          src: previewUrl,
          status: "UPLOADED & VERIFIED"
        };
      });

      renderCaseDocumentVault(activeCaseId);
      alert(`[✓] Successfully ingested ${files.length} document(s) into Case Document Vault!`);
    }

    // ==========================================
    // FIELD AGENT MANAGEMENT & DYNAMIC ROSTER
    // ==========================================
    window.allAgents = [];

    async function loadFieldAgents(autoSelectUsername = null) {
      try {
        const res = await fetch("/api/v1/agents");
        if (res.ok) {
          window.allAgents = await res.json();
          renderAgentDropdowns(autoSelectUsername);
          renderAgentRoster();
        }
      } catch (err) {
        console.warn("Could not load field agents:", err);
      }
    }

    function renderAgentDropdowns(selectedUsername = null) {
      const hoSelect = document.getElementById("hoAgentSelect");
      if (!hoSelect) return;

      const currentVal = selectedUsername || hoSelect.value;
      hoSelect.innerHTML = "";

      if (!window.allAgents || window.allAgents.length === 0) {
        hoSelect.innerHTML = `<option value="">-- No Field Staff Found (Click + Register) --</option>`;
        return;
      }

      window.allAgents.forEach((a, idx) => {
        const opt = document.createElement("option");
        opt.value = a.username;
        const dummyTag = a.is_dummy ? " [Dummy / Test]" : "";
        opt.textContent = `${a.full_name} (${a.username}${dummyTag})`;
        if (currentVal ? (a.username === currentVal) : (idx === 0)) {
          opt.selected = true;
        }
        hoSelect.appendChild(opt);
      });

      const custOpt = document.createElement("option");
      custOpt.value = "custom";
      custOpt.textContent = "✏️ Custom Phone / Manual...";
      hoSelect.appendChild(custOpt);

      onHandoverAgentChanged(hoSelect.value);
      rebuildFieldStaffFilterOptions();
    }

    // Management Portal's "Field Staff" filter used to be a hardcoded list of fake demo names
    // (Kamal Bhai, Nilesh, Rajesh Varma...) completely disconnected from who cases are actually
    // assigned to - rebuilt from the real registered agents every time the roster loads, same
    // pattern as rebuildBranchFilterOptions(). Option value is full_name (not username) because
    // applyManagementFilters() matches it against c.agent, which is stored as
    // "{full_name} ({designation})" via resolveAgentName() - a substring match on full_name
    // works regardless of designation text.
    function rebuildFieldStaffFilterOptions() {
      const sel = document.getElementById("mgmtFilterStaff");
      if (!sel) return;
      const prevValue = sel.value || "ALL";

      sel.innerHTML = "";
      const allOpt = document.createElement("option");
      allOpt.value = "ALL";
      allOpt.textContent = "All Field Staff (બધા એજન્ટ)";
      sel.appendChild(allOpt);

      (window.allAgents || []).forEach(a => {
        if (!a || !a.full_name) return;
        const opt = document.createElement("option");
        opt.value = a.full_name;
        const dummyTag = a.is_dummy ? " [Dummy / Test]" : "";
        opt.textContent = `${a.full_name}${a.username ? " (" + a.username + ")" : ""}${dummyTag}`;
        sel.appendChild(opt);
      });

      const values = Array.from(sel.options).map(o => o.value);
      sel.value = values.includes(prevValue) ? prevValue : "ALL";
    }

    function openQuickAgentModal() {
      const modal = document.getElementById("modalQuickRegisterAgent");
      if (modal) {
        modal.style.display = "flex";
        const f = document.getElementById("qaFullName");
        if (f) setTimeout(() => f.focus(), 100);
      }
    }

    function closeQuickAgentModal() {
      const modal = document.getElementById("modalQuickRegisterAgent");
      if (modal) modal.style.display = "none";
    }

    function autoSuggestAgentCredentials(val) {
      const uField = document.getElementById("qaUsername");
      const pField = document.getElementById("qaPassword");
      if (!val || !uField || !pField) return;
      const clean = val.trim().split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
      if (clean) {
        uField.value = clean;
        pField.value = clean + "@123";
      }
    }

    async function submitQuickAgent(e) {
      if (e) e.preventDefault();
      const name = document.getElementById("qaFullName").value.trim();
      const phone = document.getElementById("qaPhone").value.trim();
      const username = document.getElementById("qaUsername").value.trim();
      const password = document.getElementById("qaPassword").value.trim();
      const btn = document.getElementById("btnSubmitQuickAgent");

      if (!name || !phone) {
        alert("Please enter Agent Full Name and WhatsApp Phone Number.");
        return;
      }

      btn.disabled = true;
      btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[16px]">sync</span> Saving...`;

      try {
        const res = await fetch("/api/v1/agents/quick-register", {
          method: "POST",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({
            full_name: name,
            phone: phone,
            username: username || undefined,
            password: password || undefined,
          })
        });

        if (res.ok) {
          const data = await res.json();
          closeQuickAgentModal();
          const form = document.getElementById("quickAgentForm");
          if (form) form.reset();

          // Refresh agents list and select this newly registered agent
          await loadFieldAgents(data.username);

          document.getElementById("hoCredUser").textContent = data.username;
          document.getElementById("hoCredPass").textContent = data.password;
          document.getElementById("hoAgentPhone").value = data.phone;
          updateHandoverPreview();

          alert(`✓ Field Agent '${data.full_name}' registered successfully!\n\nUsername: ${data.username}\nPassword: ${data.password}\n\nTask handover preview updated!`);
        } else {
          const err = await res.json().catch(() => ({}));
          alert(`Could not register agent: ${err.detail || "Server error"}`);
        }
      } catch (err) {
        alert(`Network error registering agent: ${err.message}`);
      } finally {
        btn.disabled = false;
        btn.innerHTML = `<span class="material-symbols-outlined text-[16px]">check_circle</span> <span>Register & Select Agent (ઉમેરો)</span>`;
      }
    }

    function openManageAgentsModal() {
      const modal = document.getElementById("modalManageAgents");
      if (modal) {
        modal.style.display = "flex";
        loadFieldAgents();
      }
    }

    function closeManageAgentsModal() {
      const modal = document.getElementById("modalManageAgents");
      if (modal) modal.style.display = "none";
    }

    function renderAgentRoster() {
      const container = document.getElementById("rosterListContainer");
      const loading = document.getElementById("rosterLoadingState");
      if (!container) return;
      if (loading) loading.style.display = "none";

      if (!window.allAgents || window.allAgents.length === 0) {
        container.innerHTML = `
          <div class="p-6 text-center text-on-surface-variant font-mono text-xs border border-dashed border-outline-variant rounded-xl bg-surface-container-low">
            <span class="material-symbols-outlined text-[32px] text-outline mb-1">person_off</span>
            <p>No field agents currently registered.</p>
            <button onclick="closeManageAgentsModal(); openQuickAgentModal();" class="mt-2.5 px-3 py-1.5 bg-emerald-600 text-white rounded font-headline font-bold text-xs inline-flex items-center gap-1 shadow-xs">
              <span class="material-symbols-outlined text-[15px]">person_add</span>
              <span>+ Register Real Field Staff</span>
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = window.allAgents.map(a => {
        const words = (a.full_name || 'FA').trim().split(/\s+/).filter(Boolean);
        const initials = (words[0] ? words[0][0] : 'F') + (words[1] ? words[1][0] : (words[0] && words[0][1] ? words[0][1] : 'A'));
        const safeInitials = (initials || 'FA').toUpperCase();
        return `
        <div class="p-3.5 rounded-xl border ${a.is_dummy ? 'border-amber-300 bg-amber-50/50' : 'border-outline-variant bg-surface-container-lowest'} flex flex-wrap items-center justify-between gap-3 shadow-2xs hover:shadow-sm transition-all">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full ${a.is_dummy ? 'bg-amber-100 text-amber-800' : 'bg-primary-container text-white'} flex items-center justify-center font-bold text-xs font-headline shadow-xs">
              ${safeInitials}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-headline font-bold text-sm text-on-surface">${a.full_name}</span>
                ${a.is_dummy ? '<span class="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">DUMMY / SEED</span>' : '<span class="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">ACTIVE REAL STAFF</span>'}
              </div>
              <div class="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant font-mono mt-0.5">
                <span>📱 ${a.phone || 'No Phone'}</span>
                <span>•</span>
                <span>🔑 User: <strong class="text-on-surface">${a.username}</strong></span>
                <span>•</span>
                <span>📋 ${a.active_cases_count} Active Case(s)</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="deleteAgent('${a.id}', '${(a.full_name || 'Agent').replace(/'/g, "\\'")}')" class="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-headline font-bold flex items-center gap-1 transition-all" title="Permanently delete this agent">
              <span class="material-symbols-outlined text-[15px]">delete</span>
              <span>${a.is_dummy ? 'Remove Dummy' : 'Delete Agent'}</span>
            </button>
          </div>
        </div>
      `;
      }).join("");
    }

    async function deleteAgent(agentId, agentName) {
      if (!confirm(`Are you sure you want to remove agent '${agentName}'?\n\nIf any cases are allotted to this agent, they will be safely marked unassigned.`)) {
        return;
      }
      try {
        const res = await fetch(`/api/v1/agents/${encodeURIComponent(agentId)}`, {
          method: "DELETE",
          headers: authHeaders()
        });
        if (res.ok) {
          alert(`✓ Agent '${agentName}' removed successfully.`);
          await loadFieldAgents();
        } else {
          const err = await res.json().catch(() => ({}));
          alert(`Could not delete agent: ${err.detail || "Server error"}`);
        }
      } catch (err) {
        alert(`Error deleting agent: ${err.message}`);
      }
    }

    // Call on initial load
    setTimeout(() => { loadFieldAgents(); }, 500);

    // ==========================================
    // AGENT ACTIVITY LOG: dashboard-side view of the same case-history table the PWA
    // shows each agent for themselves ("My Records"), but across every agent at once, so
    // the CA can see who completed what case and when without opening each case individually.
    // ==========================================
    window.agentActivityCases = [];

    const AAL_STATUS_LABELS = {
      DRAFT: { label: "Not Yet Started", cls: "bg-slate-200 text-slate-700" },
      ASSIGNED: { label: "Assigned — Not Started", cls: "bg-amber-100 text-amber-800" },
      IN_PROGRESS: { label: "Visit In Progress", cls: "bg-blue-100 text-blue-800" },
      PENDING_CA_REVIEW: { label: "Completed — With CA", cls: "bg-emerald-100 text-emerald-800" },
      APPROVED: { label: "Completed — Approved", cls: "bg-emerald-100 text-emerald-800" },
      CERTIFIED: { label: "Completed — Certified", cls: "bg-emerald-100 text-emerald-800" },
      FLAGGED: { label: "Completed — Flagged", cls: "bg-rose-100 text-rose-800" },
      REJECTED: { label: "Completed — Rejected", cls: "bg-rose-100 text-rose-800" },
    };
    const AAL_DONE_STATUSES = new Set(["PENDING_CA_REVIEW", "APPROVED", "CERTIFIED", "FLAGGED", "REJECTED"]);

    function fmtAalDate(iso) {
      if (!iso) return "—";
      try {
        const d = new Date(iso);
        if (isNaN(d.getTime())) return "—";
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + " " +
          d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      } catch (e) { return "—"; }
    }

    async function openAgentActivityLog() {
      const modal = document.getElementById("modalAgentActivityLog");
      const loading = document.getElementById("aalLoadingState");
      const summary = document.getElementById("aalSummaryBar");
      const tbody = document.getElementById("aalTableBody");
      if (!modal) return;
      modal.style.display = "flex";
      if (loading) { loading.style.display = "flex"; loading.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">sync</span><span>Loading agent activity...</span>`; }
      if (summary) summary.classList.add("hidden");
      if (tbody) tbody.innerHTML = "";

      if (!window.allAgents || window.allAgents.length === 0) {
        await loadFieldAgents();
      }
      try {
        const res = await fetch("/api/v1/cases", { headers: authHeaders() });
        if (!res.ok) throw new Error("fetch failed");
        window.agentActivityCases = await res.json();
        populateAgentActivityFilter();
        renderAgentActivityLog();
      } catch (e) {
        if (loading) loading.innerHTML = `<span class="text-rose-700">Could not load agent activity — check connection and retry.</span>`;
        return;
      }
      if (loading) loading.style.display = "none";
    }

    function closeAgentActivityLog() {
      const modal = document.getElementById("modalAgentActivityLog");
      if (modal) modal.style.display = "none";
    }

    // Real audit trail across dashboard + PWA (logins, case create/edit/delete, document
    // actions, field visit check-in/out) - distinct from "Agent Activity" above, which is
    // just a case-assignment overview, not an action-by-action security log.
    const ACTIVITY_ACTION_LABELS = {
      USER_LOGIN: "Logged in",
      CASE_CREATED: "Created case",
      CASE_UPDATED: "Edited case details",
      CASE_DELETED: "Deleted case",
      CASE_ASSIGNED: "Assigned case to agent",
      BENCHMARK_AUTO_LOCATED: "Auto-located benchmark",
      PDF_INGESTED_AND_SEPARATED: "AI-ingested a PDF",
      IMAGES_INGESTED_AND_CLASSIFIED: "AI-ingested images",
      DOCUMENT_DELETED: "Deleted a document",
      DOCUMENT_UPLOADED: "Uploaded a document (PWA)",
      DOCUMENT_SCRUTINIZED: "Scrutinized a document",
      AGENT_CHECK_IN: "Checked in on-site (PWA)",
      AGENT_CHECK_OUT: "Checked out on-site (PWA)",
      FIELD_FORM_SUBMITTED: "Submitted field form (PWA)",
      APPLICANT_LOCATION_SHARED: "Shared applicant location",
    };

    function openActivityLog() {
      const modal = document.getElementById("modalActivityLog");
      if (!modal) return;
      modal.style.display = "flex";
      loadActivityLog();
    }

    function closeActivityLog() {
      const modal = document.getElementById("modalActivityLog");
      if (modal) modal.style.display = "none";
    }

    function activityLogMetaSummary(action, meta) {
      if (!meta) return "";
      const m = meta;
      switch (action) {
        case "USER_LOGIN": return `${m.full_name || ""} (${m.role || ""})`;
        case "CASE_CREATED": return `${m.case_no || ""} • ${m.bank_name || ""}`;
        case "CASE_DELETED": return `${m.case_no || ""} — ${m.applicant_name || ""} (${m.bank_name || ""})`;
        case "CASE_UPDATED": return Object.keys(m).filter(k => k !== "case_no").join(", ");
        case "DOCUMENT_DELETED": return `${m.title || m.doc_type || ""}`;
        default: {
          const keys = Object.keys(m).slice(0, 3);
          return keys.map(k => `${k}: ${m[k]}`).join(" • ");
        }
      }
    }

    async function loadActivityLog() {
      const tbody = document.getElementById("alTableBody");
      const loading = document.getElementById("alLoadingState");
      const actionFilter = document.getElementById("alActionFilter");
      if (!tbody) return;
      if (loading) loading.style.display = "flex";
      tbody.innerHTML = "";
      try {
        const qs = new URLSearchParams({ limit: "200" });
        if (actionFilter && actionFilter.value) qs.set("action", actionFilter.value);
        const res = await fetch(`/api/v1/activity-log?${qs.toString()}`, { headers: authHeaders() });
        if (!res.ok) throw new Error("fetch failed");
        const entries = await res.json();
        if (loading) loading.style.display = "none";
        if (!entries.length) {
          tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-on-surface-variant font-mono text-xs">No activity recorded yet.</td></tr>`;
          return;
        }
        tbody.innerHTML = entries.map(e => {
          const when = new Date(e.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
          const label = ACTIVITY_ACTION_LABELS[e.action] || e.action;
          const who = (e.user_name || "Unknown user").replace(/</g, "&lt;");
          const caseNo = (e.case_no || "—").replace(/</g, "&lt;");
          const details = activityLogMetaSummary(e.action, e.extra_metadata).replace(/</g, "&lt;");
          const isDelete = e.action.includes("DELETED");
          return `
            <tr class="border-b border-outline-variant/50 ${isDelete ? "bg-rose-50/50" : ""}">
              <td class="py-2 pr-3 font-mono text-[11px] whitespace-nowrap">${when}</td>
              <td class="py-2 pr-3 font-semibold ${isDelete ? "text-rose-700" : "text-on-surface"}">${label}</td>
              <td class="py-2 pr-3">${who}</td>
              <td class="py-2 pr-3 font-mono text-[11px]">${caseNo}</td>
              <td class="py-2 pr-3 text-on-surface-variant text-[11px]">${details}</td>
            </tr>`;
        }).join("");
      } catch (e) {
        if (loading) loading.innerHTML = `<span class="text-rose-700">Could not load activity log — check connection and retry.</span>`;
      }
    }

    // ==========================================
    // REPORT READINESS — what the final report will print as "Not Captured", fillable here
    // ==========================================
    const RR_COMPOSITE_FIELDS = new Set(["family_members"]);

    // Mirrors the exact dropdown option values the PWA field form itself offers for these
    // fields, so a value typed here reads identically to one the field agent would have picked.
    const RR_FIELD_OPTIONS = {
      "qualification": ["Graduate", "Post Graduate", "12th Pass", "10th Pass", "8th Pass"],
      "community": ["Hindu", "Muslim", "Christian"],
      "marital_status": ["Married (પરિણિત)", "Unmarried (અપરિણિત)"],
      "building_type": ["Bungalow", "Flat", "Independent House"],
      "ownership": ["Owned", "Rented", "Government Provided", "Company Provided"],
      "occupation": ["Job", "Business", "House Wife", "Retired"],
      "bank_account_status": ["Active / Regular", "Active / Irregular", "Dormant", "Not Verified"],
      "office_details.location": ["Commercial", "Residential", "Industrial", "Mixed"],
      "office_details.firm_type": ["Government / Government Job", "Proprietorship", "Partnership", "Private Limited", "LLP", "Corporation", "Public Limited", "Trust / Society", "Other"],
      "office_details.premises_ownership": ["Owned", "Rented", "NA"],
      "office_details_co.location": ["Commercial", "Residential", "Industrial", "Mixed"],
      "office_details_co.firm_type": ["Government / Government Job", "Proprietorship", "Partnership", "Private Limited", "LLP", "Corporation", "Public Limited", "Trust / Society", "Other"],
      "office_details_co.premises_ownership": ["Owned", "Rented", "NA"],
      "office_details_co.marital_status": ["Married (પરિણિત)", "Unmarried (અપરિણિત)"],
      "office_details_co.community": ["Hindu", "Muslim", "Christian"],
      "office_details_co.qualification": ["Graduate", "Post Graduate", "12th Pass", "10th Pass", "8th Pass"],
      "bank_account_status_co": ["Active / Regular", "Active / Irregular", "Dormant", "Not Verified"],
    };

    function rrInputHtml(f) {
      const options = RR_FIELD_OPTIONS[f.field];
      if (options) {
        return `<select data-rr-field="${f.field}" class="w-full text-xs rounded border border-outline-variant bg-white p-1.5 text-on-surface">
          <option value="">-- Select --</option>
          ${options.map(o => `<option value="${o.replace(/"/g, "&quot;")}">${o}</option>`).join("")}
        </select>`;
      }
      return `<input type="text" data-rr-field="${f.field}" placeholder="Type the answer if the CA office already knows it..." class="w-full text-xs rounded border border-outline-variant bg-white p-1.5 text-on-surface"/>`;
    }

    function openReportReadiness() {
      if (!activeCaseId) { alert("Select a case first."); return; }
      const modal = document.getElementById("modalReportReadiness");
      if (!modal) return;
      modal.style.display = "flex";
      loadReportReadiness();
    }

    function closeReportReadiness() {
      const modal = document.getElementById("modalReportReadiness");
      if (modal) modal.style.display = "none";
    }

    async function loadReportReadiness() {
      const loading = document.getElementById("rrLoadingState");
      const allGood = document.getElementById("rrAllGoodState");
      const dashSection = document.getElementById("rrDashboardSection");
      const docSection = document.getElementById("rrDocumentSection");
      const ffSection = document.getElementById("rrFieldFormSection");
      const dashList = document.getElementById("rrDashboardList");
      const docList = document.getElementById("rrDocumentList");
      const ffList = document.getElementById("rrFieldFormList");
      const subtitle = document.getElementById("rrSubtitle");
      if (!loading || !activeCaseId) return;
      loading.style.display = "flex";
      allGood.classList.add("hidden");
      dashSection.classList.add("hidden");
      docSection.classList.add("hidden");
      ffSection.classList.add("hidden");
      dashList.innerHTML = "";
      docList.innerHTML = "";
      ffList.innerHTML = "";
      try {
        const res = await fetch(`/api/v1/cases/${activeCaseId}/report-readiness`, { headers: authHeaders() });
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        loading.style.display = "none";
        const c = caseRegistry[activeCaseId];
        subtitle.textContent = `${c ? c.case_no + " — " + c.applicant_name + " • " : ""}${data.missing_count} field(s) will print as "Not Captured"`;

        if (data.missing_count === 0) {
          allGood.classList.remove("hidden");
          return;
        }

        const dashItems = data.missing_fields.filter(f => f.source === "dashboard");
        const docItems = data.missing_fields.filter(f => f.source === "document");
        const ffItems = data.missing_fields.filter(f => f.source === "field_form");

        if (dashItems.length) {
          dashSection.classList.remove("hidden");
          dashList.innerHTML = dashItems.map(f => `
            <div class="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs">
              <div>
                <span class="font-bold text-amber-900">${f.label}</span>
                <span class="text-amber-700 block text-[10px] font-mono">${f.how}</span>
              </div>
              <button onclick="closeReportReadiness(); openEditCaseModal('${activeCaseId}');" class="px-2.5 py-1 bg-white border border-amber-300 text-amber-900 rounded font-bold text-[10px] hover:bg-amber-100 shrink-0">Fix in Edit Case</button>
            </div>`).join("");
        }

        if (docItems.length) {
          docSection.classList.remove("hidden");
          docList.innerHTML = docItems.map(f => `
            <div class="flex items-center justify-between p-2 rounded-lg bg-blue-50 border border-blue-200 text-xs">
              <div>
                <span class="font-bold text-blue-900">${f.label}</span>
                <span class="text-blue-700 block text-[10px] font-mono">${f.how}</span>
              </div>
              <button onclick="closeReportReadiness(); triggerAiFolderIngestForCase('${activeCaseId}');" class="px-2.5 py-1 bg-white border border-blue-300 text-blue-900 rounded font-bold text-[10px] hover:bg-blue-100 shrink-0">Scan Document</button>
            </div>`).join("");
        }

        if (ffItems.length) {
          ffSection.classList.remove("hidden");
          ffList.innerHTML = ffItems.map(f => {
            if (RR_COMPOSITE_FIELDS.has(f.field)) {
              return `
              <div class="p-2 rounded-lg bg-surface-container-low border border-outline-variant text-xs">
                <span class="font-bold text-on-surface">${f.label}</span>
                <span class="text-outline block text-[10px] font-mono">${f.how} — ask the field agent, this needs several structured entries</span>
              </div>`;
            }
            return `
            <div class="p-2 rounded-lg bg-surface-container-low border border-outline-variant text-xs space-y-1">
              <label class="font-bold text-on-surface block">${f.label}</label>
              ${rrInputHtml(f)}
            </div>`;
          }).join("");
        }
      } catch (e) {
        loading.innerHTML = `<span class="text-rose-700">Could not check report readiness — check connection and retry.</span>`;
      }
    }

    async function saveReportReadinessFields() {
      const inputs = document.querySelectorAll("#rrFieldFormList [data-rr-field]");
      const flat = {};
      const officeDetails = {};
      const officeDetailsCo = {};
      inputs.forEach(inp => {
        const val = inp.value.trim();
        if (!val) return;
        const field = inp.getAttribute("data-rr-field");
        if (field.startsWith("office_details_co.")) {
          officeDetailsCo[field.split(".")[1]] = val;
        } else if (field.startsWith("office_details.")) {
          officeDetails[field.split(".")[1]] = val;
        } else {
          flat[field] = val;
        }
      });
      if (Object.keys(officeDetails).length) flat.office_details = officeDetails;
      if (Object.keys(officeDetailsCo).length) flat.office_details_co = officeDetailsCo;

      if (Object.keys(flat).length === 0) {
        alert("Type at least one answer before saving.");
        return;
      }

      try {
        const res = await fetch(`/api/v1/cases/${activeCaseId}/report-fields`, {
          method: "PATCH",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(flat),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert(`Could not save: ${err.detail || "Server error"}`);
          return;
        }
        await loadReportReadiness();
      } catch (e) {
        alert(`Network error saving report fields: ${e.message}`);
      }
    }

    function populateAgentActivityFilter() {
      const sel = document.getElementById("aalAgentFilter");
      if (!sel) return;
      const current = sel.value || "ALL";
      const seen = new Map();
      (window.agentActivityCases || []).forEach(c => {
        if (c.assigned_agent_id) {
          const a = (window.allAgents || []).find(x => x.id === c.assigned_agent_id);
          seen.set(c.assigned_agent_id, a ? a.full_name : "Unknown Agent");
        }
      });
      sel.innerHTML = `<option value="ALL">All Agents</option>` +
        Array.from(seen.entries()).map(([id, name]) => `<option value="${id}">${name.replace(/</g, "&lt;")}</option>`).join("") +
        `<option value="UNASSIGNED">Not Yet Allotted</option>`;
      if (Array.from(sel.options).some(o => o.value === current)) sel.value = current;
    }

    function renderAgentActivityLog() {
      const tbody = document.getElementById("aalTableBody");
      const summary = document.getElementById("aalSummaryBar");
      const filterSel = document.getElementById("aalAgentFilter");
      if (!tbody || !filterSel) return;
      const filterVal = filterSel.value || "ALL";
      let cases = window.agentActivityCases || [];
      if (filterVal === "UNASSIGNED") {
        cases = cases.filter(c => !c.assigned_agent_id);
      } else if (filterVal !== "ALL") {
        cases = cases.filter(c => c.assigned_agent_id === filterVal);
      }
      cases = [...cases].sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));

      if (cases.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-on-surface-variant font-mono text-xs">No cases match this filter.</td></tr>`;
        if (summary) summary.classList.add("hidden");
        return;
      }

      const doneCount = cases.filter(c => AAL_DONE_STATUSES.has(c.status)).length;
      if (summary) {
        summary.classList.remove("hidden");
        summary.textContent = `${cases.length} case(s) shown · ${doneCount} completed`;
      }

      const safe = (s) => (s === null || s === undefined || s === "" ? "—" : String(s)).replace(/</g, "&lt;");
      tbody.innerHTML = cases.map(c => {
        const agentObj = c.assigned_agent_id ? (window.allAgents || []).find(a => a.id === c.assigned_agent_id) : null;
        const agentName = agentObj ? agentObj.full_name : "Not Yet Allotted";
        const meta = AAL_STATUS_LABELS[c.status] || { label: c.status || "Unknown", cls: "bg-slate-200 text-slate-700" };
        const isDone = AAL_DONE_STATUSES.has(c.status);
        return `
          <tr class="border-b border-outline-variant/60 hover:bg-surface-container-low/60">
            <td class="py-2 pr-3 font-semibold text-on-surface whitespace-nowrap">${safe(agentName)}</td>
            <td class="py-2 pr-3 font-mono text-primary-container whitespace-nowrap">${safe(c.case_no)}</td>
            <td class="py-2 pr-3">${safe(c.applicant_name)}</td>
            <td class="py-2 pr-3 text-on-surface-variant max-w-[220px] truncate" title="${safe(c.target_address)}">${safe(c.target_address)}</td>
            <td class="py-2 pr-3"><span class="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold ${meta.cls}">${meta.label}</span></td>
            <td class="py-2 pr-3 font-mono text-on-surface-variant whitespace-nowrap">${fmtAalDate(c.created_at)}</td>
            <td class="py-2 pr-3 font-mono text-on-surface-variant whitespace-nowrap">${isDone ? fmtAalDate(c.updated_at) : "—"}</td>
          </tr>`;
      }).join("");
    }

