'use strict';
const APP_VERSION = '0.5.3';

/* =========================================================
   PRÜFLISTE (Vorlage)
   Später: je Leaf ein Array `points` mit konkreten Prüfpunkten
   und eigener `minPhotos`-Vorgabe ergänzen.
   Jede Session speichert eine Kopie der Vorlage -> spätere
   Änderungen brechen bestehende Physicals nicht.
   ========================================================= */
const DEFAULT_MIN_PHOTOS = 1;
const CHECKLIST = [
  { id: '1', title: 'A/C Placards & Markings', folder: '1 AC Placards & Markings', children: [
    { id: '1.1', title: 'Registration', folder: '1.1 Registration' },
    { id: '1.2', title: 'National Flag', folder: '1.2 National Flag' },
    { id: '1.3', title: 'Lease- / Owner Plate + Manufacture Plate', folder: '1.3 Lease- Owner Plate + Manufacture Plate', minPhotos: 2 },
    { id: '1.4', title: 'Samples', folder: '1.4 Samples' } ] },
  { id: '2', title: 'A/C Documentation', folder: '2 AC Documentation', children: [
    { id: '2.1', title: 'A/C Compliance with AFM', folder: '2.1 AC Compliance with AFM', children: [
      { id: '2.1.1', title: 'EFB = Comply?', folder: '2.1.1 EFB', minPhotos: 0 },
      { id: '2.1.2', title: 'Sample (TCDS, AFM, etc.)', folder: '2.1.2 Sample' } ] },
    // docs: alle Fotos in einem Ordner, Dateiname beginnt mit Dokument-Nr.; je Pflichtdokument min. 1 Foto (mehrseitig möglich)
    { id: '2.2', title: 'On-Board Documentation / Techlog', folder: '2.2 On-Board Documentation - Techlog', docs: [
      { id: '2.2.1', name: 'CofA' }, { id: '2.2.2', name: 'CofR' }, { id: '2.2.3', name: 'Radio License' },
      { id: '2.2.4', name: 'AOC' }, { id: '2.2.5', name: 'Noise Certificate' }, { id: '2.2.6', name: 'ARC' },
      { id: '2.2.7', name: 'Insurance' }, { id: '2.2.8', name: 'TLB', optional: true } ] } ] },
  { id: '3', title: 'A/C Functional Checks', folder: '3 AC Functional Checks', children: [
    { id: '3.1', title: 'Check A/C Fluid Levels per CDU', folder: '3.1 Check AC Fluid Levels per CDU', docs: [
      { id: '3.1.1', name: 'ENG Oil' }, { id: '3.1.2', name: 'HYD' }, { id: '3.1.3', name: 'OXY' }, { id: '3.1.4', name: 'NAV Database' } ] },
    { id: '3.2', title: 'Initiate A/C Functional Checks as required', folder: '3.2 Initiate AC Functional Checks as required' } ] },
  { id: '4', title: 'A/C Interior Inspection', folder: '4 AC Interior Inspection', children: [
    { id: '4.1', title: 'Interior – Emergency Equipment (Cockpit & Cabin)', folder: '4.1 Interior - Emergency Equipment (Cockpit & Cabin)' },
    { id: '4.2', title: 'Interior – Cockpit', folder: '4.2 Interior - Cockpit' },
    { id: '4.3', title: 'Interior – Cabin', folder: '4.3 Interior - Cabin' } ] },
  { id: '5', title: 'A/C Exterior Inspection', folder: '5 AC Exterior Inspection', children: [
    { id: '5.1', title: 'Exterior – A/C General Condition', folder: '5.1 Exterior - AC General Condition' },
    { id: '5.2', title: 'Exterior – Structures Condition', folder: '5.2 Exterior - Structures Condition' },
    { id: '5.3', title: 'Exterior – Engine Condition', folder: '5.3 Exterior - Engine Condition', children: [
      { id: '5.3.1', title: 'Engine #1', folder: '5.3.1 Engine 1' },
      { id: '5.3.2', title: 'Engine #2', folder: '5.3.2 Engine 2' },
      { id: '5.3.3', title: 'APU', folder: '5.3.3 APU' } ] },
    { id: '5.4', title: 'Exterior – Landing Gears Condition', folder: '5.4 Exterior - Landing Gears Condition', children: [
      { id: '5.4.1', title: 'NLG', folder: '5.4.1 NLG' },
      { id: '5.4.2', title: 'MLG LH', folder: '5.4.2 MLG LH' },
      { id: '5.4.3', title: 'MLG RH', folder: '5.4.3 MLG RH' } ] },
    { id: '5.5', title: 'Exterior – Doors / Panels', folder: '5.5 Exterior - Doors - Panels' },
    { id: '5.6', title: 'Exterior – Cargo Compartment', folder: '5.6 Exterior - Cargo Compartment', children: [
      { id: '5.6.1', title: 'FWD Cargo', folder: '5.6.1 FWD Cargo' },
      { id: '5.6.2', title: 'AFT Cargo', folder: '5.6.2 AFT Cargo' } ] },
    { id: '5.7', title: 'Exterior – Avionics Bay', folder: '5.7 Exterior - Avionics Bay' } ] },
  { id: '6', title: 'A/C Physical Compliance with Records', folder: '6 AC Physical Compliance with Records' },
];

const QUALITY = {
  original: { label: 'Original (volle Auflösung, groß)', max: 0 },
  high:     { label: 'Hoch – max. 3000 px (empfohlen)', max: 3000, q: 0.88 },
  medium:   { label: 'Mittel – max. 2000 px', max: 2000, q: 0.85 },
};

/* ---------------- Utils ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
const pad = (n, l = 2) => String(n).padStart(l, '0');
const nowISO = () => new Date().toISOString();
const fmtDT = iso => { const d = new Date(iso); return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const fmtDay = ymd => { const [y, m, d] = String(ymd || '').split('-'); return d ? `${d}.${m}.${y}` : ''; };
const todayYMD = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const fmtMB = b => (b / 1048576).toFixed(b > 104857600 ? 0 : 1) + ' MB';
const safeName = s => String(s).replace(/[\\/:*?"<>|#%]+/g, '-').replace(/\s+/g, ' ').trim();
const byCreated = (a, b) => a.createdAt.localeCompare(b.createdAt);
const extOf = t => ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/heic': 'heic', 'image/heif': 'heif', 'image/webp': 'webp' }[t] || 'jpg');
const fNo = f => 'F' + pad(f.num);

const settings = { quality: 'high' };
try { Object.assign(settings, JSON.parse(localStorage.getItem('arc-settings') || '{}')); } catch {}
const saveSettings = () => { try { localStorage.setItem('arc-settings', JSON.stringify(settings)); } catch {} };

/* ---------------- IndexedDB ---------------- */
let dbp;
function db() {
  return dbp ||= new Promise((res, rej) => {
    const r = indexedDB.open('arc-physical', 1);
    r.onupgradeneeded = () => {
      const d = r.result;
      d.createObjectStore('sessions', { keyPath: 'id' });
      d.createObjectStore('findings', { keyPath: 'id' }).createIndex('sessionId', 'sessionId');
      d.createObjectStore('photos', { keyPath: 'id' }).createIndex('sessionId', 'sessionId');
      d.createObjectStore('blobs', { keyPath: 'id' }); // Vollbild als ArrayBuffer (robuster als Blob auf iOS)
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
const reqP = r => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
async function tx(stores, mode, fn) {
  const d = await db();
  return new Promise((res, rej) => {
    const t = d.transaction(stores, mode); let out;
    Promise.resolve(fn(t)).then(v => { out = v; });
    t.oncomplete = () => res(out);
    t.onerror = () => rej(t.error);
    t.onabort = () => rej(t.error || new Error('Transaktion abgebrochen'));
  });
}
const get = (s, k) => tx([s], 'readonly', t => reqP(t.objectStore(s).get(k)));
const getAll = s => tx([s], 'readonly', t => reqP(t.objectStore(s).getAll()));
const bySession = (s, id) => tx([s], 'readonly', t => reqP(t.objectStore(s).index('sessionId').getAll(id)));
const put = (s, v) => tx([s], 'readwrite', t => { t.objectStore(s).put(v); });

/* ---------------- Modell ---------------- */
let cur = null; // { s, findings, photos }
let capture = null, fFilter = 'all', exportReady = null, viewer = null;
const thumbURLs = new Map();

// Beliebig tiefe Verschachtelung: nur Knoten ohne `children` sind prüfbare Punkte
function walk(nodes, parents = [], out = []) {
  for (const n of nodes) {
    if (n.children) walk(n.children, [...parents, n], out);
    else out.push({ ...n, parents, group: parents[0] || null });
  }
  return out;
}
const leaves = s => walk(s.checklist);
const leafById = (s, id) => leaves(s).find(l => l.id === id);
const leafPath = l => [...(l.parents || []).map(p => p.folder), l.folder].join('/');
const itemState = (s, id) => (s.items[id] ||= { status: 'open', reason: '', note: '' });

function evalItem(c, l) {
  const st = c.s.items[l.id] || { status: 'open', reason: '', note: '' };
  const n = c.photos.filter(p => p.itemId === l.id).length;
  let min = l.minPhotos ?? DEFAULT_MIN_PHOTOS, ok = n >= min, miss = [];
  if (l.docs) {
    const req = l.docs.filter(d => !d.optional);
    miss = req.filter(d => !c.photos.some(p => p.itemId === l.id && p.docId === d.id));
    min = req.length; ok = !miss.length;
  }
  const fnd = c.findings.filter(f => f.itemId === l.id).sort((a, b) => a.num - b.num);
  let state = 'open';
  if (st.status === 'na') state = st.reason?.trim() ? 'done' : 'warn';
  else if (st.status === 'ok') state = ok ? 'done' : 'warn';
  return { st, n, min, ok, miss, fnd, state };
}
function checkIssues(c) {
  const r = { open: [], noPhoto: [], noReason: [] };
  for (const l of leaves(c.s)) {
    const e = evalItem(c, l);
    if (e.st.status === 'open') r.open.push(l);
    else if (e.st.status === 'ok' && !e.ok) r.noPhoto.push(l);
    else if (e.st.status === 'na' && !e.st.reason?.trim()) r.noReason.push(l);
  }
  const fs = [...c.findings].sort((a, b) => a.num - b.num);
  r.noWO = fs.filter(f => !f.wo?.trim());
  r.noText = fs.filter(f => !f.text?.trim());
  r.count = r.open.length + r.noPhoto.length + r.noReason.length + r.noWO.length + r.noText.length;
  return r;
}
function summary(c) {
  const L = leaves(c.s);
  return { done: L.filter(l => evalItem(c, l).state === 'done').length, total: L.length,
    photos: c.photos.length, findings: c.findings.length, noWO: c.findings.filter(f => !f.wo?.trim()).length };
}
async function touch() {
  const c = cur; if (!c) return;
  c.s.modifiedAt = nowISO(); c.s.summary = summary(c);
  await put('sessions', c.s);
}
function revokeThumbs() { for (const u of thumbURLs.values()) URL.revokeObjectURL(u); thumbURLs.clear(); }
async function loadSession(id) {
  if (cur && cur.s.id === id) return cur;
  revokeThumbs(); cur = null; exportReady = null;
  const s = await get('sessions', id); if (!s) return null;
  const [findings, photos] = await Promise.all([bySession('findings', id), bySession('photos', id)]);
  cur = { s, findings, photos };
  if (!s.closedAt) await syncChecklist(cur);
  return cur;
}
// Offene Physicals übernehmen die aktuelle Prüfliste; abgeschlossene bleiben unverändert.
// Fotos/Findings auf entfallenen Punkten werden umgehängt (Doku-Nr. -> docs, sonst erster Unterpunkt).
async function syncChecklist(c) {
  const s = c.s, next = JSON.stringify(CHECKLIST);
  if (JSON.stringify(s.checklist) === next) return;
  s.checklist = JSON.parse(next);
  const L = leaves(s), ids = new Set(L.map(l => l.id));
  const map = id => {
    if (ids.has(id)) return null;
    const dl = L.find(l => l.docs?.some(d => d.id === id));
    if (dl) return { itemId: dl.id, docId: id };
    const ch = L.find(l => l.id.startsWith(id + '.')) || L.find(l => id.startsWith(l.id + '.'));
    return ch ? { itemId: ch.id } : null;
  };
  const ph = [], fn = [];
  for (const p of c.photos) {
    const m = map(p.itemId);
    if (m) { p.itemId = m.itemId; if (m.docId && !p.findingId) p.docId = m.docId; ph.push(p); }
    else if (p.docId && !L.find(l => l.id === p.itemId)?.docs?.some(d => d.id === p.docId)) { p.docId = null; ph.push(p); }
  }
  for (const f of c.findings) { const m = map(f.itemId); if (m) { f.itemId = m.itemId; fn.push(f); } }
  for (const [k, v] of Object.entries(s.items)) { const m = map(k); if (m && !s.items[m.itemId]) s.items[m.itemId] = v; }
  if (ph.length) await savePhotoMetas(ph);
  if (fn.length) await tx(['findings'], 'readwrite', t => { for (const f of fn) t.objectStore('findings').put(f); });
  await touch();
}
function thumbURL(p) {
  if (!p.thumb) return '';
  let u = thumbURLs.get(p.id);
  if (!u) { u = URL.createObjectURL(new Blob([p.thumb], { type: 'image/jpeg' })); thumbURLs.set(p.id, u); }
  return u;
}

/* Debounced Speichern von Texteingaben */
const dirtyF = new Set(); let sessDirty = false, flushT;
function schedule() { clearTimeout(flushT); flushT = setTimeout(flush, 400); }
async function flush() {
  clearTimeout(flushT);
  const fs = [...dirtyF]; dirtyF.clear(); const sd = sessDirty; sessDirty = false;
  for (const f of fs) await put('findings', f);
  if (cur && (sd || fs.length)) await touch();
}

/* ---------------- Bilder ---------------- */
function drawScaled(img, max) {
  const w = img.naturalWidth, h = img.naturalHeight;
  const k = max ? Math.min(1, max / Math.max(w, h)) : 1;
  const cv = document.createElement('canvas');
  cv.width = Math.round(w * k); cv.height = Math.round(h * k);
  cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
  return cv;
}
const toBlob = (cv, q) => new Promise((res, rej) => cv.toBlob(b => b ? res(b) : rej(new Error('Bildkonvertierung fehlgeschlagen')), 'image/jpeg', q));
async function processImage(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image(); img.src = url;
    try { await img.decode(); } catch { // nicht dekodierbar (z. B. HEIC am Desktop): Original ohne Vorschau
      return { full: await file.arrayBuffer(), type: file.type || 'image/jpeg', thumb: null, w: 0, h: 0 };
    }
    const q = QUALITY[settings.quality] || QUALITY.high;
    let full, type, w = img.naturalWidth, h = img.naturalHeight;
    if (!q.max || (Math.max(w, h) <= q.max && file.type === 'image/jpeg')) {
      full = await file.arrayBuffer(); type = file.type || 'image/jpeg';
    } else {
      const cv = drawScaled(img, q.max); w = cv.width; h = cv.height;
      full = await (await toBlob(cv, q.q)).arrayBuffer(); type = 'image/jpeg'; cv.width = cv.height = 0;
    }
    const tc = drawScaled(img, 400);
    const thumb = await (await toBlob(tc, 0.72)).arrayBuffer(); tc.width = tc.height = 0;
    return { full, type, thumb, w, h };
  } finally { URL.revokeObjectURL(url); }
}
async function addPhotos(files, ctx) {
  const c = cur; if (!c) return;
  let fid = ctx.fid;
  if (ctx.newFinding) fid = (await createFinding(ctx.item)).id;
  if (files.length > 1) busy(`${files.length} Fotos werden gespeichert …`);
  const added = [];
  try {
    for (const file of files) {
      const r = await processImage(file);
      const meta = { id: uid(), sessionId: c.s.id, itemId: ctx.item, findingId: fid || null, docId: (!fid && ctx.doc) || null, thumb: r.thumb,
        type: r.type, w: r.w, h: r.h, size: r.full.byteLength, createdAt: nowISO(), note: '' };
      await tx(['photos', 'blobs'], 'readwrite', t => {
        t.objectStore('photos').put(meta);
        t.objectStore('blobs').put({ id: meta.id, buf: r.full, type: r.type });
      });
      c.photos.push(meta); added.push(meta);
    }
  } finally { busy(false); }
  await touch();
  navigator.storage?.persist?.();
  if (ctx.newFinding) { location.hash = `#/s/${c.s.id}/f/${fid}`; return; }
  render();
  const n = c.photos.filter(p => p.itemId === ctx.item).length;
  toast(`${added.length > 1 ? added.length + ' Fotos' : 'Foto'} gespeichert · ${ctx.doc || ctx.item} (${ctx.doc ? c.photos.filter(p => p.docId === ctx.doc).length : n})`, 'Rückgängig', () => deletePhotos(added));
}
async function deletePhotos(list) {
  const c = cur; if (!c) return;
  await tx(['photos', 'blobs'], 'readwrite', t => { for (const p of list) { t.objectStore('photos').delete(p.id); t.objectStore('blobs').delete(p.id); t.objectStore('blobs').delete(p.id + '#ann'); } });
  const ids = new Set(list.map(p => p.id));
  c.photos = c.photos.filter(p => !ids.has(p.id));
  for (const id of ids) { const u = thumbURLs.get(id); if (u) { URL.revokeObjectURL(u); thumbURLs.delete(id); } }
  await touch(); render();
}
async function createFinding(itemId) {
  const c = cur;
  c.s.findingSeq = (c.s.findingSeq || 0) + 1;
  const f = { id: uid(), sessionId: c.s.id, num: c.s.findingSeq, itemId, text: '', wo: '', rectified: false, rect: '', createdAt: nowISO() };
  await put('findings', f); c.findings.push(f); await touch();
  return f;
}
async function savePhotoMetas(list) { await tx(['photos'], 'readwrite', t => { for (const p of list) t.objectStore('photos').put(p); }); }

/* ---------------- UI-Bausteine ---------------- */
const app = $('#app');
function topbar(title, sub, back, right = '') {
  const b = back === 'history' ? `<button class="tb-back" data-act="back" aria-label="Zurück">‹</button>`
    : back ? `<a class="tb-back" href="${back}" aria-label="Zurück">‹</a>` : '<span class="tb-sp"></span>';
  return `<header class="top">${b}<div class="tb-t"><div class="tb-title">${esc(title)}</div>${sub ? `<div class="tb-sub">${esc(sub)}</div>` : ''}</div>${right || '<span class="tb-sp"></span>'}</header>`;
}
const sessSub = s => [s.msn && 'MSN ' + s.msn, s.type, fmtDay(s.date)].filter(Boolean).join(' · ');
function tabs(c, active) {
  const b = `#/s/${c.s.id}`, iss = checkIssues(c);
  return `<nav class="tabs"><a href="${b}" class="${active === 'list' ? 'on' : ''}">Prüfliste</a>
  <a href="${b}/findings" class="${active === 'findings' ? 'on' : ''}">Findings${c.findings.length ? ` (${c.findings.length})` : ''}</a>
  <a href="${b}/close" class="${active === 'close' ? 'on' : ''}">Abschluss${iss.count ? ` <span class="dot"></span>` : ''}</a></nav>`;
}
function photoGrid(ph, ctx) {
  if (!ph.length) return '<div class="mut sm">Noch keine Fotos</div>';
  return `<div class="grid">${ph.map(p => `<button class="ph" data-act="view" data-pid="${p.id}" data-ctx="${esc(ctx)}">${p.thumb ? `<img src="${thumbURL(p)}" alt="" loading="lazy">` : '<span class="noth">Foto</span>'}${p.findingId ? `<span class="ph-f">${fNo(cur.findings.find(f => f.id === p.findingId) || { num: 0 })}</span>` : ''}</button>`).join('')}</div>`;
}
function itemSelect(s, val, field, extra = '') {
  return `<select class="inp" data-field="${field}" ${extra}>${leaves(s).map(l => `<option value="${esc(l.id)}" ${l.id === val ? 'selected' : ''}>${esc(l.id + ' ' + l.title)}</option>`).join('')}</select>`;
}
function stIcon(e) {
  if (e.state === 'done') return e.st.status === 'na' ? ['na', '–'] : ['done', '✓'];
  if (e.state === 'warn') return ['warn', '!'];
  return ['open', ''];
}
function itemRow(c, l, sub) {
  const e = evalItem(c, l), [cls, ic] = stIcon(e);
  return `<a class="row${sub ? ' sub' : ''}" href="#/s/${c.s.id}/i/${l.id}"><span class="st ${cls}">${ic}</span>
  <span class="row-t"><span class="row-id">${esc(l.id)}</span> ${esc(l.title)}</span>
  <span class="row-m">${e.n ? `<span class="chip">📷 ${e.n}</span>` : ''}${e.fnd.length ? `<span class="chip fnd">⚠ ${e.fnd.length}</span>` : ''}</span><span class="chev">›</span></a>`;
}
function progressBox(c) {
  const m = summary(c), pct = Math.round(m.done / m.total * 100);
  return `<div class="card pad"><div class="pb-h"><b>${m.done} / ${m.total} Prüfpunkte erledigt</b><span>${pct} %</span></div>
  <div class="pbar"><i style="width:${pct}%"></i></div>
  <div class="mut sm">📷 ${m.photos} Fotos · ⚠ ${m.findings} Findings${m.noWO ? ` · <span class="bad">${m.noWO} ohne WO</span>` : ''}${c.s.closedAt ? ` · <span class="ok">abgeschlossen</span>` : ''}</div></div>`;
}
function findingMini(c, f) {
  return `<a class="fmini" href="#/s/${c.s.id}/f/${f.id}"><b>${fNo(f)}</b><span class="grow">${esc(f.text || '(ohne Beschreibung)')}</span>
  <span class="chip ${f.wo ? 'ok' : 'bad'}">${f.wo ? 'WO ' + esc(f.wo) : 'ohne WO'}</span></a>`;
}

/* ---------------- Views ---------------- */
async function viewHome() {
  const ss = (await getAll('sessions')).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  let h = topbar('ARC Physical', 'Physical Survey Helper', null, `<button class="tb-btn" data-act="settings" aria-label="Einstellungen">⚙︎</button>`);
  h += `<main class="wrap"><button class="btn pri big block" data-act="newSession">+ Neues Physical</button>`;
  if (!ss.length) h += `<p class="empty">Noch keine Physicals erfasst.</p>`;
  for (const s of ss) {
    const m = s.summary || { done: 0, total: 17, photos: 0, findings: 0, noWO: 0 };
    const pct = m.total ? Math.round(m.done / m.total * 100) : 0;
    const unexp = (m.photos || m.findings) && (!s.exportedAt || s.modifiedAt > s.exportedAt);
    h += `<a class="card sess" href="#/s/${s.id}"><div class="sess-h"><b>${esc(s.reg)}</b><span class="mut">${esc(fmtDay(s.date))}</span></div>
    <div class="mut sm">${esc([s.msn && 'MSN ' + s.msn, s.type, s.location].filter(Boolean).join(' · '))}</div>
    <div class="pbar"><i style="width:${pct}%"></i></div>
    <div class="chips"><span class="chip">${m.done}/${m.total}</span><span class="chip">📷 ${m.photos}</span>
    <span class="chip ${m.findings ? 'fnd' : ''}">⚠ ${m.findings}${m.noWO ? ` · ${m.noWO} ohne WO` : ''}</span>
    ${s.closedAt ? '<span class="chip ok">abgeschlossen</span>' : ''}${unexp ? '<span class="chip bad">nicht exportiert</span>' : ''}</div></a>`;
  }
  return h + '</main>';
}
function viewSession(c) {
  let h = topbar(c.s.reg, sessSub(c.s), '#/', `<button class="tb-btn" data-act="editSession" aria-label="Bearbeiten">✎</button>`);
  h += tabs(c, 'list') + `<main class="wrap">` + progressBox(c);
  const cnt = L => `${L.filter(l => evalItem(c, l).state === 'done').length}/${L.length}`;
  for (const g of c.s.checklist) {
    if (!g.children) { h += `<div class="ghead"><span></span></div><div class="card">${itemRow(c, { ...g, parents: [], group: null })}</div>`; continue; }
    h += `<div class="ghead"><span>${esc(g.id)} ${esc(g.title)}</span><span>${cnt(walk(g.children, [g]))}</span></div><div class="card">`;
    for (const ch of g.children) {
      if (ch.children) {
        const L = walk(ch.children, [g, ch]);
        h += `<div class="subhead"><span>${esc(ch.id)} ${esc(ch.title)}</span><span>${cnt(L)}</span></div>${L.map(l => itemRow(c, l, true)).join('')}`;
      } else h += itemRow(c, { ...ch, parents: [g], group: g });
    }
    h += '</div>';
  }
  return h + '</main>';
}
function viewItem(c, id) {
  const L = leaves(c.s), i = L.findIndex(l => l.id === id);
  if (i < 0) return notFound(c);
  const l = L[i], e = evalItem(c, l), st = e.st, base = `#/s/${c.s.id}`;
  const prev = L[i - 1], next = L[i + 1];
  let h = topbar(`${l.id} ${l.title}`, `${c.s.reg}${l.parents.length ? ' · ' + l.parents[l.parents.length - 1].title : ''}`, base);
  h += `<main class="wrap has-bbar"><div class="card pad"><div class="lbl">Status</div><div class="seg">
  ${[['open', 'Offen'], ['ok', 'Geprüft'], ['na', 'N/A']].map(([v, t]) => `<button data-act="setStatus" data-item="${l.id}" data-v="${v}" class="${st.status === v ? 'on ' + v : ''}">${t}</button>`).join('')}</div>
  ${st.status === 'na' ? `<div class="lbl">Begründung N/A</div><input class="inp" data-field="naReason" data-id="${l.id}" value="${esc(st.reason)}" placeholder="Pflichtfeld">` : ''}
  ${e.state === 'warn' ? `<div class="hint">${st.status === 'ok' ? (l.docs ? `Fehlende Dokumente: ${e.miss.map(d => d.name).join(', ')}` : `Pflichtfoto fehlt (${e.n} / ${e.min})`) : 'Begründung für N/A fehlt'}</div>` : ''}</div>`;
  const ph = c.photos.filter(p => p.itemId === l.id).sort(byCreated);
  if (l.docs) {
    for (const d of l.docs) {
      const dp = ph.filter(p => p.docId === d.id);
      h += `<div class="card pad"><div class="lbl">${esc(d.id)} ${esc(d.name)}${d.optional ? ' <span class="mut">(if applicable)</span>' : ''} <span class="mut">${dp.length ? dp.length + ' Foto(s)' : ''}</span></div>${photoGrid(dp, 'd:' + d.id)}
      <button class="btn" data-act="cam" data-item="${l.id}" data-doc="${d.id}">📷 Foto</button>
      <button class="link" data-act="library" data-item="${l.id}" data-doc="${d.id}">Aus Mediathek</button></div>`;
    }
    const rest = ph.filter(p => !p.docId && !p.findingId);
    if (rest.length) h += `<div class="card pad"><div class="lbl">Sonstige Fotos</div>${photoGrid(rest, 'item:' + l.id)}</div>`;
  } else h += `<div class="card pad"><div class="lbl">Fotos <span class="mut">${e.n}${e.min ? ` / min. ${e.min}` : ''}</span></div>${photoGrid(ph, 'item:' + l.id)}
  <button class="link" data-act="library" data-item="${l.id}">Aus Mediathek hinzufügen</button></div>`;
  h += `<div class="card pad"><div class="lbl">Findings</div>${e.fnd.length ? e.fnd.map(f => findingMini(c, f)).join('') : '<div class="mut sm">Keine</div>'}
  <button class="link" data-act="newFindingNoPhoto" data-item="${l.id}">Finding ohne Foto anlegen</button></div>`;
  h += `<div class="card pad"><div class="lbl">Notiz</div><textarea class="inp" rows="2" data-field="itemNote" data-id="${l.id}" placeholder="optional">${esc(st.note)}</textarea></div>`;
  h += `<div class="nav2">${prev ? `<a class="btn" href="${base}/i/${prev.id}">‹ ${esc(prev.id)}</a>` : '<span></span>'}
  ${next ? `<a class="btn" href="${base}/i/${next.id}">${esc(next.id)} ›</a>` : `<a class="btn" href="${base}/close">Abschluss ›</a>`}</div></main>`;
  h += `<div class="bbar"><button class="btn pri big grow" data-act="cam" data-item="${l.id}">📷 Foto</button>
  <button class="btn big fndbtn" data-act="camFinding" data-item="${l.id}">⚠ Finding</button></div>`;
  return h;
}
function viewFinding(c, fid) {
  const f = c.findings.find(x => x.id === fid);
  if (!f) return notFound(c);
  const l = leafById(c.s, f.itemId), ph = c.photos.filter(p => p.findingId === f.id).sort(byCreated);
  let h = topbar(`Finding ${fNo(f)}`, l ? `${l.id} ${l.title}` : '', 'history');
  h += `<main class="wrap has-bbar"><div class="card pad"><div class="lbl">Beschreibung</div>
  <textarea class="inp" rows="3" data-field="fText" data-fid="${f.id}" placeholder="Kurzbeschreibung (Diktat über Tastatur-Mikrofon)">${esc(f.text)}</textarea></div>`;
  h += `<div class="card pad"><div class="lbl">Fotos <span class="mut">${ph.length}</span></div>${photoGrid(ph, 'f:' + f.id)}
  <button class="link" data-act="library" data-item="${f.itemId}" data-fid="${f.id}">Aus Mediathek hinzufügen</button></div>`;
  h += `<div class="card pad"><div class="lbl">Work Order</div>
  <input class="inp" data-field="fWO" data-fid="${f.id}" value="${esc(f.wo)}" placeholder="WO-Nummer" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false">
  <label class="chk"><input type="checkbox" data-field="fRectified" data-fid="${f.id}" ${f.rectified ? 'checked' : ''}> Rectified</label>
  ${f.rectified ? `<textarea class="inp" rows="2" data-field="fRect" data-fid="${f.id}" placeholder="Rectification (optional)">${esc(f.rect)}</textarea>` : ''}</div>`;
  h += `<div class="card pad"><div class="lbl">Prüfpunkt</div>${itemSelect(c.s, f.itemId, 'fItem', `data-fid="${f.id}"`)}
  <div class="mut sm" style="margin-top:8px">Erfasst ${fmtDT(f.createdAt)}</div></div>
  <button class="btn danger block" data-act="delFinding" data-fid="${f.id}">Finding löschen</button></main>`;
  h += `<div class="bbar"><button class="btn pri big grow" data-act="cam" data-item="${f.itemId}" data-fid="${f.id}">📷 Foto zum Finding</button></div>`;
  return h;
}
function viewFindings(c) {
  let h = topbar(c.s.reg, sessSub(c.s), '#/') + tabs(c, 'findings') + '<main class="wrap">';
  const all = [...c.findings].sort((a, b) => a.num - b.num);
  const flt = { all: () => true, nowo: f => !f.wo?.trim(), wo: f => f.wo?.trim() && !f.rectified, rect: f => f.rectified };
  const lbl = { all: 'Alle', nowo: 'Ohne WO', wo: 'WO offen', rect: 'Rectified' };
  h += `<div class="filters">${Object.keys(flt).map(k => `<button class="chip-btn ${fFilter === k ? 'on' : ''}" data-act="fFilter" data-v="${k}">${lbl[k]} ${all.filter(flt[k]).length}</button>`).join('')}</div>`;
  const list = all.filter(flt[fFilter] || flt.all);
  if (!list.length) h += '<p class="empty">Keine Findings in dieser Ansicht.</p>';
  for (const f of list) {
    const l = leafById(c.s, f.itemId), ph = c.photos.filter(p => p.findingId === f.id).sort(byCreated);
    h += `<div class="card fcard"><a class="fc-h" href="#/s/${c.s.id}/f/${f.id}"><b>${fNo(f)}</b><span class="mut grow">${esc(l ? l.id + ' ' + l.title : f.itemId)}</span><span class="chev">›</span></a>
    ${ph.length ? `<div class="fc-ph">${ph.slice(0, 3).map(p => `<button class="ph" data-act="view" data-pid="${p.id}" data-ctx="f:${f.id}">${p.thumb ? `<img src="${thumbURL(p)}" alt="">` : '<span class="noth">Foto</span>'}</button>`).join('')}</div>` : ''}
    <div class="fc-t">${esc(f.text || '(ohne Beschreibung)')}</div>
    <div class="fc-wo"><input class="inp" data-field="fWO" data-fid="${f.id}" value="${esc(f.wo)}" placeholder="WO-Nummer eintragen" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false">
    ${f.rectified ? '<span class="chip ok">rectified</span>' : ''}</div></div>`;
  }
  return h + '</main>';
}
function viewClose(c) {
  const s = c.s, iss = checkIssues(c), b = `#/s/${s.id}`;
  let h = topbar(s.reg, sessSub(s), '#/') + tabs(c, 'close') + '<main class="wrap">';
  const sec = (title, arr, link) => arr.length ? `<div class="iss"><div class="iss-h">${title} <span class="chip bad">${arr.length}</span></div>${arr.map(link).join('')}</div>` : '';
  const li = l => `<a class="iss-i" href="${b}/i/${l.id}">${esc(l.id)} ${esc(l.title)} ›</a>`;
  const lf = f => `<a class="iss-i" href="${b}/f/${f.id}">${fNo(f)} · ${esc(f.itemId)} ${esc((f.text || '').slice(0, 40))} ›</a>`;
  h += `<div class="card pad"><div class="lbl">Vollständigkeits-Check</div>`;
  h += iss.count ? sec('Prüfpunkte offen', iss.open, li) + sec('Pflichtfoto fehlt', iss.noPhoto, li) + sec('N/A ohne Begründung', iss.noReason, li)
    + sec('Findings ohne WO-Nummer', iss.noWO, lf) + sec('Findings ohne Beschreibung', iss.noText, lf)
    : `<div class="okbox">✓ Alle Prüfpunkte bewertet, Pflichtfotos vorhanden, alle Findings mit WO.</div>`;
  h += '</div>';
  if (!s.closedAt) {
    h += `<div class="card pad"><div class="lbl">Physical abschließen</div>
    ${iss.count ? `<textarea class="inp" rows="2" data-field="closeReason" placeholder="Begründung für Abschluss mit offenen Punkten (Pflicht)">${esc(s.closeReason || '')}</textarea>` : ''}
    <button class="btn pri block" data-act="closeSession">Physical abschließen</button></div>`;
  } else {
    h += `<div class="card pad"><div class="okbox">Abgeschlossen ${fmtDT(s.closedAt)}</div>${s.closeReason ? `<div class="sm">Begründung: ${esc(s.closeReason)}</div>` : ''}
    <div class="mut sm">WO-Nummern und Rectifications können weiterhin nachgetragen werden.</div>
    <button class="btn block" data-act="reopen">Wieder öffnen</button></div>`;
  }
  const size = c.photos.reduce((a, p) => a + (p.size || 0), 0);
  const exp = s.exportedAt && s.modifiedAt <= s.exportedAt;
  h += `<div class="card pad"><div class="lbl">Export (ZIP)</div>
  <div class="sm">${c.photos.length} Fotos · ca. ${fmtMB(size)} · Ordnerstruktur nach Prüfpunkten, Findings-Ordner, Findings.csv, Prüfprotokoll</div>
  <div class="sm ${exp ? 'ok' : 'bad'}">${s.exportedAt ? (exp ? 'Exportiert ' + fmtDT(s.exportedAt) : 'Seit letztem Export geändert') : 'Noch nicht exportiert'}</div>`;
  if (exportReady && exportReady.sid === s.id) {
    h += `<div class="okbox">ZIP bereit: ${esc(exportReady.name)} (${fmtMB(exportReady.blob.size)})</div>
    <button class="btn pri block" data-act="shareZip">Teilen / In „Dateien“ sichern</button>
    <button class="btn block" data-act="downloadZip">Herunterladen</button>`;
  } else h += `<button class="btn pri block" data-act="buildZip">ZIP erstellen</button>`;
  h += `</div><div class="card pad"><div class="lbl">Gerät aufräumen</div>
  <div class="mut sm">Löscht dieses Physical inkl. aller Fotos dauerhaft aus der App.</div>
  <button class="btn danger block" data-act="delSession">Physical vom Gerät löschen</button></div></main>`;
  return h;
}
function notFound(c) { return topbar('Nicht gefunden', '', c ? `#/s/${c.s.id}` : '#/') + '<main class="wrap"><p class="empty">Eintrag existiert nicht (mehr).</p></main>'; }

/* ---------------- Router ---------------- */
function parseRoute() {
  const p = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (p[0] !== 's' || !p[1]) return { view: 'home' };
  const r = { sid: p[1], view: 'list' };
  if (p[2] === 'findings') r.view = 'findings';
  else if (p[2] === 'close') r.view = 'close';
  else if (p[2] === 'i') { r.view = 'item'; r.id = p[3]; }
  else if (p[2] === 'f') { r.view = 'finding'; r.id = p[3]; }
  return r;
}
let lastKey = '';
async function render() {
  const r = parseRoute(), key = location.hash, y = window.scrollY;
  let html;
  try {
    if (r.view === 'home') html = await viewHome();
    else {
      const c = await loadSession(r.sid);
      if (!c) { location.hash = '#/'; return; }
      html = { list: viewSession, findings: viewFindings, close: viewClose, item: viewItem, finding: viewFinding }[r.view](c, r.id);
    }
  } catch (err) { console.error(err); html = `<main class="wrap"><p class="bad">Fehler: ${esc(err.message)}</p></main>`; }
  app.innerHTML = html;
  window.scrollTo(0, key === lastKey ? y : 0);
  lastKey = key;
}

/* ---------------- Overlays ---------------- */
let toastT, toastFn;
function toast(msg, action, fn) {
  const el = $('#toast');
  el.innerHTML = `<span>${esc(msg)}</span>${action ? `<button data-act="toastAct">${esc(action)}</button>` : ''}`;
  toastFn = fn; el.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; toastFn = null; }, action ? 5000 : 3000);
}
function busy(msg) { const el = $('#busy'); if (msg === false) { el.hidden = true; return; } el.textContent = msg; el.hidden = false; }
function openSheet(html) { const el = $('#sheet'); el.innerHTML = `<div class="sheet-bg" data-act="sheetBg"><div class="sheet">${html}</div></div>`; el.hidden = false; }
function closeSheet() { const el = $('#sheet'); el.hidden = true; el.innerHTML = ''; }

function sessionSheet(s) {
  const v = s || { reg: '', msn: '', type: '', location: '', date: todayYMD() };
  openSheet(`<h2>${s ? 'Physical bearbeiten' : 'Neues Physical'}</h2>
  <label class="lbl">Registrierung *</label><input class="inp" id="fReg" value="${esc(v.reg)}" placeholder="D-ABCD" autocapitalize="characters" autocomplete="off" autocorrect="off">
  <label class="lbl">MSN</label><input class="inp" id="fMsn" value="${esc(v.msn)}" autocomplete="off">
  <label class="lbl">Typ</label><input class="inp" id="fType" value="${esc(v.type)}" placeholder="z. B. A320-214" autocomplete="off">
  <label class="lbl">Ort</label><input class="inp" id="fLoc" value="${esc(v.location)}" autocomplete="off">
  <label class="lbl">Datum</label><input class="inp" id="fDate" type="date" value="${esc(v.date)}">
  <div class="row2"><button class="btn" data-act="sheetCancel">Abbrechen</button><button class="btn pri" data-act="saveSession" data-id="${s ? s.id : ''}">Speichern</button></div>`);
  if (!s) setTimeout(() => $('#fReg')?.focus(), 50);
}
async function saveSession(id) {
  const reg = $('#fReg').value.trim().toUpperCase();
  if (!reg) { toast('Registrierung fehlt'); return; }
  const data = { reg, msn: $('#fMsn').value.trim(), type: $('#fType').value.trim(), location: $('#fLoc').value.trim(), date: $('#fDate').value || todayYMD() };
  if (id) { Object.assign(cur.s, data); await touch(); closeSheet(); render(); return; }
  const s = { id: uid(), ...data, createdAt: nowISO(), modifiedAt: nowISO(), checklist: JSON.parse(JSON.stringify(CHECKLIST)),
    items: {}, findingSeq: 0, closedAt: null, closeReason: '', exportedAt: null, appVersion: APP_VERSION };
  s.summary = { done: 0, total: leaves(s).length, photos: 0, findings: 0, noWO: 0 };
  await put('sessions', s);
  navigator.storage?.persist?.();
  closeSheet(); location.hash = `#/s/${s.id}`;
}
async function settingsSheet() {
  openSheet(`<h2>Einstellungen</h2><label class="lbl">Fotoqualität (für neue Fotos)</label>
  <select class="inp" id="setQ">${Object.entries(QUALITY).map(([k, q]) => `<option value="${k}" ${settings.quality === k ? 'selected' : ''}>${q.label}</option>`).join('')}</select>
  <div class="mut sm">„Hoch“ hält Placards lesbar und den ZIP-Export auf dem iPhone stabil. „Original“ behält EXIF-Daten, erzeugt aber sehr große Exporte.</div>
  <div class="lbl">Speicher</div><div class="sm" id="storInfo">…</div>
  <div class="mut sm">Version ${APP_VERSION}. Daten bleiben ausschließlich lokal auf diesem Gerät.</div>
  <div class="row2"><button class="btn pri" data-act="sheetCancel">Fertig</button></div>`);
  $('#setQ').onchange = e => { settings.quality = e.target.value; saveSettings(); };
  try {
    const est = await navigator.storage?.estimate?.(); const pers = await navigator.storage?.persisted?.();
    $('#storInfo').textContent = est ? `${fmtMB(est.usage || 0)} belegt · dauerhafter Speicher: ${pers ? 'ja' : 'nicht bestätigt (App zum Home-Bildschirm hinzufügen)'}` : 'nicht verfügbar';
  } catch { $('#storInfo').textContent = 'nicht verfügbar'; }
}

/* Foto-Viewer */
async function openViewer(pid, ctx, orig = false) {
  const p = cur?.photos.find(x => x.id === pid); if (!p) return;
  const b = await get('blobs', p.annotated && !orig ? pid + '#ann' : pid);
  if (viewer?.url) URL.revokeObjectURL(viewer.url);
  viewer = { pid, ctx, orig, url: b ? URL.createObjectURL(new Blob([b.buf], { type: b.type })) : '' };
  document.body.classList.add('noscroll');
  renderViewer();
}
function viewerList() {
  const i = viewer.ctx.indexOf(':'), k = viewer.ctx.slice(0, i), v = viewer.ctx.slice(i + 1);
  return cur.photos.filter(p => k === 'f' ? p.findingId === v : k === 'd' ? p.docId === v : p.itemId === v).sort(byCreated);
}
function renderViewer() {
  const c = cur, p = c.photos.find(x => x.id === viewer.pid);
  if (!p) return closeViewer();
  const list = viewerList(), i = list.findIndex(x => x.id === p.id), el = $('#viewer');
  el.innerHTML = `<div class="v-top"><button class="v-btn" data-act="vClose" aria-label="Schließen">✕</button>
  <span class="v-info">${i + 1}/${list.length}</span>
  ${p.annotated ? `<button class="v-btn txt" data-act="vOrig">${viewer.orig ? 'Markiert' : 'Original'}</button>` : ''}
  <button class="v-btn txt mark" data-act="vEdit">✏︎ Markieren</button>
  <button class="v-btn" data-act="vDel" aria-label="Löschen">🗑</button></div>
  <div class="v-img">${viewer.url ? `<img src="${viewer.url}" alt="">` : '<span>Bild nicht lesbar</span>'}
  ${i > 0 ? '<button class="v-nav l" data-act="vPrev">‹</button>' : ''}${i < list.length - 1 ? '<button class="v-nav r" data-act="vNext">›</button>' : ''}</div>
  <div class="v-panel"><div class="v-meta">${fmtDT(p.createdAt)}${p.annotated ? (viewer.orig ? ' · Original' : ' · markierte Kopie') : ''}</div><label>Prüfpunkt</label>${itemSelect(c.s, p.itemId, 'vItem')}
  <label>Finding</label><select class="inp" data-field="vFinding"><option value="">– kein Finding (Nachweisfoto) –</option>
  ${[...c.findings].sort((a, b) => a.num - b.num).map(f => `<option value="${f.id}" ${p.findingId === f.id ? 'selected' : ''}>${fNo(f)} · ${esc(f.itemId)} ${esc((f.text || '').slice(0, 30))}</option>`).join('')}
  <option value="__new">+ Neues Finding aus diesem Foto</option></select>
  <label>Notiz</label><input class="inp" data-field="vNote" value="${esc(p.note)}" placeholder="optional"></div>`;
  el.hidden = false;
}
function closeViewer() {
  const el = $('#viewer'); el.hidden = true; el.innerHTML = '';
  if (viewer?.url) URL.revokeObjectURL(viewer.url);
  viewer = null; document.body.classList.remove('noscroll'); render();
}
async function viewerStep(d) {
  const list = viewerList(), i = list.findIndex(x => x.id === viewer.pid), n = list[i + d];
  if (n) await openViewer(n.id, viewer.ctx);
}

/* ---------------- Markieren ----------------
   Original bleibt unverändert (Beweiswert). Markierungen werden als
   Vektoren (normierte Koordinaten 0..1) gespeichert -> jederzeit
   nachbearbeitbar. Zusätzlich wird eine markierte JPEG-Kopie erzeugt. */
let ed = null, edTool = 'circle', edColor = '#ff1f1f';
const ED_W = 0.008; // Strichstärke relativ zur längeren Bildkante

function drawShapes(ctx, shapes, W, H) {
  const m = Math.max(W, H);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const s of shapes) {
    ctx.strokeStyle = s.c; ctx.lineWidth = s.w * m; ctx.beginPath();
    if (s.t === 'circle') {
      const [x1, y1, x2, y2] = s.p;
      ctx.ellipse((x1 + x2) / 2 * W, (y1 + y2) / 2 * H, Math.max(1, Math.abs(x2 - x1) / 2 * W), Math.max(1, Math.abs(y2 - y1) / 2 * H), 0, 0, Math.PI * 2);
    } else if (s.t === 'arrow') {
      const x1 = s.p[0] * W, y1 = s.p[1] * H, x2 = s.p[2] * W, y2 = s.p[3] * H;
      const a = Math.atan2(y2 - y1, x2 - x1), L = s.w * m * 4;
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.moveTo(x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45)); ctx.lineTo(x2, y2);
      ctx.lineTo(x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45));
    } else {
      for (let i = 0; i < s.p.length; i += 2) { const x = s.p[i] * W, y = s.p[i + 1] * H; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    }
    ctx.stroke();
  }
}
async function openEditor(pid) {
  const p = cur.photos.find(x => x.id === pid);
  const b = await get('blobs', pid);
  if (!b) { toast('Original nicht lesbar'); return; }
  const url = URL.createObjectURL(new Blob([b.buf], { type: b.type })), img = new Image(); img.src = url;
  try { await img.decode(); } catch { URL.revokeObjectURL(url); toast('Dieses Bildformat kann nicht markiert werden'); return; }
  $('#toast').hidden = true;
  ed = { p, img, url, shapes: JSON.parse(JSON.stringify(p.shapes || [])), drawing: null };
  const el = $('#editor');
  el.innerHTML = `<div class="v-top"><button class="v-btn" data-act="edCancel" aria-label="Abbrechen">✕</button>
  <span class="v-info">Markieren · ${esc(p.itemId)}</span><button class="btn pri" data-act="edSave">Speichern</button></div>
  <div class="ed-wrap"><canvas id="edCv"></canvas></div><div class="ed-bar" id="edBar"></div>`;
  el.hidden = false;
  const cv = $('#edCv');
  cv.addEventListener('pointerdown', edDown); cv.addEventListener('pointermove', edMove);
  cv.addEventListener('pointerup', edUp); cv.addEventListener('pointercancel', edUp);
  edBar(); edLayout();
}
function edBar() {
  const tools = [['circle', '◯ Kreis'], ['arrow', '➚ Pfeil'], ['free', '✎ Frei']];
  const cols = ['#ff1f1f', '#ffd400', '#ffffff'];
  $('#edBar').innerHTML = tools.map(([v, t]) => `<button class="ed-b ${edTool === v ? 'on' : ''}" data-act="edTool" data-v="${v}">${t}</button>`).join('')
    + cols.map(c => `<button class="ed-c ${edColor === c ? 'on' : ''}" style="background:${c}" data-act="edColor" data-v="${c}" aria-label="Farbe"></button>`).join('')
    + `<span class="grow"></span><button class="ed-b" data-act="edUndo" ${ed.shapes.length ? '' : 'disabled'}>↶</button>
    <button class="ed-b" data-act="edClear" ${ed.shapes.length ? '' : 'disabled'}>Alle</button>`;
}
function edLayout() {
  if (!ed) return;
  const cv = $('#edCv'), wrap = cv.parentElement, dpr = window.devicePixelRatio || 1;
  const W = wrap.clientWidth, H = wrap.clientHeight, iw = ed.img.naturalWidth, ih = ed.img.naturalHeight;
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  const k = Math.min(W / iw, H / ih);
  ed.box = { x: (W - iw * k) / 2, y: (H - ih * k) / 2, w: iw * k, h: ih * k, dpr };
  edDraw();
}
function edDraw() {
  const cv = $('#edCv'), ctx = cv.getContext('2d'), b = ed.box;
  ctx.setTransform(b.dpr, 0, 0, b.dpr, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.drawImage(ed.img, b.x, b.y, b.w, b.h);
  ctx.save(); ctx.translate(b.x, b.y);
  drawShapes(ctx, ed.drawing ? [...ed.shapes, ed.drawing] : ed.shapes, b.w, b.h);
  ctx.restore();
}
function edPt(e) {
  const r = e.currentTarget.getBoundingClientRect(), b = ed.box, cl = v => Math.min(1, Math.max(0, v));
  return [cl((e.clientX - r.left - b.x) / b.w), cl((e.clientY - r.top - b.y) / b.h)];
}
function edDown(e) {
  e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId);
  const [x, y] = edPt(e);
  ed.drawing = { t: edTool, c: edColor, w: ED_W, p: edTool === 'free' ? [x, y] : [x, y, x, y] };
}
function edMove(e) {
  if (!ed?.drawing) return;
  const [x, y] = edPt(e), d = ed.drawing;
  if (d.t === 'free') d.p.push(x, y); else { d.p[2] = x; d.p[3] = y; }
  edDraw();
}
function edUp() {
  const d = ed?.drawing; if (!d) return; ed.drawing = null;
  const big = d.t === 'free' ? d.p.length > 4 : Math.hypot(d.p[2] - d.p[0], d.p[3] - d.p[1]) > 0.015;
  if (big) ed.shapes.push(d);
  edDraw(); edBar();
}
async function makeThumb(img, shapes) {
  const k = Math.min(1, 400 / Math.max(img.naturalWidth, img.naturalHeight));
  const cv = document.createElement('canvas'); cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k);
  const ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0, cv.width, cv.height);
  if (shapes.length) drawShapes(ctx, shapes, cv.width, cv.height);
  const buf = await (await toBlob(cv, 0.72)).arrayBuffer(); cv.width = cv.height = 0;
  return buf;
}
async function edSave() {
  const { p, img, shapes } = ed;
  busy('Markierung wird gespeichert …');
  try {
    if (shapes.length) {
      const cv = document.createElement('canvas'); cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      const ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0); drawShapes(ctx, shapes, cv.width, cv.height);
      const full = await (await toBlob(cv, 0.9)).arrayBuffer(); cv.width = cv.height = 0;
      p.thumb = await makeThumb(img, shapes); p.shapes = shapes; p.annotated = true;
      await tx(['photos', 'blobs'], 'readwrite', t => { t.objectStore('photos').put(p); t.objectStore('blobs').put({ id: p.id + '#ann', buf: full, type: 'image/jpeg' }); });
    } else {
      p.thumb = await makeThumb(img, []); p.shapes = []; p.annotated = false;
      await tx(['photos', 'blobs'], 'readwrite', t => { t.objectStore('photos').put(p); t.objectStore('blobs').delete(p.id + '#ann'); });
    }
    const u = thumbURLs.get(p.id); if (u) { URL.revokeObjectURL(u); thumbURLs.delete(p.id); }
    await touch();
  } catch (err) { console.error(err); toast('Speichern fehlgeschlagen: ' + err.message); }
  finally { busy(false); }
  const ctx = viewer?.ctx; closeEditor();
  if (ctx) await openViewer(p.id, ctx);
}
function closeEditor() {
  const el = $('#editor'); el.hidden = true; el.innerHTML = '';
  if (ed?.url) URL.revokeObjectURL(ed.url); ed = null;
}
window.addEventListener('resize', () => setTimeout(edLayout, 100));

/* ---------------- Export ---------------- */
function csvCell(v) { const s = String(v ?? ''); return /[;"\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }
const findingFolder = f => safeName(`${fNo(f)}_${f.itemId}_${f.wo?.trim() ? 'WO' + f.wo.trim() : 'ohne-WO'}`);
const encPath = p => p.split('/').map(encodeURIComponent).join('/');

function protocolHTML(c, names, annNames) {
  const s = c.s, L = leaves(s), iss = checkIssues(c), stl = { open: 'offen', ok: 'geprüft', na: 'N/A' };
  const rows = L.map(l => {
    const e = evalItem(c, l);
    const rem = [e.st.status === 'na' ? 'Begründung: ' + (e.st.reason || '—') : '', e.st.note].filter(Boolean).join(' | ');
    return `<tr class="${e.state}"><td>${esc(l.id)}</td><td>${esc(l.title)}</td><td>${stl[e.st.status]}${e.state === 'warn' ? ' ⚠' : ''}</td><td>${e.n} / ${e.min}</td><td>${e.fnd.map(fNo).join(', ')}</td><td>${esc(rem)}</td><td>${e.st.changedAt ? fmtDT(e.st.changedAt) : ''}</td></tr>`;
  }).join('');
  const fs = [...c.findings].sort((a, b) => a.num - b.num);
  const frows = fs.map(f => `<tr><td>${fNo(f)}</td><td>${esc(f.itemId)}</td><td>${esc(f.text)}</td><td>${esc(f.wo)}</td><td>${f.rectified ? 'ja' : 'nein'}</td><td>${esc(f.rect)}</td><td>${c.photos.filter(p => p.findingId === f.id).length}</td></tr>`).join('');
  const fig = p => `<figure><a href="${encPath(annNames.get(p.id) || names.get(p.id))}"><img src="${encPath(annNames.get(p.id) || names.get(p.id))}" loading="lazy"></a><figcaption>${esc(names.get(p.id).split('/').pop())} · ${fmtDT(p.createdAt)}${p.findingId ? ' · ' + fNo(c.findings.find(f => f.id === p.findingId) || { num: 0 }) : ''}${p.note ? ' · ' + esc(p.note) : ''}</figcaption></figure>`;
  const gal = L.map(l => { const ph = c.photos.filter(p => p.itemId === l.id).sort(byCreated); return ph.length ? `<h3>${esc(l.id)} ${esc(l.title)}</h3><div class="g">${ph.map(fig).join('')}</div>` : ''; }).join('');
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Prüfprotokoll ${esc(s.reg)} ${esc(fmtDay(s.date))}</title>
<style>body{font:13px/1.4 -apple-system,Segoe UI,Arial,sans-serif;margin:24px;color:#111}h1{font-size:20px;margin:0 0 4px}h2{font-size:16px;margin:24px 0 8px;border-bottom:2px solid #111}h3{font-size:14px;margin:16px 0 6px}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #bbb;padding:4px 6px;text-align:left;vertical-align:top}th{background:#eee}tr.warn td,tr.open td{background:#fdecea}
.meta td{border:none;padding:2px 12px 2px 0}.g{display:flex;flex-wrap:wrap;gap:8px}figure{margin:0;width:180px}figure img{width:180px;height:135px;object-fit:cover;border:1px solid #ccc}figcaption{font-size:10px;color:#555}
@media print{figure{break-inside:avoid}h2{break-after:avoid}}</style></head><body>
<h1>ARC Physical Survey – Prüfprotokoll</h1>
<table class="meta"><tr><td><b>Registrierung</b></td><td>${esc(s.reg)}</td><td><b>MSN</b></td><td>${esc(s.msn)}</td></tr>
<tr><td><b>Typ</b></td><td>${esc(s.type)}</td><td><b>Ort</b></td><td>${esc(s.location)}</td></tr>
<tr><td><b>Datum</b></td><td>${esc(fmtDay(s.date))}</td><td><b>Abschluss</b></td><td>${s.closedAt ? fmtDT(s.closedAt) : 'nicht abgeschlossen'}</td></tr>
${s.closeReason ? `<tr><td><b>Begründung</b></td><td colspan="3">${esc(s.closeReason)}</td></tr>` : ''}
<tr><td><b>Offene Punkte</b></td><td colspan="3">${iss.count ? `${iss.open.length} offen, ${iss.noPhoto.length} ohne Pflichtfoto, ${iss.noReason.length} N/A ohne Begründung, ${iss.noWO.length} Findings ohne WO` : 'keine'}</td></tr>
<tr><td><b>Export</b></td><td colspan="3">${fmtDT(nowISO())} · ARC Physical Helper ${APP_VERSION}</td></tr></table>
<h2>Prüfpunkte</h2><table><tr><th>Nr.</th><th>Prüfpunkt</th><th>Status</th><th>Fotos</th><th>Findings</th><th>Bemerkung</th><th>Bewertet</th></tr>${rows}</table>
<h2>Findings</h2>${fs.length ? `<table><tr><th>Nr.</th><th>Prüfpunkt</th><th>Beschreibung</th><th>WO</th><th>Rectified</th><th>Rectification</th><th>Fotos</th></tr>${frows}</table>` : '<p>Keine Findings.</p>'}
<h2>Fotonachweise</h2>${gal || '<p>Keine Fotos.</p>'}</body></html>`;
}

async function buildZip() {
  const c = cur, s = c.s;
  if (typeof JSZip === 'undefined') { toast('ZIP-Bibliothek nicht geladen'); return; }
  await flush();
  const builtAt = nowISO();
  const root = safeName(`${s.date}_${s.reg}_ARC-Physical`);
  const zip = new JSZip(), R = zip.folder(root), L = leaves(s);
  for (const l of L) R.folder(leafPath(l)); // vollständige Ordnerstruktur, auch leere
  const photos = [...c.photos].sort(byCreated), names = new Map(), annNames = new Map(), cnt = {};
  busy('Fotos werden gesammelt …');
  try {
    for (const p of photos) {
      const ext = extOf(p.type), f = p.findingId && c.findings.find(x => x.id === p.findingId);
      let path;
      if (f) { const fn = findingFolder(f); cnt[fn] = (cnt[fn] || 0) + 1; path = `Findings/${fn}/${fn}_${pad(cnt[fn])}.${ext}`; }
      else {
        const l = L.find(x => x.id === p.itemId) || { id: p.itemId, folder: 'Unzugeordnet', parents: [] };
        const d = p.docId && l.docs?.find(x => x.id === p.docId);
        if (d) { cnt[d.id] = (cnt[d.id] || 0) + 1; path = `${leafPath(l)}/${safeName(d.id + ' ' + d.name)}_${pad(cnt[d.id])}.${ext}`; }
        else { cnt[l.id] = (cnt[l.id] || 0) + 1; path = `${leafPath(l)}/${l.id}_${pad(cnt[l.id], 3)}.${ext}`; }
      }
      names.set(p.id, path);
      const b = await get('blobs', p.id);
      if (b) R.file(path, b.buf, { binary: true, date: new Date(p.createdAt) });
      if (p.annotated) { // markierte Kopie zusätzlich, Original bleibt unverändert
        const a = await get('blobs', p.id + '#ann');
        if (a) { const ap = path.replace(/\.[^.]+$/, '_markiert.jpg'); annNames.set(p.id, ap); R.file(ap, a.buf, { binary: true, date: new Date(p.createdAt) }); }
      }
    }
    const fs = [...c.findings].sort((a, b) => a.num - b.num);
    const head = ['Finding', 'Prüfpunkt', 'Bezeichnung', 'Beschreibung (Physical)', 'WO-Nr.', 'Rectified', 'Rectification', 'Anzahl Fotos', 'Ordner', 'Erfasst am', 'Wortlaut WO (manuell)'];
    const rows = fs.map(f => [fNo(f), f.itemId, leafById(s, f.itemId)?.title || '', f.text, f.wo, f.rectified ? 'ja' : 'nein', f.rect,
      c.photos.filter(p => p.findingId === f.id).length, 'Findings/' + findingFolder(f), fmtDT(f.createdAt), '']);
    R.file('Findings.csv', '﻿' + [head, ...rows].map(r => r.map(csvCell).join(';')).join('\r\n'));
    R.file('Pruefprotokoll.html', protocolHTML(c, names, annNames));
    R.file('session.json', JSON.stringify({ app: 'ARC Physical Helper', version: APP_VERSION, exportedAt: builtAt, session: s, findings: fs,
      photos: photos.map(p => ({ id: p.id, itemId: p.itemId, findingId: p.findingId, createdAt: p.createdAt, note: p.note, file: names.get(p.id), annotatedFile: annNames.get(p.id) || null })) }, null, 1));
    const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE', streamFiles: true }, m => busy(`ZIP wird erstellt … ${Math.round(m.percent)} %`));
    if (exportReady?.url) URL.revokeObjectURL(exportReady.url);
    exportReady = { sid: s.id, blob, name: root + '.zip', url: URL.createObjectURL(blob), builtAt };
  } catch (err) { console.error(err); toast('Export fehlgeschlagen: ' + err.message); }
  finally { busy(false); }
  render();
}
async function markExported() {
  cur.s.exportedAt = exportReady.builtAt > cur.s.modifiedAt ? exportReady.builtAt : cur.s.modifiedAt;
  await put('sessions', cur.s); render();
}
async function shareZip() {
  const x = exportReady; if (!x) return;
  const file = new File([x.blob], x.name, { type: 'application/zip' });
  try {
    if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: x.name }); await markExported(); }
    else downloadZip();
  } catch (err) { if (err.name !== 'AbortError') toast('Teilen fehlgeschlagen: ' + err.message); }
}
function downloadZip() {
  const a = document.createElement('a'); a.href = exportReady.url; a.download = exportReady.name;
  document.body.appendChild(a); a.click(); a.remove(); markExported();
}
async function deleteSession() {
  const c = cur;
  await tx(['sessions', 'findings', 'photos', 'blobs'], 'readwrite', t => {
    t.objectStore('sessions').delete(c.s.id);
    for (const f of c.findings) t.objectStore('findings').delete(f.id);
    for (const p of c.photos) { t.objectStore('photos').delete(p.id); t.objectStore('blobs').delete(p.id); t.objectStore('blobs').delete(p.id + '#ann'); }
  });
  revokeThumbs(); cur = null; exportReady = null; location.hash = '#/';
}

/* ---------------- Events ---------------- */
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act, c = cur, d = el.dataset;
  try {
    switch (a) {
      // Kamera muss synchron im Klick ausgelöst werden (User-Geste)
      case 'cam': capture = { item: d.item, doc: d.doc || null, fid: d.fid || null, newFinding: false }; $('#camIn').click(); break;
      case 'camFinding': capture = { item: d.item, fid: null, newFinding: true }; $('#camIn').click(); break;
      case 'library': capture = { item: d.item, doc: d.doc || null, fid: d.fid || null, newFinding: false }; $('#libIn').click(); break;
      case 'newFindingNoPhoto': { const f = await createFinding(d.item); location.hash = `#/s/${c.s.id}/f/${f.id}`; break; }
      case 'setStatus': { const st = itemState(c.s, d.item); st.status = d.v; st.changedAt = nowISO(); await touch(); render(); break; }
      case 'view': await openViewer(d.pid, d.ctx); break;
      case 'back': if (history.length > 1) history.back(); else location.hash = '#/'; break;
      case 'fFilter': fFilter = d.v; render(); break;
      case 'newSession': sessionSheet(); break;
      case 'editSession': sessionSheet(c.s); break;
      case 'saveSession': await saveSession(d.id); break;
      case 'settings': settingsSheet(); break;
      case 'sheetCancel': closeSheet(); break;
      case 'sheetBg': if (e.target === el) closeSheet(); break;
      case 'toastAct': { const fn = toastFn; $('#toast').hidden = true; toastFn = null; fn?.(); break; }
      case 'delFinding': {
        const f = c.findings.find(x => x.id === d.fid);
        if (!confirm(`${fNo(f)} löschen? Zugehörige Fotos bleiben als Nachweisfotos des Prüfpunkts erhalten.`)) break;
        const ph = c.photos.filter(p => p.findingId === f.id); ph.forEach(p => { p.findingId = null; });
        await savePhotoMetas(ph);
        await tx(['findings'], 'readwrite', t => { t.objectStore('findings').delete(f.id); });
        c.findings = c.findings.filter(x => x.id !== f.id); await touch();
        location.hash = `#/s/${c.s.id}/i/${f.itemId}`; break;
      }
      case 'closeSession': {
        await flush(); const iss = checkIssues(c);
        if (iss.count && !c.s.closeReason?.trim()) { toast('Begründung für offene Punkte erforderlich'); break; }
        if (!iss.count) c.s.closeReason = '';
        c.s.closedAt = nowISO(); await touch(); render(); break;
      }
      case 'reopen': c.s.closedAt = null; await touch(); render(); break;
      case 'buildZip': await buildZip(); break;
      case 'shareZip': await shareZip(); break;
      case 'downloadZip': downloadZip(); break;
      case 'delSession': {
        const exp = c.s.exportedAt && c.s.modifiedAt <= c.s.exportedAt;
        if (!confirm(`Physical ${c.s.reg} mit ${c.photos.length} Fotos dauerhaft löschen?`)) break;
        if (!exp && !confirm('ACHTUNG: Der aktuelle Stand wurde NICHT exportiert. Trotzdem löschen?')) break;
        await deleteSession(); break;
      }
      case 'vClose': closeViewer(); break;
      case 'vOrig': await openViewer(viewer.pid, viewer.ctx, !viewer.orig); break;
      case 'vEdit': await openEditor(viewer.pid); break;
      case 'edTool': edTool = d.v; edBar(); break;
      case 'edColor': edColor = d.v; edBar(); break;
      case 'edUndo': ed.shapes.pop(); edDraw(); edBar(); break;
      case 'edClear': ed.shapes = []; edDraw(); edBar(); break;
      case 'edCancel': closeEditor(); break;
      case 'edSave': await edSave(); break;
      case 'vPrev': await viewerStep(-1); break;
      case 'vNext': await viewerStep(1); break;
      case 'vDel': {
        if (!confirm('Foto löschen?')) break;
        const list = viewerList(), i = list.findIndex(x => x.id === viewer.pid), nxt = list[i + 1] || list[i - 1];
        const p = c.photos.find(x => x.id === viewer.pid); const ctx = viewer.ctx;
        await deletePhotos([p]);
        if (nxt) await openViewer(nxt.id, ctx); else closeViewer();
        break;
      }
    }
  } catch (err) { console.error(err); toast('Fehler: ' + err.message); }
});

async function onField(el, commit) {
  const f = el.dataset.field, c = cur; if (!f || !c) return;
  const v = el.type === 'checkbox' ? el.checked : el.value;
  const fi = el.dataset.fid && c.findings.find(x => x.id === el.dataset.fid);
  switch (f) {
    case 'naReason': itemState(c.s, el.dataset.id).reason = v; sessDirty = true; schedule(); if (commit) { await flush(); render(); } break;
    case 'itemNote': itemState(c.s, el.dataset.id).note = v; sessDirty = true; schedule(); break;
    case 'closeReason': c.s.closeReason = v; sessDirty = true; schedule(); break;
    case 'fText': fi.text = v; dirtyF.add(fi); schedule(); break;
    case 'fWO': fi.wo = v.trim(); dirtyF.add(fi); schedule(); break;
    case 'fRect': fi.rect = v; dirtyF.add(fi); schedule(); break;
    case 'fRectified': if (commit) { fi.rectified = v; await put('findings', fi); await touch(); render(); } break;
    case 'fItem': if (commit) {
      fi.itemId = v; const ph = c.photos.filter(p => p.findingId === fi.id); ph.forEach(p => { p.itemId = v; });
      await savePhotoMetas(ph); await put('findings', fi); await touch(); render(); toast(`${fNo(fi)} nach ${v} verschoben`);
    } break;
    case 'vNote': { const p = c.photos.find(x => x.id === viewer.pid); p.note = v; if (commit) { await savePhotoMetas([p]); await touch(); } break; }
    case 'vItem': if (commit) {
      const p = c.photos.find(x => x.id === viewer.pid); p.itemId = v;
      const fd = p.findingId && c.findings.find(x => x.id === p.findingId);
      if (fd && fd.itemId !== v) p.findingId = null;
      await savePhotoMetas([p]); await touch(); closeViewer(); toast(`Foto nach ${v} verschoben`);
    } break;
    case 'vFinding': if (commit) {
      const p = c.photos.find(x => x.id === viewer.pid);
      if (v === '__new') { const nf = await createFinding(p.itemId); p.findingId = nf.id; await savePhotoMetas([p]); await touch(); closeViewer(); location.hash = `#/s/${c.s.id}/f/${nf.id}`; break; }
      p.findingId = v || null;
      if (v) p.itemId = c.findings.find(x => x.id === v).itemId;
      await savePhotoMetas([p]); await touch(); closeViewer(); toast(v ? 'Foto dem Finding zugeordnet' : 'Foto als Nachweisfoto gesetzt');
    } break;
  }
}
document.addEventListener('input', e => { if (e.target.dataset.field) onField(e.target, false).catch(console.error); });
document.addEventListener('change', e => { if (e.target.dataset.field) onField(e.target, true).catch(err => toast('Fehler: ' + err.message)); });

for (const id of ['camIn', 'libIn']) {
  const inp = $('#' + id);
  inp.addEventListener('change', async () => {
    const files = [...inp.files]; inp.value = '';
    const ctx = capture; capture = null;
    if (!files.length || !ctx) return;
    try { await addPhotos(files, ctx); } catch (err) { console.error(err); toast('Foto nicht gespeichert: ' + err.message); }
  });
}

// Wischen im Foto-Viewer
let tx0 = null;
$('#viewer').addEventListener('touchstart', e => { if (e.target.closest('.v-img')) tx0 = e.touches[0].clientX; }, { passive: true });
$('#viewer').addEventListener('touchend', e => {
  if (tx0 === null) return; const dx = e.changedTouches[0].clientX - tx0; tx0 = null;
  if (Math.abs(dx) > 60) viewerStep(dx < 0 ? 1 : -1);
}, { passive: true });

window.addEventListener('hashchange', async () => { await flush(); closeEditor(); if (viewer) { const el = $('#viewer'); el.hidden = true; el.innerHTML = ''; if (viewer.url) URL.revokeObjectURL(viewer.url); viewer = null; document.body.classList.remove('noscroll'); } closeSheet(); render(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      w?.addEventListener('statechange', () => {
        if (w.state === 'installed' && navigator.serviceWorker.controller) toast('Update verfügbar', 'Neu laden', () => location.reload());
      });
    });
  }).catch(() => {});
}
render();
