# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML, CSS and JavaScript; charts are hand-drawn SVG with no chart library. Delivered two ways (user's choice, Oct 19, 2026): as a Claude Dashboard artifact (its own Sources panel, CSV download per figure, shared from its Share menu) and as one standalone, self-contained HTML file that can be emailed or uploaded. The standalone file is encrypted and opens with a username and password agreed with the user (Oct 19, 2026); the dashboard is gated by its sharing controls. Scope (user, Oct 19, 2026): the Clayface event only; island-wide context (early quits, XP, queue) is out.

## Users

The client team behind the Clayface event (contact: Lobotommy), reading the report first thing Monday morning. Their job: confirm that the Clayface limited-time event and its clay system worked on both islands, and trust the numbers enough to pass them on. TeraCreators (the studio that built the islands and the event) authors and sends the report.

## Product Purpose

A weekend analytics report for the Clayface event on two Fortnite (UEFN) islands, Havoc Hotel 3 and Havoc Hotel 2. It turns the Creator Portal exports into a few clear answers: how many Clayface fights happened, how many clays were collected, how many players reached the 20-clay goal and redeemed the Clay Goo Gun, and how much time players spent around Clayface content. Success: the client reads it in minutes, believes it, and can check any figure against its source file.

## Positioning

Every figure is computed from the island's own Creator Portal CSV exports, using custom analytics events TeraCreators built into the event (clayface_defeated, clayface_clay_collected, clayface_clay_goal_reached, clayface_weapon_redeemed, clayface_dwell_rooms_5s, clayface_dwell_lobby_5s). A generic analytics screenshot cannot show the clay funnel or the time spent near event content.

## Operating Context

- Source: Creator Portal, Análisis, Jugabilidad tab, CSV export per island (files: dispositivo_analítico, tasa_de_rebote, pe_en_el_juego, tiempo_en_cola, lo_más_destacado_cambios_de_la_versión).
- Reporting dates agreed with the client: Oct 16, Oct 20, Oct 27 and Oct 29, 2026, each by 10am PST. Portal data takes about 2 days to fill in.
- Event window Oct 8 to Oct 26, 2026. Analytics went live Oct 16 (HH3 v109 12:23 UTC-5, HH2 v79 12:05 UTC-5).

## Capabilities and Constraints

- The export gives daily event totals, not unique players. Goal reached and redemption fire once per player, so those two equal players.
- clayface_defeated counts every player in the fight; one fight drops one clay.
- Dwell time = dwell events x 5 seconds; lobby time includes idle players.
- The first tracked day is partial.
- Poster impressions: not in the Oct 19 exports (re-checked with a fresh download, identical files). Left out of the report at the user's request until the events are found.
- Unique players per event: not in the export. Open.

## Brand Commitments

- Map key art for Havoc Hotel 2 and Havoc Hotel 3 (yellow 3D logotype, Fortnite characters) appears on the page.
- TeraCreators is credited as the report's author.
- In-game names are used as written: Clayface, Clay Goo Gun, clays.

## Evidence on Hand

- Ten Creator Portal CSVs (5 per island), exported Oct 19, 2026, attached to the dashboard as sources.
- Key art: two thumbnails supplied by the user.
- No testimonials, unique-player counts, revenue or retention data. Do not invent them.

## Product Principles

1. Traceable before impressive: every number points to its file.
2. Client first: lead with the answer the client asked for, then the detail.
3. Say the limits plainly: partial days, totals vs players, what is not measured.
4. One identity per island, used the same way everywhere on the page.
