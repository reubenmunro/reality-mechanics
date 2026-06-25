const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reality Mechanics</title>
  <meta name="description" content="Reality Mechanics begins from a working postulate: Relation holds. Order carries. Trace places." />
  <link rel="canonical" href="https://realitymechanics.nz/" />
  <style>
    :root {
      color-scheme: dark;
      --text: #f8f0e4;
      --muted: rgba(248, 240, 228, 0.72);
      --line: rgba(248, 240, 228, 0.18);
      --accent: rgba(248, 240, 228, 0.86);
      --ember: #e79150;
      --ember-soft: rgba(231, 145, 80, 0.14);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      background: #fdf8ef;
      color: var(--text);
      font-family: "Iowan Old Style", Charter, Georgia, serif;
      letter-spacing: 0;
    }

    main {
      min-height: 100vh;
      display: grid;
      grid-template-rows: minmax(58vh, auto) 1fr;
    }

    .wrap {
      width: min(100%, 940px);
    }

    .hero {
      display: grid;
      align-items: end;
      padding: 4rem 1.25rem 3rem;
      border-bottom: 1px solid rgba(248, 240, 228, 0.18);
      background:
        radial-gradient(circle at 76% 18%, rgba(255, 121, 44, 0.46), transparent 34rem),
        radial-gradient(circle at 12% 90%, rgba(255, 184, 96, 0.18), transparent 28rem),
        linear-gradient(140deg, #321409, #7f3512 58%, #421808);
    }

    .hero .wrap,
    .lower .wrap {
      margin: 0 auto;
    }

    .lower {
      color: #24231f;
      background: #fdf8ef;
      padding: 1.6rem 1.25rem 4rem;
    }

    h1 {
      margin: 0;
      font-size: clamp(2.8rem, 5.4vw, 5.15rem);
      line-height: 1;
      font-family: Optima, "Optima nova", Candara, "Trebuchet MS", sans-serif;
      font-weight: 500;
      letter-spacing: 0.055em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .statement {
      max-width: 620px;
      margin: 1.6rem 0 0;
      color: var(--muted);
      font-size: clamp(1.35rem, 3vw, 1.9rem);
      line-height: 1.35;
      font-style: italic;
      font-weight: 400;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 0;
      padding-top: 0;
      border-top: 0;
      max-width: 620px;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 3rem;
      padding: 0.85rem 1.05rem;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.52);
      color: #24231f;
      font-size: 0.96rem;
      font-weight: 500;
      transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;
    }

    .button.primary {
      border-color: rgba(231, 145, 80, 0.36);
      background: rgba(231, 145, 80, 0.12);
    }

    .button:hover,
    .button:focus-visible {
      border-color: rgba(231, 145, 80, 0.58);
      background: rgba(231, 145, 80, 0.17);
      transform: translateY(-1px);
      outline: none;
    }

    .note {
      max-width: 560px;
      margin: 1.8rem 0 0;
      color: #777066;
      font-size: 0.94rem;
      line-height: 1.55;
    }

    @media (max-width: 520px) {
      main { grid-template-rows: minmax(58vh, auto) 1fr; }
      .hero { align-items: end; }
      h1 {
        font-size: clamp(2.6rem, 13vw, 4rem);
        white-space: normal;
      }
      .actions { flex-direction: column; }
      .button { width: 100%; }
    }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div class="wrap">
        <h1>Reality Mechanics</h1>
        <p class="statement">Relation holds. Order carries. Trace places.</p>
      </div>
    </section>
    <section class="lower">
      <div class="wrap">
        <nav class="actions" aria-label="Primary links">
          <a class="button primary" href="https://atlas.realitymechanics.nz">Open the Atlas</a>
          <a class="button" href="https://theory.realitymechanics.nz">Open the Working Postulate</a>
          <a class="button" href="https://doi.org/10.5281/zenodo.20338363">Zenodo Archive</a>
        </nav>
      </div>
    </section>
  </main>
</body>
</html>`;

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname === "/robots.txt") {
    return new Response("User-agent: *\nAllow: /\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    }
  });
}
