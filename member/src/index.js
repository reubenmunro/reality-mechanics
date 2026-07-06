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
      --warm-dim:rgba(212,197,169,0.68); --cool:#4d5e72; --line:rgba(255,255,255,0.075);
      --lead:#4d8ea6; --good:#5f9c72;
    }
    * { box-sizing:border-box; }
    html, body { min-height:100%; }
    body {
      margin:0; background:radial-gradient(circle at 50% 0%, #111925 0, #07090e 52%, #040509 100%);
      color:var(--warm-dim); font:15px/1.6 system-ui, sans-serif;
    }
    header {
      position:sticky; top:0; z-index:4; display:flex; justify-content:space-between; align-items:center;
      gap:16px; padding:14px 18px; background:rgba(7,9,14,0.82);
      border-bottom:1px solid var(--line); backdrop-filter:blur(16px);
    }
    .brand { color:var(--ember); font-weight:700; letter-spacing:0.12em; font-size:12px; text-transform:uppercase; }
    nav { display:flex; gap:14px; align-items:center; }
    nav a { color:var(--cool); text-decoration:none; font-size:12px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; }
    nav a:hover { color:var(--ember); }
    main { width:min(860px, calc(100vw - 32px)); margin:0 auto; padding:54px 0 64px; }
    .intro { max-width:760px; margin-bottom:34px; }
    .eyebrow { color:var(--ember); font-size:11px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; }
    h1 {
      margin:10px 0 14px; color:var(--warm);
      font:500 clamp(34px, 7vw, 68px)/1.02 Georgia, Charter, serif; letter-spacing:0;
    }
    .intro p { margin:0; max-width:680px; color:var(--warm-dim); font:19px/1.55 Georgia, Charter, serif; }
    .proof {
      display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:10px; margin:28px 0 0;
      color:var(--cool); font-size:13px;
    }
    .proof div { border:1px solid var(--line); border-radius:8px; padding:12px; background:rgba(12,16,25,0.64); }
    .proof b { display:block; color:var(--warm); margin-bottom:3px; }

    .mech {
      margin-top:30px; border:1px solid var(--line); border-radius:10px;
      background:rgba(12,16,25,0.72); padding:22px;
    }
    .mech-head { display:flex; justify-content:space-between; align-items:flex-start; gap:18px; flex-wrap:wrap; }
    .mech-head h2 { margin:0; color:var(--warm); font:500 22px/1.2 Georgia, Charter, serif; }
    .mech-head .status { color:var(--cool); font-size:12px; letter-spacing:0.08em; text-transform:uppercase; }
    .mech-head .status.live { color:var(--good); }

    .cardio-panel {
      position:relative; margin:24px 0 8px; height:190px; border:1px solid var(--line); border-radius:8px;
      background:#07090e; overflow:hidden;
    }
    .cardio-panel svg { width:100%; height:100%; display:block; }
    .grid-line { stroke:rgba(255,255,255,0.045); stroke-width:1; }
    #thresholdLine { stroke:var(--lead); stroke-width:1.2; stroke-dasharray:5 4; opacity:0.55; }
    #emaLine { fill:none; stroke:var(--cool); stroke-width:1.3; stroke-dasharray:2 4; opacity:0.75; }
    #strainLine {
      fill:none; stroke:var(--ember); stroke-width:2; stroke-linecap:round; stroke-linejoin:round;
      filter:drop-shadow(0 0 5px rgba(200,96,26,0.5));
    }
    #pulseDot { fill:var(--ember); r:0; opacity:0; }
    #pulseDot.flashing { animation:beep 0.5s ease-out; }
    @keyframes beep { 0% { r:2.4; opacity:1; } 100% { r:9; opacity:0; } }
    #flash { fill:#f4ead9; opacity:0; pointer-events:none; }
    #flash.flashing { animation:strike 0.5s ease-out; }
    @keyframes strike { 0% { opacity:0; } 10% { opacity:0.22; } 100% { opacity:0; } }
    #carryLabel { fill:var(--warm-dim); font:700 11px/1 system-ui, sans-serif; }
    #carryLabel.flash { animation:carryFlash 0.7s ease-out; }
    @keyframes carryFlash { 0% { fill:var(--ember); } 100% { fill:var(--warm-dim); } }
    .panel-cap { color:var(--cool); font-size:11px; margin-top:6px; }
    .legend { display:flex; gap:16px; flex-wrap:wrap; color:var(--cool); font-size:11px; margin-top:6px; }
    .legend span { display:inline-flex; align-items:center; gap:6px; }
    .legend i { width:14px; height:2px; display:inline-block; }
    .legend i.strain { background:var(--ember); }
    .legend i.ema { background:var(--cool); opacity:0.8; }
    .legend i.threshold { background:var(--lead); opacity:0.6; }

    .readouts { display:grid; grid-template-columns:repeat(5, minmax(0,1fr)); gap:10px; margin-top:20px; }
    .readout {
      border:1px solid var(--line); border-radius:8px; padding:12px; background:rgba(7,9,14,0.6);
    }
    .readout .k { color:var(--ember); font-size:10px; font-weight:700; letter-spacing:0.11em; text-transform:uppercase; }
    .readout .v { color:var(--warm); font:500 22px/1.3 Georgia, Charter, serif; margin-top:4px; }
    .readout .sub { color:var(--cool); font-size:11px; margin-top:2px; }

    .actions { display:flex; flex-wrap:wrap; gap:10px; margin:22px 0 0; }
    button {
      border:1px solid var(--line); border-radius:8px; background:transparent; color:var(--cool);
      font:700 11px/1 system-ui, sans-serif; letter-spacing:0.1em; text-transform:uppercase;
      padding:12px 14px; cursor:pointer;
    }
    button.primary { color:var(--ember); border-color:rgba(200,96,26,0.34); }
    button:hover { color:var(--ember); border-color:rgba(200,96,26,0.36); }

    .note { margin-top:18px; color:var(--cool); font-size:13px; max-width:640px; }
    .note b { color:var(--ember); }
    .runtime-line { color:var(--cool); font:600 11px/1.6 system-ui, sans-serif; letter-spacing:0.08em; text-transform:uppercase; }
    .runtime-line a { color:var(--cool); }
    .runtime-line a:hover { color:var(--ember); }

    @media (max-width:640px) {
      .readouts { grid-template-columns:repeat(2, minmax(0,1fr)); }
      .proof { grid-template-columns:1fr; }
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">Pulse</div>
    <nav aria-label="Reality Mechanics">
      <a href="https://realitymechanics.nz/field">🔭 Observatory</a>
      <a href="https://calibration.realitymechanics.nz/">❤️ Pulse</a>
      <a href="https://realitymechanics.nz/theory">📖 Theory</a>
      <a href="https://realitymechanics.nz/proof">✓ Proof</a>
      <a href="https://realitymechanics.nz/calculus">∴ Calculus</a>
    </nav>
  </header>
  <main>
    <section class="intro">
      <div class="eyebrow">Pulse</div>
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
