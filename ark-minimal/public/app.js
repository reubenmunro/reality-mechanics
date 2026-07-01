const participantId = `ark-${crypto.randomUUID()}`;
const enterButton = document.querySelector("#enter");
const statusEl = document.querySelector("#status");
const entryTitle = document.querySelector("#entry-title");
const relatedEl = document.querySelector("#related");
const inhabitantsEl = document.querySelector("#inhabitants");
const eventEl = document.querySelector("#event");

async function arkFetch(path, body = null) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Ark-Participant": participantId,
    },
    body: body ? JSON.stringify(body) : "{}",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || data.reason || "Ark movement failed");
  return data;
}

function render(data) {
  entryTitle.textContent = data.entry.title;
  statusEl.textContent = `${data.event.type} observed.`;
  relatedEl.innerHTML = data.related
    .map((entry) => `<button type="button" data-id="${entry.id}">${entry.title} <span>${entry.relation}</span></button>`)
    .join("");
  inhabitantsEl.innerHTML = data.inhabitants
    .map((item) => `<article><strong>${item.inhabitant}</strong><span>${item.response.symbol}</span></article>`)
    .join("");
  eventEl.textContent = JSON.stringify({
    type: data.event.type,
    relation: data.event.relation,
    localFrequency: data.event.localFrequency,
    trace: data.event.trace,
  }, null, 2);
}

enterButton.addEventListener("click", async () => {
  try {
    render(await arkFetch("/api/enter"));
  } catch (error) {
    statusEl.textContent = error.message;
  }
});

relatedEl.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  try {
    render(await arkFetch("/api/move", { to: button.dataset.id }));
  } catch (error) {
    statusEl.textContent = error.message;
  }
});
