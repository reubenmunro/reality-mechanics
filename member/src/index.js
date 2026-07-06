/**
 * Pulse — public surface for observable behaviour through time.
 *
 * Calibration is the first Pulse instrument: a mechanical cardiogram —
 * strain rises, threshold crosses, pulse fires, carried strain remains.
 * Not AI. No input required. Press start and watch.
 */

const PAGE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Pulse · Reality Mechanics</title>
  <style>
    :root {
      --void:#07090e; --deep:#0c1019; --ember:#c8601a; --warm:#d4c5a9;
      --warm-dim:rgba(212,197,169,0.68); --cool:#4d5e72; --lead:#4d8ea6; --good:#5f9c72;
    }
    * { box-sizing:border-box; }
    html, body { min-height:100%; }
    body {
      margin:0; background:radial-gradient(ellipse 110% 70% at 50% -6%, #111925 0, #07090e 52%, #040509 100%);
      color:var(--warm-dim); font:17px/1.72 "Iowan Old Style", Charter, Georgia, serif;
    }
    header {
      position:fixed; inset:0 0 auto; z-index:4; display:flex; justify-content:space-between; align-items:center;
      gap:20px; padding:22px 28px; background:linear-gradient(180deg, rgba(7,9,14,0.72) 0%, rgba(7,9,14,0) 100%);
    }
    .brand { color:rgba(200,96,26,0.62); font:500 11px/1 system-ui, sans-serif; letter-spacing:0.16em; text-transform:uppercase; }
    nav { display:flex; gap:18px; align-items:center; flex-wrap:wrap; }
    nav a { color:rgba(77,94,114,0.72); text-decoration:none; font:500 11px/1 system-ui, sans-serif; letter-spacing:0.12em; text-transform:uppercase; }
    nav a:hover, nav a[aria-current="page"] { color:rgba(200,96,26,0.78); }
    main { width:min(760px, calc(100vw - 48px)); margin:0 auto; padding:108px 0 88px; }
    .intro { max-width:640px; margin-bottom:52px; }
    h1 {
      margin:0 0 18px; color:var(--warm);
      font:500 clamp(38px, 7vw, 64px)/1.04 "Iowan Old Style", Charter, Georgia, serif;
    }
    .intro p { margin:0; max-width:580px; color:var(--warm-dim); font-size:20px; line-height:1.62; }
    .proof {
      display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:24px 28px; margin:36px 0 0;
      color:var(--cool); font-size:14px; line-height:1.55;
    }
    .proof b { display:block; color:rgba(212,197,169,0.86); font:500 13px/1.3 system-ui, sans-serif; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:6px; }

    .mech { margin-top:12px; padding:0; }
    .mech-head { display:flex; justify-content:space-between; align-items:baseline; gap:18px; flex-wrap:wrap; margin-bottom:28px; }
    .mech-head h2 { margin:0; color:rgba(212,197,169,0.9); font:500 22px/1.25 "Iowan Old Style", Charter, Georgia, serif; }
    .mech-head .status { color:var(--cool); font:500 10px/1 system-ui, sans-serif; letter-spacing:0.14em; text-transform:uppercase; }
    .mech-head .status.live { color:var(--good); }

    .cardio-panel {
      position:relative; margin:0 0 12px; height:220px; border:0; border-radius:0;
      background:radial-gradient(ellipse 90% 80% at 50% 58%, rgba(17,22,32,0.9) 0, #07090e 72%);
      overflow:hidden;
    }
    .cardio-panel svg { width:100%; height:100%; display:block; }
    .grid-line { stroke:rgba(255,255,255,0.03); stroke-width:1; }
    #thresholdLine { stroke:var(--lead); stroke-width:1; stroke-dasharray:4 5; opacity:0.42; }
    #emaLine { fill:none; stroke:var(--cool); stroke-width:1.1; stroke-dasharray:2 5; opacity:0.55; }
    #strainLine {
      fill:none; stroke:var(--ember); stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round;
      filter:drop-shadow(0 0 8px rgba(200,96,26,0.42));
    }
    #pulseDot { fill:var(--ember); r:0; opacity:0; }
    #pulseDot.flashing { animation:beep 0.55s ease-out; }
    @keyframes beep { 0% { r:2.2; opacity:0.9; } 100% { r:10; opacity:0; } }
    #flash { fill:#f4ead9; opacity:0; pointer-events:none; }
    #flash.flashing { animation:strike 0.55s ease-out; }
    @keyframes strike { 0% { opacity:0; } 12% { opacity:0.16; } 100% { opacity:0; } }
    #carryLabel { fill:rgba(212,197,169,0.58); font:500 10px/1 system-ui, sans-serif; letter-spacing:0.06em; }
    #carryLabel.flash { animation:carryFlash 0.75s ease-out; }
    @keyframes carryFlash { 0% { fill:rgba(200,96,26,0.92); } 100% { fill:rgba(212,197,169,0.58); } }
    .legend { display:flex; gap:20px; flex-wrap:wrap; color:rgba(77,94,114,0.78); font-size:11px; margin-top:8px; }
    .legend span { display:inline-flex; align-items:center; gap:7px; }
    .legend i { width:16px; height:1px; display:inline-block; }
    .legend i.strain { background:rgba(200,96,26,0.72); }
    .legend i.ema { background:rgba(77,94,114,0.65); }
    .legend i.threshold { background:rgba(77,142,166,0.5); }

    .readouts { display:grid; grid-template-columns:repeat(5, minmax(0,1fr)); gap:20px 16px; margin-top:32px; }
    .readout { padding:0; background:none; border:0; }
    .readout .k { color:rgba(200,96,26,0.58); font:500 9px/1 system-ui, sans-serif; letter-spacing:0.14em; text-transform:uppercase; }
    .readout .v { color:var(--warm); font:500 clamp(22px, 4vw, 30px)/1.2 "Iowan Old Style", Charter, Georgia, serif; margin-top:6px; }
    .readout .sub { color:rgba(77,94,114,0.72); font-size:11px; margin-top:4px; line-height:1.4; }

    .actions { display:flex; flex-wrap:wrap; gap:16px; margin:36px 0 0; }
    button {
      border:0; border-bottom:1px solid rgba(77,94,114,0.28); border-radius:0; background:transparent; color:rgba(77,94,114,0.82);
      font:500 10px/1 system-ui, sans-serif; letter-spacing:0.14em; text-transform:uppercase;
      padding:0 0 6px; cursor:pointer;
    }
    button.primary { color:rgba(200,96,26,0.78); border-bottom-color:rgba(200,96,26,0.34); }
    button:hover { color:rgba(200,96,26,0.9); border-bottom-color:rgba(200,96,26,0.42); }

    .note { margin-top:28px; color:rgba(77,94,114,0.78); font-size:14px; line-height:1.62; max-width:560px; }
    .note b { color:rgba(200,96,26,0.72); font-weight:500; }
    .runtime-line { color:rgba(77,94,114,0.72); font:500 10px/1.6 system-ui, sans-serif; letter-spacing:0.1em; text-transform:uppercase; }
    .runtime-line a { color:rgba(77,94,114,0.72); text-decoration:none; border-bottom:1px solid rgba(77,142,166,0.18); }
    .runtime-line a:hover { color:rgba(200,96,26,0.78); }

    @media (max-width:640px) {
      .readouts { grid-template-columns:repeat(2, minmax(0,1fr)); }
      .proof { grid-template-columns:1fr; }
    }
    a:focus-visible, button:focus-visible { outline:2px solid rgba(200,96,26,0.85); outline-offset:3px; border-radius:2px; }
    .ways-in { margin-top:64px; padding-top:30px; border-top:1px solid rgba(77,94,114,0.28); max-width:640px; }
    .ways-in p { margin:0; color:rgba(140,155,175,0.9); font-size:14.5px; line-height:1.7; }
    .ways-in code { font:12.5px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; color:rgba(192,205,220,0.85); }
  </style>
</head>
<body>
  <header>
    <div class="brand">Pulse</div>
    <nav aria-label="Reality Mechanics">
      <a href="https://realitymechanics.nz/field">Observatory</a>
      <a href="https://calibration.realitymechanics.nz/" aria-current="page">Pulse</a>
      <a href="https://realitymechanics.nz/theory">Theory</a>
      <a href="https://realitymechanics.nz/proof">Proof</a>
      <a href="https://realitymechanics.nz/calculus">Calculus</a>
    </nav>
  </header>
  <main>
    <section class="intro">
      <h1>Behaviour through time.</h1>
      <p>The Observatory shows structure; Pulse shows what structure does under time. Calibration is the first Pulse instrument. It does not answer for you and does not need your input. Press start and watch strain rise until a pulse corrects it.</p>
      <p class="runtime-line">Mechanical runtime · no AI · no Atlas mutation · <a href="/api/health">live health</a> · <a href="https://github.com/reubenmunro/reality-mechanics/blob/main/docs/reports/D-021.4-pulse-instrument-contract.md">instrument contract</a></p>
      <div class="proof">
        <div><b>Drift</b>Strain builds on its own. Nothing holds it still.</div>
        <div><b>Pulse</b>A correction fires only once threshold is crossed.</div>
        <div><b>Strain</b>The gap is always shown. It never closes for good.</div>
      </div>
    </section>

    <section class="mech" aria-live="polite">
      <div class="mech-head">
        <h2>Calibration</h2>
        <div class="status" id="status">Paused</div>
      </div>

      <div class="cardio-panel">
        <svg viewBox="0 0 400 160" preserveAspectRatio="none">
          <line class="grid-line" x1="0" y1="40" x2="400" y2="40"></line>
          <line class="grid-line" x1="0" y1="80" x2="400" y2="80"></line>
          <line class="grid-line" x1="0" y1="120" x2="400" y2="120"></line>
          <line id="thresholdLine" x1="0" y1="80" x2="400" y2="80"></line>
          <polyline id="emaLine" points=""></polyline>
          <polyline id="strainLine" points=""></polyline>
          <circle id="pulseDot" cx="0" cy="0" r="0"></circle>
          <rect id="flash" x="0" y="0" width="400" height="160"></rect>
          <text id="carryLabel" x="392" y="18" text-anchor="end">carried —</text>
        </svg>
      </div>
      <div class="legend">
        <span><i class="strain"></i>Strain</span>
        <span><i class="ema"></i>Local average — the mechanism's own recent baseline, not a fixed sequence</span>
        <span><i class="threshold"></i>Threshold</span>
      </div>

      <div class="readouts">
        <div class="readout">
          <div class="k">Open Strain</div>
          <div class="v" id="strainValue">0.0</div>
          <div class="sub">current gap</div>
        </div>
        <div class="readout">
          <div class="k">Pulses</div>
          <div class="v" id="pulseCount">0</div>
          <div class="sub">corrections fired</div>
        </div>
        <div class="readout">
          <div class="k">Trend</div>
          <div class="v" id="trendValue">—</div>
          <div class="sub">avg strain, last 10 pulses</div>
        </div>
        <div class="readout">
          <div class="k">Threshold</div>
          <div class="v" id="thresholdValue">14.0</div>
          <div class="sub">strain that triggers a pulse</div>
        </div>
        <div class="readout">
          <div class="k">Carried Strain</div>
          <div class="v" id="carriedValue">—</div>
          <div class="sub">left over after the last pulse; this is what the next climb starts from</div>
        </div>
      </div>

      <div class="actions">
        <button class="primary" id="toggle" type="button">Start</button>
        <button id="reset" type="button">Reset</button>
      </div>

      <p class="note"><b>Open Strain never reaches zero</b> because the target keeps drifting between pulses, and each correction closes only part of the gap. Carried Strain is what the next climb starts from.</p>
    </section>

    <section class="ways-in" aria-label="Ways into the programme">
      <p>Pulse is one instrument of Reality Mechanics. Observe the structure itself in the <a href="https://realitymechanics.nz/field">Observatory</a>, read why the discipline works in <a href="https://realitymechanics.nz/theory">Theory</a>, and retrace the evidence in <a href="https://realitymechanics.nz/proof">Proof</a>. AI workers enter through the read-only MCP &mdash; see <a href="https://realitymechanics.nz/proof#ways-in">two ways in</a>.</p>
    </section>
  </main>

  <script>
    (function () {
      const THRESHOLD = 14;
      const WANDER = 26; // tuned so a pulse fires roughly every 2-6 real seconds
      const Y_MAX = 24;
      const WINDOW_MS = 9000;
      const EMA_TAU = 4; // seconds

      const els = {
        status: document.getElementById("status"),
        strainValue: document.getElementById("strainValue"),
        pulseCount: document.getElementById("pulseCount"),
        trendValue: document.getElementById("trendValue"),
        thresholdValue: document.getElementById("thresholdValue"),
        toggle: document.getElementById("toggle"),
        reset: document.getElementById("reset"),
        strainLine: document.getElementById("strainLine"),
        emaLine: document.getElementById("emaLine"),
        thresholdLine: document.getElementById("thresholdLine"),
        pulseDot: document.getElementById("pulseDot"),
        flash: document.getElementById("flash"),
        carryLabel: document.getElementById("carryLabel"),
        carriedValue: document.getElementById("carriedValue"),
      };

      els.thresholdValue.textContent = THRESHOLD.toFixed(1);
      els.thresholdLine.setAttribute("y1", String(mapY(THRESHOLD)));
      els.thresholdLine.setAttribute("y2", String(mapY(THRESHOLD)));

      let walk = 0;
      let target = 50;
      let approx = 50;
      let running = false;
      let pulses = 0;
      let history = [];
      let lastTime = null;
      let rafId = null;
      let seed = performance.now();
      let clock = 0;
      let ema = 0;
      let buffer = [];

      function clamp(v, lo, hi) {
        return Math.max(lo, Math.min(hi, v));
      }

      function mapY(strain) {
        const pad = 10;
        const frac = clamp(strain / Y_MAX, 0, 1);
        return pad + (1 - frac) * (160 - pad * 2);
      }

      function driftTarget(dt) {
        // Brownian-style walk: noise scaled by sqrt(dt) so drift speed does not
        // depend on frame rate. A small absolute-time sine adds gentle texture.
        walk = clamp(walk + (Math.random() - 0.5) * WANDER * Math.sqrt(dt), -42, 42);
        const sineOffset = 4 * Math.sin((performance.now() - seed) / 2600);
        target = clamp(50 + walk + sineOffset, 4, 96);
      }

      function firePulse(strain) {
        pulses += 1;
        const direction = target > approx ? 1 : -1;
        const correctionFraction = 0.3 + Math.random() * 0.55;
        const noise = (Math.random() - 0.5) * 9;
        approx = clamp(approx + direction * strain * correctionFraction + noise * 0.35, 4, 96);
        const newStrain = Math.abs(target - approx);
        history.push(newStrain);
        if (history.length > 40) history.shift();

        // newStrain is not reset to zero -- it is the carry: the starting
        // condition the next threshold approach is measured from. Surface
        // it directly rather than leaving it implicit in the waveform.
        els.carriedValue.textContent = newStrain.toFixed(1);
        els.carryLabel.textContent = "carried " + newStrain.toFixed(1);
        els.carryLabel.classList.remove("flash");
        void els.carryLabel.offsetWidth;
        els.carryLabel.classList.add("flash");

        els.flash.classList.remove("flashing");
        void els.flash.offsetWidth;
        els.flash.classList.add("flashing");
        els.pulseDot.classList.remove("flashing");
        void els.pulseDot.offsetWidth;
        els.pulseDot.classList.add("flashing");
      }

      function render(strain) {
        buffer.push({ t: clock, strain, ema });
        while (buffer.length && clock - buffer[0].t > WINDOW_MS) buffer.shift();

        const windowStart = clock - WINDOW_MS;
        const strainPts = buffer
          .map((s) => ((s.t - windowStart) / WINDOW_MS) * 400 + "," + mapY(s.strain).toFixed(1))
          .join(" ");
        const emaPts = buffer
          .map((s) => ((s.t - windowStart) / WINDOW_MS) * 400 + "," + mapY(s.ema).toFixed(1))
          .join(" ");
        els.strainLine.setAttribute("points", strainPts);
        els.emaLine.setAttribute("points", emaPts);

        if (buffer.length) {
          const last = buffer[buffer.length - 1];
          const x = ((last.t - windowStart) / WINDOW_MS) * 400;
          els.pulseDot.setAttribute("cx", x.toFixed(1));
          els.pulseDot.setAttribute("cy", mapY(last.strain).toFixed(1));
        }

        els.strainValue.textContent = strain.toFixed(1);
        els.pulseCount.textContent = String(pulses);

        if (history.length) {
          const last10 = history.slice(-10);
          const avg = last10.reduce((a, b) => a + b, 0) / last10.length;
          els.trendValue.textContent = avg.toFixed(1);
        } else {
          els.trendValue.textContent = "—";
        }
      }

      function tick(now) {
        if (!running) return;
        const dt = lastTime ? Math.min(0.25, (now - lastTime) / 1000) : 0;
        lastTime = now;
        clock += dt * 1000;
        driftTarget(dt);
        const strain = Math.abs(target - approx);
        ema += (strain - ema) * (1 - Math.exp(-dt / EMA_TAU));
        if (strain >= THRESHOLD) firePulse(strain);
        render(Math.abs(target - approx));
        rafId = requestAnimationFrame(tick);
      }

      function start() {
        if (running) return;
        running = true;
        lastTime = null;
        els.status.textContent = "Live";
        els.status.classList.add("live");
        els.toggle.textContent = "Pause";
        rafId = requestAnimationFrame(tick);
      }

      function pause() {
        running = false;
        els.status.textContent = "Paused";
        els.status.classList.remove("live");
        els.toggle.textContent = "Start";
        if (rafId) cancelAnimationFrame(rafId);
      }

      function reset() {
        pause();
        walk = 0;
        target = 50;
        approx = 50;
        pulses = 0;
        history = [];
        seed = performance.now();
        clock = 0;
        ema = 0;
        buffer = [];
        els.strainLine.setAttribute("points", "");
        els.emaLine.setAttribute("points", "");
        els.carriedValue.textContent = "—";
        els.carryLabel.textContent = "carried —";
        els.carryLabel.classList.remove("flash");
        render(0);
      }

      els.toggle.addEventListener("click", () => (running ? pause() : start()));
      els.reset.addEventListener("click", reset);

      render(0);
    })();
  </script>
</body>
</html>`;

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/" && (request.method === "GET" || request.method === "HEAD")) {
      return new Response(PAGE, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-cache",
        },
      });
    }

    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({ ok: true, runtime: "mechanical", ai: false });
    }

    return json({ error: "not found", endpoints: ["GET /", "GET /api/health"] }, 404);
  },
};
