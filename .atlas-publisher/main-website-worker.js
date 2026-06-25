const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reality Mechanics</title>
  <meta name="description" content="Reality Mechanics is a dependency-ordered reasoning system. A reason is traceable support." />
  <link rel="canonical" href="https://realitymechanics.nz/" />
  <style>
    :root {
      color-scheme: light;
      --text: #202327;
      --muted: #626971;
      --line: #e4e6e8;
      --paper: #ffffff;
      --soft: #f6f7f8;
      --accent: #2f6a86;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      background: var(--paper);
      color: var(--text);
      font-family: "Iowan Old Style", Charter, Georgia, serif;
      letter-spacing: 0;
    }

    main {
      min-height: 100vh;
      display: grid;
      grid-template-rows: auto 1fr;
    }

    .wrap {
      width: min(100%, 940px);
    }

    .hero {
      display: grid;
      align-items: end;
      min-height: 48vh;
      padding: 5rem 1.25rem 3.5rem;
      border-bottom: 1px solid var(--line);
      background: var(--soft);
    }

    .hero .wrap,
    .lower .wrap {
      margin: 0 auto;
    }

    .lower {
      color: var(--text);
      background: var(--paper);
      padding: 1.8rem 1.25rem 4rem;
    }

    h1 {
      margin: 0;
      font-size: clamp(2.4rem, 5vw, 4.8rem);
      line-height: 1.04;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-weight: 600;
      letter-spacing: 0;
      text-transform: none;
      white-space: nowrap;
    }

    .statement {
      max-width: 720px;
      margin: 1.3rem 0 0;
      color: var(--muted);
      font-size: clamp(1.35rem, 3vw, 2rem);
      line-height: 1.35;
      font-weight: 400;
    }

    .postulate {
      max-width: 560px;
      margin: 1.8rem 0 0;
      color: var(--text);
      font-size: clamp(1.05rem, 2vw, 1.28rem);
      line-height: 1.55;
    }

    .postulate span {
      display: block;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 0;
      padding-top: 0;
      border-top: 0;
      max-width: 720px;
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
      background: var(--paper);
      color: var(--text);
      font-size: 0.96rem;
      font-weight: 500;
      transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;
    }

    .button.primary {
      border-color: rgba(47, 106, 134, 0.36);
      background: rgba(47, 106, 134, 0.08);
      color: var(--accent);
    }

    .button:hover,
    .button:focus-visible {
      border-color: rgba(47, 106, 134, 0.58);
      background: rgba(47, 106, 134, 0.11);
      transform: translateY(-1px);
      outline: none;
    }

    .note {
      max-width: 700px;
      margin: 1.8rem 0 0;
      color: var(--muted);
      font-size: 0.94rem;
      line-height: 1.55;
    }

    .note strong {
      color: var(--text);
      font-weight: 600;
    }

    @media (max-width: 520px) {
      main { grid-template-rows: auto 1fr; }
      .hero { align-items: end; }
      h1 {
        font-size: clamp(2.6rem, 13vw, 4rem);
        white-space: normal;
      }
      .hero { min-height: auto; padding-top: 3.5rem; }
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
        <p class="statement">A dependency-ordered reasoning system.</p>
        <p class="note"><strong>A reason is traceable support.</strong> The Atlas keeps reasons answerable by showing what holds them, what they carry, and how they return through trace.</p>
        <p class="postulate">
          <span>Relation holds.</span>
          <span>Order carries.</span>
          <span>Trace places.</span>
        </p>
      </div>
    </section>
    <section class="lower">
      <div class="wrap">
        <nav class="actions" aria-label="Primary links">
          <a class="button primary" href="https://atlas.realitymechanics.nz">Open the Atlas</a>
          <a class="button" href="https://atlas.realitymechanics.nz/reasoning.html">Start with Reasoning</a>
          <a class="button" href="https://theory.realitymechanics.nz">Read the Postulate</a>
          <a class="button" href="https://atlas.realitymechanics.nz/ai-participation.html">AI Participation</a>
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
