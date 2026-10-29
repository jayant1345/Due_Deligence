// Shared satellite geofence map for the CA Portal and the Field Agent PWA.
// Renders the benchmark (property) pin, the field agent capture pin and the 150m safe-harbour
// circle on Esri World Imagery. Needs Leaflet 1.9.x loaded first; when Leaflet is unavailable
// (offline / CDN blocked) create() returns null and the page keeps its plain text telemetry.
(function () {
  const GEOFENCE_RADIUS_M = 150;

  const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/";
  const ESRI_ATTR = "Imagery &copy; Esri, Maxar, Earthstar Geographics";

  function num(v) {
    if (v === null || v === undefined || v === "" || v === "—") return null;
    const n = typeof v === "number" ? v : parseFloat(v);
    return Number.isFinite(n) ? n : null;
  }

  function validPoint(lat, lon) {
    return lat !== null && lon !== null && Math.abs(lat) <= 90 && Math.abs(lon) <= 180 && !(lat === 0 && lon === 0);
  }

  function distanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  function googleMapsUrl(lat, lon) {
    return `https://maps.google.com/?q=${lat.toFixed(6)},${lon.toFixed(6)}&t=k&z=19`;
  }

  // labelLeft keeps the benchmark and agent labels apart when the two pins are close together.
  function pinIcon(color, label, labelLeft) {
    return L.divIcon({
      className: "gf-pin",
      html: `<div class="gf-pin-body" style="background:${color}"><div class="gf-pin-dot"></div></div>` +
            (label ? `<div class="gf-pin-label${labelLeft ? " gf-pin-label-left" : ""}" style="border-color:${color}">${label}</div>` : ""),
      iconSize: [26, 26],
      iconAnchor: [13, 26],
    });
  }

  // Styles live here so both pages get identical map rendering without duplicating CSS.
  function injectStyles() {
    if (document.getElementById("gf-map-styles")) return;
    const s = document.createElement("style");
    s.id = "gf-map-styles";
    s.textContent = `
      .gf-map { isolation: isolate; z-index: 0; background: #0f172a; }
      .gf-map .leaflet-container { background: #0f172a; font-family: inherit; }
      /* Tailwind preflight sets img{max-width:100%;height:auto}, which breaks Leaflet tiles */
      .gf-map img { max-width: none !important; max-height: none !important; }
      .gf-map .leaflet-control-attribution { font-size: 8px; background: rgba(0,0,0,.55); color: #cbd5e1; }
      .gf-map .leaflet-control-attribution a { color: #93c5fd; }
      .gf-pin { background: none; border: none; }
      .gf-pin-body { width: 26px; height: 26px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
        border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; }
      .gf-pin-dot { width: 8px; height: 8px; border-radius: 50%; background: #fff; }
      .gf-pin-label { position: absolute; left: 30px; top: 2px; white-space: nowrap; background: rgba(0,0,0,.78);
        color: #fff; font: 700 9px/1.2 'JetBrains Mono', monospace; padding: 2px 5px; border-radius: 4px; border: 1px solid; }
      .gf-pin-label-left { left: auto; right: 30px; top: 14px; }
      .gf-map.gf-editing .leaflet-container { cursor: crosshair; }
    `;
    document.head.appendChild(s);
  }

  /**
   * create(container, opts) -> controller | null
   * opts.editable      allow "adjust benchmark" mode (CA portal only)
   * opts.agentLabel    label shown next to the green pin
   * opts.onPreview(lat, lon)   called while the benchmark pin is being moved (not saved yet)
   */
  function create(container, opts) {
    opts = opts || {};
    if (typeof window.L === "undefined" || !container) return null;
    injectStyles();
    container.classList.add("gf-map");

    const isTouch = L.Browser.mobile;
    const map = L.map(container, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false, // enabled on click so page scrolling is never hijacked
      dragging: !isTouch,     // on phones one-finger drag scrolls the page; pinch still zooms
      tap: false,
      maxZoom: 20,
    }).setView([23.0225, 72.5714], 12);
    map.attributionControl.setPrefix(false);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    const satellite = L.layerGroup([
      L.tileLayer(ESRI + "World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxNativeZoom: 18, maxZoom: 20, attribution: ESRI_ATTR }),
      L.tileLayer(ESRI + "Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", { maxNativeZoom: 18, maxZoom: 20, opacity: 0.7 }),
      L.tileLayer(ESRI + "Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", { maxNativeZoom: 18, maxZoom: 20 }),
    ]);
    const street = L.tileLayer(ESRI + "World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxNativeZoom: 19, maxZoom: 20, attribution: "&copy; Esri, HERE, Garmin, OpenStreetMap contributors",
    });
    satellite.addTo(map);
    let baseMode = "satellite";

    map.on("click", () => map.scrollWheelZoom.enable());
    container.addEventListener("mouseleave", () => map.scrollWheelZoom.disable());

    const benchMarker = L.marker([0, 0], { icon: pinIcon("#dc2626", "BENCHMARK", true), draggable: false, zIndexOffset: 500, keyboard: false });
    const agentMarker = L.marker([0, 0], { icon: pinIcon("#16a34a", opts.agentLabel || "FIELD AGENT"), zIndexOffset: 1000, keyboard: false });
    const applicantMarker = L.marker([0, 0], { icon: pinIcon("#2563eb", "APPLICANT SHARED"), zIndexOffset: 300, keyboard: false });
    const fence = L.circle([0, 0],{ radius: GEOFENCE_RADIUS_M, color: "#22c55e", weight: 2, fillColor: "#22c55e", fillOpacity: 0.12 });
    const link = L.polyline([], { color: "#facc15", weight: 2, dashArray: "6 6" });

    let bench = null;     // {lat, lon} currently displayed
    let saved = null;     // last committed benchmark (restored on cancel)
    let agent = null;
    let applicant = null; // self-declared location the applicant shared (WhatsApp)
    let editing = false;
    let fittedKey = null; // avoid re-fitting the view on every live GPS tick

    function styleFence() {
      const d = (bench && agent) ? distanceMeters(bench.lat, bench.lon, agent.lat, agent.lon) : null;
      const breach = d !== null && d > GEOFENCE_RADIUS_M;
      const col = breach ? "#ef4444" : "#22c55e";
      fence.setStyle({ color: col, fillColor: col });
      return d;
    }

    function draw() {
      if (bench) {
        benchMarker.setLatLng([bench.lat, bench.lon]).addTo(map);
        fence.setLatLng([bench.lat, bench.lon]).addTo(map);
      } else {
        map.removeLayer(benchMarker); map.removeLayer(fence);
      }
      if (agent) agentMarker.setLatLng([agent.lat, agent.lon]).addTo(map);
      else map.removeLayer(agentMarker);
      if (applicant) applicantMarker.setLatLng([applicant.lat, applicant.lon]).addTo(map);
      else map.removeLayer(applicantMarker);
      if (bench && agent) link.setLatLngs([[bench.lat, bench.lon], [agent.lat, agent.lon]]).addTo(map);
      else map.removeLayer(link);
      return styleFence();
    }

    function fit() {
      map.invalidateSize();
      const pts = [];
      if (bench) {
        const b = L.latLng(bench.lat, bench.lon).toBounds(GEOFENCE_RADIUS_M * 2.4);
        pts.push(b.getSouthWest(), b.getNorthEast());
      }
      if (agent) pts.push(L.latLng(agent.lat, agent.lon));
      // Include the applicant pin unless it is far away (a mismatch the CA sees in the flag, not by zooming out to a state).
      if (applicant && (!bench || distanceMeters(bench.lat, bench.lon, applicant.lat, applicant.lon) < 20000)) {
        pts.push(L.latLng(applicant.lat, applicant.lon));
      }
      if (pts.length === 1) map.setView(pts[0], 17);
      else if (pts.length) map.fitBounds(L.latLngBounds(pts), { padding: [28, 28], maxZoom: 18 });
    }

    function previewBench(lat, lon) {
      bench = { lat, lon };
      const d = draw();
      if (opts.onPreview) opts.onPreview(lat, lon, d);
    }

    benchMarker.on("drag", (e) => {
      const p = e.target.getLatLng();
      previewBench(p.lat, p.lng);
    });
    map.on("click", (e) => {
      if (editing) previewBench(e.latlng.lat, e.latlng.lng);
    });

    // Leaflet must re-measure when the card is resized or revealed (tabs, modals, layout shifts).
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(() => map.invalidateSize()).observe(container);
    }

    return {
      map,
      distanceMeters,
      googleMapsUrl,
      /** update({benchLat, benchLon, agentLat, agentLon, agentLabel, applicantLat, applicantLon, refit}) -> distance in metres or null */
      update(state) {
        const bLat = num(state.benchLat), bLon = num(state.benchLon);
        const aLat = num(state.agentLat), aLon = num(state.agentLon);
        const pLat = num(state.applicantLat), pLon = num(state.applicantLon);
        if (!editing) {
          bench = validPoint(bLat, bLon) ? { lat: bLat, lon: bLon } : null;
          saved = bench ? { ...bench } : null;
        }
        agent = validPoint(aLat, aLon) ? { lat: aLat, lon: aLon } : null;
        applicant = validPoint(pLat, pLon) ? { lat: pLat, lon: pLon } : null;
        if (state.agentLabel) agentMarker.setIcon(pinIcon("#16a34a", state.agentLabel));
        const d = draw();
        const key = `${bench ? bench.lat.toFixed(5) + "," + bench.lon.toFixed(5) : "-"}|${agent ? "a" : "-"}|${applicant ? applicant.lat.toFixed(5) + "," + applicant.lon.toFixed(5) : "-"}`;
        if (!editing && (state.refit || key !== fittedKey)) { fittedKey = key; fit(); }
        return d;
      },
      fit,
      getBenchmark() { return bench ? { ...bench } : null; },
      getAgent() { return agent ? { ...agent } : null; },
      setBaseLayer(mode) {
        if (mode === baseMode) return;
        if (mode === "street") { map.removeLayer(satellite); street.addTo(map); }
        else { map.removeLayer(street); satellite.addTo(map); }
        baseMode = mode;
      },
      getBaseLayer() { return baseMode; },
      isEditing() { return editing; },
      /** While editing: move the benchmark pin to a looked-up point and zoom there (not saved). */
      previewBenchmark(lat, lon, zoom) {
        if (!editing) return;
        previewBench(lat, lon);
        map.invalidateSize();
        map.setView([lat, lon], zoom || 17);
      },
      startEdit() {
        if (!opts.editable) return;
        editing = true;
        saved = bench ? { ...bench } : null;
        if (!bench) previewBench(map.getCenter().lat, map.getCenter().lng);
        benchMarker.dragging.enable();
        map.dragging.enable();
        container.classList.add("gf-editing");
      },
      /** Leave edit mode. keep=true commits the moved pin, false restores the saved one. */
      endEdit(keep) {
        editing = false;
        benchMarker.dragging.disable();
        if (isTouch) map.dragging.disable();
        container.classList.remove("gf-editing");
        if (keep) saved = bench ? { ...bench } : null;
        else bench = saved ? { ...saved } : null;
        draw();
      },
    };
  }

  window.GeofenceMap = { create, distanceMeters, googleMapsUrl, RADIUS_M: GEOFENCE_RADIUS_M };
})();
