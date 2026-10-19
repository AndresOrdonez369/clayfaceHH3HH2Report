// Standalone bootstrap: the report markup and CSVs ship encrypted (PBKDF2-SHA256 -> AES-256-CBC + HMAC-SHA256,
// encrypt-then-MAC). The sign-in derives the keys, verifies the MAC, decrypts, then renders as usual.
(() => {
  const parse = text => {
    const rows = []; let row = [], cell = '', quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (quoted) {
        if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (ch === '"') quoted = false;
        else cell += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === ',') { row.push(cell); cell = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); cell = '';
        if (row.some(c => c !== '')) rows.push(row);
        row = [];
      } else cell += ch;
    }
    row.push(cell);
    if (row.some(c => c !== '')) rows.push(row);
    const [head, ...body] = rows;
    return body.map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
  };

  const vault = document.getElementById('vault');
  const form = document.getElementById('gate-form'), error = document.getElementById('gate-error'), go = form.querySelector('.gate-go');
  const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const say = text => { error.textContent = text; error.hidden = !text; };

  async function unlock(user, pass) {
    const subtle = crypto.subtle, v = vault.dataset;
    const base = await subtle.importKey('raw', new TextEncoder().encode(`${user.trim().toLowerCase()}\n${pass}`), 'PBKDF2', false, ['deriveBits']);
    const bits = new Uint8Array(await subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: b64(v.salt), iterations: Number(v.iter) }, base, 512));
    const iv = b64(v.iv), ct = b64(vault.textContent.trim());
    const signed = new Uint8Array(iv.length + ct.length);
    signed.set(iv); signed.set(ct, iv.length);
    const macKey = await subtle.importKey('raw', bits.slice(32), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    if (!await subtle.verify('HMAC', macKey, b64(v.mac), signed)) return null;
    const aesKey = await subtle.importKey('raw', bits.slice(0, 32), 'AES-CBC', false, ['decrypt']);
    return JSON.parse(new TextDecoder().decode(await subtle.decrypt({ name: 'AES-CBC', iv }, aesKey, ct)));
  }

  function open(payload) {
    const gate = document.getElementById('gate');
    gate.insertAdjacentHTML('afterend', payload.markup);
    gate.remove();
    scrollTo(0, 0);
    const store = {};
    for (const [id, text] of Object.entries(payload.csv)) store[id] = parse(text);
    for (const c of CALCS) store[c.id] = c.fn(...c.inputs.map(id => store[id]));
    const data = id => (id in store ? { status: 'ok', data: store[id] } : { status: 'missing', data: [] });
    const root = document.getElementById('report');
    const render = createReport(root, data);
    render();
    const title = root.querySelector('h1');
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
    let w = innerWidth;
    addEventListener('resize', () => { if (innerWidth !== w) { w = innerWidth; render(); } });
  }

  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    if (!window.crypto || !crypto.subtle) { say('This browser blocks decryption here. Open the file directly from your computer, or over https.'); return; }
    const { user, pass } = form.elements;
    if (!user.value.trim() || !pass.value) { say('Enter the username and password you were given.'); return; }
    say('');
    go.disabled = true;
    go.textContent = 'Opening…';
    try {
      const payload = await unlock(user.value, pass.value);
      if (payload) return open(payload);
      say('Username or password is incorrect. Check both and try again.');
      pass.select();
    } catch {
      say('This report could not be opened. The file may be damaged; ask TeraCreators for a fresh copy.');
    }
    go.disabled = false;
    go.textContent = 'Open report';
  });
})();
