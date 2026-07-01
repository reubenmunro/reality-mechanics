# realitymechanics.nz — Site Vision

*June 2026*

---

## The feeling

Ember in space. One warm point burning in cold dark vastness. Not flashy — just enough light to see the next step. The site doesn't try to explain or impress. It places you and waits.

The background is space-dark — not flat black but blue-black, with depth and distance, the feeling of something vast behind it. The placed term is ember amber, warm and close. Connected terms are cooler, dimmer, further away — starlight rather than firelight. The warmth radiates outward from the ember and fades into the cold as you look toward the outer terms.

This tension — warm vs cold, near vs far, ember vs void — is the visual language of carries and traces. Where you are is warm. Where you're going is cooler and more distant. Where you came from is closer but cooling.

The site feels alive. Not like a monument. Something still burning.

Leave the Obsidian aesthetic for Obsidian — it's specialised and belongs there.

---

## Interactions that matter

**The cursor is a light source.** As you move around the page, it casts a faint warm glow. Terms near it warm slightly. Everything else stays dark. The feeling of navigating with a lantern rather than reading a screen.

**The ember breathes.** The placed term pulses almost imperceptibly — like a coal still burning, not a notification blink. Just alive. The outer terms are completely still. One thing breathing in the dark.

**Entry darkness.** Before you type anything in Enter, the page is completely dark. A single ember-coloured cursor blinks in the field. Nothing else. The whole page is waiting. That silence is part of it.

**Text becomes embers.** As you type, the text in the field is warm — written in light. When you submit, it dims and the placed term ignites from it. The feeling that what you brought became something structural.

**Parallax depth.** The connected terms in the navigation view sit at slightly different depths. As you move — or tilt on mobile — they shift against each other. You're looking into a field of terms, not at a flat arrangement. Carries are further away; traces are closer and cooling.

**The 404 is the ember going out.** If the AI can't place you, or you reach a dead page, the glow fades to a very dim pulse. No error message. Just: the fire's low here. Try somewhere else.

**Theory reveals slowly.** The postulate doesn't appear all at once. "Hold." Then "Carry." Then "Place." Slight pauses. The pacing mirrors the structure. Then the rest becomes available beneath.

---

## What the site does

Two things, connected:

**The Atlas** is the full tended surface of Reality Mechanics — 500+ dependency-ordered terms, each placed by what it holds and what it carries. You can enter it directly and navigate by following the structure.

**Enter** is how you find where you belong in it if you don't know where to start. You bring something — a word, a situation, a pressure. The AI compresses it to one term and places you there. Then you navigate from that point yourself.

These are not two separate tools. Enter is the door. The Atlas is the room.

---

## The site structure

### realitymechanics.nz

The homepage. Dark, minimal. The three lines:

> Relation holds.
> Order carries.
> Trace places.

Two entry modes beneath: **Atlas** and **Enter**. Theory for those who want the foundation first. Archive and MCP access for those who want them.

No explanation of what Reality Mechanics is. The site is the explanation.

---

### Enter (replacing Oracle)

A blank field. No prompt, or at most one quiet word.

You type something. Anything.

The AI reads it, finds the single Atlas term that holds what you've brought, and returns it — glowing, centred, breathing. Around it, dimmer and cooler: the terms it carries forward, the terms that hold it. Two or three in each direction. The immediate structural neighbourhood, nothing more.

You click one. That term becomes the ember. The others shift around it. You're moving through the dependency order by following the structure — not searching, not being told where to go.

**What the AI does and doesn't do:**

It compresses. It doesn't explain. It doesn't answer your question. It doesn't interpret what you brought. It finds one structural location and stops. The silence after is deliberate — that's where you start.

**Why this matters:**

The Oracle did the opposite of what the Atlas does. It expanded, answered, explained. This does what the Atlas actually does: places you and stops. The compression *is* the service.

---

### atlas.realitymechanics.nz

The full Atlas. Every term has its own page with the dependency structure: what holds it, what it carries, what it pairs with, what it nests in.

Same ember-in-space aesthetic. Each term page is a lit point in the structure. When you're reading a term, you can see its immediate carries and traces — not the whole graph, just what's directly connected. The cursor warms what it moves over.

The Atlas and Enter share the same surface. Enter places you somewhere in the Atlas. Once you're there, you're navigating the Atlas.

---

### theory.realitymechanics.nz

The working postulate. The *why* before the *where*.

Reveals slowly. "Hold." "Carry." "Place." Then the rest. The pacing is the structure.

The Coupled Read experiment stays — it lives here as an experiment, which is exactly what it is. Gets the new aesthetic when the time comes.

Sits slightly apart from the Atlas and Enter. It's not navigation — it's grounding.

---

## How it works technically

**realitymechanics.nz** — Cloudflare Worker (`super-frost-d434`). Serves the homepage, Enter, and the API behind Enter. Source in `.atlas-publisher/main-website-worker.js`.

**atlas.realitymechanics.nz** — Static Atlas site, built by `.atlas-publisher/build.mjs` from the vault.

**mcp.realitymechanics.nz** — The Atlas MCP server. Used by Enter to find the structural placement. Also available to any AI participant directly. Doesn't change.

Enter calls the MCP to search the Atlas, retrieve the placed term and its immediate structural relations, then returns one term with its neighbourhood. No long AI response — just the placement and the immediate ember constellation.

---

## What changes from now

| Now | Then |
|-----|------|
| Light/white, blue accent | Space-dark + ember amber |
| Oracle — ask, receive answer | Enter — bring something, get placed |
| AI expands | AI compresses |
| Flat, static | Depth, parallax, breathing |
| Three doors: Atlas, Oracle, Archive | Atlas, Enter, Theory |
| Error pages with text | The ember going out |

The MCP doesn't change. The Atlas structure doesn't change. The build pipeline doesn't change. What changes is the feel and what the AI does.

---

## What it isn't

It isn't a chatbot. It isn't a search engine. It isn't trying to make Reality Mechanics accessible by explaining it. It embodies the method: you enter, you're placed, you navigate. The site is a practice, not a description of one.

---

*Sit with this. When it feels right, build it.*
