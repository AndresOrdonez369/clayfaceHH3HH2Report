// Clayface Weekend Analytics: calculations from the raw Creator Portal rows, and the page renderer.
// Shared by the standalone file and the dashboard page; only the data loader differs.

const CATALOG = {
  hh3_analytics: ['S1', 'hh3_analytics_device.csv'], hh2_analytics: ['S2', 'hh2_analytics_device.csv'],
  hh3_releases: ['S3', 'hh3_release_notes.csv'], hh2_releases: ['S4', 'hh2_release_notes.csv']
};

const FIELD_SOURCE = {
  defeated: 'clayface_defeated column',
  clays: 'clayface_clay_collected column',
  reached: 'clayface_clay_goal_reached column',
  redeemed: 'clayface_weapon_redeemed column',
  redeemRate: 'weapon_redeemed ÷ clay_goal_reached',
  fightersPerClay: 'clayface_defeated ÷ clayface_clay_collected',
  totalHours: '(dwell_rooms_5s + dwell_lobby_5s) × 5 seconds',
  hoursPerFullDay: 'dwell events × 5 s, averaged over full days',
  roomHours: 'clayface_dwell_rooms_5s × 5 seconds',
  lobbyHours: 'clayface_dwell_lobby_5s × 5 seconds',
  roomShare: 'room dwell events ÷ all dwell events',
  rowsInFile: 'Days (rows) in the analytics export',
  daysTracked: 'Days with any Clayface event',
  eventsBeforeTracking: 'Clayface events dated before the first tracked day'
};

const CALCS = [
  {
    id: 'clayface_daily',
    title: 'Clayface events by day',
    description: 'Daily Clayface totals per island from the two analytics-device files; dwell events become hours at 5 seconds each. The first tracked day is marked partial.',
    inputs: ['hh3_analytics', 'hh2_analytics'],
    fn: (hh3_analytics, hh2_analytics) => {
      const num = s => Number(String(s ?? '0').replace(/\./g, '').replace(',', '.'));
      const day = r => r.Date ?? r['﻿Date'];
      const hours = events => Math.round(events * 5 / 360) / 10;
      const out = [];
      for (const [map, rows] of [['HH3', hh3_analytics], ['HH2', hh2_analytics]]) {
        const tracked = rows
          .filter(r => num(r.clayface_defeated) + num(r.clayface_dwell_rooms_5s) + num(r.clayface_dwell_lobby_5s) > 0)
          .sort((a, b) => (day(a) < day(b) ? -1 : 1));
        tracked.forEach((r, i) => {
          const roomEvents = num(r.clayface_dwell_rooms_5s), lobbyEvents = num(r.clayface_dwell_lobby_5s);
          out.push({ key: `${map} ${day(r)}`, map, day: day(r), partial: i === 0,
            defeated: num(r.clayface_defeated), clays: num(r.clayface_clay_collected),
            reached: num(r.clayface_clay_goal_reached), redeemed: num(r.clayface_weapon_redeemed),
            roomEvents, lobbyEvents, roomHours: hours(roomEvents), lobbyHours: hours(lobbyEvents) });
        });
      }
      return out;
    }
  },
  {
    id: 'clayface_totals',
    title: 'Clayface weekend totals',
    description: 'Totals per island and for both islands, with the redemption rate, players per clay, share of time in hotel rooms and hours per full day.',
    inputs: ['clayface_daily'],
    fn: (clayface_daily) => {
      const sum = (rows, f) => rows.reduce((s, r) => s + f(r), 0);
      const hours = events => Math.round(events * 5 / 360) / 10;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const label = d => `${months[Number(d.slice(5, 7)) - 1]} ${Number(d.slice(8, 10))}`;
      const days = clayface_daily.map(r => r.day).sort();
      const period = days.length ? `${label(days[0])} – ${label(days[days.length - 1])}, ${days[0].slice(0, 4)}` : '';
      const groups = [['HH3', clayface_daily.filter(r => r.map === 'HH3')], ['HH2', clayface_daily.filter(r => r.map === 'HH2')], ['Both', clayface_daily]];
      return groups.map(([map, rows]) => {
        const full = rows.filter(r => !r.partial);
        const room = sum(rows, r => r.roomEvents), lobby = sum(rows, r => r.lobbyEvents);
        const defeated = sum(rows, r => r.defeated), clays = sum(rows, r => r.clays);
        const reached = sum(rows, r => r.reached), redeemed = sum(rows, r => r.redeemed);
        return { map, period, defeated, clays, reached, redeemed,
          roomHours: hours(room), lobbyHours: hours(lobby), totalHours: hours(room + lobby),
          roomShare: room / (room + lobby), redeemRate: redeemed / reached,
          fightersPerClay: Math.round(defeated / clays * 10) / 10,
          hoursPerFullDay: map === 'Both' ? null : hours(sum(full, r => r.roomEvents + r.lobbyEvents) / full.length) };
      });
    }
  },
  {
    id: 'tracking_start',
    title: 'Release that added tracking',
    description: 'The release in each island\'s history whose note mentions analytics, with its version and publish time.',
    inputs: ['hh3_releases', 'hh2_releases'],
    fn: (hh3_releases, hh2_releases) => [['HH3', hh3_releases], ['HH2', hh2_releases]].map(([map, rows]) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const r = rows.find(x => /anal[iy]t/i.test(x['Nota de la versión'] ?? ''));
      if (!r) return { map, version: null, published: null, label: 'not found' };
      const p = r.Publicado, offset = p.slice(19, 22).replace(/^([+-])0/, '$1');
      return { map, version: Number(r['Número de versión']), published: p,
        label: `v${r['Número de versión']} · live ${months[Number(p.slice(5, 7)) - 1]} ${Number(p.slice(8, 10))}, ${p.slice(11, 16)} UTC${offset}` };
    })
  },
  {
    id: 'verification',
    title: 'Checks on the raw exports',
    description: 'Per island: days in the analytics file, its date range, the release that added tracking, days with Clayface data and Clayface events found before that day.',
    inputs: ['hh3_analytics', 'hh2_analytics', 'clayface_daily', 'tracking_start'],
    fn: (hh3_analytics, hh2_analytics, clayface_daily, tracking_start) => {
      const num = s => Number(String(s ?? '0').replace(/\./g, '').replace(',', '.'));
      const day = r => r.Date ?? r['﻿Date'];
      const cols = ['clayface_defeated', 'clayface_clay_collected', 'clayface_clay_goal_reached', 'clayface_weapon_redeemed', 'clayface_dwell_rooms_5s', 'clayface_dwell_lobby_5s'];
      return [['HH3', hh3_analytics], ['HH2', hh2_analytics]].map(([map, rows]) => {
        const days = rows.map(day).sort();
        const tracked = clayface_daily.filter(r => r.map === map).map(r => r.day).sort();
        const before = rows.filter(r => day(r) < tracked[0]).reduce((s, r) => s + cols.reduce((t, c) => t + num(r[c]), 0), 0);
        const start = tracking_start.find(r => r.map === map);
        return { map, rowsInFile: rows.length, firstDay: days[0], lastDay: days[days.length - 1],
          trackingRelease: start ? start.label : 'not found', daysTracked: tracked.length, eventsBeforeTracking: before };
      });
    }
  }
];

function createReport(root, data) {
  const ISLANDS = ['HH3', 'HH2'];
  const NAME = { HH3: 'Havoc Hotel 3', HH2: 'Havoc Hotel 2', Both: 'Both islands' };
  const COLOR = { HH3: 'var(--hh3)', HH2: 'var(--hh2)' };
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const SVG = 'http://www.w3.org/2000/svg';
  const int = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
  const one = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const shortDay = d => `${MONTHS[Number(d.slice(5, 7)) - 1]} ${Number(d.slice(8, 10))}`;
  const FMT = { int: v => int.format(v), hours: v => one.format(v), pct: v => `${one.format(v * 100)}%`, dec: v => one.format(v), day: shortDay, text: String };
  const show = (fmt, v) => (v == null || Number.isNaN(v) ? '—' : FMT[fmt](v));
  const failed = d => ['error', 'connect', 'declined', 'missing'].includes(d.status);
  const tip = root.querySelector('.tip');

  const rowFor = (rows, where) => {
    const want = [...new URLSearchParams(where || '')];
    return rows.find(r => want.every(([k, v]) => String(r[k]) === v));
  };

  // Datasets a value rests on, narrowed to one island when the value belongs to one.
  const leaves = id => (CATALOG[id] ? [id] : (CALCS.find(c => c.id === id)?.inputs ?? []).flatMap(leaves));
  const sourcesOf = (ids, island) => [...new Set(ids.flatMap(leaves))]
    .filter(ds => !island || island === 'Both' || ds.startsWith(island.toLowerCase()));

  function fillMarks() {
    root.querySelectorAll('[data-fmt]').forEach(el => {
      const d = data(el.dataset.source);
      const row = d.status === 'ok' ? rowFor(d.data, el.dataset.where) : null;
      el.classList.toggle('dash-skeleton', d.status === 'loading');
      el.textContent = row ? show(el.dataset.fmt, row[el.dataset.field]) : '—';
      if (el.hasAttribute('data-cite')) el.tabIndex = 0;
    });
  }

  function fillTable(id, cols) {
    const table = root.querySelector(`#${id}`), body = table.tBodies[0], d = data(table.dataset.source);
    body.replaceChildren();
    if (d.status !== 'ok') return;
    const heads = [...table.tHead.rows[0].cells].map(th => th.textContent);
    for (const r of d.data) {
      const tr = body.insertRow();
      tr.dataset.key = r[table.dataset.rowKey];
      cols.forEach(([field, text, numeric], i) => {
        const td = tr.insertCell();
        if (field === 'map') {
          const chip = document.createElement('span'), long = document.createElement('span'), short = document.createElement('span');
          chip.className = 'chip';
          long.className = 'long'; long.textContent = NAME[r.map] ?? r.map;
          short.className = 'short'; short.textContent = r.map;
          chip.append(long, short);
          td.append(chip);
        } else {
          td.textContent = text(r[field], r);
        }
        if (numeric) {
          td.className = 'num';
          Object.assign(td.dataset, { cite: '', source: r.src ?? table.dataset.source, field, where: `map=${r.map}`, label: r.metric ?? heads[i] });
          td.tabIndex = 0;
        }
      });
    }
  }

  const el = (name, attrs = {}, text) => {
    const node = document.createElementNS(SVG, name);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (text != null) node.textContent = text;
    return node;
  };
  const niceMax = (v, target) => {
    const raw = v / target, mag = 10 ** Math.floor(Math.log10(raw)), step = [1, 2, 2.5, 5, 10].find(s => s * mag >= raw) * mag;
    const ticks = Math.ceil(v / step);
    return { step, ticks, max: step * ticks };
  };

  function prepareChart(id) {
    const box = root.querySelector(`#${id}`);
    const d = data(box.dataset.source.split(' ')[0]);
    box.querySelector('svg')?.remove();
    box.querySelector('.fail')?.remove();
    box.classList.toggle('dash-skeleton', d.status === 'loading');
    if (failed(d)) {
      const f = document.createElement('div');
      f.className = 'fail';
      f.textContent = 'Failed to load';
      box.append(f);
    }
    return { box, d, width: Math.max(320, box.clientWidth) };
  }

  function grid(svg, y, x0, x1, ticks, step, format) {
    for (let i = 0; i <= ticks; i++) {
      const v = i * step;
      svg.append(el('line', { x1: x0, x2: x1, y1: y(v), y2: y(v), stroke: i === 0 ? 'var(--ink)' : 'var(--rule-2)', 'stroke-width': i === 0 ? 1.5 : 1 }));
      svg.append(el('text', { x: x0 - 8, y: y(v) + 4, 'text-anchor': 'end', class: 'tick' }, format(v)));
    }
  }

  function drawDwell() {
    const { box, d, width: W } = prepareChart('dwell-chart');
    if (d.status !== 'ok' || !d.data.length) return;
    const rows = d.data, H = 320, m = { l: 58, r: 8, t: 26, b: 54 };
    const days = [...new Set(rows.map(r => r.day))].sort();
    const total = r => r.roomHours + r.lobbyHours;
    const { step, ticks, max } = niceMax(Math.max(...rows.map(total)) * 1.08, 5);
    const y = v => H - m.b - (v / max) * (H - m.t - m.b);
    const gw = (W - m.l - m.r) / days.length, bw = Math.min(64, gw * 0.3), gap = Math.min(10, gw * 0.05);
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' });
    grid(svg, y, m.l, W - m.r, ticks, step, v => `${int.format(v)} h`);
    days.forEach((day, gi) => {
      const cx = m.l + gw * gi + gw / 2;
      ISLANDS.forEach((map, i) => {
        const r = rows.find(x => x.day === day && x.map === map);
        if (!r) return;
        const x = i === 0 ? cx - gap / 2 - bw : cx + gap / 2;
        const g = el('g');
        g.append(el('rect', { x, y: y(r.roomHours), width: bw, height: y(0) - y(r.roomHours), fill: COLOR[map] }));
        g.append(el('rect', { x, y: y(total(r)), width: bw, height: y(r.roomHours) - y(total(r)), fill: COLOR[map], 'fill-opacity': 0.35 }));
        g.append(el('text', { x: x + bw / 2, y: y(total(r)) - 7, 'text-anchor': 'middle', class: 'val' }, int.format(total(r))));
        g.append(el('text', { x: x + bw / 2, y: H - m.b + 17, 'text-anchor': 'middle', class: 'tick' }, map));
        const hit = el('rect', { x, y: m.t, width: bw, height: H - m.t - m.b, fill: 'transparent', tabindex: 0 });
        const [ref, file] = CATALOG[`${map.toLowerCase()}_analytics`];
        const lines = [`${NAME[map]} · ${shortDay(day)}${r.partial ? ' (partial)' : ''}`, `Rooms ${one.format(r.roomHours)} h · lobby ${one.format(r.lobbyHours)} h`, `${ref} · ${file}`];
        const enter = () => { showTip(hit, lines); light([ref]); };
        hit.addEventListener('pointerenter', enter);
        hit.addEventListener('focus', enter);
        hit.addEventListener('pointerleave', hideTip);
        hit.addEventListener('blur', hideTip);
        g.append(hit);
        svg.append(g);
      });
      svg.append(el('text', { x: cx, y: H - m.b + 40, 'text-anchor': 'middle', class: 'daylab' }, `${shortDay(day)}${rows.some(r => r.day === day && r.partial) ? ' (partial)' : ''}`));
    });
    box.prepend(svg);
  }

  function showTip(target, lines, ev) {
    const [head, ...rest] = lines;
    const b = document.createElement('b');
    b.textContent = head;
    tip.replaceChildren(b, ...rest.map(line => { const s = document.createElement('span'); s.textContent = line; return s; }));
    tip.hidden = false;
    const r = root.getBoundingClientRect(), a = target.getBoundingClientRect();
    const cx = ev ? ev.clientX : a.left + a.width / 2, top = ev ? ev.clientY - 12 : a.top;
    const left = Math.max(8, Math.min(cx - r.left - tip.offsetWidth / 2, root.clientWidth - tip.offsetWidth - 8));
    tip.style.left = `${left}px`;
    tip.style.top = `${Math.max(8, top - r.top - tip.offsetHeight - 10)}px`;
  }
  function hideTip() {
    tip.hidden = true;
    root.querySelectorAll('.cat.lit').forEach(c => c.classList.remove('lit'));
  }

  const light = refs => root.querySelectorAll('.cat[data-cat]').forEach(c => c.classList.toggle('lit', refs.includes(c.dataset.cat)));

  // The signature move: any figure names its file and lights its catalog number.
  function cite(ev) {
    const target = ev.target.closest('[data-cite]');
    if (!target || !root.contains(target)) return;
    const island = new URLSearchParams(target.dataset.where || '').get('map');
    const ds = sourcesOf(target.dataset.source.split(' '), island);
    const refs = ds.map(id => CATALOG[id][0]);
    light(refs);
    showTip(target, [refs.join(' + '), ds.map(id => CATALOG[id][1]).join(', '), FIELD_SOURCE[target.dataset.field] ?? target.dataset.label ?? target.dataset.field]);
  }
  root.addEventListener('pointerover', cite);
  root.addEventListener('focusin', cite);
  root.addEventListener('pointerout', ev => { if (ev.target.closest('[data-cite]')) hideTip(); });
  root.addEventListener('focusout', ev => { if (ev.target.closest('[data-cite]')) hideTip(); });

  // Tabs follow the reader.
  const tabs = [...root.querySelectorAll('.tabs a')];
  const sections = tabs.map(a => root.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const visible = new Set();
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      const current = sections.find(s => visible.has(s));
      if (current) tabs.forEach(a => a.classList.toggle('on', a.getAttribute('href') === `#${current.id}`));
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => io.observe(s));
  }

  let pressed = false;
  return function render() {
    fillMarks();
    fillTable('time-table', [['map'], ['roomHours', v => show('hours', v), true], ['lobbyHours', v => show('hours', v), true], ['roomShare', v => show('pct', v), true]]);
    fillTable('daily-table', [['map'], ['day', (v, r) => `${shortDay(v)}${r.partial ? ' · partial' : ''}`], ['defeated', v => show('int', v), true], ['clays', v => show('int', v), true], ['reached', v => show('int', v), true], ['redeemed', v => show('int', v), true], ['roomHours', v => show('hours', v), true], ['lobbyHours', v => show('hours', v), true]]);
    fillTable('verify-table', [['map'], ['rowsInFile', v => show('int', v), true], ['firstDay', v => shortDay(v)], ['lastDay', v => shortDay(v)], ['trackingRelease', v => v], ['daysTracked', v => show('int', v), true], ['eventsBeforeTracking', v => show('int', v), true]]);
    drawDwell();
    if (!pressed && data('clayface_totals').status === 'ok') {
      pressed = true;
      root.querySelectorAll('.stamp').forEach(s => s.classList.add('pressed'));
    }
  };
}
