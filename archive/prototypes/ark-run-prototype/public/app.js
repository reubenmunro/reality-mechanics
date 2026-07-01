const form = document.querySelector("#run-form");
const status = document.querySelector("#status");
const runsList = document.querySelector("#runs-list");
const refreshButton = document.querySelector("#refresh");

function valuesFromForm() {
  return Object.fromEntries(new FormData(form).entries());
}

function setStatus(message) {
  status.textContent = message;
}

function preview(value) {
  const text = String(value || "").trim();
  if (!text) return "Open.";
  return text.length > 170 ? `${text.slice(0, 167)}...` : text;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderRuns(runs) {
  if (!runs.length) {
    runsList.innerHTML = "<p>No runs saved yet.</p>";
    return;
  }

  runsList.innerHTML = runs
    .map(
      (run) => `
        <article class="run-item">
          <time datetime="${run.created}">${new Date(run.created).toLocaleString()}</time>
          <p><strong>Pressure:</strong> ${escapeHtml(preview(run.pressure))}</p>
          <p><strong>Active condition:</strong> ${escapeHtml(preview(run.activeCondition))}</p>
          <p><strong>Atlas ids:</strong> ${escapeHtml(preview((run.atlasEntryIds || []).join(", ")))}</p>
          <p><strong>Determined:</strong> ${escapeHtml(preview(run.determination))}</p>
          <p><strong>State:</strong> ${escapeHtml(preview(run.currentState))}</p>
          <p><strong>Status:</strong> ${escapeHtml(preview(run.determineStatus))} / ${escapeHtml(preview(run.warrantStatus))}</p>
          <p><strong>Discernible:</strong> ${run.discernible ? "Yes" : "No"}</p>
          <p><strong>Force read:</strong> ${escapeHtml(preview(run.forceRead))}</p>
          <p><strong>Valid move:</strong> ${run.validMove ? "Yes" : "No"}</p>
          <p><strong>Scope:</strong> ${escapeHtml(preview(run.scope))}</p>
          <p><strong>Next pressure:</strong> ${escapeHtml(preview(run.nextPressure))}</p>
        </article>
      `,
    )
    .join("");
}

async function loadRuns() {
  const response = await fetch("/api/runs");
  if (!response.ok) throw new Error("Could not load saved runs.");
  renderRuns(await response.json());
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Saving run...");

  const response = await fetch("/api/runs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(valuesFromForm()),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    const blockers = result?.validation?.blockers?.join(" ");
    setStatus(blockers || "The run could not be saved.");
    return;
  }

  form.reset();
  setStatus("Run saved as Markdown and JSON.");
  await loadRuns();
});

refreshButton.addEventListener("click", () => {
  loadRuns().catch((error) => setStatus(error.message));
});

loadRuns().catch((error) => setStatus(error.message));
